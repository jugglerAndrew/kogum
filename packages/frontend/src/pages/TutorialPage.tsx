// /workspaces/kogum/packages/frontend/src/pages/TutorialPage.tsx
import React, { useState } from "react";
import CardComponent from "../components/Card";

// Example cards for tutorial steps (replace with real data as needed)
const exampleCards = [
  {
    card_name: "BLUE_SOLID_TRIANGLE",
    count_value: 1 as const,
    abstractCardId: "c1",
  },
  {
    card_name: "BLUE_STRIPED_DIAMOND",
    count_value: 1 as const,
    abstractCardId: "c2",
  },
  {
    card_name: "BLUE_OPEN_OVAL",
    count_value: 1 as const,
    abstractCardId: "c3",
  },
  {
    card_name: "GREEN_SOLID_TRIANGLE",
    count_value: 1 as const,
    abstractCardId: "c4",
  },
  {
    card_name: "RED_STRIPED_DIAMOND",
    count_value: 1 as const,
    abstractCardId: "c5",
  },
  {
    card_name: "BLUE_OPEN_OVAL",
    count_value: 1 as const,
    abstractCardId: "c6",
  },
  {
    card_name: "BLUE_OPEN_OVAL",
    count_value: 3 as const,
    abstractCardId: "c7",
  },
  {
    card_name: "BLUE_OPEN_OVAL",
    count_value: 2 as const,
    abstractCardId: "c8",
  },
  {
    card_name: "RED_STRIPED_DIAMOND",
    count_value: 2 as const,
    abstractCardId: "c9",
  },
  {
    card_name: "GREEN_SOLID_TRIANGLE",
    count_value: 2 as const,
    abstractCardId: "c10",
  },
];

const steps = [
  {
    title: "What is Køgum?",
    content: (
      <>
        <p>
          Køgum is a puzzle game composed of twelve different cards. The goal is
          to find sets of three cards that form a valid pattern.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          {exampleCards.slice(0, 3).map((card) => (
            <CardComponent
              key={card.abstractCardId}
              cardData={card}
              onSelect={() => {}}
              isSelected={false}
            />
          ))}
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

        <div>
          <b>Color:</b>
          <div style={{ display: "flex", gap: 8 }}>
            <CardComponent
              cardData={{
                card_name: "RED_SOLID_OVAL",
                count_value: 1,
                abstractCardId: "color1",
              }}
              onSelect={() => {}}
              isSelected={false}
            />
            <CardComponent
              cardData={{
                card_name: "GREEN_SOLID_OVAL",
                count_value: 1,
                abstractCardId: "color2",
              }}
              onSelect={() => {}}
              isSelected={false}
            />
            <CardComponent
              cardData={{
                card_name: "BLUE_SOLID_OVAL",
                count_value: 1,
                abstractCardId: "color3",
              }}
              onSelect={() => {}}
              isSelected={false}
            />
          </div>
        </div>
        <div>
          <b>Number:</b>
          <div style={{ display: "flex", gap: 8 }}>
            <CardComponent
              cardData={{
                card_name: "RED_SOLID_OVAL",
                count_value: 1,
                abstractCardId: "num1",
              }}
              onSelect={() => {}}
              isSelected={false}
            />
            <CardComponent
              cardData={{
                card_name: "RED_SOLID_OVAL",
                count_value: 2,
                abstractCardId: "num2",
              }}
              onSelect={() => {}}
              isSelected={false}
            />
            <CardComponent
              cardData={{
                card_name: "RED_SOLID_OVAL",
                count_value: 3,
                abstractCardId: "num3",
              }}
              onSelect={() => {}}
              isSelected={false}
            />
          </div>
        </div>
        <div>
          <b>Fill:</b>
          <div style={{ display: "flex", gap: 8 }}>
            <CardComponent
              cardData={{
                card_name: "GREEN_SOLID_OVAL",
                count_value: 1,
                abstractCardId: "fill1",
              }}
              onSelect={() => {}}
              isSelected={false}
            />
            <CardComponent
              cardData={{
                card_name: "GREEN_STRIPED_OVAL",
                count_value: 1,
                abstractCardId: "fill2",
              }}
              onSelect={() => {}}
              isSelected={false}
            />
            <CardComponent
              cardData={{
                card_name: "GREEN_OPEN_OVAL",
                count_value: 1,
                abstractCardId: "fill3",
              }}
              onSelect={() => {}}
              isSelected={false}
            />
          </div>
        </div>
        <div>
          <b>Shape:</b>
          <div style={{ display: "flex", gap: 8 }}>
            <CardComponent
              cardData={{
                card_name: "BLUE_SOLID_OVAL",
                count_value: 1,
                abstractCardId: "shape1",
              }}
              onSelect={() => {}}
              isSelected={false}
            />
            <CardComponent
              cardData={{
                card_name: "BLUE_SOLID_DIAMOND",
                count_value: 1,
                abstractCardId: "shape2",
              }}
              onSelect={() => {}}
              isSelected={false}
            />
            <CardComponent
              cardData={{
                card_name: "BLUE_SOLID_TRIANGLE",
                count_value: 1,
                abstractCardId: "shape3",
              }}
              onSelect={() => {}}
              isSelected={false}
            />
          </div>
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
            For any attribute (color, number, fill, shape), the three cards must
            either all share the same value or all have different values.
          </li>
        </ol>
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          {exampleCards.slice(0, 3).map((card) => (
            <CardComponent
              key={card.abstractCardId + "set"}
              cardData={card}
              onSelect={() => {}}
              isSelected={true}
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
          <CardComponent
            cardData={{
              card_name: "RED_SOLID_OVAL",
              count_value: 2,
              abstractCardId: "color1",
            }}
            onSelect={() => {}}
            isSelected={false}
          />
          <CardComponent
            cardData={{
              card_name: "GREEN_SOLID_OVAL",
              count_value: 2,
              abstractCardId: "color2",
            }}
            onSelect={() => {}}
            isSelected={false}
          />
          <CardComponent
            cardData={{
              card_name: "BLUE_SOLID_OVAL",
              count_value: 2,
              abstractCardId: "color3",
            }}
            onSelect={() => {}}
            isSelected={false}
          />
        </div>
        <p style={{ marginTop: 16 }}>
          Same: count, fill, shape. Different: color.
        </p>
        <br />
        <div style={{ display: "flex", gap: 8 }}>
          <CardComponent
            cardData={{
              card_name: "RED_EMPTY_OVAL",
              count_value: 3,
              abstractCardId: "color1",
            }}
            onSelect={() => {}}
            isSelected={false}
          />
          <CardComponent
            cardData={{
              card_name: "BLUE_EMPTY_OVAL",
              count_value: 1,
              abstractCardId: "color2",
            }}
            onSelect={() => {}}
            isSelected={false}
          />
          <CardComponent
            cardData={{
              card_name: "GREEN_EMPTY_OVAL",
              count_value: 2,
              abstractCardId: "color3",
            }}
            onSelect={() => {}}
            isSelected={false}
          />
        </div>
        <p>Same: shape, fill. Different: count, color.</p>
        <br />
        <div style={{ display: "flex", gap: 8 }}>
          <CardComponent
            cardData={{
              card_name: "RED_STRIPED_DIAMOND",
              count_value: 2,
              abstractCardId: "color1",
            }}
            onSelect={() => {}}
            isSelected={false}
          />
          <CardComponent
            cardData={{
              card_name: "GREEN_EMPTY_TRIANGLE",
              count_value: 1,
              abstractCardId: "color2",
            }}
            onSelect={() => {}}
            isSelected={false}
          />
          <CardComponent
            cardData={{
              card_name: "BLUE_SOLID_OVAL",
              count_value: 3,
              abstractCardId: "color3",
            }}
            onSelect={() => {}}
            isSelected={false}
          />
        </div>
        <p>Different: shape, count, fill, color.</p>
      </>
    ),
  },
];

const TutorialPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const totalSteps = steps.length;

  return (
    <div>
      <h1 style={{ textAlign: "center", fontSize: "2.2em", marginBottom: 8 }}>
        tutørial
      </h1>
      <h2 style={{ textAlign: "center", color: "#007bff", marginBottom: 24 }}>
        {steps[step].title}
      </h2>
      <div>{steps[step].content}</div>
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
            background: step === 0 ? "#eee" : "#007bff",
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
                background: i === step ? "#007bff" : "#eee",
                display: "inline-block",
                border: i === step ? "2px solid #007bff" : "1px solid #ccc",
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
            background: step === totalSteps - 1 ? "#eee" : "#007bff",
            color: step === totalSteps - 1 ? "#888" : "#fff",
            fontWeight: 600,
            fontSize: "1em",
            cursor: step === totalSteps - 1 ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TutorialPage;
