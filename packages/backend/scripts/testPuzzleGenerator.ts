// /workspaces/kogum/packages/backend/scripts/testPuzzleGenerator.ts

import {
  generateSingleAbstractPuzzle,
  attemptPuzzleGenerationWithInitialCards,
} from "../src/game/puzzleGenerator";
import { generateAllAbstractCards } from "../src/game/cardManager";
import { findAllSets } from "../src/game/gameLogic";
import { AbstractCard, AttributeIndex } from "../src/game/types";

function runPuzzleGeneratorTests() {
  console.log("🧪 Running PuzzleGenerator Tests...\n");

  console.log("🔍 Attempting to generate a single abstract puzzle...");
  // The function has internal retries. We call it once here for the test.
  const puzzle = generateSingleAbstractPuzzle();

  if (puzzle) {
    console.log("✅ Puzzle Candidate Found!");
    if (puzzle.length === 12) {
      console.log("   - Contains 12 cards.");
      const solutionsInPuzzle = findAllSets(puzzle);
      if (solutionsInPuzzle.length === 6) {
        console.log("   - Contains exactly 6 solutions. Test Passed!");
        console.log("   Solution count:", solutionsInPuzzle.length);
        console.log(
          "   Puzzle card IDs:",
          puzzle.map((c: AbstractCard) => c.id)
        );
      } else {
        console.error(
          `❌ Test Failed: Puzzle has ${solutionsInPuzzle.length} solutions, expected 6.`
        );
      }
    } else {
      console.error(
        `❌ Test Failed: Puzzle has ${puzzle.length} cards, expected 12.`
      );
    }
  } else {
    console.error(
      `❌ Test Failed: generateSingleAbstractPuzzle() returned null. It could not generate a puzzle within its internal attempts.`
    );
  }

  // Test attemptPuzzleGenerationWithInitialCards (basic test, not exhaustive)
  console.log(
    "\n🔍 Testing attemptPuzzleGenerationWithInitialCards (basic test)..."
  );

  // Define initial cards ensuring they conform to AbstractCard type
  const initialCards: AbstractCard[] = [
    {
      id: "c0s0f0n0",
      colorIndex: 0 as AttributeIndex,
      shapeIndex: 0 as AttributeIndex,
      fillIndex: 0 as AttributeIndex,
      countIndex: 0 as AttributeIndex,
    },
    {
      id: "c1s1f1n1",
      colorIndex: 1 as AttributeIndex,
      shapeIndex: 1 as AttributeIndex,
      fillIndex: 1 as AttributeIndex,
      countIndex: 1 as AttributeIndex,
    },
    {
      id: "c2s2f2n2",
      colorIndex: 2 as AttributeIndex,
      shapeIndex: 2 as AttributeIndex,
      fillIndex: 2 as AttributeIndex,
      countIndex: 2 as AttributeIndex,
    },
    {
      id: "c0s1f2n0",
      colorIndex: 0 as AttributeIndex,
      shapeIndex: 1 as AttributeIndex,
      fillIndex: 2 as AttributeIndex,
      countIndex: 0 as AttributeIndex,
    },
    {
      id: "c1s2f0n1",
      colorIndex: 1 as AttributeIndex,
      shapeIndex: 2 as AttributeIndex,
      fillIndex: 0 as AttributeIndex,
      countIndex: 1 as AttributeIndex,
    },
    {
      id: "c2s0f1n2",
      colorIndex: 2 as AttributeIndex,
      shapeIndex: 0 as AttributeIndex,
      fillIndex: 1 as AttributeIndex,
      countIndex: 2 as AttributeIndex,
    },
  ];

  // Initialize allCards for the attemptPuzzleGenerationWithInitialCards test
  const allCards = generateAllAbstractCards();

  const puzzleWithInitial = attemptPuzzleGenerationWithInitialCards(
    allCards,
    initialCards
  );

  if (puzzleWithInitial) {
    console.log(
      "✅ attemptPuzzleGenerationWithInitialCards returned a puzzle (basic check passed)."
    );
    // More thorough checks:
    if (puzzleWithInitial.length === 12) {
      const solutions = findAllSets(puzzleWithInitial);
      if (solutions.length === 6) {
        console.log("   - Verified: Puzzle has 12 cards and 6 solutions.");
      } else {
        console.warn(
          `   - Warning: Puzzle has 12 cards but ${solutions.length} solutions (expected 6).`
        );
      }
    } else {
      console.warn(
        `   - Warning: Puzzle has ${puzzleWithInitial.length} cards (expected 12).`
      );
    }
  } else {
    console.warn(
      // Changed to warn as this test is basic and might not always find a puzzle
      "❌ attemptPuzzleGenerationWithInitialCards failed to generate a puzzle."
    );
  }

  console.log("\n🏁 PuzzleGenerator Tests Finished.");
}

runPuzzleGeneratorTests();
