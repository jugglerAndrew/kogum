// Utility for consistent SVG fill logic for all shapes
export function getFillValue(
  fillType: "SOLID" | "STRIPED" | "OPEN" | "DOTTED",
  color: string,
  patternId: string
): string {
  switch (fillType) {
    case "SOLID":
      return color;
    case "STRIPED":
    case "DOTTED":
      return `url(#${patternId})`;
    case "OPEN":
    default:
      return "none";
  }
}
