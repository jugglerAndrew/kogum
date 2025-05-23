import React, { useState, useEffect } from "react";
import CardComponent from "./Card";

// Types to match backend response
interface ClientCardData {
  card_name: string;
  count_value: 1 | 2 | 3;
  abstractCardId: string;
}

interface PuzzleData {
  puzzle_id: number;
  cards: ClientCardData[];
  solutions: string[][]; // Array of arrays of abstract card IDs
}

const Game: React.FC = () => {
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]); // Store abstractCardIds
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Store found solutions as an array of ClientCardData arrays, up to 6 solutions
  const [foundSolutions, setFoundSolutions] = useState<
    (ClientCardData[] | null)[]
  >(Array(6).fill(null));

  useEffect(() => {
    fetchNewPuzzle();
  }, []);

  const fetchNewPuzzle = async () => {
    setIsLoading(true);
    setMessage("");
    setSelectedCards([]);
    setFoundSolutions(Array(6).fill(null)); // Reset found solutions
    try {
      const response = await fetch("/api/puzzles/random");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PuzzleData = await response.json();
      setPuzzle(data);
    } catch (error) {
      console.error("Failed to fetch puzzle:", error);
      setMessage("Failed to load puzzle. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardSelect = (abstractCardId: string) => {
    setSelectedCards((prevSelected) => {
      if (prevSelected.includes(abstractCardId)) {
        return prevSelected.filter((id) => id !== abstractCardId); // Deselect
      }
      if (prevSelected.length < 3) {
        const newSelection = [...prevSelected, abstractCardId];
        if (newSelection.length === 3) {
          checkIfSet(newSelection);
        }
        return newSelection;
      }
      return prevSelected; // Max 3 selected
    });
  };

  const checkIfSet = (currentSelection: string[]) => {
    if (!puzzle || currentSelection.length !== 3) return;

    const sortedSelectedIds = [...currentSelection].sort();

    let isSetFoundThisTurn = false;
    for (const solutionIds of puzzle.solutions) {
      const sortedSolutionIds = [...solutionIds].sort();

      if (
        JSON.stringify(sortedSelectedIds) === JSON.stringify(sortedSolutionIds)
      ) {
        const alreadyFound = foundSolutions.some(
          (foundSet) =>
            foundSet &&
            JSON.stringify(
              [...foundSet.map((c) => c.abstractCardId)].sort()
            ) === JSON.stringify(sortedSolutionIds)
        );

        if (alreadyFound) {
          setMessage("You already found this Set!");
          isSetFoundThisTurn = true;
          break;
        }

        const emptySlotIndex = foundSolutions.findIndex(
          (slot) => slot === null
        );
        if (emptySlotIndex !== -1) {
          const cardsForSolutionSet = solutionIds
            .map((id) =>
              puzzle.cards.find((card) => card.abstractCardId === id)
            )
            .filter(Boolean) as ClientCardData[];

          if (cardsForSolutionSet.length === 3) {
            // Ensure all cards were found
            setFoundSolutions((prev) => {
              const newFound = [...prev];
              newFound[emptySlotIndex] = cardsForSolutionSet;
              return newFound;
            });
            setMessage("Congratulations! You found a Set!");
            isSetFoundThisTurn = true;
          } else {
            // This case should ideally not happen if puzzle data is consistent
            console.error("Could not find all cards for a valid solution set.");
            setMessage("Error processing set. Try again.");
          }
        } else {
          // All 6 slots are filled, but this set wasn't among them (should be rare if puzzle.solutions is the source of truth)
          setMessage(
            "Congratulations! You found a Set! (All solution slots full)"
          );
          isSetFoundThisTurn = true;
        }
        break;
      }
    }

    if (!isSetFoundThisTurn) {
      setMessage("Not a Set. Try again!");
    }
    setSelectedCards([]); // Clear selection after checking
  };

  if (isLoading) return <p>Loading puzzle...</p>;
  if (!puzzle) return <p>{message || "No puzzle data."}</p>;

  const numSolutionsProvided = puzzle.solutions.length;
  const numSolutionsActuallyFound = foundSolutions.filter(
    (s) => s !== null
  ).length;

  return (
    <div>
      <button onClick={fetchNewPuzzle}>New Random Puzzle</button>
      {/* <p>Puzzle ID: {puzzle.puzzle_id}</p> */}
      {/* <p>Solutions expected: {numSolutionsProvided}</p> */}
      {message && (
        <p
          style={{
            color: message.startsWith("Congratulations") ? "green" : "red",
            fontWeight: "bold",
            minHeight: "1.2em", // Reserve space to prevent layout shift
          }}
        >
          {message}
        </p>
      )}
      <div
        className="card-board"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)", // 4 columns
          gridTemplateRows: "repeat(3, 1fr)", // 3 rows
          gap: "5px", // Reduced gap for tighter grid
          maxWidth: "800px", // Max width for the board (approx 4 cards wide + gaps)
          margin: "20px auto", // Center the board
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        {puzzle.cards.map((card) => (
          <CardComponent
            key={card.abstractCardId}
            cardData={card}
            onSelect={handleCardSelect}
            isSelected={selectedCards.includes(card.abstractCardId)}
          />
        ))}
      </div>

      <div
        className="solution-area"
        style={{
          marginTop: "30px",
          borderTop: "2px solid #ccc",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <h2>
          Found Sets ({numSolutionsActuallyFound}/{numSolutionsProvided})
        </h2>
        <div
          className="solution-slots"
          style={{
            display: "grid", // Change to grid
            gridTemplateColumns: "repeat(3, 1fr)", // 3 columns
            gridTemplateRows: "repeat(2, auto)", 
            justifyItems: "center", // Center items within grid cells
            gap: "10px",
            maxWidth: "920px", 
            margin: "0 auto", 
          }}
        >
          {Array(numSolutionsProvided)
            .fill(null)
            .map((_, index) => {
              const solutionSet = foundSolutions[index];
              return (
                <div
                  key={`solution-slot-${index}`}
                  className="solution-slot"
                  style={{
                    border: "1px dashed #aaa",
                    borderRadius: "5px",
                    padding: "5px",
                    // Slot width: 3 scaled cards (90px each) + 2 gaps (5px each) + slot padding (5px*2)
                    // (90 * 3) + (5 * 2) + (5 * 2) = 270 + 10 + 10 = 290px.
                    width: "284px", 
                    // Slot height: 1 scaled card (60px) + slot padding (5px*2) = 70px
                    height: "70px", 
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start", // Align cards to the start, gap will space them
                    gap: "2px", // Reduced gap between the scaled card wrappers
                    backgroundColor: solutionSet ? "#e8f5e9" : "#f0f0f0",
                  }}
                >
                  {solutionSet ? (
                    solutionSet.map((card) => (
                      <div
                        key={`sol-${card.abstractCardId}-${index}-wrapper`}
                        style={{
                          transform: "scale(0.5)",
                          transformOrigin: "top left", // Scale from top-left
                          // Set wrapper dimensions to the SCALED card's content box size
                          // This makes the layout box match the visual size after scaling.
                          width: "90px",  // Scaled card content width (180px * 0.5)
                          height: "60px", // Scaled card content height (120px * 0.5)
                        }}
                      >
                        <CardComponent
                          cardData={card}
                          onSelect={() => {}}
                          isSelected={false} // isSelected is false for solution cards
                          applyMargins={false} // Don't apply CardComponent's internal margins
                        />
                      </div>
                    ))
                  ) : (
                    <span style={{ color: "#aaa" }}>Slot {index + 1}</span>
                  )}
                </div>
              );
            })}
        </div>
      </div>
      {/* For debugging: <pre>{JSON.stringify(puzzle.solutions, null, 2)}</pre> */}
    </div>
  );
};

export default Game;
