import React from "react";

interface ShapeProps {
  color: string;
  fillType: "SOLID" | "STRIPED" | "OPEN";
  patternId: string;
}

const Parallelogram: React.FC<ShapeProps> = ({
  color,
  fillType,
  patternId,
}) => {
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

  // Parallelogram points in a 40x40 box, slanted right
  // (8,8), (36,8), (32,32), (4,32)
  const points = "8,8 36,8 32,32 4,32";

  return (
    <polygon
      points={points}
      stroke={strokeValue}
      strokeWidth={strokeWidthValue}
      fill={fillValue}
    />
  );
};

export default Parallelogram;
