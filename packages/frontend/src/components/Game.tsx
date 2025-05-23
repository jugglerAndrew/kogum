import React, { useState, useEffect, useRef } from "react";
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
  const [message, setMessage] = useState<string>(" "); // Initialized with a space to maintain height
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [foundSolutions, setFoundSolutions] = useState<
    (ClientCardData[] | null)[]
  >(Array(6).fill(null));

  // Timer state
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0); // Time in ms when paused
  const [currentTime, setCurrentTime] = useState<number>(0); // Continuously updated time in ms
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameCompleted, setIsGameCompleted] = useState<boolean>(false);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchNewPuzzle();
  }, []);

  // Timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (!isPaused && startTime !== null && puzzle) {
      intervalId = setInterval(() => {
        setCurrentTime(elapsedTime + (Date.now() - startTime));
      }, 47); // Update frequently for ms accuracy
    } else if (isPaused) {
      // Ensure currentTime reflects the paused time accurately
      setCurrentTime(elapsedTime);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPaused, startTime, elapsedTime, puzzle]);

  // Effect to make messages temporary
  useEffect(() => {
    if (message.trim() !== "") {
      // If there's a non-empty message
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
      messageTimeoutRef.current = setTimeout(() => {
        setMessage(" "); // Clear message after 5 seconds
      }, 5000);
    }
    // Cleanup timeout if component unmounts or message changes before timeout fires
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, [message]);

  const fetchNewPuzzle = async () => {
    setIsLoading(true);
    setMessage(" "); // Reset message to a space to maintain height
    setSelectedCards([]);
    setFoundSolutions(Array(6).fill(null)); // Reset found solutions
    try {
      setIsGameCompleted(false); // Reset game completion state
      const response = await fetch("/api/puzzles/random");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PuzzleData = await response.json();
      setPuzzle(data);
      // Reset and start timer
      setElapsedTime(0);
      setCurrentTime(0);
      setStartTime(Date.now());
      setIsPaused(false);
    } catch (error) {
      console.error("Failed to fetch puzzle:", error);
      setMessage("Failed to load puzzle. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardSelect = (abstractCardId: string) => {
    if (isPaused || isGameCompleted) return; // Do nothing if paused or game is completed
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

            // Check if all sets are found
            const newNumSolutionsFound =
              foundSolutions.filter((s) => s !== null).length + 1; // +1 for the current one
            if (
              newNumSolutionsFound === puzzle.solutions.length &&
              puzzle.solutions.length > 0
            ) {
              setIsGameCompleted(true);
              if (startTime) {
                // If timer was running
                // Capture final elapsed time
                const finalElapsedTime = elapsedTime + (Date.now() - startTime);
                setElapsedTime(finalElapsedTime);
                setCurrentTime(finalElapsedTime); // Ensure currentTime reflects the final time immediately
              }
              setStartTime(null); // Stop the timer
              setMessage("Congratulations! You found all Sets!");
            } else {
              setMessage("Congratulations! You found a Set!");
            }
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

  const handlePauseResume = () => {
    if (isGameCompleted) return; // Don't allow pause/resume if game is completed
    const now = Date.now();
    if (isPaused) {
      // Resuming
      setStartTime(now); // Current time becomes the new start for the current segment
      // elapsedTime remains the accumulated time from previous segments
      setIsPaused(false);
    } else {
      // Pausing
      if (startTime) {
        setElapsedTime(
          (prevElapsedTime) => prevElapsedTime + (now - startTime)
        );
      }
      setStartTime(null); // Indicate that the timer is not actively running a segment
      setIsPaused(true);
    }
  };

  const handleNewPuzzleClick = () => {
    const wasGameAlreadyPaused = isPaused;

    // If the game is not already paused by the user, pause it for the dialog
    if (!wasGameAlreadyPaused) {
      handlePauseResume(); // This will set isPaused to true and stop the timer
    }

    // Defer the confirm dialog to allow the pause state to render
    setTimeout(() => {
      if (
        window.confirm(
          "Are you sure you want to start a new puzzle? Your current game progress will be lost."
        )
      ) {
        fetchNewPuzzle(); // fetchNewPuzzle will reset isPaused to false and restart timer
      } else {
        // If user cancels, and we paused the game for this dialog, resume it
        if (!wasGameAlreadyPaused) {
          handlePauseResume(); // This will set isPaused back to false and resume the timer
        }
      }
    }, 0); // Timeout of 0ms defers execution to the next event loop cycle
  };

  if (isLoading) return <p>Loading puzzle...</p>;
  if (!puzzle) return <p>{message || "No puzzle data."}</p>;

  const numSolutionsProvided = puzzle.solutions.length;
  const numSolutionsActuallyFound = foundSolutions.filter(
    (s) => s !== null
  ).length;

  const formatTime = (totalMilliseconds: number): string => {
    const ms = String(totalMilliseconds % 1000).padStart(3, "0");
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    return `${minutes}:${seconds}:${ms}`;
  };
  const displayTime = formatTime(currentTime);

  return (
    <div>
      {/* Puzzle Menu Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", // Distribute space
          padding: "10px 15px",
          borderBottom: "1px solid #eee",
          marginBottom: "15px",
          flexWrap: "wrap", // Allow wrapping on smaller screens
          gap: "10px", // Gap between items if they wrap
        }}
      >
        {/* Puzzle Type - Placeholder for now */}
        <div style={{ fontSize: "1.1em", fontWeight: "bold" }}>randøm</div>

        {/* Message Area */}
        <div
          style={{
            color:
              message.trim() === "" || message.startsWith("Congratulations")
                ? "green"
                : "red",
            fontWeight: "bold",
            minHeight: "1.2em", // Reserve space
            textAlign: "center",
            flexGrow: 1, // Allow message to take available space
            visibility: message.trim() === "" ? "hidden" : "visible", // Hide if effectively empty but keep space
          }}
        >
          {message}
        </div>

        {/* Timer and Controls Group */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ fontSize: "1.2em", fontFamily: "monospace" }}>
            {displayTime}
          </div>
          <button onClick={handlePauseResume} disabled={isGameCompleted}>
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button onClick={handleNewPuzzleClick}>New Puzzle</button>
        </div>
      </div>

      {/* Main Game Layout: Solutions on Left, Card Grid on Right */}
      <div
        className="game-area-container"
        style={{
          display: "flex",
          justifyContent: "center", // Center the whole game area if screen is wide
          alignItems: "flex-start", // Align items to the top
          gap: "20px", // Gap between solution area and card grid
          padding: "0 15px", // Add some horizontal padding to the overall container
        }}
      >
        {/* Solution Area Wrapper */}
        <div
          className="solution-area-wrapper"
          style={{
            // flexBasis: "320px", // Define a base width for the solution area
            width: "310px", // Fixed width for the solution area column
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            // height: "100%", // If trying to match height, but flex-start is better
          }}
        >
          {/* Found Sets ({numSolutionsActuallyFound}/{numSolutionsProvided}) */}
          <div
            className="solution-slots"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr", // Single column
              gridTemplateRows: "repeat(6, auto)", // 6 rows, height based on content
              gap: "8px", // Gap between solution slots vertically
              justifyItems: "center", // Center the slots if the grid column is wider
            }}
          >
            {Array(numSolutionsProvided > 0 ? numSolutionsProvided : 6) // Ensure at least 6 slots are rendered for layout
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
                      width: "284px", // Width of a single solution slot
                      height: "68px", // Height of a single solution slot
                      display: "flex",
                      alignItems: "center", // Keeps vertical centering
                      justifyContent: solutionSet ? "flex-start" : "center", // Center text if no solutionSet, else flex-start for cards
                      gap: "7px",
                      backgroundColor: solutionSet ? "#e8f5e9" : "#f0f0f0",
                    }}
                  >
                    {solutionSet ? (
                      solutionSet.map((card) => (
                        <div
                          key={`sol-${card.abstractCardId}-${index}-wrapper`}
                          style={{
                            transform: "scale(0.5)",
                            transformOrigin: "top left",
                            width: "90px",
                            height: "60px",
                          }}
                        >
                          <CardComponent
                            cardData={card}
                            onSelect={() => {}}
                            isSelected={false}
                            applyMargins={false}
                            isPaused={isPaused}
                            isSolutionDisplayCard={true}
                          />
                        </div>
                      ))
                    ) : (
                      <span style={{ color: "#aaa" }}>
                        Solution Set {index + 1}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Card Grid */}
        <div
          className="card-board"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // 4 rows
            gridTemplateRows: "repeat(4, 1fr)", // 3 columns
            gap: "5px",
            maxWidth: "600px",
            // margin: "0 auto", // No longer needed as parent flex centers
            padding: "5px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            alignSelf: "flex-start", // Ensure it doesn't stretch if solution area is taller
          }}
        >
          {puzzle.cards.map((card) => (
            <CardComponent
              key={card.abstractCardId}
              cardData={card}
              onSelect={handleCardSelect}
              isSelected={selectedCards.includes(card.abstractCardId)}
              isPaused={isPaused}
            />
          ))}
        </div>
      </div>
      {/* For debugging: <pre>{JSON.stringify(puzzle.solutions, null, 2)}</pre> */}
    </div>
  );
};

export default Game;
