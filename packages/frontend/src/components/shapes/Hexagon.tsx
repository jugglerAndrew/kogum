import React from "react";

interface ShapeProps {
  color: string;
  fillType: "SOLID" | "STRIPED" | "OPEN";
  patternId: string;
}

const Hexagon: React.FC<ShapeProps> = ({ color, fillType, patternId }) => {
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

  // Points for a regular hexagon centered in a 40x40 box
  // (20,4), (36,12), (36,28), (20,36), (4,28), (4,12)
  const points = "20,4 36,12 36,28 20,36 4,28 4,12";

  return (
    <polygon
      points={points}
      stroke={strokeValue}
      strokeWidth={strokeWidthValue}
      fill={fillValue}
    />
  );
};

export default Hexagon;
