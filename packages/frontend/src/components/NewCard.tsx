import React, { useState } from "react";

import SvgEntity from "./SvgEntity";
import type { SvgPattern } from "../types";

// Props for NewCard
interface NewCardProps {
  svgType: string;
  svgProps: React.SVGProps<
    SVGPolygonElement | SVGEllipseElement | SVGCircleElement | SVGPathElement
  > & { "data-abstract-card-id"?: string };
  fillType: string;
  color: string;
  patternId?: string;
  count: number;
  applyMargins?: boolean;
  isSelected?: boolean;
  isPaused?: boolean;
  isSolutionDisplayCard?: boolean;
  svgPattern?: SvgPattern;
}

const NewCard: React.FC<NewCardProps> = (props) => {
  const {
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
    svgPattern,
  } = props;
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

  // Styles
  const entitiesRowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "150px",
    height: "50%",
    margin: "auto",
  };

  const entityBoxStyle: React.CSSProperties = {
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Use svgPattern prop directly; svgPattern is no longer part of svgProps
  const effectiveSvgPattern = svgPattern;

  const maxPerRow = 3;
  const rows: number[][] = [];
  // Special logic for 4: two rows of 2. Otherwise, first row gets the remainder (so first row is fullest)
  if (count === 4) {
    rows.push([0, 1]);
    rows.push([2, 3]);
  } else if (count <= maxPerRow) {
    rows.push(Array.from({ length: count }, (_, i) => i));
  } else {
    const numRows = Math.ceil(count / maxPerRow);
    const firstRowCount = count - maxPerRow * (numRows - 1);
    let idx = 0;
    rows.push(Array.from({ length: firstRowCount }, (_, i) => idx + i));
    idx += firstRowCount;
    for (let r = 1; r < numRows; r++) {
      rows.push(Array.from({ length: maxPerRow }, (_, i) => idx + i));
      idx += maxPerRow;
    }
  }

  return (
    <div
      style={cardStyle}
      id={`card-${svgProps["data-abstract-card-id"] ?? ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {rows.map((row, rowIdx) => (
        <div key={`entity-row-${rowIdx}`} style={entitiesRowStyle}>
          {row.map((entityIdx) => (
            <div key={`svg-entity-${entityIdx}`} style={entityBoxStyle}>
              <SvgEntity
                svgType={svgType}
                svgProps={svgProps}
                fillType={fillType}
                color={color}
                patternId={patternId}
                svgPattern={effectiveSvgPattern}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default NewCard;
