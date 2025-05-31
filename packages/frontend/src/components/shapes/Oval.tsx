import React from "react";
import { getFillValue } from "./getFillValue";

interface ShapeProps {
  color: string;
  fillType: string;
  patternId: string;
}

const Oval: React.FC<ShapeProps> = ({ color, fillType, patternId }) => {
  const fillValue = getFillValue(fillType, color, patternId);
  const strokeValue: string = color;
  const strokeWidthValue = 4;

  return (
    <ellipse
      cx="25"
      cy="25"
      rx="20"
      ry="12"
      stroke={strokeValue}
      strokeWidth={strokeWidthValue}
      fill={fillValue}
    />
  );
};

export default Oval;
