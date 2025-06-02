import React from "react";

type SvgEntityProps = {
  svgType: string;
  svgProps: React.SVGProps<
    SVGPolygonElement | SVGEllipseElement | SVGCircleElement | SVGPathElement
  >;
  fillType: string;
  color: string;
  patternId?: string; // Required for STRIPED, DOTTED, CROSSHATCH
};

const getFillValue = (
  fillType: SvgEntityProps["fillType"],
  color: string,
  patternId?: string
) => {
  switch (fillType) {
    case "SOLID":
      return color;
    case "OPEN":
      return "none";
    default:
      return patternId ? `url(#${patternId})` : "YELLOW";
  }
};

// SVG pattern types moved to types/index.ts
import type { SvgPattern, SvgPatternElement } from "../types";

function renderPatternFromData(
  patternId: string,
  fillType: string,
  color: string,
  svgPattern: SvgPattern
) {
  if (!svgPattern) return null;
  const { patternUnits, patternTransform, width, height, elements } =
    svgPattern;
  return (
    <pattern
      id={patternId}
      width={width}
      height={height}
      patternUnits={patternUnits || "userSpaceOnUse"}
      patternTransform={patternTransform}
    >
      {elements?.map((el: SvgPatternElement, idx: number) => {
        switch (el.element) {
          case "rect":
            return (
              <rect
                key={idx}
                width={el.width}
                height={el.height}
                fill={el.fill || "transparent"}
              />
            );
          case "line":
            return (
              <line
                key={idx}
                x1={el.x1}
                y1={el.y1}
                x2={el.x2}
                y2={el.y2}
                stroke={color}
                strokeWidth={el.strokeWidth}
              />
            );
          case "circle":
            return (
              <circle key={idx} cx={el.cx} cy={el.cy} r={el.r} fill={color} />
            );
          default:
            return null;
        }
      })}
    </pattern>
  );
}

const SvgEntity: React.FC<SvgEntityProps & { svgPattern?: SvgPattern }> = ({
  svgType,
  svgProps,
  fillType,
  color,
  patternId,
  svgPattern,
}) => {
  const fill = getFillValue(fillType, color, patternId);
  const stroke = color;
  const strokeWidth = 4;

  // Render the correct SVG element
  const shapeProps = {
    stroke,
    strokeWidth,
    fill,
    ...svgProps,
  };

  let shapeElement: React.ReactElement | null = null;
  switch (svgType) {
    case "polygon":
      shapeElement = (
        <polygon {...(shapeProps as React.SVGProps<SVGPolygonElement>)} />
      );
      break;
    case "ellipse":
      shapeElement = (
        <ellipse {...(shapeProps as React.SVGProps<SVGEllipseElement>)} />
      );
      break;
    case "circle":
      shapeElement = (
        <circle {...(shapeProps as React.SVGProps<SVGCircleElement>)} />
      );
      break;
    case "path":
      shapeElement = (
        <path {...(shapeProps as React.SVGProps<SVGPathElement>)} />
      );
      break;
    default:
      shapeElement = null;
  }

  return (
    <svg width="100%" height="100%" viewBox="0 0 50 50">
      {patternId && svgPattern && (
        <defs>
          {renderPatternFromData(patternId, fillType, color, svgPattern)}
        </defs>
      )}
      {shapeElement}
    </svg>
  );
};

export default SvgEntity;
