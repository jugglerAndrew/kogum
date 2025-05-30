// /workspaces/kogum/packages/backend/src/game/types.ts

/**
 * Represents the index for an attribute's value (0, 1, or 2).
 * Each of the four card attributes will have three possible values.
 */
export type AttributeIndex = 0 | 1 | 2;

/**
 * Defines the structure of an abstract card.
 * Each card is a unique combination of four attribute indices.
 * There will be 3*3*3*3 = 81 unique abstract cards.
 */
export interface AbstractCard {
  /** A unique identifier, e.g., "c0-s1-f2-n0" (colorIdx 0, shapeIdx 1, fillIdx 2, countIdx 0) */
  id: string;
  colorIndex: AttributeIndex;
  shapeIndex: AttributeIndex;
  fillIndex: AttributeIndex;
  /** This will map to count values 1, 2, 3 (countIndex + 1) */
  countIndex: AttributeIndex;
}

/**
 * Defines the set of actual attribute names (strings) for a specific game instance.
 * For example, a daily puzzle might use ["RED", "GREEN", "BLUE"] as its colors.
 */
export interface GameAttributeSet {
  colors: [string, string, string];
  shapes: [string, string, string];
  fills: [string, string, string];
  // Counts are implicitly [1, 2, 3] based on countIndex of an AbstractCard
}

/**
 * Represents the data structure for a card as expected by the client,
 * after an AbstractCard has been "materialized" with a GameAttributeSet.
 */
export interface ClientCardData {
  /** e.g., "RED_EMPTY_SQUARE" (Color_Fill_Shape) */
  card_name: string;
  count_value: 1 | 2 | 3;
  /** Optionally, the ID of the abstract card this was derived from */
  abstractCardId?: string;
}

export type DailyMealType = "breakfast" | "lunch" | "dinner" | "dessert";
