// /workspaces/kogum/packages/frontend/src/pages/TodayPage.tsx
import React, { useState, useEffect, useRef } from "react";
import CardComponent from "../components/Card";
import type { ClientCardData, PuzzleData, DailyMealType } from "../types";
import { formatTime } from "../utils/formatters";
import { getCurrentMealType, formatMealType } from "../utils/timeHelpers";

const TodayPage: React.FC = () => {
  const [currentMeal, setCurrentMeal] = useState<DailyMealType | null>(null);
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [message, setMessage] = useState<string>(" ");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [foundSolutions, setFoundSolutions] = useState<
    (ClientCardData[] | null)[]
  >(Array(6).fill(null));

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameCompleted, setIsGameCompleted] = useState<boolean>(false);

  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const meal = getCurrentMealType();
    setCurrentMeal(meal);
  }, []);

  const fetchDailyPuzzle = async (mealType: DailyMealType) => {
    setIsLoading(true);
    setMessage(" ");
    setSelectedCards([]);
    setFoundSolutions(Array(6).fill(null));
    setIsGameCompleted(false);
    try {
      // API endpoint: /api/puzzles/daily?meal=<mealtype>
      // Example: /api/puzzles/daily?meal=breakfast
      const response = await fetch(`/api/puzzles/daily?meal=${mealType}`);
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
      setCurrentTime(0);
      setStartTime(Date.now());
      setIsPaused(false);
    } catch (error: unknown) {
      console.error("Failed to fetch daily puzzle:", error);
      if (error instanceof Error) {
        setMessage(
          error.message ||
            "Failed to load today's puzzle. Please try again later."
        );
      } else {
        setMessage("Failed to load today's puzzle. Please try again later.");
      }
      setPuzzle(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentMeal) {
      fetchDailyPuzzle(currentMeal);
    }
  }, [currentMeal]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setTimeout> | null = null;
    if (!isPaused && startTime !== null && puzzle && !isGameCompleted) {
      intervalId = setInterval(() => {
        setCurrentTime(elapsedTime + (Date.now() - startTime));
      }, 47);
    } else if (isPaused || isGameCompleted) {
      setCurrentTime(elapsedTime);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPaused, startTime, elapsedTime, puzzle, isGameCompleted]);

  useEffect(() => {
    if (message.trim() !== "") {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
      messageTimeoutRef.current = setTimeout(() => {
        setMessage(" ");
      }, 5000);
    }
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, [message]);

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
                setCurrentTime(finalElapsedTime);
              }
              setStartTime(null);
              setMessage(
                `Congratulations! You completed Today's ${
                  currentMeal ? formatMealType(currentMeal) : ""
                } puzzle!`
              );
            } else {
              setMessage("Congratulations! You found a Set!");
            }
            isSetFoundThisTurn = true;
          } else {
            console.error("Could not find all cards for a valid solution set.");
            setMessage("Error processing set. Try again.");
          }
        } else {
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
    setSelectedCards([]);
  };

  const handlePauseResume = () => {
    if (isGameCompleted) return;
    const now = Date.now();
    if (isPaused) {
      setStartTime(now);
      setIsPaused(false);
    } else {
      if (startTime) {
        setElapsedTime(
          (prevElapsedTime) => prevElapsedTime + (now - startTime)
        );
      }
      setStartTime(null);
      setIsPaused(true);
    }
  };

  // For daily puzzles, "New Puzzle" should probably reset the current daily puzzle.
  const handleResetPuzzleClick = () => {
    if (!currentMeal) return;
    const wasGameAlreadyPaused = isPaused;
    if (!wasGameAlreadyPaused && startTime && !isGameCompleted)
      handlePauseResume();

    setTimeout(() => {
      if (
        window.confirm(
          `Are you sure you want to reset Today's ${formatMealType(
            currentMeal
          )} puzzle? Your current progress will be lost.`
        )
      ) {
        fetchDailyPuzzle(currentMeal);
      } else {
        if (!wasGameAlreadyPaused && startTime && !isGameCompleted)
          handlePauseResume();
      }
    }, 0);
  };

  if (isLoading)
    return (
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Loading Today's Puzzle...
      </p>
    );
  if (!puzzle)
    return (
      <p style={{ textAlign: "center", marginTop: "20px", color: "orange" }}>
        {message || "Today's puzzle is not available. Please check back later."}
      </p>
    );

  const numSolutionsProvided = puzzle.solutions.length;
  const displayTime = formatTime(currentTime);
  const pageTitle = currentMeal
    ? `Today's ${formatMealType(currentMeal)} Puzzle`
    : "Today's Puzzle";

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 15px",
          borderBottom: "1px solid #eee",
          marginBottom: "15px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ fontSize: "1.1em", fontWeight: "bold" }}>{pageTitle}</div>
        <div
          style={{
            color:
              message.trim() === "" || message.startsWith("Congratulations")
                ? "green"
                : "red",
            fontWeight: "bold",
            minHeight: "1.2em",
            textAlign: "center",
            flexGrow: 1,
            visibility: message.trim() === "" ? "hidden" : "visible",
          }}
        >
          {message}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <div style={{ fontSize: "1.2em", fontFamily: "monospace" }}>
            {displayTime}
          </div>
          <button
            onClick={handlePauseResume}
            disabled={isGameCompleted || !puzzle}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={handleResetPuzzleClick}
            disabled={!puzzle || !currentMeal}
          >
            Reset Puzzle
          </button>
        </div>
      </div>

      <div
        className="game-area-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "20px",
          padding: "0 15px",
        }}
      >
        <div
          className="solution-area-wrapper"
          style={{
            width: "310px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <div
            className="solution-slots"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gridTemplateRows: "repeat(6, auto)",
              gap: "8px",
              justifyItems: "center",
            }}
          >
            {Array(numSolutionsProvided > 0 ? numSolutionsProvided : 6)
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
                      width: "284px",
                      height: "68px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: solutionSet ? "flex-start" : "center",
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

        <div
          className="card-board"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(4, 1fr)",
            gap: "5px",
            alignSelf: "flex-start",
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
    </>
  );
};
export default TodayPage;
