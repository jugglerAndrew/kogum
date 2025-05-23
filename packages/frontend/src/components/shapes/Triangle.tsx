import React from "react";

interface ShapeProps {
  color: string;
  fillType: "SOLID" | "STRIPED" | "OPEN";
  patternId: string;
}

const Triangle: React.FC<ShapeProps> = ({ color, fillType, patternId }) => {
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

  // Points for an upward-pointing triangle centered in a ~40x40 area
  // (Center X: 20, Top Y: 5, Bottom-Left X: 5, Bottom-Left Y: 35, Bottom-Right X: 35, Bottom-Right Y: 35)
  // Adjusted to fit within the 40x40 shapeDisplayWidth/Height, assuming origin is top-left of this 40x40 box.
  // For a 40x40 box, if shape is centered at 20,20:
  // Top point: (20, 2.5) -> (20, (40 - 0.866*35)/2 ) if base is 35
  // Base width of ~30, height of ~26. Centered in 40x40.
  // Top: (20, 7), Bottom-left: (5, 33), Bottom-right: (35, 33)
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
