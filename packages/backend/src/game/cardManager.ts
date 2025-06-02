// /workspaces/kogum/packages/backend/src/game/cardManager.ts

import {
  AbstractCard,
  GameAttributeSet,
  ClientCardData,
  AttributeIndex,
} from "./types";

let allAbstractCardsCache: AbstractCard[] | null = null;
let abstractCardMapCache: Map<string, AbstractCard> | null = null;
/**
 * Generates all 81 unique abstract cards.
 * Each card is a combination of four attributes, each with three possible values (represented by indices 0, 1, 2).
 * @returns An array of 81 AbstractCard objects.
 */
export function generateAllAbstractCards(): AbstractCard[] {
  if (allAbstractCardsCache) {
    return allAbstractCardsCache;
  }

  const cardsGenerated: AbstractCard[] = [];
  const attributeIndices: AttributeIndex[] = [0, 1, 2];

  for (const colorIndex of attributeIndices) {
    for (const shapeIndex of attributeIndices) {
      for (const fillIndex of attributeIndices) {
        for (const countIndex of attributeIndices) {
          cardsGenerated.push({
            id: `c${colorIndex}-s${shapeIndex}-f${fillIndex}-n${countIndex}`, // Standardized ID format
            colorIndex,
            shapeIndex,
            fillIndex,
            countIndex,
          });
        }
      }
    }
  }
  allAbstractCardsCache = cardsGenerated;
  return allAbstractCardsCache;
}

/**
 * Retrieves a map of all abstract cards, keyed by their ID.
 * Generates and caches the map on the first call.
 * @returns A Map where keys are card IDs and values are AbstractCard objects.
 */
function getAbstractCardMap(): Map<string, AbstractCard> {
  if (abstractCardMapCache) {
    return abstractCardMapCache;
  }
  const map = new Map<string, AbstractCard>();
  generateAllAbstractCards().forEach((card) => map.set(card.id, card));
  abstractCardMapCache = map;
  return abstractCardMapCache;
}

export function getAbstractCardById(id: string): AbstractCard | undefined {
  return getAbstractCardMap().get(id);
}

/**
 * Materializes an abstract card into client-facing data using a specific set of attribute names.
 * This function translates the attribute indices of an abstract card into concrete string values
 * (e.g., color names, shape names) and constructs the card representation expected by the frontend.
 *
 * @param abstractCard The abstract card definition with attribute indices.
 * @param attributeSet The set of specific attribute names (colors, shapes, fills) for the current game context.
 * @param svgEntityData (optional) The centralized SVG entity data cache for shape SVG info.
 * @returns Promise<ClientCardData> containing the human-readable card_name and its count_value.
 */
export async function materializeCard(
  abstractCard: AbstractCard,
  attributeSet: GameAttributeSet,
  svgEntityData?: import("../db/svgEntity").SvgEntityData
): Promise<ClientCardData> {
  const color = attributeSet.colors[abstractCard.colorIndex];
  const shape = attributeSet.shapes[abstractCard.shapeIndex];
  const fill = attributeSet.fills[abstractCard.fillIndex];

  // The client-facing card_name format is Color_Fill_Shape, as per legacy system analysis.
  const card_name = `${color}_${fill}_${shape}`;
  const count_value = (abstractCard.countIndex + 1) as 1 | 2 | 3; // countIndex (0,1,2) maps to count (1,2,3)

  // Use svgEntityData for shape SVG info if provided
  let svg_type: string = "ellipse";
  let svg_properties: Record<string, string | number | boolean | undefined> = {
    cx: 25,
    cy: 25,
    rx: 20,
    ry: 12,
  };
  let svg_pattern: any | null = null;
  if (svgEntityData) {
    const shapeData = svgEntityData.shapes[shape.toUpperCase()];
    if (shapeData) {
      svg_type = shapeData.svg_type;
      svg_properties = shapeData.svg_properties;
    }
    const fillData = svgEntityData.fills[fill.toUpperCase()];
    if (fillData && fillData.svg_pattern) {
      svg_pattern = fillData.svg_pattern;
    }
  }

  return {
    card_name,
    count_value,
    abstractCardId: abstractCard.id, // Include the abstract ID for potential reference
    svg_type,
    svg_properties,
    svg_pattern,
  };
}
