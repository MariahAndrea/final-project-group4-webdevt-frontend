//GreetingPhase.jsx

import React from "react";
import cutsceneTexts from "../data/cutscenes.json";

export default function GreetingPhase({ starmuData, onTakeCare }) {
  const lines = cutsceneTexts.greeting;

  return (
    <div className="starmu-container phase-greeting">
      <div className="starmu-bg"></div>
      <div className="cutscene-content">
        <div className="cutscene-text">
          {lines.map((line, idx) => (
            <p key={idx}>
              {line.replace("{name}", starmuData.name || "Starmu")}
            </p>
          ))}
          <span className="starmu-name-display">{starmuData.name || "Starmu"}</span>
        </div>
        <div className="starmu-placeholder"></div>

        <button className="takecare-button" onClick={onTakeCare}>
          Take care of {starmuData.name || "Starmu"}
        </button>
      </div>
    </div>
  );
}
