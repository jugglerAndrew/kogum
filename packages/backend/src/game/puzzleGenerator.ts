// /workspaces/kogum/packages/backend/src/game/puzzleGenerator.ts

import { AbstractCard } from "./types";
import { findAllSets } from "./gameLogic";
import { generateAllAbstractCards } from "./cardManager"; // For later use or testing

/**
 * Attempts to generate a 12-card puzzle with exactly 6 solutions,
 * starting from an initial set of cards and greedily adding filler cards.
 *
 * @param allCards The complete deck of 81 abstract cards.
 * @param initialPuzzleCards An array of AbstractCard objects to start the puzzle with.
 *                           These cards should ideally already form some sets (e.g., 6 cards from 2 disjoint sets).
 * @returns An array of 12 AbstractCard objects if a puzzle with 6 solutions is successfully generated,
 *          otherwise null.
 */
export function attemptPuzzleGenerationWithInitialCards(
  allCards: AbstractCard[],
  initialPuzzleCards: AbstractCard[]
): AbstractCard[] | null {
  const currentPuzzleCards: AbstractCard[] = [...initialPuzzleCards];

  // Create a pool of available filler cards (those not in initialPuzzleCards)
  const initialCardIds = new Set(initialPuzzleCards.map((card) => card.id));
  const availableFillerCards = allCards.filter(
    (card) => !initialCardIds.has(card.id)
  );

  // Shuffle available filler cards to introduce variability in puzzle generation
  // Basic Fisher-Yates shuffle
  for (let i = availableFillerCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableFillerCards[i], availableFillerCards[j]] = [
      availableFillerCards[j],
      availableFillerCards[i],
    ];
  }

  for (const candidateCard of availableFillerCards) {
    if (currentPuzzleCards.length >= 12) {
      break; // We have 12 cards, stop adding
    }

    const potentialPuzzle = [...currentPuzzleCards, candidateCard];
    const numSolutionsInPotential = findAllSets(potentialPuzzle).length;

    // Greedy choice: Add the card if it doesn't push the solution count over 6.
    if (numSolutionsInPotential <= 6) {
      currentPuzzleCards.push(candidateCard);
    }
  }

  // Final check: Did we end up with 12 cards and exactly 6 solutions?
  if (
    currentPuzzleCards.length === 12 &&
    findAllSets(currentPuzzleCards).length === 6
  ) {
    return currentPuzzleCards;
  }

  return null; // Failed to generate a valid puzzle with this attempt
}

/**
 * Attempts to generate a single abstract puzzle consisting of 12 cards
 * that together form exactly 6 unique "Set" solutions.
 *
 * The function shuffles the deck and iteratively builds a candidate puzzle,
 * adding cards if they do not cause the number of solutions to exceed the target.
 * This process is repeated for a defined number of attempts.
 *
 * @returns An array of 12 AbstractCard objects if a valid puzzle is generated, otherwise null.
 */
const MAX_CARDS_IN_PUZZLE = 12;
const TARGET_SOLUTIONS = 6;
const PUZZLE_GENERATION_ATTEMPTS = 200; // Number of attempts to generate one puzzle

export function generateSingleAbstractPuzzle(): AbstractCard[] | null {
  const allCards = generateAllAbstractCards();

  for (let attempt = 0; attempt < PUZZLE_GENERATION_ATTEMPTS; attempt++) {
    let currentPuzzleCards: AbstractCard[] = [];
    // Create a pool of available cards, shuffled for this attempt
    const availableCards = [...allCards].sort(() => 0.5 - Math.random());

    // Greedily try to build a puzzle
    // Iterate while we need more cards and have cards to pick from
    while (
      currentPuzzleCards.length < MAX_CARDS_IN_PUZZLE &&
      availableCards.length > 0
    ) {
      let cardAddedInThisIteration = false;
      for (let i = 0; i < availableCards.length; i++) {
        const candidateCard = availableCards[i];
        const potentialPuzzle = [...currentPuzzleCards, candidateCard];
        const numSolutionsInPotential = findAllSets(potentialPuzzle).length;

        // Add card if it doesn't push solutions beyond the target
        if (numSolutionsInPotential <= TARGET_SOLUTIONS) {
          currentPuzzleCards.push(candidateCard);
          availableCards.splice(i, 1); // Remove card from available pool
          cardAddedInThisIteration = true;
          break; // Card added, move to fill the next slot in currentPuzzleCards
        }
      }
      if (!cardAddedInThisIteration) {
        // If we went through all available cards and couldn't add one
        // without exceeding TARGET_SOLUTIONS, this specific build attempt is stuck.
        break;
      }
    }

    // Final check for this attempt
    if (
      currentPuzzleCards.length === MAX_CARDS_IN_PUZZLE &&
      findAllSets(currentPuzzleCards).length === TARGET_SOLUTIONS
    ) {
      return currentPuzzleCards; // Successfully generated a puzzle
    }
  }
  // console.warn(`Failed to generate a puzzle after ${PUZZLE_GENERATION_ATTEMPTS} attempts.`);
  return null; // Failed to generate a puzzle after all attempts
}
