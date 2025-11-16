// /pages/StarmuCreation.jsx
// /pages/StarmuCreation.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LoadingScreen from "../components/LoadingScreen";
import CutscenePhase from "../components/CutscenePhase";
import ColorPickPhase from "../components/ColorPickPhase";
import NamingPhase from "../components/NamingPhase";
import GreetingPhase from "../components/GreetingPhase";

import usePreloadAssets from "../hooks/usePreloadAssets";
import { useGame } from "../store/GameContext";
import "../css/StarmuCreation.css";

function StarmuCreation() {
  const navigate = useNavigate();
  const {
    starmuPhase,
    setStarmuPhase,
    starmuData,
    setStarmuData
  } = useGame();

  const [blockClicks, setBlockClicks] = useState(true);
  const [showComet, setShowComet] = useState(false);
  const [showText, setShowText] = useState(false);

  const assets = [
    "/images/bg_StarmuCreation.jpg",
    "/images/comet.png",
  ];
  const loading = usePreloadAssets(assets);

  // ==========================
  // Cutscene timers
  // ==========================
  useEffect(() => {
    if (starmuPhase === "cutscene") {
      const cometTimer = setTimeout(() => setShowComet(true), 1000);
      const textTimer = setTimeout(() => setShowText(true), 4000);
      return () => {
        clearTimeout(cometTimer);
        clearTimeout(textTimer);
      };
    }
  }, [starmuPhase]);

  // ==========================
  // Phase handlers
  // ==========================
  const handleColorSelect = (color) => {
    setStarmuData({ ...starmuData, color });
    setStarmuPhase("naming");
  };

  const handleNameConfirm = (name) => {
    setStarmuData({ ...starmuData, name });
    setStarmuPhase("greeting");
    // TODO: Save to DB here if needed
  };

  const handleGreeting = () => {
    navigate("/starmu-page");
    {/*
    // Reset creation for testing (does not allow backtracking)
    setStarmuPhase("cutscene");
    setStarmuData({ color: "", name: "" });
    setShowComet(false);
    setShowText(false);
    setBlockClicks(true);

    console.log("Starmu creation reset for testing.");
    */}
  };

  if (loading) return <LoadingScreen show />;

  // ==========================
  // Phase components
  // ==========================
  const phaseComponents = {
    cutscene: (
      <CutscenePhase
        showComet={showComet}
        showText={showText}
        blockClicks={blockClicks}
        onCutsceneClick={() => !blockClicks && setStarmuPhase("colorpick")}
        onCometEnd={() => setBlockClicks(false)}
      />
    ),
    colorpick: (
      <ColorPickPhase
        selectedColor={starmuData.color}
        onColorSelect={handleColorSelect}
        onConfirm={() => setStarmuPhase("naming")}
      />
    ),
    naming: (
      <NamingPhase
        starmuName={starmuData.name}
        onNameConfirm={handleNameConfirm}
      />
    ),
    greeting: (
      <GreetingPhase
        starmuData={starmuData}
        onTakeCare={handleGreeting}
      />
    ),
  };

  return phaseComponents[starmuPhase];
}

export default StarmuCreation;
