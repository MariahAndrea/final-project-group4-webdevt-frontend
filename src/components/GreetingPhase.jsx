// GreetingPhase.jsx
import React from "react";
import cutsceneTexts from "../data/cutscenes.json";
import { useGame } from "../store/GameContext";

export default function GreetingPhase({ starmuData, onTakeCare, onBack }) {
  const lines = cutsceneTexts.greeting;
  const { starmuImageMap } = useGame(); // get the color -> image map

  // Determine the image based on selected color
  const starmuImg = starmuData.color ? starmuImageMap[starmuData.color] : "/images/starmu.png";

  return (
    <div className="starmu-container phase-greeting">
      <div className="starmu-bg"></div>
      <div className="cutscene-content">
        {/* Cutscene text */}
        <div className="cutscene-text">
          {lines.map((line, idx) => (
            <p key={idx}>
              {line.replace("{name}", starmuData.name || "Starmu")}
            </p>
          ))}
        </div>

        {/* Starmu placeholder with correct color image */}
        <div
          className="starmu-placeholder1"
          style={{ backgroundImage: `url(${starmuImg})` }}
        ></div>
        
        {/* Take Care Button */}
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
