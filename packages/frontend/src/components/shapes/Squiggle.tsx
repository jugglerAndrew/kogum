import React from "react";

interface ShapeProps {
  color: string;
  fillType: "SOLID" | "STRIPED" | "OPEN";
  patternId: string;
}

const Squiggle: React.FC<ShapeProps> = ({ color, fillType, patternId }) => {
  let fillValue: string;
  const strokeValue: string = color;
  const strokeWidthValue = 4;

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

  // This path creates a more traditional Set squiggle.
  // It's designed to be a closed shape, resembling two connected "S" curves with closed ends.
  // The coordinates are set to make the shape roughly 34 units wide and 12 units tall.
  // It will be drawn starting near the top-left of its local coordinate space.
  // You might need to adjust the `transform` in Card.tsx or this path's scale/position
  // to ensure it centers well within the allocated 40x40 shapeDisplay area.
  // M(ove) L(ine) C(ubic Bezier) Z(close path)
  const setSquigglePath =
    "M2,10 C2,2 10,2 10,10 C10,18 18,18 18,10 C18,2 26,2 26,10 C26,18 34,18 34,10 L34,12 C34,20 26,20 26,12 C26,4 18,4 18,12 C18,20 10,20 10,12 C10,4 2,4 2,12 L2,10 Z";

  return (
    <path
      d={setSquigglePath}
      stroke={strokeValue}
      strokeWidth={strokeWidthValue}
      fill={fillValue}
    />
  );
};

export default Squiggle;
