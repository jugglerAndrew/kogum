// /workspaces/kogum/packages/backend/src/controllers/PuzzleData.ts
import db from ".";
import { DailyMealType } from "../game/types";

export async function getRandomPuzzleCardIds(): Promise<{
  puzzle_id: number;
  card_ids: string[];
} | null> {
  const puzzleResult = await db.query(
    "SELECT puzzle_id, card_ids FROM puzzles ORDER BY RANDOM() LIMIT 1"
  );
  if (puzzleResult.rows.length === 0) return null;
  const dbPuzzle = puzzleResult.rows[0];
  return {
    puzzle_id: dbPuzzle.puzzle_id,
    card_ids: dbPuzzle.card_ids,
  };
}

export async function getDailyPuzzleCardIds(
  meal: DailyMealType,
  today: string
): Promise<{ puzzle_id: number; card_ids: string[] } | null> {
  const dailyPuzzleAssignmentResult = await db.query(
    `SELECT \
      p.puzzle_id, \
      p.card_ids\n    FROM \
      puzzles p\n    JOIN \
      daily_puzzles dp ON p.puzzle_id = dp.puzzle_id\n    WHERE \
      dp.puzzle_date = $1 AND dp.meal_type = $2;`,
    [today, meal.toLowerCase()]
  );
  if (dailyPuzzleAssignmentResult.rows.length === 0) return null;
  const dbPuzzle = dailyPuzzleAssignmentResult.rows[0];
  return {
    puzzle_id: dbPuzzle.puzzle_id,
    card_ids: dbPuzzle.card_ids,
  };
}

export async function getPuzzleById(
  puzzleId: number
): Promise<{ puzzle_id: number; card_ids: string[] } | null> {
  const puzzleResult = await db.query(
    "SELECT puzzle_id, card_ids FROM puzzles WHERE puzzle_id = $1",
    [puzzleId]
  );
  if (puzzleResult.rows.length === 0) return null;
  const dbPuzzle = puzzleResult.rows[0];
  return {
    puzzle_id: dbPuzzle.puzzle_id,
    card_ids: dbPuzzle.card_ids,
  };
}
