import React from "react";
import { getFillValue } from "./getFillValue";

interface ShapeProps {
  color: string;
  fillType: "SOLID" | "STRIPED" | "OPEN" | "DOTTED";
  patternId: string;
}

const Triangle: React.FC<ShapeProps> = ({ color, fillType, patternId }) => {
  const fillValue = getFillValue(fillType, color, patternId);
  const strokeValue: string = color;
  const strokeWidthValue = 4;
  // Points for an upward-pointing triangle centered in a ~40x40 area
  // (Center X: 20, Top Y: 5, Bottom-Left X: 5, Bottom-Left Y: 33, Bottom-Right X: 35, Bottom-Right Y: 33)
  const points = "20,7 5,33 35,33";
  return (
    <polygon
      points={points}
      stroke={strokeValue}
      strokeWidth={strokeWidthValue}
      fill={fillValue}
    />
  );
};

export default Triangle;
