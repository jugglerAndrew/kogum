import React, { useState } from "react";

import SvgEntity from "./SvgEntity";
import type { SvgPattern } from "../types";

// Props for NewCard
interface NewCardProps {
  svgType: "polygon" | "ellipse" | "circle" | "path";
  svgProps: React.SVGProps<
    SVGPolygonElement | SVGEllipseElement | SVGCircleElement | SVGPathElement
  > & { svgPattern?: SvgPattern };
  fillType: "SOLID" | "STRIPED" | "DOTTED" | "CROSSHATCH" | "OPEN";
  color: string;
  patternId?: string;
  count: number;
  applyMargins?: boolean;
  isSelected?: boolean;
  isPaused?: boolean;
  isSolutionDisplayCard?: boolean;
}

const NewCard: React.FC<NewCardProps> = ({
  svgType,
  svgProps,
  fillType,
  color,
  patternId,
  count,
  applyMargins = true,
  isSelected = false,
  isPaused = false,
  isSolutionDisplayCard = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Card styling (adapted from Card.tsx)
  const cardStyle: React.CSSProperties = {
    boxSizing: "border-box",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: isSelected && !isPaused ? "green" : "#ccc",
    padding: "5px",
    margin: applyMargins ? "5px" : "0px",
    width: "180px",
    height: "120px",
    cursor: isPaused || isSolutionDisplayCard ? "default" : "pointer",
    backgroundColor:
      isSelected && !isPaused && !isSolutionDisplayCard ? "#e6ffed" : "#ffffff",
    borderRadius: "8px",
    boxShadow:
      isSelected && !isPaused && !isSolutionDisplayCard
        ? "0 0 8px rgba(0, 128, 0, 0.5)"
        : "0 2px 4px rgba(0,0,0,0.1)",
    outline:
      isHovered && !isSelected && !isPaused && !isSolutionDisplayCard
        ? "2px solid gold"
        : isSelected && !isPaused && !isSolutionDisplayCard
        ? "2px solid green"
        : "none",
    outlineOffset:
      (isHovered && !isSelected && !isPaused && !isSolutionDisplayCard) ||
      (isSelected && !isPaused && !isSolutionDisplayCard)
        ? "1px"
        : "0px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    opacity: isSolutionDisplayCard ? 0.7 : 1,
  };

  // Render SvgEntity instances horizontally using flexbox
  const entitiesRowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    gap: "5px",
    margin: "auto",
  };

  const entityBoxStyle: React.CSSProperties = {
    width: "100px",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Try to get svgPattern from fillType if present in props (for DB-driven patterns)
  // This expects the parent to pass svgPattern as a prop, or you can extend this to accept a fillPattern prop
  // For now, try to extract from svgProps if present (for debug page, pass as svgPattern)
  const svgPattern = svgProps.svgPattern;

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={entitiesRowStyle}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={`svg-entity-${i}`} style={entityBoxStyle}>
            <SvgEntity
              svgType={svgType}
              svgProps={svgProps}
              fillType={fillType}
              color={color}
              patternId={patternId}
              svgPattern={svgPattern}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewCard;
