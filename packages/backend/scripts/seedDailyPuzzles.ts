// /workspaces/kogum/packages/backend/scripts/seedDailyPuzzles.ts

import db from "../src/db"; // Assuming your db connection is exported as default
import type { DailyMealType } from "../src/game/types"; // Import the centralized type

const NUMBER_OF_DAYS_TO_SEED = 21; // Insert for 3 weeks (today + 20 more days)
const MEAL_TYPES: DailyMealType[] = ["snack", "breakfast", "lunch", "dinner"];

async function seedDailyPuzzles() {
  console.log("🌱 Starting to seed daily puzzles...");

  let totalPuzzlesAssigned = 0;
  let daysProcessed = 0;

  for (let dayOffset = 0; dayOffset < NUMBER_OF_DAYS_TO_SEED; dayOffset++) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dayOffset);
    const dateString = targetDate.toISOString().split("T")[0]; // YYYY-MM-DD

    daysProcessed++;
    process.stdout.write(
      `\r🔄 Processing date: ${dateString} (${daysProcessed}/${NUMBER_OF_DAYS_TO_SEED})`
    );

    try {
      // Fetch 4 distinct random puzzle_ids for the current day
      const randomPuzzlesResult = await db.query<{ puzzle_id: number }>(
        "SELECT puzzle_id FROM puzzles ORDER BY RANDOM() LIMIT 4"
      );

      if (randomPuzzlesResult.rows.length < 4) {
        console.warn(
          `\n    ⚠️ Could not fetch 4 distinct puzzle_ids from the "puzzles" table for date ${dateString}. Found only ${randomPuzzlesResult.rows.length}. Skipping this day.`
        );
        continue; // Skip to the next day
      }

      const puzzleIdsForDay = randomPuzzlesResult.rows.map(
        (row) => row.puzzle_id
      );

      for (let i = 0; i < MEAL_TYPES.length; i++) {
        const mealType = MEAL_TYPES[i];
        const selectedPuzzleId = puzzleIdsForDay[i];

        try {
          await db.query(
            "INSERT INTO daily_puzzles (puzzle_date, meal_type, puzzle_id) VALUES ($1, $2, $3)",
            [dateString, mealType, selectedPuzzleId]
          );
          totalPuzzlesAssigned++;
        } catch (insertError: any) {
          if (insertError.code === "23505") {
            // Unique violation code for PostgreSQL
            // console.log(`\n    ⏭️ Puzzle already assigned for meal: ${mealType}, date: ${dateString}. Skipping.`);
          } else {
            console.error(
              `\n    ❌ Error inserting for meal: ${mealType}, date: ${dateString} (puzzle_id ${selectedPuzzleId}):`,
              insertError.message
            );
          }
        }
      }
    } catch (fetchError) {
      console.error(
        `\n    ❌ Error fetching random puzzles for date ${dateString}:`,
        fetchError
      );
    }
  }
  process.stdout.write("\n"); // New line after the progress indicator

  console.log("\n🏁 Daily puzzle seeding finished.");
  console.log(`Total daily puzzle slots processed over ${daysProcessed} days.`);
  console.log(
    `Successfully assigned ${totalPuzzlesAssigned} new puzzles to daily slots.`
  );

  await db.end(); // Close the database connection
  console.log("Database connection pool closed.");
}

seedDailyPuzzles().catch((error) => {
  console.error("Unhandled error during daily puzzle seeding:", error);
  process.exit(1); // Exit with error code
});
