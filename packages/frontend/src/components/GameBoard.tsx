import React from "react";
import Card from "./Card";
import type { ClientCardData } from "../types";

interface GameBoardProps {
  pageTitle: string;
  cards: ClientCardData[];
  solutions: string[][];
  foundSolutions: (ClientCardData[] | null)[];
  selectedCards: string[];
  isPaused: boolean;
  isGameCompleted: boolean;
  isLoading: boolean;
  message: string;
  displayTime: string;
  onCardSelect: (abstractCardId: string) => void;
  onPauseResume: () => void;
  onResetPuzzle: () => void;
  resetButtonLabel: string;
}

const GameBoard: React.FC<GameBoardProps> = ({
  pageTitle,
  cards,
  solutions,
  foundSolutions,
  selectedCards,
  isPaused,
  isGameCompleted,
  isLoading,
  message,
  displayTime,
  onCardSelect,
  onPauseResume,
  onResetPuzzle,
  resetButtonLabel,
}) => {
  const numSolutionsProvided = solutions.length;

  if (isLoading)
    return (
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Loading Puzzle...
      </p>
    );

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div style={{ fontSize: "1.2em", fontFamily: "monospace" }}>
            {displayTime}
          </div>
          <button
            onClick={onPauseResume}
            disabled={isGameCompleted || cards.length === 0}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
          {resetButtonLabel && (
            <button onClick={onResetPuzzle} disabled={cards.length === 0}>
              {resetButtonLabel}
            </button>
          )}
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
                          <Card
                            svgType={card.svg_type as string}
                            svgProps={
                              card.svg_properties as Record<
                                string,
                                string | number | boolean | undefined
                              >
                            }
                            fillType={
                              card.card_name
                                .split("_")[1]
                                ?.toUpperCase() as string
                            }
                            color={card.card_name.split("_")[0]?.toUpperCase()}
                            count={card.count_value}
                            applyMargins={false}
                            isSelected={false}
                            isPaused={isPaused}
                            isSolutionDisplayCard={true}
                            svgPattern={card.svg_pattern ?? undefined}
                            patternId={
                              card.svg_pattern
                                ? `solution-pattern-${card.abstractCardId}-${index}`
                                : undefined
                            }
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
          {cards.map((card) => (
            <div
              key={card.abstractCardId}
              onClick={() => onCardSelect(card.abstractCardId)}
              style={{ cursor: isPaused ? "not-allowed" : "pointer" }}
              tabIndex={0}
              role="button"
              aria-pressed={selectedCards.includes(card.abstractCardId)}
              onKeyUp={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onCardSelect(card.abstractCardId);
                }
              }}
            >
              <Card
                svgType={card.svg_type as string}
                svgProps={{
                  ...(card.svg_properties as Record<
                    string,
                    string | number | boolean | undefined
                  >),
                  "data-abstract-card-id": card.abstractCardId,
                }}
                fillType={card.card_name.split("_")[1]?.toUpperCase() as string}
                color={card.card_name.split("_")[0]?.toUpperCase()}
                count={card.count_value}
                applyMargins={true}
                isSelected={selectedCards.includes(card.abstractCardId)}
                isPaused={isPaused}
                isSolutionDisplayCard={false}
                svgPattern={card.svg_pattern ?? undefined}
                patternId={
                  card.svg_pattern
                    ? `pattern-${card.abstractCardId}`
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GameBoard;
