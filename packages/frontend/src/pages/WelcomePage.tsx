// /workspaces/kogum/packages/frontend/src/pages/WelcomePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: "center", padding: "0 20px 8px 20px" }}>
      <h1>k&#248;gum</h1>a game of patterns
      <button
        onClick={() => navigate("/today")}
        style={{
          width: "100%",
          padding: "28px 0",
          fontSize: "1.5em",
          fontWeight: 700,
          background: "linear-gradient(90deg, #6a4a7e 0%, #594b78 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          marginBottom: 18,
          marginTop: 36,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(79,140,255,0.10)",
          transition: "background 0.2s",
        }}
      >
        Play Today's Puzzle
      </button>
      <button
        onClick={() => navigate("/random")}
        style={{
          width: "100%",
          padding: "28px 0",
          fontSize: "1.5em",
          fontWeight: 700,
          background: "linear-gradient(90deg, #90447f 0%, #6a4a7e 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          marginBottom: 22,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(255,94,98,0.10)",
          transition: "background 0.2s",
        }}
      >
        Play a Random Puzzle
      </button>
      <div
        style={{
          background: "#f3f7ff",
          borderRadius: 10,
          padding: "22px 18px 18px 18px",
          marginTop: 18,
          marginBottom: 0,
        }}
      >
        <div
          style={{
            fontSize: "1.15em",
            fontWeight: 700,
            marginBottom: 8,
            color: "#555",
          }}
        >
          Register for More Features
        </div>
        <div style={{ fontSize: "1em", color: "#555", marginBottom: 12 }}>
          Register to track your progress, compete on leaderboards, and save
          your stats!
        </div>
        <button
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            padding: "16px 0",
            fontSize: "1.1em",
            fontWeight: 600,
            background: "green",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,123,255,0.10)",
            transition: "background 0.2s",
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
