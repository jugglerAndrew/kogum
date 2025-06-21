// /workspaces/kogum/packages/frontend/src/pages/ScoresPage.tsx
import React, { useState, useEffect } from "react";
import {
  fetchLeaderboard,
  type LeaderboardEntry,
  type LeaderboardMealType,
  type LeaderboardTimeRange,
} from "../utils/leaderboardApi";
import { formatTime } from "../utils/formatters";

const mealTabs: { label: string; value: LeaderboardMealType }[] = [
  { label: "Overall", value: "overall" },
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Dessert", value: "dessert" },
];

const timeRanges: { label: string; value: LeaderboardTimeRange }[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
  { label: "All-Time", value: "all" },
];

const ScoresPage: React.FC = () => {
  const [selectedMeal, setSelectedMeal] =
    useState<LeaderboardMealType>("overall");
  const [selectedRange, setSelectedRange] =
    useState<LeaderboardTimeRange>("today");
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setEntries(null);
    fetchLeaderboard(selectedMeal, selectedRange)
      .then((data) => {
        setEntries(data);
      })
      .catch((err) => {
        setError(err.message || "Failed to load leaderboard");
      })
      .finally(() => setLoading(false));
  }, [selectedMeal, selectedRange]);

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: 16 }}>
      <h1 style={{ textAlign: "center" }}>Leaderboards</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {mealTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedMeal(tab.value)}
              style={{
                padding: "6px 18px",
                borderRadius: 6,
                border:
                  tab.value === selectedMeal
                    ? "2px solid #4a90e2"
                    : "1px solid #bbb",
                background: tab.value === selectedMeal ? "#eaf4ff" : "#fff",
                fontWeight: tab.value === selectedMeal ? 700 : 400,
                cursor: "pointer",
                outline: "none",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div>
          <label htmlFor="timeRange" style={{ marginRight: 8 }}>
            Time Range:
          </label>
          <select
            id="timeRange"
            value={selectedRange}
            onChange={(e) =>
              setSelectedRange(e.target.value as LeaderboardTimeRange)
            }
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #bbb",
            }}
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div
        style={{
          background: "#f8f8fa",
          borderRadius: 8,
          padding: 24,
          boxShadow: "0 2px 8px #0001",
        }}
      >
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : error ? (
          <p style={{ color: "#c00", textAlign: "center" }}>Error: {error}</p>
        ) : entries && entries.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: 6, textAlign: "left" }}>Rank</th>
                <th style={{ padding: 6, textAlign: "left" }}>Username</th>
                <th style={{ padding: 6, textAlign: "left" }}>Time</th>
                <th style={{ padding: 6, textAlign: "left" }}>Date</th>
                {selectedMeal === "overall" && (
                  <th style={{ padding: 6, textAlign: "left" }}>Meal</th>
                )}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr
                  key={entry.rank + entry.user_name}
                  style={{ background: idx % 2 === 0 ? "#fff" : "#f3f6fa" }}
                >
                  <td style={{ padding: 6 }}>{entry.rank}</td>
                  <td style={{ padding: 6 }}>{entry.user_name}</td>
                  <td style={{ padding: 6 }}>
                    {formatTime(entry.best_time_ms)}
                  </td>
                  <td style={{ padding: 6 }}>
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  {selectedMeal === "overall" && (
                    <td style={{ padding: 6 }}>
                      {entry.meal_type
                        ? entry.meal_type.charAt(0).toUpperCase() +
                          entry.meal_type.slice(1)
                        : ""}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ textAlign: "center" }}>No results yet.</p>
        )}
      </div>
    </div>
  );
};

export default ScoresPage;
