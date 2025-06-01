// Shape.tsx
import React from "react";
import { getFillValue } from "./getFillValue";

// type PolygonProps = {
//   svgType: "polygon";
//   svgProps: React.SVGProps<SVGPolygonElement>;
// };

// type EllipseProps = {
//   svgType: "ellipse";
//   svgProps: React.SVGProps<SVGEllipseElement>;
// };

// type PathProps = {
//   svgType: "path";
//   svgProps: React.SVGProps<SVGPathElement>;
// };

type ShapeProps = {
  color: string;
  fillType: string;
  patternId?: string;
  svgType: string;
  svgProps?: React.SVGProps<
    SVGPolygonElement | SVGEllipseElement | SVGPathElement
  >;
};

const Shape: React.FC<ShapeProps> = (props) => {
  const { color, fillType, patternId, svgType, svgProps } = props;
  const fillValue = getFillValue(fillType, color, patternId ?? "");
  const strokeValue = color;
  const strokeWidthValue = 4;

  const baseProps = {
    stroke: strokeValue,
    strokeWidth: strokeWidthValue,
    fill: fillValue,
  };

  switch (svgType) {
    case "polygon":
      return (
        <polygon
          {...baseProps}
          {...(svgProps as React.SVGProps<SVGPolygonElement>)}
        />
      );
    case "ellipse":
      return (
        <ellipse
          {...baseProps}
          {...(svgProps as React.SVGProps<SVGEllipseElement>)}
        />
      );
    case "circle":
      return (
        <circle
          {...baseProps}
          {...(svgProps as React.SVGProps<SVGCircleElement>)}
        />
      );
    case "path":
      return (
        <path
          {...baseProps}
          {...(svgProps as React.SVGProps<SVGPathElement>)}
        />
      );
    default:
      return null;
  }
};

export default Shape;
