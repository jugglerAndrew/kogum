import React from "react";
import { getFillValue } from "./getFillValue";

interface ShapeProps {
  color: string;
  fillType: string;
  patternId: string;
}

const Diamond: React.FC<ShapeProps> = ({ color, fillType, patternId }) => {
  const fillValue = getFillValue(fillType, color, patternId);
  const strokeValue: string = color;
  const strokeWidthValue = 4;
  // Points for a diamond centered roughly in a 50x50 box
  // Top(25,5), Right(45,25), Bottom(25,45), Left(5,25)
  return (
    <polygon
      points="25,5 45,25 25,45 5,25"
      stroke={strokeValue}
      strokeWidth={strokeWidthValue}
      fill={fillValue}
    />
  );
};

export default Diamond;
