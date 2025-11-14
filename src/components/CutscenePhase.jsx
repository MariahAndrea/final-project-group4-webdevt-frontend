//CutscenePhase.jsx
import React from "react";
import cutsceneTexts from "../data/cutscenes.json";

export default function CutscenePhase({ showComet, showText, blockClicks, onCutsceneClick, onCometEnd }) {
  const lines = cutsceneTexts.cutscene;

  return (
    <div className={`starmu-container ${blockClicks ? "block-clicks" : ""}`} onClick={onCutsceneClick}>
      <div className="starmu-bg"></div>

      {showText && (
        <div className="cutscene-content">
          <div className="cutscene-text">
            {lines.map((line, idx) => <p key={idx}>{line}</p>)}
          </div>
          <div className="starmu-placeholder cutscene-animate"></div>
          <div className="continue-text">Click to continue</div>
        </div>
      )}

      {showComet && <div className="comet" onAnimationEnd={onCometEnd}></div>}
    </div>
  );
}
