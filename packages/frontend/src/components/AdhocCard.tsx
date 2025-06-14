import React, { useEffect, useState } from "react";
import Card from "./Card";
import type { SvgPattern } from "../types";

interface AdhocCardProps {
  shape: string;
  fill: string;
  color: string;
  count: number;
}

interface CardData {
  svgType: string;
  svgProps: React.SVGProps<
    SVGPolygonElement | SVGEllipseElement | SVGCircleElement | SVGPathElement
  > & { "data-abstract-card-id"?: string };
  fillType: string;
  color: string;
  svgPattern?: SvgPattern;
  count: number;
}

const AdhocCard: React.FC<AdhocCardProps> = ({ shape, fill, color, count }) => {
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCardData(null);
    setError(null);
    fetch(
      `/api/adhoc/adhoc-card?shape=${encodeURIComponent(
        shape
      )}&fill=${encodeURIComponent(fill)}&color=${encodeURIComponent(
        color
      )}&count=${count}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setCardData(data))
      .catch((err) => setError(err.message));
  }, [shape, fill, color, count]);

  if (error) return <div>Error: {error}</div>;
  if (!cardData) return <div>Loading...</div>;

  // Generate a unique patternId if a pattern is present
  const patternId = cardData.svgPattern
    ? `adhoc-pattern-${shape}-${fill}-${color}-${count}`
    : undefined;

  return <Card {...cardData} patternId={patternId} />;
};

export default AdhocCard;
