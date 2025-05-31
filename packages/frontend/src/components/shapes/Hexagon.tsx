import React from "react";
import { getFillValue } from "./getFillValue";

interface ShapeProps {
  color: string;
  fillType: string;
  patternId: string;
}

const Hexagon: React.FC<ShapeProps> = ({ color, fillType, patternId }) => {
  const fillValue = getFillValue(fillType, color, patternId);
  const strokeValue: string = color;
  const strokeWidthValue = 4;
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
