// Utility for consistent SVG fill logic for all shapes
export function getFillValue(
  fillType: string,
  color: string,
  patternId: string
): string {
  switch (fillType) {
    case "SOLID":
      return color;
    case "STRIPED":
    case "DOTTED":
    case "CROSSHATCH":
      return `url(#${patternId})`;
    case "OPEN":
    default:
      return "none";
  }
}
