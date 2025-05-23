import React from "react";

interface ShapeProps {
  color: string;
  fillType: "SOLID" | "STRIPED" | "OPEN";
  // Unique ID for pattern referencing, passed from Card.tsx
  patternId: string;
}

const Oval: React.FC<ShapeProps> = ({ color, fillType, patternId }) => {
  let fillValue: string;
  let strokeValue: string = color;
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
