import React, { useState } from "react";
import Shape from "./Shape";

// Updated ClientCardData to support DB-driven SVG
interface ClientCardData {
  card_name: string; // e.g., "RED_SOLID_OVAL"
  count_value: 1 | 2 | 3;
  abstractCardId: string;
  svg_type: string;
  svg_properties: Record<string, string | number | boolean | undefined>;
}

interface CardProps {
  cardData: ClientCardData;
  onSelect: (abstractCardId: string) => void;
  isSelected: boolean;
  applyMargins?: boolean;
  isPaused?: boolean;
  isSolutionDisplayCard?: boolean;
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
  const { card_name, count_value, abstractCardId, svg_type, svg_properties } =
    cardData;
  const [isHovered, setIsHovered] = useState(false);

  const [colorName = "", fillName = ""] = card_name.split("_");
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

  // Generic renderShapes using DB-driven SVG
  const renderShapes = () => {
    const shapesToRender: React.ReactElement[] = [];
    const currentFillType = fillName.toUpperCase() as
      | "SOLID"
      | "STRIPED"
      | "OPEN"
      | "DOTTED"
      | "CROSSHATCH";
    let uniquePatternId: string | undefined = undefined;
    if (fillName.toUpperCase() === "STRIPED") {
      uniquePatternId = `stripePattern-${abstractCardId}`;
    } else if (fillName.toUpperCase() === "DOTTED") {
      uniquePatternId = `dotPattern-${abstractCardId}`;
    } else if (fillName.toUpperCase() === "CROSSHATCH") {
      uniquePatternId = `crosshatchPattern-${abstractCardId}`;
    }

    // --- Positioning Logic for Multiple Shapes (HORIZONTAL LAYOUT) ---
    const shapeDisplayWidth = 40;
    const shapeDisplayHeight = 40;
    const spacing = 5;
    const totalShapesWidth =
      count_value * shapeDisplayWidth + Math.max(0, count_value - 1) * spacing;
    const startX = (150 - totalShapesWidth) / 2;
    const translateY = (100 - shapeDisplayHeight) / 2;
    // --- End Positioning Logic ---

    // Patch: For circles, ensure svg_properties keys are correct and numbers, not strings
    let safeSvgProps = svg_properties;
    if (svg_type === "circle") {
      safeSvgProps = {
        cx: Number(svg_properties.cx),
        cy: Number(svg_properties.cy),
        r: Number(svg_properties.r),
      };
    }

    for (let i = 0; i < count_value; i++) {
      shapesToRender.push(
        <Shape
          key={`${abstractCardId}-shape-${i}`}
          svgType={svg_type}
          svgProps={safeSvgProps}
          color={actualColor}
          fillType={currentFillType}
          patternId={uniquePatternId ?? ""}
        />
      );
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
        {/* STRIPED pattern */}
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
                strokeWidth="6"
              />
            </pattern>
          </defs>
        )}
        {/* DOTTED pattern */}
        {fillName.toUpperCase() === "DOTTED" && (
          <defs>
            <pattern
              id={`dotPattern-${abstractCardId}`}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <rect width="8" height="8" fill="transparent" />
              <circle cx="2" cy="2" r="1.5" fill={actualColor} />
              <circle cx="6" cy="6" r="1.5" fill={actualColor} />
            </pattern>
          </defs>
        )}
        {/* CROSSHATCH pattern (vertical and horizontal lines) */}
        {fillName.toUpperCase() === "CROSSHATCH" && (
          <defs>
            <pattern
              id={`crosshatchPattern-${abstractCardId}`}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <rect width="8" height="8" fill="transparent" />
              {/* Vertical line */}
              <line
                x1="4"
                y1="0"
                x2="4"
                y2="8"
                stroke={actualColor}
                strokeWidth="2"
              />
              {/* Horizontal line */}
              <line
                x1="0"
                y1="4"
                x2="8"
                y2="4"
                stroke={actualColor}
                strokeWidth="2"
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
