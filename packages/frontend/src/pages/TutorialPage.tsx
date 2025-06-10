// /workspaces/kogum/packages/frontend/src/pages/TutorialPage.tsx
import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import type { ClientCardData, PuzzleData } from "../types";

const TUTORIAL_API_URL = "/api/puzzles/tutorial";

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
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            {tutorialCards &&
              [
                // Replace these IDs with the ones you want to show
                "c0-s0-f1-n0",
                "c2-s2-f1-n2",
                "c1-s1-f0-n1",
                "c0-s2-f1-n1",
                "c1-s2-f1-n0",
              ].map((id) => {
                const card = tutorialCards.find((c) => c.abstractCardId === id);
                if (!card) return null;
                return (
                  <Card
                    key={card.abstractCardId}
                    svgType={card.svg_type as string}
                    svgProps={{
                      ...(card.svg_properties as Record<
                        string,
                        string | number | boolean | undefined
                      >),
                      "data-abstract-card-id": card.abstractCardId,
                    }}
                    fillType={
                      card.card_name.split("_")[1]?.toUpperCase() as string
                    }
                    color={card.card_name.split("_")[0]?.toUpperCase()}
                    count={card.count_value}
                    applyMargins={true}
                    isSelected={false}
                    isPaused={false}
                    isSolutionDisplayCard={false}
                    svgPattern={card.svg_pattern ?? undefined}
                    patternId={
                      card.svg_pattern
                        ? `pattern-${card.abstractCardId}`
                        : undefined
                    }
                  />
                );
              })}
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

          <b>Color:</b>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            <Card
              key="1"
              svgType="polygon"
              svgProps={{
                ...(card.svg_properties as Record<
                  string,
                  string | number | boolean | undefined
                >),
                "data-abstract-card-id": card.abstractCardId,
              }}
              fillType={card.card_name.split("_")[1]?.toUpperCase() as string}
              color={card.card_name.split("_")[0]?.toUpperCase()}
              count={card.count_value}
              applyMargins={true}
              isSelected={false}
              isPaused={false}
              isSolutionDisplayCard={false}
              svgPattern={card.svg_pattern ?? undefined}
              patternId={
                card.svg_pattern ? `pattern-${card.abstractCardId}` : undefined
              }
            />
          </div>

          <b>Number:</b>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            {tutorialCards &&
              ["c0-s0-f1-n0", "c1-s1-f0-n1", "c2-s2-f2-n2"].map((id) => {
                const card = tutorialCards.find((c) => c.abstractCardId === id);
                if (!card) return null;
                return (
                  <Card
                    key={card.abstractCardId}
                    svgType={card.svg_type as string}
                    svgProps={{
                      ...(card.svg_properties as Record<
                        string,
                        string | number | boolean | undefined
                      >),
                      "data-abstract-card-id": card.abstractCardId,
                    }}
                    fillType={
                      card.card_name.split("_")[1]?.toUpperCase() as string
                    }
                    color={card.card_name.split("_")[0]?.toUpperCase()}
                    count={card.count_value}
                    applyMargins={true}
                    isSelected={false}
                    isPaused={false}
                    isSolutionDisplayCard={false}
                    svgPattern={card.svg_pattern ?? undefined}
                    patternId={
                      card.svg_pattern
                        ? `pattern-${card.abstractCardId}`
                        : undefined
                    }
                  />
                );
              })}
          </div>

          <b>Fill:</b>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            {tutorialCards &&
              ["c0-s0-f1-n0", "c2-s2-f1-n2", "c1-s1-f1-n2"].map((id) => {
                const card = tutorialCards.find((c) => c.abstractCardId === id);
                if (!card) return null;
                return (
                  <Card
                    key={card.abstractCardId}
                    svgType={card.svg_type as string}
                    svgProps={{
                      ...(card.svg_properties as Record<
                        string,
                        string | number | boolean | undefined
                      >),
                      "data-abstract-card-id": card.abstractCardId,
                    }}
                    fillType={
                      card.card_name.split("_")[1]?.toUpperCase() as string
                    }
                    color={card.card_name.split("_")[0]?.toUpperCase()}
                    count={card.count_value}
                    applyMargins={true}
                    isSelected={false}
                    isPaused={false}
                    isSolutionDisplayCard={false}
                    svgPattern={card.svg_pattern ?? undefined}
                    patternId={
                      card.svg_pattern
                        ? `pattern-${card.abstractCardId}`
                        : undefined
                    }
                  />
                );
              })}
          </div>

          <b>Shape:</b>
          <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
            {tutorialCards &&
              ["c0-s0-f1-n0", "c2-s2-f1-n2", "c1-s1-f1-n2"].map((id) => {
                const card = tutorialCards.find((c) => c.abstractCardId === id);
                if (!card) return null;
                return (
                  <Card
                    key={card.abstractCardId}
                    svgType={card.svg_type as string}
                    svgProps={{
                      ...(card.svg_properties as Record<
                        string,
                        string | number | boolean | undefined
                      >),
                      "data-abstract-card-id": card.abstractCardId,
                    }}
                    fillType={
                      card.card_name.split("_")[1]?.toUpperCase() as string
                    }
                    color={card.card_name.split("_")[0]?.toUpperCase()}
                    count={card.count_value}
                    applyMargins={true}
                    isSelected={false}
                    isPaused={false}
                    isSolutionDisplayCard={false}
                    svgPattern={card.svg_pattern ?? undefined}
                    patternId={
                      card.svg_pattern
                        ? `pattern-${card.abstractCardId}`
                        : undefined
                    }
                  />
                );
              })}
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
            {tutorialCards &&
              tutorialCards.slice(0, 3).map((card) => (
                <Card
                  key={card.abstractCardId + "set"}
                  svgType={
                    card.svg_type ||
                    card.card_name.split("_")[2]?.toUpperCase() ||
                    "ellipse"
                  }
                  svgProps={{
                    ...(card.svg_properties || {}),
                    "data-abstract-card-id": card.abstractCardId,
                  }}
                  fillType={
                    card.card_name.split("_")[1]?.toUpperCase() || "SOLID"
                  }
                  color={card.card_name.split("_")[0]?.toUpperCase() || "BLUE"}
                  count={card.count_value}
                  isSelected={true}
                  svgPattern={card.svg_pattern || undefined}
                />
              ))}
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
            <Card
              svgType="OVAL"
              svgProps={{ "data-abstract-card-id": "color1" }}
              fillType="SOLID"
              color="RED"
              count={2}
            />
            <Card
              svgType="OVAL"
              svgProps={{ "data-abstract-card-id": "color2" }}
              fillType="SOLID"
              color="GREEN"
              count={2}
            />
            <Card
              svgType="OVAL"
              svgProps={{ "data-abstract-card-id": "color3" }}
              fillType="SOLID"
              color="BLUE"
              count={2}
            />
          </div>
          <p style={{ marginTop: 16 }}>
            Same: count, fill, shape. Different: color.
          </p>
          <br />
          <div style={{ display: "flex", gap: 8 }}>
            <Card
              svgType="OVAL"
              svgProps={{ "data-abstract-card-id": "color1" }}
              fillType="OPEN"
              color="RED"
              count={3}
            />
            <Card
              svgType="OVAL"
              svgProps={{ "data-abstract-card-id": "color2" }}
              fillType="OPEN"
              color="BLUE"
              count={1}
            />
            <Card
              svgType="OVAL"
              svgProps={{ "data-abstract-card-id": "color3" }}
              fillType="OPEN"
              color="GREEN"
              count={2}
            />
          </div>
          <p>Same: shape, fill. Different: count, color.</p>
          <br />
          <div style={{ display: "flex", gap: 8 }}>
            <Card
              svgType="DIAMOND"
              svgProps={{ "data-abstract-card-id": "color1" }}
              fillType="STRIPED"
              color="RED"
              count={2}
            />
            <Card
              svgType="TRIANGLE"
              svgProps={{ "data-abstract-card-id": "color2" }}
              fillType="OPEN"
              color="GREEN"
              count={1}
            />
            <Card
              svgType="OVAL"
              svgProps={{ "data-abstract-card-id": "color3" }}
              fillType="SOLID"
              color="BLUE"
              count={3}
            />
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
