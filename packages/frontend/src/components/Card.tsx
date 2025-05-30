import React, { useState } from "react";
import Oval from "./shapes/Oval";
import Diamond from "./shapes/Diamond";
import Squiggle from "./shapes/Squiggle";
import Triangle from "./shapes/Triangle";
import Hexagon from "./shapes/Hexagon";
import Pentagon from "./shapes/Pentagon";
import Circle from "./shapes/Circle";
import Parallelogram from "./shapes/Parallelogram";

// Define the types for card data
interface ClientCardData {
  card_name: string; // e.g., "RED_SOLID_OVAL"
  count_value: 1 | 2 | 3;
  abstractCardId: string;
}

interface CardProps {
  cardData: ClientCardData;
  onSelect: (abstractCardId: string) => void;
  isSelected: boolean;
  applyMargins?: boolean; // New prop
  isPaused?: boolean; // To hide shapes when game is paused
  isSolutionDisplayCard?: boolean; // True if this card is for displaying a found solution
}

// A simple map for color names to SVG/CSS color values
const colorMap: { [key: string]: string } = {
  RED: "red",
  GREEN: "green",
  BLUE: "blue",
  PURPLE: "purple",
  GOLD: "gold",
  ORANGE: "orange",
  CYAN: "cyan",
  MAGENTA: "magenta",
  LIME: "lime",
};

const CardComponent: React.FC<CardProps> = ({
  cardData,
  onSelect,
  isSelected,
  applyMargins = true, // Default to true
  isPaused = false, // Default to false
  isSolutionDisplayCard = false,
}) => {
  const { card_name, count_value, abstractCardId } = cardData;
  const [isHovered, setIsHovered] = useState(false);

  const [colorName = "", fillName = "", shapeName = ""] = card_name.split("_");
  const actualColor = colorMap[colorName.toUpperCase()] || "black";

  const cardStyle: React.CSSProperties = {
    boxSizing: "border-box",
    // Ensure border width is constant to prevent shrinking/growing
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: isSelected && !isPaused ? "green" : "#ccc", // Green border if selected and not paused, else gray
    padding: "5px",
    margin: applyMargins ? "5px" : "0px", // Conditional margin
    width: "180px", // Landscape width
    height: "120px", // Landscape height
    cursor: isPaused || isSolutionDisplayCard ? "default" : "pointer", // Change cursor when paused or solution display
    backgroundColor:
      isSelected && !isPaused && !isSolutionDisplayCard ? "#e6ffed" : "#ffffff", // Light green for selected (if not paused and not solution display)
    borderRadius: "8px",
    boxShadow:
      isSelected && !isPaused && !isSolutionDisplayCard
        ? "0 0 8px rgba(0, 128, 0, 0.5)" // Green shadow for selected
        : "0 2px 4px rgba(0,0,0,0.1)",
    outline:
      isHovered && !isSelected && !isPaused && !isSolutionDisplayCard
        ? "2px solid gold" // Hover effect
        : isSelected && !isPaused && !isSolutionDisplayCard
        ? "2px solid green" // Selected effect (mimics thicker border)
        : "none",
    outlineOffset:
      (isHovered && !isSelected && !isPaused && !isSolutionDisplayCard) ||
      (isSelected && !isPaused && !isSolutionDisplayCard)
        ? "1px"
        : "0px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // Center the SVG container
    overflow: "hidden",
    opacity: isSolutionDisplayCard ? 0.7 : 1, // Grey out solution display cards
  };

  const renderShapes = () => {
    const shapesToRender: React.ReactElement[] = [];
    const currentFillType = fillName.toUpperCase() as
      | "SOLID"
      | "STRIPED"
      | "OPEN";
    const uniquePatternId = `stripePattern-${abstractCardId}`;

    // --- Positioning Logic for Multiple Shapes (HORIZONTAL LAYOUT) ---
    // Values based on viewBox="0 0 150 100" and shapes fitting in ~40x40
    const shapeDisplayWidth = 40;
    const shapeDisplayHeight = 40; // For vertical centering
    const spacing = 5;

    const totalShapesWidth =
      count_value * shapeDisplayWidth + Math.max(0, count_value - 1) * spacing;
    const startX = (150 - totalShapesWidth) / 2; // Center horizontally in 150-width viewBox
    const translateY = (100 - shapeDisplayHeight) / 2; // Center vertically in 100-height viewBox
    // --- End Positioning Logic ---

    for (let i = 0; i < count_value; i++) {
      let shapeComponent: React.ReactElement | null = null;
      switch (shapeName.toUpperCase()) {
        case "OVAL":
          shapeComponent = (
            <Oval
              color={actualColor}
              fillType={currentFillType}
              patternId={uniquePatternId}
            />
          );
          break;
        case "DIAMOND":
          shapeComponent = (
            <Diamond
              color={actualColor}
              fillType={currentFillType}
              patternId={uniquePatternId}
            />
          );
          break;
        case "SQUIGGLE":
          shapeComponent = (
            <Squiggle
              color={actualColor}
              fillType={currentFillType}
              patternId={uniquePatternId}
            />
          );
          break;
        case "TRIANGLE":
          shapeComponent = (
            <Triangle
              color={actualColor}
              fillType={currentFillType}
              patternId={uniquePatternId}
            />
          );
          break;
        case "HEXAGON":
          shapeComponent = (
            <Hexagon
              color={actualColor}
              fillType={currentFillType}
              patternId={uniquePatternId}
            />
          );
          break;
        case "PENTAGON":
          shapeComponent = (
            <Pentagon
              color={actualColor}
              fillType={currentFillType}
              patternId={uniquePatternId}
            />
          );
          break;
        case "CIRCLE":
          shapeComponent = (
            <Circle
              color={actualColor}
              fillType={currentFillType}
              patternId={uniquePatternId}
            />
          );
          break;
        case "PARALLELOGRAM":
          shapeComponent = (
            <Parallelogram
              color={actualColor}
              fillType={currentFillType}
              patternId={uniquePatternId}
            />
          );
          break;
        default:
          shapeComponent = <text fontSize="10">Unknown: {shapeName}</text>;
      }
      if (shapeComponent) {
        shapesToRender.push(shapeComponent);
      }
    }

    return shapesToRender.map((shapeComponentInstance, index) => {
      const currentX = startX + index * (shapeDisplayWidth + spacing);
      return (
        <g
          key={`${abstractCardId}-shape-group-${index}`}
          transform={`translate(${currentX}, ${translateY})`}
        >
          {shapeComponentInstance}
        </g>
      );
    });
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)} // Disable click when paused or if it's a solution display card
      onClick={!isPaused ? () => onSelect(abstractCardId) : undefined} // Disable click when paused
    >
      <svg
        width="90%"
        height="90%"
        viewBox="0 0 150 100" // Adjusted for landscape
        preserveAspectRatio="xMidYMid meet"
      >
        {fillName.toUpperCase() === "STRIPED" && (
          <defs>
            <pattern
              id={`stripePattern-${abstractCardId}`}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <rect width="8" height="8" fill="transparent" />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke={actualColor}
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
        )}
        {(!isPaused || isSolutionDisplayCard) && renderShapes()}{" "}
        {/* Render shapes if not paused OR if it's a solution card (even if game is paused) */}
      </svg>
      {/* <div style={{ fontSize: '0.6em', color: '#777', marginTop: 'auto' }}>
        {card_name.replace(/_/g, ' ')}
      </div> */}
    </div>
  );
};

export default CardComponent;
