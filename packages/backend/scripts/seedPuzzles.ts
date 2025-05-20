// /workspaces/kogum/packages/backend/scripts/seedPuzzles.ts

import db from "../src/db"; // Changed to default import
import { generateSingleAbstractPuzzle } from "../src/game/puzzleGenerator";
import { AbstractCard } from "../src/game/types";

const NUMBER_OF_PUZZLES_TO_SEED = 50; // Desired number of unique puzzles to seed
const MAX_GENERATION_CYCLES = NUMBER_OF_PUZZLES_TO_SEED * 25; // Safety break for generation attempts

async function seedPuzzles() {
  console.log("🌱 Starting to seed puzzles...");

  let puzzlesSuccessfullySeeded = 0;
  let generationAttempts = 0;
  const uniquePuzzleSignatures = new Set<string>();

  // Optional: Load existing puzzle signatures to avoid duplicates if re-running
  try {
    const existingPuzzlesResult = await db.query(
      "SELECT card_ids FROM puzzles"
    );
    existingPuzzlesResult.rows.forEach((row: { card_ids: string[] }) => {
      // Added type for row
      // Ensure row.card_ids is an array before trying to sort and join
      if (Array.isArray(row.card_ids)) {
        const signature = (row.card_ids as string[]).sort().join(",");
        uniquePuzzleSignatures.add(signature);
      }
    });
    console.log(
      `🔍 Found ${uniquePuzzleSignatures.size} existing unique puzzle signatures in the database.`
    );
  } catch (error) {
    console.warn(
      "⚠️ Could not fetch existing puzzles, proceeding without pre-check for duplicates. Error:",
      error
    );
  }

  while (
    puzzlesSuccessfullySeeded < NUMBER_OF_PUZZLES_TO_SEED &&
    generationAttempts < MAX_GENERATION_CYCLES
  ) {
    generationAttempts++;
    process.stdout.write(
      `\r🔄 Attempting to generate puzzle ${
        puzzlesSuccessfullySeeded + 1
      }/${NUMBER_OF_PUZZLES_TO_SEED} (Overall generation cycle: ${generationAttempts}/${MAX_GENERATION_CYCLES})`
    );

    const puzzleCards: AbstractCard[] | null = generateSingleAbstractPuzzle();

    if (puzzleCards) {
      const cardIds = puzzleCards.map((card) => card.id);
      const currentPuzzleSignature = [...cardIds].sort().join(",");

      if (uniquePuzzleSignatures.has(currentPuzzleSignature)) {
        // console.log(`    ⏭️ Puzzle signature already exists, skipping.`);
        continue; // Try generating another one
      }

      try {
        await db.query("INSERT INTO puzzles (card_ids) VALUES ($1)", [cardIds]);
        uniquePuzzleSignatures.add(currentPuzzleSignature);
        puzzlesSuccessfullySeeded++;
        // console.log(`\n    ✅ Puzzle ${puzzlesSuccessfullySeeded} seeded successfully with ${cardIds.length} cards.`);
      } catch (dbError) {
        console.error(
          "\n    ❌ Error inserting puzzle into database:",
          dbError
        );
        // Depending on the error, you might want to break or continue
      }
    }
    // No else needed here, if puzzleCards is null, the loop continues to the next attempt
  }
  process.stdout.write("\n"); // New line after the progress indicator

  console.log("\n🏁 Puzzle seeding finished.");
  console.log(
    `Total unique puzzles seeded in this run: ${puzzlesSuccessfullySeeded}`
  );
  if (
    generationAttempts >= MAX_GENERATION_CYCLES &&
    puzzlesSuccessfullySeeded < NUMBER_OF_PUZZLES_TO_SEED
  ) {
    console.warn(
      `⚠️ Reached max generation cycles (${MAX_GENERATION_CYCLES}) before seeding all desired puzzles (${NUMBER_OF_PUZZLES_TO_SEED}).`
    );
  }

  await db.end(); // Close the database connection
}

seedPuzzles().catch(console.error);
