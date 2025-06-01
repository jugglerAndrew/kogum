// shapeSvgData.ts
// This module loads shape SVG data from the database for dynamic support

import { Pool } from "pg";

export interface ShapeSvgData {
  svg_type: string;
  svg_properties: Record<string, string | number | boolean | undefined>;
}

// You may want to move this pool to a shared db util in production
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
});

// In-memory cache for shape data (keyed by shape_name)
let shapeDataCache: Record<string, ShapeSvgData> | null = null;

/**
 * Loads all shape SVG data from the database and caches it in memory.
 */
export async function loadShapeSvgDataFromDb(): Promise<void> {
  const res = await pool.query(
    "SELECT shape_name, svg_type, svg_properties FROM shape WHERE active_flag = TRUE"
  );
  const map: Record<string, ShapeSvgData> = {};
  for (const row of res.rows) {
    map[row.shape_name.toUpperCase()] = {
      svg_type: row.svg_type,
      svg_properties: row.svg_properties,
    };
  }
  shapeDataCache = map;
}

/**
 * Gets the SVG data for a shape by name, loading from DB if needed.
 * @param shapeName The shape name (case-insensitive)
 */
export async function getShapeSvgData(
  shapeName: string
): Promise<ShapeSvgData> {
  if (!shapeDataCache) {
    await loadShapeSvgDataFromDb();
  }
  // Default to OVAL if not found
  return (
    (shapeDataCache && shapeDataCache[shapeName.toUpperCase()]) ||
    (shapeDataCache && shapeDataCache["OVAL"]) || {
      svg_type: "ellipse",
      svg_properties: { cx: 25, cy: 25, rx: 20, ry: 12 },
    }
  );
}
