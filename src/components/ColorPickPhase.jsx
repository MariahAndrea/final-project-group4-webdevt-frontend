// ColorPickPhase.jsx
import React, { useState } from "react";
import cutsceneTexts from "../data/cutscenes.json";
import { useGame } from "../store/GameContext";

export default function ColorPickPhase({ selectedColor, onColorSelect, onConfirm }) {
  const colors = ["purple", "pink", "mintGreen", "babyBlue", "beige"];
  const [tempColor, setTempColor] = useState(selectedColor || "purple");
  const lines = cutsceneTexts.colorpick;

  const { starmuImageMap, setStarmuColor } = useGame();  

  const handleConfirm = () => {
    if (!tempColor) return;
    setStarmuColor(tempColor);

    console.log(`User picked color: ${tempColor}`);
    if (onColorSelect) onColorSelect(tempColor);
    if (onConfirm) onConfirm();
  };

  return (
    <div className="starmu-container phase-colorpick">
      <div className="starmu-bg"></div>

      <div className="cutscene-content">
        <div className="cutscene-text">
          {lines.map((line, idx) => <p key={idx}>{line}</p>)}
        </div>

        {/* ✅ ONLY CHANGE HERE → dynamic background image */}
        <div
          className="starmu-placeholder1"
          style={{
            backgroundImage: `url(${
              tempColor 
                ? starmuImageMap[tempColor] 
                : "/images/starmu.png"
            })`,
          }}
        ></div>

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
