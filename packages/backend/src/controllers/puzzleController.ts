// /workspaces/kogum/packages/backend/src/controllers/puzzleController.ts

import { Request, Response, NextFunction, RequestHandler } from "express";
import db from "../db";
import { getSvgEntityData } from "../db/svgEntity";
import {
  getRandomPuzzleCardIds,
  getDailyPuzzleCardIds,
  getPuzzleById,
} from "../db/puzzle";
import {
  GameAttributeSet,
  ClientCardData,
  AbstractCard,
  DailyMealType,
} from "../game/types";
import { getAbstractCardById, materializeCard } from "../game/cardManager";
import { findAllSets } from "../game/gameLogic";
import { AuthenticatedRequest } from "../middleware/requireAuth";

export const getRandomPuzzle: RequestHandler = async (req, res, next) => {
  const puzzleData = await getRandomPuzzleCardIds();
  await servePuzzle({
    puzzleData,
    buildGameAttributes: (svgEntityData) => {
      const availableColors = Object.values(svgEntityData.colors).map(
        (c) => (c as { color_name: string }).color_name
      );
      const availableShapes = Object.values(svgEntityData.shapes).map(
        (s) => (s as { shape_name: string }).shape_name
      );
      const availableFills = Object.values(svgEntityData.fills).map(
        (f) => (f as { fill_name: string }).fill_name
      );
      if (
        availableColors.length < 3 ||
        availableShapes.length < 3 ||
        availableFills.length < 3
      ) {
        throw new Error("Not enough attribute values for random puzzle.");
      }
      return {
        colors: pickThreeRandom(availableColors),
        shapes: pickThreeRandom(availableShapes),
        fills: pickThreeRandom(availableFills),
      };
    },
    res,
    next,
  });
};

const isValidMealType = (meal: any): meal is DailyMealType => {
  return ["breakfast", "lunch", "dinner", "dessert"].includes(meal);
};

export const getDailyPuzzle: RequestHandler = async (req, res, next) => {
  const meal = req.query.meal as string;

  if (!meal || !isValidMealType(meal.toLowerCase() as DailyMealType)) {
    res.status(400).json({
      error:
        "Invalid or missing meal type parameter. Must be one of: breakfast, lunch, dinner, dessert.",
    });
    return;
  }

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format (server's date)

  // Get difficulty for the meal type
  let difficultyValue: number | null = null;
  try {
    const difficultyResult = await db.query(
      `SELECT difficulty_value FROM difficulty WHERE meal_type = $1 LIMIT 1`,
      [meal.toLowerCase()]
    );
    if (difficultyResult.rows.length === 0) {
      res
        .status(500)
        .json({ message: `No difficulty found for meal type: ${meal}` });
      return;
    }
    difficultyValue = difficultyResult.rows[0].difficulty_value;
  } catch (error) {
    next(error);
    return;
  }

  const puzzleData = await getDailyPuzzleCardIds(
    meal.toLowerCase() as DailyMealType,
    today
  );
  if (!puzzleData) {
    res
      .status(404)
      .json({ message: "No daily puzzle found for this meal and date." });
    return;
  }
  // Patch servePuzzle to allow extra fields in the response, type-safe
  let extraFields: Record<string, unknown> = {};
  if (typeof puzzleData.daily_puzzle_id === "number") {
    extraFields.daily_puzzle_id = puzzleData.daily_puzzle_id;
  }
  // Use a wrapper for res.json to merge extraFields into the response
  const originalJson = res.json.bind(res);
  await servePuzzle({
    puzzleData,
    buildGameAttributes: (svgEntityData) => {
      const availableColors = Object.values(svgEntityData.colors)
        .filter(
          (c) => (c as { difficulty: number }).difficulty <= difficultyValue!
        )
        .map((c) => (c as { color_name: string }).color_name);
      const availableShapes = Object.values(svgEntityData.shapes)
        .filter(
          (s) => (s as { difficulty: number }).difficulty <= difficultyValue!
        )
        .map((s) => (s as { shape_name: string }).shape_name);
      const availableFills = Object.values(svgEntityData.fills)
        .filter(
          (f) => (f as { difficulty: number }).difficulty <= difficultyValue!
        )
        .map((f) => (f as { fill_name: string }).fill_name);
      if (
        availableColors.length < 3 ||
        availableShapes.length < 3 ||
        availableFills.length < 3
      ) {
        throw new Error("Not enough attribute values for this difficulty.");
      }
      return {
        colors: pickThreeRandom(availableColors),
        shapes: pickThreeRandom(availableShapes),
        fills: pickThreeRandom(availableFills),
      };
    },
    res: Object.assign(Object.create(res), {
      json: (body: any) => {
        // Only add extra fields if present
        if (
          Object.keys(extraFields).length > 0 &&
          typeof body === "object" &&
          body !== null
        ) {
          return originalJson({ ...body, ...extraFields });
        }
        return originalJson(body);
      },
    }) as Response,
    next,
  });
};

export const getTutorialPuzzle: RequestHandler = async (req, res, next) => {
  // Always fetch puzzle with id 1
  const puzzleData = await getPuzzleById(1);
  await servePuzzle({
    puzzleData,
    buildGameAttributes: () => ({
      colors: ["RED", "BLUE", "GREEN"],
      shapes: ["OVAL", "TRIANGLE", "DIAMOND"],
      fills: ["SOLID", "OPEN", "STRIPED"],
    }),
    res,
    next,
  });
};

// POST /api/puzzle/start
export const startPuzzleForUser: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const { dailyPuzzleId } = typedReq.body;
    if (!dailyPuzzleId || !typedReq.user) {
      res.status(400).json({ message: "Missing dailyPuzzleId or user." });
      return;
    }
    const mealResult = await db.query(
      `SELECT meal_type FROM daily_puzzles WHERE daily_puzzle_id = $1`,
      [dailyPuzzleId]
    );
    if (mealResult.rows.length === 0) {
      res.status(404).json({ message: "Daily puzzle not found." });
      return;
    }
    const meal_type = mealResult.rows[0].meal_type;
    const insertSql = `
      INSERT INTO puzzle_completions (user_id, daily_puzzle_id, puzzle_type, meal_type, start_time, end_time)
      VALUES ($1, $2, 'daily', $3, NOW(), NULL)
      ON CONFLICT (user_id, daily_puzzle_id) DO UPDATE SET start_time = EXCLUDED.start_time
      RETURNING start_time;
    `;
    const result = await db.query(insertSql, [
      typedReq.user.user_id,
      dailyPuzzleId,
      meal_type,
    ]);
    res.status(200).json({ start_time: result.rows[0].start_time });
  } catch (error) {
    next(error);
  }
};

// POST /api/puzzle/complete
export const completePuzzleForUser: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    const { dailyPuzzleId } = typedReq.body;
    if (!dailyPuzzleId || !typedReq.user) {
      res.status(400).json({ message: "Missing dailyPuzzleId or user." });
      return;
    }
    const updateSql = `
      UPDATE puzzle_completions
      SET end_time = NOW()
      WHERE user_id = $1 AND daily_puzzle_id = $2 AND end_time IS NULL
      RETURNING start_time, end_time, completion_time_ms;
    `;
    // Debug: log user and puzzle info before update
    console.log('[completePuzzleForUser] user_id:', typedReq.user.user_id, 'dailyPuzzleId:', dailyPuzzleId);
    const preUpdate = await db.query(
      'SELECT * FROM puzzle_completions WHERE user_id = $1 AND daily_puzzle_id = $2',
      [typedReq.user.user_id, dailyPuzzleId]
    );
    console.log('[completePuzzleForUser] Pre-update row(s):', preUpdate.rows);
    const result = await db.query(updateSql, [
      typedReq.user.user_id,
      dailyPuzzleId,
    ]);
    // Debug: log result after update
    console.log('[completePuzzleForUser] Update result:', result.rows);
    if (result.rows.length === 0) {
      res.status(400).json({
        message: "No started puzzle to complete or already completed.",
      });
      return;
    }
    res.status(200).json({
      start_time: result.rows[0].start_time,
      end_time: result.rows[0].end_time,
      completion_time_ms: result.rows[0].completion_time_ms,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/puzzle/leaderboard
export const getLeaderboard: RequestHandler = async (req, res, next) => {
  try {
    const { mealType, period } = req.query;
    let periodStart: string, periodEnd: string;
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    // Calculate period range
    switch (period) {
      case "daily":
        periodStart = today;
        periodEnd = today;
        break;
      case "weekly": {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Sunday=0
        const weekStart = new Date(now.setDate(diff));
        periodStart = weekStart.toISOString().split("T")[0];
        periodEnd = today;
        break;
      }
      case "monthly":
        periodStart = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-01`;
        periodEnd = today;
        break;
      case "yearly":
        periodStart = `${now.getFullYear()}-01-01`;
        periodEnd = today;
        break;
      default:
        periodStart = "1970-01-01";
        periodEnd = today;
    }
    if (!mealType) {
      res.status(400).json({ message: "Missing mealType parameter." });
      return;
    }
    const sql = `
      SELECT u.user_name, pc.completion_time_ms, pc.end_time, pc.start_time
      FROM puzzle_completions pc
      JOIN users u ON pc.user_id = u.user_id
      WHERE pc.meal_type = $1
        AND pc.puzzle_type = 'daily'
        AND pc.end_time IS NOT NULL
        AND pc.start_time >= $2
        AND pc.start_time <= $3
      ORDER BY pc.completion_time_ms ASC, pc.end_time ASC
      LIMIT 10;
    `;
    const result = await db.query(sql, [mealType, periodStart, periodEnd]);
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

// GET /api/puzzle/leaderboard/overall
export const getOverallLeaderboard: RequestHandler = async (req, res, next) => {
  try {
    const { period } = req.query;
    let periodStart: string, periodEnd: string;
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    switch (period) {
      case "daily":
        periodStart = today;
        periodEnd = today;
        break;
      case "weekly": {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const weekStart = new Date(now.setDate(diff));
        periodStart = weekStart.toISOString().split("T")[0];
        periodEnd = today;
        break;
      }
      case "monthly":
        periodStart = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-01`;
        periodEnd = today;
        break;
      case "yearly":
        periodStart = `${now.getFullYear()}-01-01`;
        periodEnd = today;
        break;
      default:
        periodStart = "1970-01-01";
        periodEnd = today;
    }
    const sql = `
      SELECT u.user_name,
        SUM(pc.completion_time_ms) AS total_time_ms,
        MAX(pc.end_time) AS last_completion_time,
        MIN(pc.start_time) AS first_start_time
      FROM puzzle_completions pc
      JOIN users u ON pc.user_id = u.user_id
      JOIN daily_puzzles dp ON pc.daily_puzzle_id = dp.daily_puzzle_id
      WHERE dp.puzzle_date >= $1
        AND dp.puzzle_date <= $2
        AND pc.puzzle_type = 'daily'
        AND pc.end_time IS NOT NULL
      GROUP BY u.user_id, u.user_name
      HAVING COUNT(DISTINCT pc.meal_type) = 4
      ORDER BY total_time_ms ASC, last_completion_time ASC
      LIMIT 10;
    `;
    const result = await db.query(sql, [periodStart, periodEnd]);
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

// GET /api/puzzle/personal-bests (auth required)
export const getPersonalBests: RequestHandler = async (req, res, next) => {
  const typedReq = req as AuthenticatedRequest;
  try {
    if (!typedReq.user) {
      res.status(401).json({ message: "Not authenticated." });
      return;
    }
    // Per-meal bests
    const bestsSql = `
      SELECT pc.meal_type, MIN(pc.completion_time_ms) AS best_time_ms, MIN(pc.end_time) AS best_time_date
      FROM puzzle_completions pc
      WHERE pc.user_id = $1
        AND pc.puzzle_type = 'daily'
        AND pc.end_time IS NOT NULL
      GROUP BY pc.meal_type;
    `;
    const bestsResult = await db.query(bestsSql, [typedReq.user.user_id]);
    // Overall best (sum of all meal types in a day)
    const overallSql = `
      SELECT dp.puzzle_date, SUM(pc.completion_time_ms) AS total_time_ms, MAX(pc.end_time) AS last_completion_time
      FROM puzzle_completions pc
      JOIN daily_puzzles dp ON pc.daily_puzzle_id = dp.daily_puzzle_id
      WHERE pc.user_id = $1
        AND pc.puzzle_type = 'daily'
        AND pc.end_time IS NOT NULL
      GROUP BY dp.puzzle_date
      HAVING COUNT(DISTINCT pc.meal_type) = 4
      ORDER BY total_time_ms ASC, last_completion_time ASC
      LIMIT 1;
    `;
    const overallResult = await db.query(overallSql, [typedReq.user.user_id]);
    res.status(200).json({
      meal_bests: bestsResult.rows,
      overall_best: overallResult.rows[0] || null,
    });
  } catch (error) {
    next(error);
  }
};

// --- Utility and helper functions ---
function pickThreeRandom<T>(arr: T[]): [T, T, T] {
  const shuffled = arr.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return [shuffled[0], shuffled[1], shuffled[2]];
}

async function servePuzzle({
  puzzleData,
  buildGameAttributes,
  res,
  next,
}: {
  puzzleData: { puzzle_id: number; card_ids: string[] } | null;
  buildGameAttributes: (
    svgEntityData: any
  ) => Promise<GameAttributeSet> | GameAttributeSet;
  res: Response;
  next: NextFunction;
}) {
  try {
    if (!puzzleData) {
      res.status(404).json({ message: "No puzzle available." });
      return;
    }
    const { puzzle_id: puzzleId, card_ids: abstractCardIds } = puzzleData;
    if (!abstractCardIds || abstractCardIds.length !== 12) {
      res.status(500).json({ message: "Invalid puzzle data retrieved." });
      return;
    }
    // Get SVG entity data
    const svgEntityData = await getSvgEntityData();
    // Build the GameAttributeSet
    const gameAttributes = await buildGameAttributes(svgEntityData);
    // Deduplicate card IDs and log
    const uniqueCardIds = Array.from(new Set(abstractCardIds));
    console.log("[servePuzzle] puzzle_id (from puzzleData):", puzzleId);
    if (puzzleData) {
      console.log(
        "[servePuzzle] full puzzleData:",
        JSON.stringify(puzzleData, null, 2)
      );
    }
    console.log("[servePuzzle] abstractCardIds:", abstractCardIds);
    console.log("[servePuzzle] uniqueCardIds:", uniqueCardIds);
    if (uniqueCardIds.length !== 12) {
      console.error(
        "[servePuzzle] Puzzle contains duplicate or missing cards:",
        uniqueCardIds
      );
      res
        .status(500)
        .json({ message: "Puzzle contains duplicate or missing cards." });
      return;
    }
    // Convert unique abstract card IDs to AbstractCard objects
    const abstractPuzzleCards: AbstractCard[] = [];
    for (const id of uniqueCardIds) {
      const card = getAbstractCardById(id);
      if (card) {
        abstractPuzzleCards.push(card);
      } else {
        res
          .status(500)
          .json({ message: `Invalid card ID ${id} found in puzzle.` });
        return;
      }
    }
    // Materialize AbstractCards into ClientCardData (async)
    const clientPuzzleCards: ClientCardData[] = await Promise.all(
      abstractPuzzleCards.map((abstractCard) =>
        materializeCard(abstractCard, gameAttributes, svgEntityData)
      )
    );
    console.log(
      "[servePuzzle] clientPuzzleCards:",
      clientPuzzleCards.map((c) => c.abstractCardId)
    );
    // Find all solutions for the set of 12 abstract cards
    const solutionsRaw = findAllSets(abstractPuzzleCards);
    // Format solutions (e.g., array of arrays of abstract card IDs)
    const clientSolutions = solutionsRaw.map((set) =>
      set.map((cardInSet) => cardInSet.id)
    );
    // Send the response
    res.status(200).json({
      puzzle_id: puzzleId,
      cards: clientPuzzleCards,
      solutions: clientSolutions,
    });
  } catch (error) {
    next(error);
  }
}
