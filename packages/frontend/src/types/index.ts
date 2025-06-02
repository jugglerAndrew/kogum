// SVG pattern element types for DB-driven SVG patterns
export type SvgPatternElement =
  | {
      element: "rect";
      width: number;
      height: number;
      fill?: string;
    }
  | {
      element: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      strokeWidth?: number;
    }
  | {
      element: "circle";
      cx: number;
      cy: number;
      r: number;
    };

export type SvgPattern = {
  patternUnits?: string;
  patternTransform?: string;
  width: number;
  height: number;
  elements: SvgPatternElement[];
};
// For debug page
export interface DebugCombination {
  shape: { id: number; name: string };
  color: { id: number; name: string; code: string | null };
  fill: { id: number; name: string };
}
// /workspaces/kogum/packages/frontend/src/types/index.ts
export interface ClientCardData {
  card_name: string;
  count_value: 1 | 2 | 3;
  abstractCardId: string;
  svg_type: string;
  svg_properties: Record<string, string | number | boolean | undefined>;
  svg_pattern?: SvgPattern | null;
}

export interface PuzzleData {
  puzzle_id: number;
  cards: ClientCardData[];
  solutions: string[][]; // Array of arrays of abstract card IDs
}

export interface UserData {
  user_id: string;
  user_name: string;
  user_email: string;
}

export type ActivePage =
  | "kogum"
  | "today"
  | "random"
  | "scores"
  | "login"
  | "userPage"
  | "tutorial"
  | "debugCombinations";

export type DailyMealType = "breakfast" | "lunch" | "dinner" | "dessert";
