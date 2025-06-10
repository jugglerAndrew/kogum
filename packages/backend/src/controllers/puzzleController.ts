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
    res,
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
