// /workspaces/kogum/packages/backend/scripts/testGameLogic.ts

import { isSet } from "../src/game/gameLogic";
import { AbstractCard, AttributeIndex } from "../src/game/types";

function createCard(
  id: string,
  c: AttributeIndex,
  s: AttributeIndex,
  f: AttributeIndex,
  n: AttributeIndex
): AbstractCard {
  return { id, colorIndex: c, shapeIndex: s, fillIndex: f, countIndex: n };
}

function runGameLogicTests() {
  console.log("🧪 Running GameLogic Tests (isSet)...\n");

  let testsPassed = 0;
  let testsFailed = 0;

  const testCases: Array<{
    name: string;
    cards: [AbstractCard, AbstractCard, AbstractCard];
    expected: boolean;
  }> = [
    {
      name: "Valid Set: All attributes different",
      cards: [
        createCard("c0s0f0n0", 0, 0, 0, 0),
        createCard("c1s1f1n1", 1, 1, 1, 1),
        createCard("c2s2f2n2", 2, 2, 2, 2),
      ],
      expected: true,
    },
    {
      name: "Valid Set: All attributes same (identical cards, rule applies)",
      cards: [
        createCard("c0s0f0n0_A", 0, 0, 0, 0),
        createCard("c0s0f0n0_B", 0, 0, 0, 0),
        createCard("c0s0f0n0_C", 0, 0, 0, 0),
      ],
      expected: true,
    },
    {
      name: "Valid Set: Color different, others same",
      cards: [
        createCard("c0s0f0n0", 0, 0, 0, 0),
        createCard("c1s0f0n0", 1, 0, 0, 0),
        createCard("c2s0f0n0", 2, 0, 0, 0),
      ],
      expected: true,
    },
    {
      name: "Valid Set: Two attributes different, two same",
      cards: [
        createCard("c0s0f0n0", 0, 0, 0, 0), // c0, s0
        createCard("c1s1f0n0", 1, 1, 0, 0), // c1, s1
        createCard("c2s2f0n0", 2, 2, 0, 0), // c2, s2
      ],
      expected: true,
    },
    {
      name: "Invalid Set: Color two same, one different",
      cards: [
        createCard("c0s0f0n0", 0, 0, 0, 0),
        createCard("c0s1f1n1", 0, 1, 1, 1),
        createCard("c1s2f2n2", 1, 2, 2, 2),
      ],
      expected: false,
    },
    {
      name: "Invalid Set: All attributes two same, one different",
      cards: [
        createCard("c0s0f0n0", 0, 0, 0, 0),
        createCard("c0s0f0n0_B", 0, 0, 0, 0),
        createCard("c1s1f1n1", 1, 1, 1, 1),
      ],
      expected: false,
    },
    {
      name: "Invalid Set: One attribute invalid, others valid (all different)",
      cards: [
        createCard("c0s0f0n0", 0, 0, 0, 0), // n0
        createCard("c1s1f1n0", 1, 1, 1, 0), // n0
        createCard("c2s2f2n1", 2, 2, 2, 1), // n1
      ],
      expected: false,
    },
  ];

  testCases.forEach((tc, index) => {
    console.log(`\n🔍 Testing Case ${index + 1}: ${tc.name}`);
    const result = isSet(tc.cards[0], tc.cards[1], tc.cards[2]);
    if (result === tc.expected) {
      console.log(`✅ Test Passed: Expected ${tc.expected}, Got ${result}`);
      testsPassed++;
    } else {
      console.error(`❌ Test Failed: Expected ${tc.expected}, Got ${result}`);
      console.error("   Cards:", tc.cards.map((c) => c.id).join(", "));
      testsFailed++;
    }
  });

  console.log("\n------------------------------------");
  console.log("🏁 GameLogic Tests Finished.");
  console.log(`Total Tests: ${testCases.length}`);
  console.log(`Passed: ${testsPassed}`);
  console.log(`Failed: ${testsFailed}`);
  console.log("------------------------------------");
}

runGameLogicTests();
