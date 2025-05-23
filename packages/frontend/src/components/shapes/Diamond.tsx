import React from "react";

interface ShapeProps {
  color: string;
  fillType: "SOLID" | "STRIPED" | "OPEN";
  patternId: string;
}

const Diamond: React.FC<ShapeProps> = ({ color, fillType, patternId }) => {
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
