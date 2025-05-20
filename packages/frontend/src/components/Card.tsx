import React from "react";

interface ClientCardData {
  card_name: string;
  count_value: 1 | 2 | 3;
  abstractCardId: string;
}

interface CardProps {
  cardData: ClientCardData;
  onSelect: (abstractCardId: string) => void;
  isSelected: boolean;
}

const CardComponent: React.FC<CardProps> = ({
  cardData,
  onSelect,
  isSelected,
}) => {
  const { card_name, count_value, abstractCardId } = cardData;

  // Simple text representation for now
  // card_name is like "COLOR_FILL_SHAPE"
  const [color, fill, shape] = card_name.split("_");

  const cardStyle: React.CSSProperties = {
    border: isSelected ? "2px solid blue" : "1px solid #ccc",
    padding: "10px",
    margin: "5px",
    width: "150px", // Adjust as needed
    height: "100px", // Adjust as needed
    cursor: "pointer",
    textAlign: "center",
    backgroundColor: isSelected ? "#e0e0ff" : "#f9f9f9",
  };

  return (
    <div style={cardStyle} onClick={() => onSelect(abstractCardId)}>
      <p>
        {count_value} {color} {fill} {shape}
      </p>
      {/* <p><small>ID: {abstractCardId}</small></p> */}
    </div>
  );
};

export default CardComponent;
