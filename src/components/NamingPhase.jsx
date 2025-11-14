//NamingPhase.jsx
import React, { useState } from "react";
import cutsceneTexts from "../data/cutscenes.json";

export default function NamingPhase({ starmuName, onNameConfirm }) {
  const [name, setName] = useState(starmuName || "");
  const lines = cutsceneTexts.naming;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && name.trim() !== "") {
      onNameConfirm(name.trim());
    }
  };

  return (
    <div className="starmu-container phase-naming">
      <div className="starmu-bg"></div>
      <div className="cutscene-content">
        <div className="cutscene-text">
          {lines.map((line, idx) => <p key={idx}>{line}</p>)}
        </div>
        <div className="starmu-placeholder"></div>
      </div>

      <div className="name-container">
        <input
          type="text"
          className="starmu-name-input"
          placeholder="Enter name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="continue-text">Press Enter to confirm</div>
      </div>
    </div>
  );
}
