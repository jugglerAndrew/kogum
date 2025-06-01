// /workspaces/kogum/packages/backend/src/controllers/debugController.ts
import { RequestHandler } from "express";

import { query } from "../db";
import { getShapeSvgData } from "../game/shapeSvgData";

export const getShapeColorFillCombinations: RequestHandler = async (
  req,
  res
) => {
  // Restrict to development only
  if (process.env.NODE_ENV !== "development") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const [shapes, colors, fills] = await Promise.all([
      query("SELECT * FROM shape WHERE active_flag = TRUE"),
      query("SELECT * FROM color WHERE active_flag = TRUE"),
      query("SELECT * FROM fill WHERE active_flag = TRUE"),
    ]);

    const combinations = [];
    for (const shape of shapes.rows) {
      // Fetch svg_type and svg_properties for this shape
      const { svg_type, svg_properties } = await getShapeSvgData(
        shape.shape_name
      );
      for (const color of colors.rows) {
        for (const fill of fills.rows) {
          combinations.push({
            shape: { id: shape.shape_id, name: shape.shape_name },
            color: {
              id: color.color_id,
              name: color.color_name,
              code: color.color_code,
            },
            fill: { id: fill.fill_id, name: fill.fill_name },
            svg_type,
            svg_properties,
          });
        }
      }
    }

    res.json(combinations);
    return;
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch combinations" });
    return;
  }
};
