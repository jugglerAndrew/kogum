import { useEffect, useState } from "react";
import CardComponent from "../components/Card";

type Combination = {
  shape: { id: number; name: string };
  color: { id: number; name: string; code: string | null };
  fill: { id: number; name: string };
};

export default function DebugCombinationsPage() {
  const [combinations, setCombinations] = useState<Combination[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/debug/combinations")
      .then((res) => {
        if (!res.ok) throw new Error("Not allowed or failed to fetch");
        return res.json();
      })
      .then(setCombinations)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Debug: Shape/Color/Fill Combinations</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {combinations.map(({ shape, color, fill }, i) => {
          // Compose a card_name string as expected by CardComponent, e.g. "RED_SOLID_OVAL"
          const card_name = `${color.name.toUpperCase()}_${fill.name.toUpperCase()}_${shape.name.toUpperCase()}`;
          // Use a dummy cardData object for CardComponent
          const cardData = {
            card_name,
            count_value: 1 as const,
            abstractCardId: `debug-${i}`,
          };
          return (
            <div key={i} style={{ margin: 8, minWidth: 180 }}>
              <CardComponent
                cardData={cardData}
                onSelect={() => {}}
                isSelected={false}
                applyMargins={false}
                isPaused={false}
                isSolutionDisplayCard={false}
              />
              <div style={{ fontSize: 12, marginTop: 4 }}>
                <b>Shape:</b> {shape.name}
                <br />
                <b>Color:</b> {color.name}
                <br />
                <b>Fill:</b> {fill.name}
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
