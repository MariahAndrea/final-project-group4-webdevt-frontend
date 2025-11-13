// StarmuCreation.jsx
// where the creation of a starmu happens
// note: will add API calls to each phase later 
// note: do we use react-router-dom to the whole project?

import React, { useState, useEffect, useLayoutEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";
import "../css/StarmuCreation.css"; // external CSS
import { useNavigate } from "react-router-dom";


function StarmuCreation() {
  // the Starmu Creation page is divided into multiple phases
  
  const navigate = useNavigate();
  const [phase, setPhase] = useState("cutscene"); // "cutscene" | "colorpick" | "naming" | "greeting"
  const [showComet, setShowComet] = useState(false);
  const [showText, setShowText] = useState(false);
  const [starmuColor, setStarmuColor] = useState("");
  const [starmuName, setStarmuName] = useState("");
  const [blockClicks, setBlockClicks] = useState(true);
  const [loading, setLoading] = useState(true); // loading state

  // Wait until the page is rendered before hiding loading
  useLayoutEffect(() => {
    requestAnimationFrame(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (phase === "cutscene") {
      const cometTimer = setTimeout(() => setShowComet(true), 1000);
      const textTimer = setTimeout(() => setShowText(true), 4000);
      return () => {
        clearTimeout(cometTimer);
        clearTimeout(textTimer);
      };
    }
  }, [phase]);

  // handle cutscene click to proceed to colorpick phase
  const handleCutsceneClick = () => {
    if (phase === "cutscene" && !blockClicks) setPhase("colorpick");
  };

  // handle color selection
  const handleColorSelect = (color) => {
    setStarmuColor(color);
    setPhase("naming");
  };

  const handleNameInput = (e) => {
    if (e.key === "Enter" && starmuName.trim() !== "") {
      setPhase("greeting");
      // TODO: Save to MongoDB here (via API call)
      // Example:
      // fetch("/api/starmu", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name: starmuName }),
      // });
    }
  };

  return (
    <>
      {/* Loading overlay */}
      <LoadingScreen show={loading} />

      {/* Actual page content */}
      {!loading && (
        <>
          {/* --- CUTSCENE PHASE --- */}
          {phase === "cutscene" && (
            <div
              className={`starmu-container ${blockClicks ? "block-clicks" : ""}`}
              onClick={handleCutsceneClick}
            >
              <div className="starmu-bg"></div>

              {showText && (
                <div className="cutscene-content">
                  <div className="cutscene-text">
                    A comet has fallen
                    <br />A Starmu has emerged.
                    <br />
                  </div>
                  {/* Apply animation class only in cutscene */}
                  <div className="starmu-placeholder cutscene-animate"></div>
                  <div className="continue-text">Click to continue</div>
                </div>
              )}

              {showComet && (
                <div
                  className="comet"
                  onAnimationEnd={() => setBlockClicks(false)}
                ></div>
              )}
            </div>
          )}

          {/* --- COLOR PICKING PHASE --- */}
          {phase === "colorpick" && (
            <div className="starmu-container phase-colorpick">
              <div className="starmu-bg"></div>

              {showText && (
                <div className="cutscene-content">
                  <div className="cutscene-text">pick a color for your starmu.</div>
                  <div className="starmu-placeholder"></div>
                </div>
              )}

              {/* === Color selection and confirm button === */}
              <div className="color-container">
                <div className="color-options">
                  <div
                    className={`color-option color-purple ${
                      starmuColor === "purple" ? "selected" : ""
                    }`}
                    onClick={() => setStarmuColor("purple")}
                  ></div>
                  <div
                    className={`color-option color-pink ${
                      starmuColor === "pink" ? "selected" : ""
                    }`}
                    onClick={() => setStarmuColor("pink")}
                  ></div>
                  <div
                    className={`color-option color-mintGreen ${
                      starmuColor === "mintGreen" ? "selected" : ""
                    }`}
                    onClick={() => setStarmuColor("mintGreen")}
                  ></div>
                  <div
                    className={`color-option color-babyBlue ${
                      starmuColor === "babyBlue" ? "selected" : ""
                    }`}
                    onClick={() => setStarmuColor("babyBlue")}
                  ></div>
                  <div
                    className={`color-option color-beige ${
                      starmuColor === "beige" ? "selected" : ""
                    }`}
                    onClick={() => setStarmuColor("beige")}
                  ></div>
                </div>

                <button
                  className="confirm-button"
                  onClick={() => starmuColor && setPhase("naming")}
                  disabled={!starmuColor}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}

          {/* --- NAMING PHASE --- */}
          {phase === "naming" && (
            <div className="starmu-container phase-naming">
              <div className="starmu-bg"></div>

              {/* Main content (text + Starmu placeholder) */}
              <div className="cutscene-content">
                <div className="cutscene-text">What will you name your Starmu?</div>
                <div className="starmu-placeholder"></div>
              </div>

              {/* Name input container (separate section) */}
              <div className="name-container">
                <input
                  type="text"
                  className="starmu-name-input"
                  placeholder="Enter name..."
                  value={starmuName}
                  onChange={(e) => setStarmuName(e.target.value)}
                  onKeyDown={handleNameInput}
                />
                <div className="continue-text">Press Enter to confirm</div>
              </div>
            </div>
          )}

          {/* --- GREETING PHASE --- */}
          {phase === "greeting" && (
            <div className="starmu-container phase-greeting">
              <div className="starmu-bg"></div>

              <div className="cutscene-content">
                <div className="cutscene-text">
                  Say hello to 
                  <br />
                  <span className="starmu-name-display">{starmuName || "Starmu"}</span>!
                </div>

                <div className="starmu-placeholder"></div>

                <button
                  className="takecare-button"
                  onClick={() => navigate("/starmu-page")}
                >
                  Take care of {starmuName || "Starmu"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default StarmuCreation;
