// svgEntityData.ts
// Loads and caches all active shape, fill, and color data for use in the frontend or game logic

import { Pool } from "pg";

export interface ShapeSvgData {
  svg_type: string;
  svg_properties: Record<string, string | number | boolean | undefined>;
}

export interface FillData {
  fill_name: string;
  svg_pattern: any | null; // JSONB from DB, can be null for SOLID/OPEN
  difficulty: number;
}

export interface ColorData {
  color_name: string;
  color_code: string | null;
  difficulty: number;
}

export interface SvgEntityData {
  shapes: Record<string, ShapeSvgData>;
  fills: Record<string, FillData>;
  colors: Record<string, ColorData>;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
});

let svgEntityDataCache: SvgEntityData | null = null;

export async function loadSvgEntityDataFromDb(): Promise<void> {
  // Load shapes
  const shapeRes = await pool.query(
    "SELECT shape_name, svg_type, svg_properties FROM shape WHERE active_flag = TRUE"
  );
  const shapes: Record<string, ShapeSvgData> = {};
  for (const row of shapeRes.rows) {
    shapes[row.shape_name.toUpperCase()] = {
      svg_type: row.svg_type,
      svg_properties: row.svg_properties,
    };
  }

  // Load fills
  const fillRes = await pool.query(
    "SELECT fill_name, svg_pattern, difficulty FROM fill WHERE active_flag = TRUE"
  );
  const fills: Record<string, FillData> = {};
  for (const row of fillRes.rows) {
    fills[row.fill_name.toUpperCase()] = {
      fill_name: row.fill_name,
      svg_pattern: row.svg_pattern,
      difficulty: row.difficulty,
    };
  }

  // Load colors
  const colorRes = await pool.query(
    "SELECT color_name, color_code, difficulty FROM color WHERE active_flag = TRUE"
  );
  const colors: Record<string, ColorData> = {};
  for (const row of colorRes.rows) {
    colors[row.color_name.toUpperCase()] = {
      color_name: row.color_name,
      color_code: row.color_code,
      difficulty: row.difficulty,
    };
  }

  svgEntityDataCache = { shapes, fills, colors };
}

export async function getSvgEntityData(): Promise<SvgEntityData> {
  if (!svgEntityDataCache) {
    await loadSvgEntityDataFromDb();
  }
  return svgEntityDataCache!;
}
