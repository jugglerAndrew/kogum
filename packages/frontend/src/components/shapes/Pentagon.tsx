import React from "react";

interface ShapeProps {
  color: string;
  fillType: "SOLID" | "STRIPED" | "OPEN";
  patternId: string;
}

const Pentagon: React.FC<ShapeProps> = ({ color, fillType, patternId }) => {
  let fillValue: string;
  const strokeValue: string = color;
  const strokeWidthValue = 4;

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

  // Points for a regular pentagon centered in a 40x40 box
  // (20,5), (36,16), (29,35), (11,35), (4,16)
  const points = "20,5 36,16 29,35 11,35 4,16";

  return (
    <polygon
      points={points}
      stroke={strokeValue}
      strokeWidth={strokeWidthValue}
      fill={fillValue}
    />
  );
};

export default Pentagon;
