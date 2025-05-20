// /workspaces/kogum/packages/backend/src/game/gameLogic.ts

import { AbstractCard, AttributeIndex } from "./types";

/**
 * Checks if a specific attribute's values across three cards are valid for a set.
 * An attribute is valid if its values are either all the same or all different.
 *
 * @param val1 AttributeIndex of the first card for a specific attribute.
 * @param val2 AttributeIndex of the second card for a specific attribute.
 * @param val3 AttributeIndex of the third card for a specific attribute.
 * @returns True if the attribute values form a valid part of a set, false otherwise.
 */
function isAttributeConditionMet(
  val1: AttributeIndex,
  val2: AttributeIndex,
  val3: AttributeIndex
): boolean {
  const allSame = val1 === val2 && val2 === val3;
  const allDifferent = val1 !== val2 && val1 !== val3 && val2 !== val3;
  return allSame || allDifferent;
}

/**
 * Determines if three abstract cards form a "Set".
 * A set is formed if, for each of the four attributes (color, shape, fill, count),
 * the properties are either all the same across the three cards or all different.
 *
 * @param card1 The first abstract card.
 * @param card2 The second abstract card.
 * @param card3 The third abstract card.
 * @returns True if the three cards form a set, false otherwise.
 */
export function isSet(
  card1: AbstractCard,
  card2: AbstractCard,
  card3: AbstractCard
): boolean {
  if (
    !isAttributeConditionMet(
      card1.colorIndex,
      card2.colorIndex,
      card3.colorIndex
    )
  )
    return false;
  if (
    !isAttributeConditionMet(
      card1.shapeIndex,
      card2.shapeIndex,
      card3.shapeIndex
    )
  )
    return false;
  if (
    !isAttributeConditionMet(card1.fillIndex, card2.fillIndex, card3.fillIndex)
  )
    return false;
  if (
    !isAttributeConditionMet(
      card1.countIndex,
      card2.countIndex,
      card3.countIndex
    )
  )
    return false;

  return true;
}
