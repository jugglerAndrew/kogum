// /workspaces/kogum/packages/frontend/src/pages/UserDashboardPage.tsx
import React, { useEffect, useState } from "react";
import UserPageComponent from "./UserPage";
import type { UserData } from "../types";
import { fetchPersonalBests } from "../utils/puzzleApi";
import { formatTime } from "../utils/formatters";

interface UserDashboardPageProps {
  currentUser: UserData;
}

interface UserDashboardPageWithLogoutProps extends UserDashboardPageProps {
  onLogout: () => void;
}

type PersonalBests = {
  [mealType: string]: {
    best_time_ms: number | null;
    date: string | null;
  };
} & {
  overall?: {
    best_time_ms: number | null;
    date: string | null;
    meal_type?: string;
  };
};

const mealTypes = ["breakfast", "lunch", "dinner", "dessert"];

const UserDashboardPage: React.FC<UserDashboardPageWithLogoutProps> = ({
  currentUser,
  onLogout,
}) => {
  const [personalBests, setPersonalBests] = useState<PersonalBests | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchPersonalBests()
      .then((data) => {
        setPersonalBests(data);
        setError(null);
      })
      .catch((err) => {
        // If the error is a 404, treat as no personal bests yet
        if (
          err &&
          (err.status === 404 ||
            (typeof err.message === "string" && err.message.includes("404")))
        ) {
          setPersonalBests(null);
          setError(null);
        } else {
          setError(err.message || "Failed to load personal bests");
          setPersonalBests(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section
        style={{
          maxWidth: 500,
          margin: "2rem auto",
          textAlign: "center",
          background: "#f8f8fa",
          borderRadius: 8,
          padding: 24,
          boxShadow: "0 2px 8px #0001",
        }}
      >
        <h2>Personal Bests</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "#c00" }}>Error: {error}</p>
        ) : personalBests ? (
          <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: 4 }}>Meal</th>
                <th style={{ padding: 4 }}>Best Time</th>
                <th style={{ padding: 4 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {mealTypes.map((meal) => {
                const best = personalBests[meal];
                return (
                  <tr key={meal}>
                    <td style={{ padding: 4, fontWeight: 500 }}>
                      {meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </td>
                    <td style={{ padding: 4 }}>
                      {best && best.best_time_ms != null ? (
                        formatTime(best.best_time_ms)
                      ) : (
                        <span style={{ color: "#888" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: 4 }}>
                      {best && best.date ? (
                        new Date(best.date).toLocaleDateString()
                      ) : (
                        <span style={{ color: "#888" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr style={{ borderTop: "2px solid #ccc" }}>
                <td style={{ padding: 4, fontWeight: 700 }}>Overall</td>
                <td style={{ padding: 4 }}>
                  {personalBests.overall &&
                  personalBests.overall.best_time_ms != null ? (
                    formatTime(personalBests.overall.best_time_ms)
                  ) : (
                    <span style={{ color: "#888" }}>—</span>
                  )}
                </td>
                <td style={{ padding: 4 }}>
                  {personalBests.overall && personalBests.overall.date ? (
                    new Date(personalBests.overall.date).toLocaleDateString()
                  ) : (
                    <span style={{ color: "#888" }}>—</span>
                  )}
                  {personalBests.overall && personalBests.overall.meal_type
                    ? ` (${personalBests.overall.meal_type})`
                    : null}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>
            No personal bests found yet. Play a daily puzzle to set your first
            time!
          </p>
        )}
      </section>
      <UserPageComponent currentUser={currentUser} onLogout={onLogout} />
    </div>
  );
};

export default UserDashboardPage;
