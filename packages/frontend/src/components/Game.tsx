import React, { useState, useEffect } from "react";
import CardComponent from "./Card"; // We'll create this next

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

  useEffect(() => {
    fetchNewPuzzle();
  }, []);

  const fetchNewPuzzle = async () => {
    setIsLoading(true);
    setMessage("");
    setSelectedCards([]);
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

    const sortedSelection = [...currentSelection].sort().join(",");

    for (const solution of puzzle.solutions) {
      const sortedSolution = [...solution].sort().join(",");
      if (sortedSolution === sortedSelection) {
        setMessage("Congratulations! You found a Set!");
        // Here you might want to remove the set, score points, etc.
        // For now, just a message and allow fetching a new puzzle or continuing.
        return;
      }
    }
    setMessage("Not a Set. Try again!");
  };

  if (isLoading) return <p>Loading puzzle...</p>;
  if (!puzzle) return <p>{message || "No puzzle data."}</p>;

  return (
    <div>
      <button onClick={fetchNewPuzzle}>New Random Puzzle</button>
      <p>Puzzle ID: {puzzle.puzzle_id}</p>
      <p>Solutions found by backend: {puzzle.solutions.length}</p>
      {message && (
        <p
          style={{
            color: message.startsWith("Congratulations") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
      <div
        className="card-board"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
          marginTop: "20px",
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
      {/* For debugging: <pre>{JSON.stringify(puzzle.solutions, null, 2)}</pre> */}
    </div>
  );
};

export default Game;
