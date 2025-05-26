// /workspaces/kogum/packages/frontend/src/utils/formatters.ts
export const formatTime = (totalMilliseconds: number): string => {
  const ms = String(totalMilliseconds % 1000).padStart(3, "0");
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  return `${minutes}:${seconds}:${ms}`;
};
