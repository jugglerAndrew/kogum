// /workspaces/kogum/packages/backend/src/game/cardManager.ts

import {
  AbstractCard,
  GameAttributeSet,
  ClientCardData,
  AttributeIndex,
} from "./types";

/**
 * Generates all 81 unique abstract cards.
 * Each card is a combination of four attributes, each with three possible values (represented by indices 0, 1, 2).
 * @returns An array of 81 AbstractCard objects.
 */
export function generateAllAbstractCards(): AbstractCard[] {
  const cards: AbstractCard[] = [];
  const indices: AttributeIndex[] = [0, 1, 2];

  for (const colorIndex of indices) {
    for (const shapeIndex of indices) {
      for (const fillIndex of indices) {
        for (const countIndex of indices) {
          cards.push({
            id: `c${colorIndex}-s${shapeIndex}-f${fillIndex}-n${countIndex}`,
            colorIndex,
            shapeIndex,
            fillIndex,
            countIndex,
          });
        }
      }
    }
  }
  return cards;
}

/**
 * Materializes an abstract card into client-facing data using a specific set of attribute names.
 * This function translates the attribute indices of an abstract card into concrete string values
 * (e.g., color names, shape names) and constructs the card representation expected by the frontend.
 *
 * @param abstractCard The abstract card definition with attribute indices.
 * @param attributeSet The set of specific attribute names (colors, shapes, fills) for the current game context.
 * @returns ClientCardData containing the human-readable card_name and its count_value.
 */
export function materializeCard(
  abstractCard: AbstractCard,
  attributeSet: GameAttributeSet
): ClientCardData {
  const color = attributeSet.colors[abstractCard.colorIndex];
  const shape = attributeSet.shapes[abstractCard.shapeIndex];
  const fill = attributeSet.fills[abstractCard.fillIndex];

  // The client-facing card_name format is Color_Fill_Shape, as per legacy system analysis.
  const card_name = `${color}_${fill}_${shape}`;
  const count_value = (abstractCard.countIndex + 1) as 1 | 2 | 3; // countIndex (0,1,2) maps to count (1,2,3)

  return {
    card_name,
    count_value,
    abstractCardId: abstractCard.id, // Include the abstract ID for potential reference
  };
}