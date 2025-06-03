// /workspaces/kogum/packages/frontend/src/pages/RandomPage.tsx
import React, { useState, useRef } from "react";
import GameBoard from "../components/GameBoard";
import type { ClientCardData, PuzzleData } from "../types";

const RandomPage: React.FC = () => {
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [foundSolutions, setFoundSolutions] = useState<
    (ClientCardData[] | null)[]
  >(Array(6).fill(null));
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameCompleted, setIsGameCompleted] = useState<boolean>(false);
  const [displayTime, setDisplayTime] = useState<string>("00:00");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const fetchRandomPuzzle = async () => {
    setIsLoading(true);
    setMessage("");
    setSelectedCards([]);
    setFoundSolutions(Array(6).fill(null));
    setIsGameCompleted(false);
    try {
      const response = await fetch("/api/puzzles/random");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PuzzleData = await response.json();
      setPuzzle(data);
      setElapsedTime(0);
      setStartTime(Date.now());
      setIsPaused(false);
    } catch (error: unknown) {
      let errorMessage = "Failed to load puzzle. Please try again later.";
      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      setMessage(errorMessage);
      setPuzzle(null);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRandomPuzzle();
  }, []); // Fetch a random puzzle when the component mounts

  React.useEffect(() => {
    if (!isPaused && startTime !== null && puzzle && !isGameCompleted) {
      timerRef.current = setInterval(() => {
        const ms = elapsedTime + (Date.now() - startTime);
        const formattedTime = formatTime(ms);
        setDisplayTime(formattedTime);
      }, 1000);
    } else if (isPaused || isGameCompleted) {
      setDisplayTime(formatTime(elapsedTime));
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, startTime, elapsedTime, puzzle, isGameCompleted]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleCardSelect = (abstractCardId: string) => {
    if (isPaused || isGameCompleted) return;
    setSelectedCards((prevSelected) => {
      if (prevSelected.includes(abstractCardId)) {
        return prevSelected.filter((id) => id !== abstractCardId);
      }
      if (prevSelected.length < 3) {
        const newSelection = [...prevSelected, abstractCardId];
        if (newSelection.length === 3) {
          checkIfSet(newSelection);
        }
        return newSelection;
      }
      return prevSelected;
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
            setFoundSolutions((prev) => {
              const newFound = [...prev];
              newFound[emptySlotIndex] = cardsForSolutionSet;
              return newFound;
            });

            const newNumSolutionsFound =
              foundSolutions.filter((s) => s !== null).length + 1;
            if (
              newNumSolutionsFound === puzzle.solutions.length &&
              puzzle.solutions.length > 0
            ) {
              setIsGameCompleted(true);
              if (startTime) {
                const finalElapsedTime = elapsedTime + (Date.now() - startTime);
                setElapsedTime(finalElapsedTime);
                setDisplayTime(formatTime(finalElapsedTime));
              }
              setStartTime(null);
              setMessage("Congratulations! You completed this puzzle!");
            } else {
              setMessage("Correct! You found a Set!");
            }
          }
        } else {
          setMessage(
            "Congratulations! You found a Set! (All solution slots full)"
          );
        }
        isSetFoundThisTurn = true;
        break;
      }
    }

    if (!isSetFoundThisTurn) {
      setMessage("Not a Set. Try again!");
    }
    setTimeout(() => setSelectedCards([]), 500);
  };

  const handlePauseResume = () => {
    if (isGameCompleted) return;
    setIsPaused((prev) => {
      if (!prev && startTime) {
        setElapsedTime((elapsed) => elapsed + (Date.now() - startTime));
        setStartTime(null);
      } else if (prev && !startTime) {
        setStartTime(Date.now());
      }
      return !prev;
    });
  };

  const handleResetPuzzle = () => {
    const wasGameAlreadyPaused = isPaused;
    if (!wasGameAlreadyPaused && startTime && !isGameCompleted) {
      handlePauseResume();
    }

    setTimeout(() => {
      if (
        window.confirm(
          "Are you sure you want to start a new puzzle? Your current game progress will be lost."
        )
      ) {
        fetchRandomPuzzle();
      } else {
        if (!wasGameAlreadyPaused && startTime && !isGameCompleted) {
          handlePauseResume();
        }
      }
    }, 0);
  };

  return (
    <GameBoard
      pageTitle="randøm"
      cards={puzzle ? puzzle.cards : []}
      solutions={puzzle ? puzzle.solutions : []}
      foundSolutions={foundSolutions}
      selectedCards={selectedCards}
      isPaused={isPaused}
      isGameCompleted={isGameCompleted}
      isLoading={isLoading}
      message={message}
      displayTime={displayTime}
      onCardSelect={handleCardSelect}
      onPauseResume={handlePauseResume}
      onResetPuzzle={handleResetPuzzle}
      resetButtonLabel="New Puzzle"
    />
  );
};

export default RandomPage;
