// GreetingPhase.jsx
import React from "react";
import cutsceneTexts from "../data/cutscenes.json";

export default function GreetingPhase({ starmuData, onTakeCare, onBack }) {
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
        </div>
        <div className="starmu-placeholder"></div>
        
        <button className="takecare-button" onClick={onTakeCare}>
          Take care of {starmuData.name || "Starmu"}
        </button>

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
