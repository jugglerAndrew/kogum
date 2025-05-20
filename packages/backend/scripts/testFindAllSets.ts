// /workspaces/kogum/packages/backend/scripts/testFindAllSets.ts

import { findAllSets } from "../src/game/gameLogic";
import { AbstractCard, AttributeIndex } from "../src/game/types";
import { generateAllAbstractCards } from "../src/game/cardManager";

function createCard(
  id: string,
  c: AttributeIndex,
  s: AttributeIndex,
  f: AttributeIndex,
  n: AttributeIndex
): AbstractCard {
  return { id, colorIndex: c, shapeIndex: s, fillIndex: f, countIndex: n };
}

function runFindAllSetsTests() {
  console.log("🧪 Running GameLogic Tests (findAllSets)...\n");

  let testsPassed = 0;
  let testsFailed = 0;

  const allCards = generateAllAbstractCards(); // We might use a subset for easier testing

  // Test Case 1: A known set
  const card1 = createCard("c0s0f0n0", 0, 0, 0, 0);
  const card2 = createCard("c1s1f1n1", 1, 1, 1, 1);
  const card3 = createCard("c2s2f2n2", 2, 2, 2, 2);
  const card4_non_set_member = createCard("c0s1f0n0", 0, 1, 0, 0); // Different from the set

  const testHand1: AbstractCard[] = [card1, card2, card3, card4_non_set_member];
  const sets1 = findAllSets(testHand1);

  console.log("🔍 Testing Case 1: Hand with one known set and one non-member");
  if (sets1.length === 1) {
    // Check if the found set contains the correct cards (order doesn't matter for the set itself)
    const foundSet = sets1[0].map((c) => c.id).sort();
    const expectedSetIds = [card1.id, card2.id, card3.id].sort();
    if (JSON.stringify(foundSet) === JSON.stringify(expectedSetIds)) {
      console.log("✅ Test Passed: Found 1 set, and it's the correct one.");
      testsPassed++;
    } else {
      console.error(
        "❌ Test Failed: Found 1 set, but it contains the wrong cards."
      );
      console.error("   Expected IDs:", expectedSetIds);
      console.error("   Found IDs:", foundSet);
      testsFailed++;
    }
  } else {
    console.error(`❌ Test Failed: Expected 1 set, found ${sets1.length}`);
    testsFailed++;
  }

  // Test Case 2: No sets
  const testHand2: AbstractCard[] = [
    createCard("c0s0f0n0", 0, 0, 0, 0),
    createCard("c0s0f0n1", 0, 0, 0, 1), // Only one attribute different from first
    createCard("c0s0f1n2", 0, 0, 1, 2), // Two attributes different from first
  ];
  const sets2 = findAllSets(testHand2);
  console.log("\n🔍 Testing Case 2: Hand with no sets");
  if (sets2.length === 0) {
    console.log("✅ Test Passed: Found 0 sets as expected.");
    testsPassed++;
  } else {
    console.error(`❌ Test Failed: Expected 0 sets, found ${sets2.length}`);
    testsFailed++;
  }

  // Test Case 3: Empty hand
  const sets3 = findAllSets([]);
  console.log("\n🔍 Testing Case 3: Empty hand");
  if (sets3.length === 0) {
    console.log("✅ Test Passed: Found 0 sets for empty hand.");
    testsPassed++;
  } else {
    console.error(
      `❌ Test Failed: Expected 0 sets for empty hand, found ${sets3.length}`
    );
    testsFailed++;
  }

  // Test Case 4: Hand with fewer than 3 cards
  const sets4 = findAllSets([card1, card2]);
  console.log("\n🔍 Testing Case 4: Hand with 2 cards");
  if (sets4.length === 0) {
    console.log("✅ Test Passed: Found 0 sets for hand with 2 cards.");
    testsPassed++;
  } else {
    console.error(
      `❌ Test Failed: Expected 0 sets for hand with 2 cards, found ${sets4.length}`
    );
    testsFailed++;
  }

  console.log("\n------------------------------------");
  console.log("🏁 findAllSets Tests Finished.");
  console.log(`Total Tests Run: ${testsPassed + testsFailed}`);
  console.log(`Passed: ${testsPassed}`);
  console.log(`Failed: ${testsFailed}`);
  console.log("------------------------------------");
}

runFindAllSetsTests();
