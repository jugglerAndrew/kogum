// /workspaces/kogum/packages/backend/scripts/testCardManager.ts

import {
  generateAllAbstractCards,
  materializeCard,
} from "../src/game/cardManager";
import { AbstractCard, GameAttributeSet } from "../src/game/types";

function runCardManagerTests() {
  console.log("🧪 Running CardManager Tests...\n");

  // Test generateAllAbstractCards()
  console.log("🔍 Testing generateAllAbstractCards()...");
  const allAbstractCards = generateAllAbstractCards();

  let testGeneratePassed = true;
  if (allAbstractCards.length !== 81) {
    console.error(
      `❌ Test Failed: Expected 81 cards, got ${allAbstractCards.length}`
    );
    testGeneratePassed = false;
  }

  const ids = new Set(allAbstractCards.map((card) => card.id));
  if (ids.size !== 81) {
    console.error(`❌ Test Failed: Expected 81 unique IDs, got ${ids.size}`);
    testGeneratePassed = false;
  }

  if (testGeneratePassed) {
    console.log(
      "✅ Test Passed: generateAllAbstractCards() produced 81 unique cards."
    );
  }

  // Test materializeCard()
  console.log("\n🔍 Testing materializeCard()...");
  const sampleAttributeSet: GameAttributeSet = {
    colors: ["RED", "GOLD", "DODGERBLUE"],
    shapes: ["ISOSCELES", "SQUARE", "RHOMBUS"],
    fills: ["EMPTY", "FILLED", "CIRCLES3"],
  };

  // Example: AbstractCard { id: "c0-s1-f2-n1", colorIndex: 0, shapeIndex: 1, fillIndex: 2, countIndex: 1 }
  // color: RED (index 0)
  // shape: SQUARE (index 1)
  // fill: CIRCLES3 (index 2)
  // count: 2 (index 1 + 1)
  // card_name: Color_Fill_Shape -> RED_CIRCLES3_SQUARE
  const sampleAbstractCard: AbstractCard = {
    id: "c0-s1-f2-n1",
    colorIndex: 0,
    shapeIndex: 1,
    fillIndex: 2,
    countIndex: 1,
  };

  const clientCard = materializeCard(sampleAbstractCard, sampleAttributeSet);

  const expectedCardName = `${sampleAttributeSet.colors[0]}_${sampleAttributeSet.fills[2]}_${sampleAttributeSet.shapes[1]}`; // RED_CIRCLES3_SQUARE
  const expectedCountValue = 2;

  let testMaterializePassed = true;
  if (clientCard.card_name !== expectedCardName) {
    console.error(
      `❌ Test Failed: Expected card_name "${expectedCardName}", got "${clientCard.card_name}"`
    );
    testMaterializePassed = false;
  }
  if (clientCard.count_value !== expectedCountValue) {
    console.error(
      `❌ Test Failed: Expected count_value ${expectedCountValue}, got ${clientCard.count_value}`
    );
    testMaterializePassed = false;
  }
  if (clientCard.abstractCardId !== sampleAbstractCard.id) {
    console.error(
      `❌ Test Failed: Expected abstractCardId "${sampleAbstractCard.id}", got "${clientCard.abstractCardId}"`
    );
    testMaterializePassed = false;
  }

  if (testMaterializePassed) {
    console.log(
      "✅ Test Passed: materializeCard() produced correct ClientCardData."
    );
    console.log("   Generated card:", clientCard);
  }

  console.log("\n🏁 CardManager Tests Finished.");
}

runCardManagerTests();
