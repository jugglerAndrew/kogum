// /workspaces/kogum/packages/backend/src/controllers/debugController.ts
import { RequestHandler } from "express";

import { getSvgEntityData } from "../db/svgEntity";
// Returns all combinations of shape, color, and fill using the svgEntityData cache
export const getSvgEntityCombinations: RequestHandler = async (req, res) => {
  // Restrict to development only
  if (process.env.NODE_ENV !== "development") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const { shapes, fills, colors } = await getSvgEntityData();
    const combinations = [];
    for (const [shapeName, shape] of Object.entries(shapes)) {
      for (const [colorName, color] of Object.entries(colors)) {
        for (const [fillName, fill] of Object.entries(fills)) {
          combinations.push({
            shape: {
              name: shapeName,
              svg_type: shape.svg_type,
              svg_properties: shape.svg_properties,
            },
            color: {
              name: colorName,
              color_name: color.color_name,
              color_code: color.color_code,
              difficulty: color.difficulty,
            },
            fill: {
              name: fillName,
              fill_name: fill.fill_name,
              svg_pattern: fill.svg_pattern,
              difficulty: fill.difficulty,
            },
          });
        }
      }
    }
    res.json(combinations);
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch svg entity combinations" });
    return;
  }
};
