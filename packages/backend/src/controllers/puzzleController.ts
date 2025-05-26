// /workspaces/kogum/packages/backend/src/controllers/puzzleController.ts

import { Request, Response, NextFunction, RequestHandler } from "express";
import db from "../db";
import {
  GameAttributeSet,
  ClientCardData,
  AbstractCard,
  DailyMealType,
} from "../game/types";
import { getAbstractCardById, materializeCard } from "../game/cardManager";
import { findAllSets } from "../game/gameLogic";

// Define a default attribute set for random puzzles for now
// Later, this could be fetched from the DB or be more dynamic
const defaultGameAttributes: GameAttributeSet = {
  colors: ["RED", "GREEN", "BLUE"], // Example values
  shapes: ["OVAL", "TRIANGLE", "DIAMOND"], // Example values
  fills: ["SOLID", "STRIPED", "OPEN"], // Example values
};

export const getRandomPuzzle: RequestHandler = async (req, res, next) => {
  try {
    // 1. Fetch a random puzzle (card_ids) from the database
    const puzzleResult = await db.query(
      "SELECT puzzle_id, card_ids FROM puzzles ORDER BY RANDOM() LIMIT 1"
    );

    if (puzzleResult.rows.length === 0) {
      res
        .status(404)
        .json({ message: "No puzzles available in the database." });
      return;
    }

    const dbPuzzle = puzzleResult.rows[0];
    const puzzleId: number = dbPuzzle.puzzle_id;
    const abstractCardIds: string[] = dbPuzzle.card_ids;

    if (!abstractCardIds || abstractCardIds.length !== 12) {
      console.error("Invalid puzzle data fetched from DB:", dbPuzzle);
      res.status(500).json({ message: "Invalid puzzle data retrieved." });
      return;
    }

    // 2. Convert abstract card IDs to AbstractCard objects
    const abstractPuzzleCards: AbstractCard[] = [];
    for (const id of abstractCardIds) {
      const card = getAbstractCardById(id);
      if (card) {
        abstractPuzzleCards.push(card);
      } else {
        console.error(
          `Could not find abstract card for ID: ${id} in puzzle_id: ${puzzleId}`
        );
        res
          .status(500)
          .json({ message: `Invalid card ID ${id} found in puzzle.` });
        return;
      }
    }

    // 3. Materialize AbstractCards into ClientCardData
    const clientPuzzleCards: ClientCardData[] = abstractPuzzleCards.map(
      (abstractCard) => materializeCard(abstractCard, defaultGameAttributes)
    );

    // 4. Find all solutions for the set of 12 abstract cards
    const solutionsRaw = findAllSets(abstractPuzzleCards);

    // 5. Format solutions (e.g., array of arrays of abstract card IDs)
    // The client will likely need the original abstract card IDs to identify selected cards.
    const clientSolutions = solutionsRaw.map((set) =>
      set.map((cardInSet) => cardInSet.id)
    );

    // 6. Send the response
    res.status(200).json({
      puzzle_id: puzzleId,
      cards: clientPuzzleCards, // Array of 12 { card_name, count_value, abstractCardId }
      solutions: clientSolutions, // Array of arrays of abstract card IDs
      // Optionally, you could also send the GameAttributeSet used
      // game_attributes: defaultGameAttributes,
    });
  } catch (error) {
    next(error); // Pass error to Express error handling middleware
  }
};

const isValidMealType = (meal: any): meal is DailyMealType => {
  return ["breakfast", "lunch", "dinner", "snack"].includes(meal);
};

export const getDailyPuzzle: RequestHandler = async (req, res, next) => {
  const meal = req.query.meal as string;

  if (!meal || !isValidMealType(meal.toLowerCase() as DailyMealType)) {
    res.status(400).json({
      error:
        "Invalid or missing meal type parameter. Must be one of: breakfast, lunch, dinner, snack.",
    });
    return;
  }

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format (server's date)

  try {
    // 1. Fetch the daily puzzle assignment (puzzle_id) and its card_ids
    const dailyPuzzleAssignmentResult = await db.query(
      `SELECT 
        p.puzzle_id, 
        p.card_ids
      FROM 
        puzzles p
      JOIN 
        daily_puzzles dp ON p.puzzle_id = dp.puzzle_id
      WHERE 
        dp.puzzle_date = $1 AND dp.meal_type = $2;`,
      [today, meal.toLowerCase()]
    );

    if (dailyPuzzleAssignmentResult.rows.length === 0) {
      res
        .status(404)
        .json({ message: `Today's ${meal} puzzle is not available yet.` });
      return;
    }

    const dbPuzzle = dailyPuzzleAssignmentResult.rows[0];
    const puzzleId: number = dbPuzzle.puzzle_id;
    const abstractCardIds: string[] = dbPuzzle.card_ids;

    if (!abstractCardIds || abstractCardIds.length !== 12) {
      console.error("Invalid daily puzzle data fetched from DB:", dbPuzzle);
      res.status(500).json({ message: "Invalid daily puzzle data retrieved." });
      return;
    }

    // 2. Convert abstract card IDs to AbstractCard objects and materialize them
    const abstractPuzzleCards: AbstractCard[] = abstractCardIds
      .map((id) => getAbstractCardById(id))
      .filter(Boolean) as AbstractCard[];
    if (abstractPuzzleCards.length !== 12) {
      console.error(
        `Error materializing cards for daily puzzle_id: ${puzzleId}. Expected 12, got ${abstractPuzzleCards.length}`
      );
      res.status(500).json({ message: "Error processing daily puzzle cards." });
      return;
    }
    const clientPuzzleCards: ClientCardData[] = abstractPuzzleCards.map(
      (abstractCard) => materializeCard(abstractCard, defaultGameAttributes)
    );

    // 3. Find all solutions
    const solutionsRaw = findAllSets(abstractPuzzleCards);
    const clientSolutions = solutionsRaw.map((set) =>
      set.map((cardInSet) => cardInSet.id)
    );

    // 4. Send the response
    res.status(200).json({
      puzzle_id: puzzleId,
      cards: clientPuzzleCards,
      solutions: clientSolutions,
    });
  } catch (error) {
    next(error); // Pass error to Express error handling middleware
  }
};
