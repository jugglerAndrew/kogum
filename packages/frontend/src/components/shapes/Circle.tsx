import React from "react";
import { getFillValue } from "./getFillValue";

interface ShapeProps {
  color: string;
  fillType: string;
  patternId: string;
}

const Circle: React.FC<ShapeProps> = ({ color, fillType, patternId }) => {
  const fillValue = getFillValue(fillType, color, patternId);
  const strokeValue: string = color;
  const strokeWidthValue = 4;
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
