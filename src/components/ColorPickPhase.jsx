//ColorPickPhase.jsx
import React, { useState } from "react";
import cutsceneTexts from "../data/cutscenes.json";

export default function ColorPickPhase({ selectedColor, onColorSelect, onConfirm }) {
  const colors = ["purple", "pink", "mintGreen", "babyBlue", "beige"];
  const [tempColor, setTempColor] = useState(selectedColor || "");
  const lines = cutsceneTexts.colorpick;

  const handleConfirm = () => {
    if (!tempColor) return;
    console.log(`User picked color: ${tempColor}`);
    onColorSelect(tempColor);
    if (onConfirm) onConfirm(); // optional callback to move next
  };

  return (
    <div className="starmu-container phase-colorpick">
      <div className="starmu-bg"></div>
      <div className="cutscene-content">
        <div className="cutscene-text">
          {lines.map((line, idx) => <p key={idx}>{line}</p>)}
        </div>
        <div className="starmu-placeholder"></div>
        
        <div className="color-container">
          <div className="color-options">
            {colors.map((color) => (
              <div
                key={color}
                className={`color-option color-${color} ${tempColor === color ? "selected" : ""}`}
                onClick={() => setTempColor(color)}
              ></div>
            ))}
          </div>

          <button
            className="confirm-button"
            onClick={handleConfirm}
            disabled={!tempColor}
          >
            Confirm
          </button>
        </div>
      </div>


    </div>
  );
}
