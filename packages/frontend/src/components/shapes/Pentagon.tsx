import React from "react";
import { getFillValue } from "./getFillValue";

interface ShapeProps {
  color: string;
  fillType: string;
  patternId: string;
}

const Pentagon: React.FC<ShapeProps> = ({ color, fillType, patternId }) => {
  const fillValue = getFillValue(fillType, color, patternId);
  const strokeValue: string = color;
  const strokeWidthValue = 4;
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
