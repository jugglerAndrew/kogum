// /workspaces/kogum/packages/frontend/src/pages/WelcomePage.tsx
import React from "react";

interface WelcomePageProps {
  onPlayToday: () => void;
  onPlayRandom: () => void;
  onRegister: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({
  onPlayToday,
  onPlayRandom,
  onRegister,
}) => {
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto 0 auto",
        padding: "32px 20px 40px 20px",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "3.5em",
          fontWeight: 800,
          marginBottom: 0,
          letterSpacing: "0.04em",
        }}
      >
        k
        <span
          style={{
            fontFamily: "serif",
            fontSize: "0.8em",
            verticalAlign: "middle",
          }}
        >
          &#248;
        </span>
        gum
      </h1>
      <div
        style={{ fontSize: "1.3em", margin: "10px 0 18px 0", color: "#444" }}
      >
        Kogum is a game of sets
      </div>
      <div style={{ fontSize: "1.1em", color: "#666", marginBottom: 32 }}>
        {/* Rules blurb placeholder */}
        <em>Rules coming soon! (You can add them here.)</em>
      </div>

      <button
        onClick={onPlayToday}
        style={{
          width: "100%",
          padding: "28px 0",
          fontSize: "1.5em",
          fontWeight: 700,
          background: "linear-gradient(90deg, #4f8cff 0%, #38cfa6 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          marginBottom: 18,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(79,140,255,0.10)",
          transition: "background 0.2s",
        }}
      >
        Play Today's Puzzle
      </button>

      <button
        onClick={onPlayRandom}
        style={{
          width: "100%",
          padding: "24px 0",
          fontSize: "1.25em",
          fontWeight: 600,
          background: "linear-gradient(90deg, #ffb347 0%, #ff5e62 100%)",
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
          border: "1px solid #e0e7ff",
        }}
      >
        <div style={{ fontSize: "1.15em", fontWeight: 700, marginBottom: 8 }}>
          Register for More Features
        </div>
        <div style={{ fontSize: "1em", color: "#555", marginBottom: 12 }}>
          Register to track your progress, compete on leaderboards, and save
          your stats!
        </div>
        <button
          onClick={onRegister}
          style={{
            width: "100%",
            padding: "16px 0",
            fontSize: "1.1em",
            fontWeight: 600,
            background: "#007bff",
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
