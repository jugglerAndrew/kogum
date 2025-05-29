import React from "react";

interface ShapeProps {
  color: string;
  fillType: "SOLID" | "STRIPED" | "OPEN";
  patternId: string;
}

const Circle: React.FC<ShapeProps> = ({ color, fillType, patternId }) => {
  let fillValue: string;
  const strokeValue: string = color;
  const strokeWidthValue = 2;

  switch (fillType) {
    case "SOLID":
      fillValue = color;
      break;
    case "STRIPED":
      fillValue = `url(#${patternId})`;
      break;
    case "OPEN":
    default:
      fillValue = "none";
      break;
  }

  // Centered at (20,20) with radius 16
  return (
    <circle
      cx={20}
      cy={20}
      r={16}
      stroke={strokeValue}
      strokeWidth={strokeWidthValue}
      fill={fillValue}
    />
  );
};

export default Circle;
