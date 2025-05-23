import React from "react";
import Oval from "./shapes/Oval";
import Diamond from "./shapes/Diamond";
import Squiggle from "./shapes/Squiggle";
import Triangle from "./shapes/Triangle"; // Import the new Triangle component

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
}

// A simple map for color names to SVG/CSS color values
const colorMap: { [key: string]: string } = {
  RED: "red",
  GREEN: "green",
  BLUE: "blue",
  PURPLE: "purple",
  YELLOW: "gold",
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
}) => {
  const { card_name, count_value, abstractCardId } = cardData;

  const [colorName = "", fillName = "", shapeName = ""] = card_name.split("_");
  const actualColor = colorMap[colorName.toUpperCase()] || "black";

  const cardStyle: React.CSSProperties = {
    boxSizing: "border-box", // Add this to include padding and border in width/height
    border: isSelected ? "3px solid dodgerblue" : "1px solid #ccc",
    padding: "5px",
    margin: applyMargins ? "5px" : "0px", // Conditional margin
    width: "180px", // Landscape width
    height: "120px", // Landscape height
    cursor: "pointer",
    backgroundColor: isSelected ? "#e0f0ff" : "#ffffff",
    borderRadius: "8px",
    boxShadow: isSelected
      ? "0 0 8px rgba(30,144,255,0.5)"
      : "0 2px 4px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // Center the SVG container
    overflow: "hidden",
  };

  const renderShapes = () => {
    const shapesToRender: JSX.Element[] = [];
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
      let shapeComponent: JSX.Element | null = null;
      if (shapeName.toUpperCase() === "OVAL") {
        shapeComponent = (
          <Oval
            color={actualColor}
            fillType={currentFillType}
            patternId={uniquePatternId}
          />
        );
      } else if (shapeName.toUpperCase() === "DIAMOND") {
        shapeComponent = (
          <Diamond
            color={actualColor}
            fillType={currentFillType}
            patternId={uniquePatternId}
          />
        );
      } else if (shapeName.toUpperCase() === "SQUIGGLE") {
        shapeComponent = (
          <Squiggle
            color={actualColor}
            fillType={currentFillType}
            patternId={uniquePatternId}
          />
        );
      } else if (shapeName.toUpperCase() === "TRIANGLE") {
        // Add condition for Triangle
        shapeComponent = (
          <Triangle
            color={actualColor}
            fillType={currentFillType}
            patternId={uniquePatternId}
          />
        );
      } else {
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
    <div style={cardStyle} onClick={() => onSelect(abstractCardId)}>
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
        {renderShapes()}
      </svg>
      {/* <div style={{ fontSize: '0.6em', color: '#777', marginTop: 'auto' }}>
        {card_name.replace(/_/g, ' ')}
      </div> */}
    </div>
  );
};

export default CardComponent;
