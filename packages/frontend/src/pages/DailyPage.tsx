// /workspaces/kogum/packages/frontend/src/pages/DailyPage.tsx
import React, { useEffect, useState, useRef } from "react";
import GameBoard from "../components/GameBoard";
import type { ClientCardData, PuzzleData, DailyMealType } from "../types";
import { getCurrentMealType, formatMealType } from "../utils/timeHelpers";
import { recordPuzzleCompletion, startPuzzleForUser } from "../utils/puzzleApi";

const DailyPage: React.FC = () => {
  const [currentMeal, setCurrentMeal] = useState<DailyMealType | null>(null);
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [foundSolutions, setFoundSolutions] = useState<
    (ClientCardData[] | null)[]
  >(Array(6).fill(null));
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameCompleted, setIsGameCompleted] = useState<boolean>(false);
  const [displayTime, setDisplayTime] = useState<string>("00:00.000");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    const jwt = localStorage.getItem("authToken");
    if (!jwt) {
      window.location.href = "/login";
      return;
    }
  }, []);

  useEffect(() => {
    const meal = getCurrentMealType();
    setCurrentMeal(meal);
  }, []);

  useEffect(() => {
    if (currentMeal) {
      fetchDailyPuzzle(currentMeal);
    }
  }, [currentMeal]);

  const fetchDailyPuzzle = async (mealType: DailyMealType) => {
    setIsLoading(true);
    setMessage("");
    setSelectedCards([]);
    setFoundSolutions(Array(6).fill(null));
    setIsGameCompleted(false);
    try {
      const response = await fetch(`/api/puzzle/daily?meal=${mealType}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Today's ${formatMealType(mealType)} puzzle is not available yet.`
          );
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PuzzleData = await response.json();
      setPuzzle(data);
      setElapsedTime(0);
      setStartTime(Date.now());
      setIsPaused(false);
      // Start puzzle for user if daily_puzzle_id is present
      if (data.daily_puzzle_id) {
        console.log("Calling startPuzzleForUser", data.daily_puzzle_id);
        startPuzzleForUser(data.daily_puzzle_id).catch((err) => {
          console.error("Failed to start puzzle for user:", err);
        });
      }
    } catch (error: unknown) {
      let errorMessage =
        "Failed to load today's puzzle. Please try again later.";
      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      setMessage(errorMessage);
      setPuzzle(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isPaused && startTime !== null && puzzle && !isGameCompleted) {
      timerRef.current = setInterval(() => {
        const ms = elapsedTime + (Date.now() - startTime);
        setDisplayTime(formatTime(ms));
      }, 43); // ~23fps for smooth ms updates
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
    const milliseconds = String(ms % 1000).padStart(3, "0");
    return `${minutes}:${seconds}.${milliseconds}`;
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
    if (isGameCompleted) return; // Guard: don't process if already completed
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
              let finalElapsedTime = elapsedTime;
              let endTimestamp = Date.now();
              if (startTime) {
                finalElapsedTime = elapsedTime + (endTimestamp - startTime);
                setElapsedTime(finalElapsedTime);
                setDisplayTime(formatTime(finalElapsedTime));
              }
              setStartTime(null);
              setMessage(
                `Congratulations! You completed the daily ${
                  currentMeal ? formatMealType(currentMeal) : ""
                } puzzle!`
              );
              // Record completion in backend
              if (puzzle && currentMeal) {
                const startISO = new Date(
                  endTimestamp - finalElapsedTime
                ).toISOString();
                const endISO = new Date(endTimestamp).toISOString();
                // Use daily_puzzle_id if available, else fallback to puzzle_id
                const dailyPuzzleId =
                  puzzle.daily_puzzle_id || puzzle.puzzle_id;
                console.log("Recording puzzle completion"); // TODO this is being called twice for some reason
                recordPuzzleCompletion({
                  daily_puzzle_id: dailyPuzzleId,
                  meal_type: currentMeal,
                  start_time: startISO,
                  end_time: endISO,
                }).catch((err) => {
                  // Optionally show error to user
                  console.error(
                    "Frontend Failed to record puzzle completion:",
                    err
                  );
                });
              }
            } else {
              setMessage("Correct! You found a Set.");
            }
          }
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

  // Add window event listener for beforeunload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Show warning if there's an active puzzle and it's not completed
      if (puzzle && !isGameCompleted) {
        // Pause the game before showing the dialog
        if (!isPaused && startTime) {
          const currentElapsed = elapsedTime + (Date.now() - startTime);
          setElapsedTime(currentElapsed);
          setStartTime(null);
          setIsPaused(true);
        }
        e.preventDefault();
        // Modern browsers standardize on this pattern
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isGameCompleted, puzzle, isPaused, startTime, elapsedTime]);

  return (
    <GameBoard
      pageTitle={`Daily Puzzle${
        currentMeal ? `: ${formatMealType(currentMeal)}` : ""
      }`}
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
      onResetPuzzle={() => {}} // Empty function since we don't want reset functionality
      resetButtonLabel="" // Empty string to hide the reset button
    />
  );
};

export default DailyPage;
