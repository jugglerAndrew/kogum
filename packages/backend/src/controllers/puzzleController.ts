// /workspaces/kogum/packages/backend/src/controllers/puzzleController.ts

import { Request, Response } from "express";
import db from "../db";
import { GameAttributeSet, ClientCardData, AbstractCard } from "../game/types";
import { getAbstractCardById, materializeCard } from "../game/cardManager";
import { findAllSets } from "../game/gameLogic";

// Define a default attribute set for random puzzles for now
// Later, this could be fetched from the DB or be more dynamic
const defaultGameAttributes: GameAttributeSet = {
  colors: ["RED", "GREEN", "BLUE"], // Example values
  shapes: ["OVAL", "TRIANGLE", "DIAMOND"], // Example values
  fills: ["SOLID", "STRIPED", "OPEN"], // Example values
};

export const getRandomPuzzle = async (req: Request, res: Response) => {
  try {
    // 1. Fetch a random puzzle (card_ids) from the database
    const puzzleResult = await db.query(
      "SELECT puzzle_id, card_ids FROM puzzles ORDER BY RANDOM() LIMIT 1"
    );

    if (puzzleResult.rows.length === 0) {
      res
        .status(404)
        .json({ message: "No puzzles available in the database." });
    }

    const dbPuzzle = puzzleResult.rows[0];
    const puzzleId: number = dbPuzzle.puzzle_id;
    const abstractCardIds: string[] = dbPuzzle.card_ids;

    if (!abstractCardIds || abstractCardIds.length !== 12) {
      console.error("Invalid puzzle data fetched from DB:", dbPuzzle);
      res.status(500).json({ message: "Invalid puzzle data retrieved." });
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
    console.error("Error fetching random puzzle:", error);
    res.status(500).json({ message: "Failed to fetch random puzzle." });
  }
};
