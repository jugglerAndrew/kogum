// /workspaces/kogum/packages/frontend/src/pages/TutorialPage.tsx
import React, { useState, useEffect } from "react";
import type { ClientCardData, PuzzleData } from "../types";
import AdhocCard from "../components/AdhocCard";

const TUTORIAL_API_URL = "/api/puzzle/tutorial";

const TutorialPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [tutorialCards, setTutorialCards] = useState<ClientCardData[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalSteps = 4;

  useEffect(() => {
    const fetchTutorial = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(TUTORIAL_API_URL);
        if (!res.ok) throw new Error("Failed to fetch tutorial cards");
        const data: PuzzleData = await res.json();
        setTutorialCards(data.cards);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTutorial();
  }, []);

  const steps = [
    {
      title: "What is Køgum?",
      content: (
        <>
          <p>
            Køgum is a puzzle game composed of twelve different cards. The goal
            is to find sets of three cards that form a valid pattern.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <AdhocCard shape="triangle" fill="solid" color="red" count={1} />
            <AdhocCard shape="hexagon" fill="solid" color="purple" count={2} />
            <AdhocCard shape="circle" fill="solid" color="blue" count={3} />
          </div>
        </>
      ),
    },
    {
      title: "Card Attributes",
      content: (
        <>
          <p>
            Each card has four attributes: <b>color</b>, <b>number</b>,{" "}
            <b>fill</b>, and <b>shape</b>.
          </p>

          <h3>Color:</h3>
          <div style={{ display: "flex", gap: 16 }}>
            <AdhocCard shape="triangle" fill="solid" color="red" count={1} />
            <AdhocCard shape="triangle" fill="solid" color="gold" count={1} />
            <AdhocCard shape="triangle" fill="solid" color="green" count={1} />
          </div>

          <h3>Number:</h3>
          <div style={{ display: "flex", gap: 16 }}>
            <AdhocCard shape="triangle" fill="solid" color="red" count={1} />
            <AdhocCard shape="triangle" fill="solid" color="red" count={2} />
            <AdhocCard shape="triangle" fill="solid" color="red" count={3} />
          </div>

          <h3>Fill:</h3>
          <div style={{ display: "flex", justifyContent: "left", gap: 16 }}>
            <AdhocCard shape="triangle" fill="open" color="blue" count={1} />
            <AdhocCard
              shape="triangle"
              fill="crosshatch"
              color="blue"
              count={1}
            />
            <AdhocCard shape="triangle" fill="striped" color="blue" count={1} />
          </div>

          <h3>Shape:</h3>
          <div style={{ display: "flex", gap: 16 }}>
            <AdhocCard shape="oval" fill="solid" color="orange" count={1} />
            <AdhocCard shape="pentagon" fill="solid" color="orange" count={1} />
            <AdhocCard shape="diamond" fill="solid" color="orange" count={1} />
          </div>
        </>
      ),
    },
    {
      title: "How to Find a Set",
      content: (
        <>
          <p>
            The goal is to find a set of three cards where, for each attribute,
            the cards are either all the same or all different.
          </p>
          <ol>
            <li>All cards must be unique.</li>
            <li>
              For any attribute (color, number, fill, shape), the three cards
              must either all share the same value or all have different values.
            </li>
          </ol>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            <AdhocCard shape="oval" fill="solid" color="blue" count={2} />
            <AdhocCard shape="diamond" fill="open" color="blue" count={2} />
            <AdhocCard shape="triangle" fill="striped" color="blue" count={2} />
          </div>
          <p style={{ marginTop: 16 }}>
            In this example, all three cards are blue, so color is the same. The
            shapes and fills are all different, and the number is the same.
          </p>
        </>
      ),
    },
    {
      title: "More Examples",
      content: (
        <>
          <p>Here are more valid sets. Can you spot why they are valid?</p>
          <div style={{ display: "flex", gap: 8 }}>
            <AdhocCard shape="oval" fill="solid" color="red" count={2} />
            <AdhocCard shape="oval" fill="solid" color="green" count={2} />
            <AdhocCard shape="oval" fill="solid" color="blue" count={2} />
          </div>
          <p style={{ marginTop: 16 }}>
            Same: count, fill, shape. Different: color.
          </p>
          <br />
          <div style={{ display: "flex", gap: 8 }}>
            <AdhocCard shape="oval" fill="open" color="red" count={3} />
            <AdhocCard shape="oval" fill="open" color="blue" count={1} />
            <AdhocCard shape="oval" fill="open" color="green" count={2} />
          </div>
          <p>Same: shape, fill. Different: count, color.</p>
          <br />
          <div style={{ display: "flex", gap: 8 }}>
            <AdhocCard shape="diamond" fill="striped" color="red" count={2} />
            <AdhocCard shape="triangle" fill="open" color="green" count={1} />
            <AdhocCard shape="oval" fill="solid" color="blue" count={3} />
          </div>
          <p>Different: shape, count, fill, color.</p>
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        Loading tutorial cards...
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center", marginTop: 40 }}>
        Error: {error}
      </div>
    );
  }
  return (
    <div>
      <h1 style={{ textAlign: "center", fontSize: "2.2em", marginBottom: 8 }}>
        tutørial
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 32,
        }}
      >
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            padding: "10px 24px",
            borderRadius: 8,
            border: "none",
            background: step === 0 ? "#eee" : "#0b6e4f",
            color: step === 0 ? "#888" : "#fff",
            fontWeight: 600,
            fontSize: "1em",
            cursor: step === 0 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          {steps.map((_, i) => (
            <span
              key={i}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: i === step ? "#fa9f42" : "#eee",
                display: "inline-block",
                border: i === step ? "1px solid #fa9f42" : "1px solid #ccc",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
          disabled={step === totalSteps - 1}
          style={{
            padding: "10px 24px",
            borderRadius: 8,
            border: "none",
            background: step === totalSteps - 1 ? "#eee" : "#0b6e4f",
            color: step === totalSteps - 1 ? "#888" : "#fff",
            fontWeight: 600,
            fontSize: "1em",
            cursor: step === totalSteps - 1 ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        {steps[step].title}
      </h2>
      <div>{steps[step].content}</div>
    </div>
  );
};

export default TutorialPage;
