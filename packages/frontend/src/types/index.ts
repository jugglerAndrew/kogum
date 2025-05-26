// /workspaces/kogum/packages/frontend/src/types/index.ts
export interface ClientCardData {
  card_name: string;
  count_value: 1 | 2 | 3;
  abstractCardId: string;
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
  | "userPage";

export type DailyMealType = "breakfast" | "lunch" | "dinner" | "snack";
