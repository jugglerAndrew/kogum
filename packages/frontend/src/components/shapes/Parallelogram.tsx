import React from "react";
import { getFillValue } from "./getFillValue";

interface ShapeProps {
  color: string;
  fillType: "SOLID" | "STRIPED" | "OPEN" | "DOTTED";
  patternId: string;
}

const Parallelogram: React.FC<ShapeProps> = ({
  color,
  fillType,
  patternId,
}) => {
  const fillValue = getFillValue(fillType, color, patternId);
  const strokeValue: string = color;
  const strokeWidthValue = 4;
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
