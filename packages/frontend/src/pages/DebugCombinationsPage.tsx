import { useEffect, useState } from "react";
import NewCard from "../components/NewCard";
import type { SvgPattern } from "../types";

type Combination = {
  shape: {
    id?: number;
    name: string;
    svg_type?: string;
    svg_properties?: Record<string, string | number | boolean | undefined>;
  };
  color: {
    id?: number;
    name: string;
    code?: string | null;
    color_name?: string;
    color_code?: string | null;
  };
  fill: {
    id?: number;
    name: string;
    fill_name?: string;
    svg_pattern?: SvgPattern;
  };
  svg_type?: string;
  svg_properties?: Record<string, string | number | boolean | undefined>;
};

export default function DebugCombinationsPage() {
  const [combinations, setCombinations] = useState<Combination[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [entityCount, setEntityCount] = useState<number>(1);

  useEffect(() => {
    fetch("/api/debug/combinations")
      .then((res) => {
        if (!res.ok) throw new Error("Not allowed or failed to fetch");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched combinations:", data);
        setCombinations(data);
      })
      .catch((e) => {
        console.error("Error fetching combinations:", e);
        setError(e.message);
      });
  }, []);

  if (error) return <div>Error: {error}</div>;

  // Debug: print combinations to console on every render
  console.log("Current combinations state:", combinations);

  return (
    <div style={{ padding: 24 }}>
      <h1>Debug: Shape/Color/Fill Combinations</h1>
      <div style={{ margin: "16px 0" }}>
        <label
          htmlFor="entity-count-select"
          style={{ fontWeight: 500, marginRight: 8 }}
        >
          Entity count:
        </label>
        <select
          id="entity-count-select"
          value={entityCount}
          onChange={(e) => setEntityCount(Number(e.target.value))}
          style={{ fontSize: 16, padding: "2px 8px" }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {combinations.length === 0 && (
          <div style={{ color: "red", fontWeight: 600, margin: 16 }}>
            No combinations found. Check backend API and browser console for
            errors.
          </div>
        )}
        {combinations.map((comb, i) => {
          // Debug: print each combination as it is rendered
          console.log(`Rendering combination #${i}:`, comb);
          // Use svg_type and svg_properties from shape if not at top level
          const svgType = (comb.svg_type || comb.shape.svg_type) as
            | "polygon"
            | "ellipse"
            | "circle"
            | "path";
          // Attach svgPattern from fill.svg_pattern if present
          const svgProps = {
            ...(comb.svg_properties || comb.shape.svg_properties),
            svgPattern: comb.fill.svg_pattern,
          } as React.SVGProps<
            | SVGPolygonElement
            | SVGEllipseElement
            | SVGCircleElement
            | SVGPathElement
          > & { svgPattern?: SvgPattern };
          const color = (comb.color.color_code ||
            comb.color.code ||
            comb.color.name) as string;
          const fillType = (
            (comb.fill.fill_name || comb.fill.name) as
              | "SOLID"
              | "STRIPED"
              | "DOTTED"
              | "CROSSHATCH"
              | "OPEN"
          ).toUpperCase() as
            | "SOLID"
            | "STRIPED"
            | "DOTTED"
            | "CROSSHATCH"
            | "OPEN";
          let patternId: string | undefined = undefined;
          if (["STRIPED", "DOTTED", "CROSSHATCH"].includes(fillType)) {
            patternId = `${fillType.toLowerCase()}Pattern-debug-${i}`;
          }
          return (
            <div key={i} style={{ margin: 8, minWidth: 180 }}>
              <NewCard
                svgType={svgType}
                svgProps={svgProps}
                fillType={fillType}
                color={color}
                patternId={patternId}
                count={entityCount}
                applyMargins={false}
                isSelected={false}
                isPaused={false}
                isSolutionDisplayCard={false}
              />
              <div style={{ fontSize: 12, marginTop: 4 }}>
                <b>Shape:</b> {comb.shape.name}
                <br />
                <b>Color:</b> {comb.color.name}
                <br />
                <b>Fill:</b> {comb.fill.name}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 16, color: "#888" }}>
        <small>Only available in development mode.</small>
      </div>
    </div>
  );
}
