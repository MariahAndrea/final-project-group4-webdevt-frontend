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
  
  const previousPhase = {
    colorpick: "cutscene",
    naming: "colorpick",
    greeting: "naming"
  };

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
  const handleBack = () => {
    const prev = previousPhase[starmuPhase];
    if (prev) setStarmuPhase(prev);
  };

  const handleColorSelect = (color) => {
    setStarmuData({ ...starmuData, color });
    setStarmuPhase("naming");
  };

  const handleNameConfirm = (name) => {
    setStarmuData({ ...starmuData, name });
    setStarmuPhase("greeting");
  };

  const handleGreeting = () => {
    navigate("/starmu-page");
  };

  if (loading) return <LoadingScreen show />;

  // ==========================
  // Phase components
  // ==========================
  const renderPhase = () => {
    switch (starmuPhase) {
      case "cutscene":
        return (
          <CutscenePhase
            showComet={showComet}
            showText={showText}
            blockClicks={blockClicks}
            onCutsceneClick={() => !blockClicks && setStarmuPhase("colorpick")}
            onCometEnd={() => setBlockClicks(false)}
          />
        );
      case "colorpick":
        return (
          <ColorPickPhase
            selectedColor={starmuData.color}
            onColorSelect={handleColorSelect}
            onConfirm={() => setStarmuPhase("naming")}
          />
        );
      case "naming":
        return (
          <NamingPhase
            starmuName={starmuData.name}
            selectedColor={starmuData.color}   
            onNameConfirm={handleNameConfirm}
            onBack={handleBack}
          />
        );
      case "greeting":
        return (
          <GreetingPhase
            starmuData={starmuData}
            selectedColor={starmuData.color}
            onTakeCare={handleGreeting}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="starmu-container">
      {renderPhase()}
    </div>
  );
}

export default StarmuCreation;
