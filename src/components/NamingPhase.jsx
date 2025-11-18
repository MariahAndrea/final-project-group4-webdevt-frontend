// NamingPhase.jsx
import React, { useState } from "react";
import cutsceneTexts from "../data/cutscenes.json";
import { useGame } from "../store/GameContext";  // ✅ added

export default function NamingPhase({ starmuName, selectedColor, onNameConfirm, onBack }) {  // ✅ added selectedColor
  const [name, setName] = useState(starmuName || "");
  const lines = cutsceneTexts.naming;

  const { starmuImageMap } = useGame();  // ✅ added

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && name.trim() !== "") {
      onNameConfirm(name.trim());
    }
  };

  const handleConfirm = () => {
    if (name.trim() !== "") {
      onNameConfirm(name.trim());
    }
  };

  return (
    <div className="starmu-container phase-naming">
      <div className="starmu-bg"></div>

      <div className="cutscene-content">

        {/* Cutscene text */}
        <div className="cutscene-text">
          {lines.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>

        {/* ✅ Dynamic image from selected color */}
        <div
          className="starmu-placeholder"
          style={{
            backgroundImage: `url(${
              selectedColor
                ? starmuImageMap[selectedColor]
                : "/images/starmu.png"
            })`,
          }}
        ></div>

        {/* Name input */}
        <div className="name-container">
          <div className="name-input">
            <input
              type="text"
              className="starmu-name-input"
              placeholder="Enter name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button className ="confirm-name-input" onClick={handleConfirm}> confirm </button>
        </div>
      </div>

      {/* Back button */}
      {onBack && (
        <button className="back-button" onClick={onBack}>
          Back
        </button>
      )}

    </div>
  );
}
