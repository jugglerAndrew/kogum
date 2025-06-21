// /workspaces/kogum/packages/frontend/src/utils/leaderboardApi.ts
// Utility for fetching leaderboard data (public endpoints, no auth required)

const API_BASE = "/api/puzzle";

export type LeaderboardEntry = {
  rank: number;
  user_name: string;
  best_time_ms: number;
  date: string;
  meal_type?: string; // present for overall
};

export type LeaderboardTimeRange = "today" | "week" | "month" | "year" | "all";
export type LeaderboardMealType =
  | "overall"
  | "breakfast"
  | "lunch"
  | "dinner"
  | "dessert";

export async function fetchLeaderboard(
  mealType: LeaderboardMealType,
  timeRange: LeaderboardTimeRange
): Promise<LeaderboardEntry[]> {
  // Map to backend endpoints
  let url = "";
  if (mealType === "overall") {
    url = `${API_BASE}/leaderboard/overall?range=${timeRange}`;
  } else {
    url = `${API_BASE}/leaderboard?meal_type=${mealType}&range=${timeRange}`;
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch leaderboard: ${res.status}`);
  }
  return res.json();
}
