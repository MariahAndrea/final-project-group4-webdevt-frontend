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
    setStarmuData,
    setHp,
    setHunger,
    setHappiness
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
  // Redirect if Starmu already created
  // ==========================
  useEffect(() => {
    // Normalize the API base so it always includes `/api` and has no trailing slash.
    const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
    const normalized = rawBase.replace(/\/+$/g, '');
    const API_BASE = normalized.endsWith('/api') ? normalized : `${normalized}/api`;

    // If starmuData already present in context, go straight to page
    if (starmuData?.name && starmuData?.color) {
      navigate("/starmu-page");
      return;
    }

    // Otherwise, if user is logged in, check backend for an existing pet
    const ownerID = localStorage.getItem('userId');
    if (!ownerID) return;

    (async () => {
      try {
        const resp = await fetch(`${API_BASE}/pets/owner/${ownerID}`);
        if (!resp.ok) return; // no pet or error
        const data = await resp.json();
        const pets = data?.pets || [];
        if (pets.length > 0) {
          const pet = pets[0];
          // map backend enum to frontend color key
          const backendToFrontend = {
            Purple: 'purple',
            Pink: 'pink',
            MintGreen: 'mintGreen',
            BabyBlue: 'babyBlue',
            Beige: 'beige'
          };
          const frontColor = backendToFrontend[pet.color] || pet.color;
          setStarmuData({ ...starmuData, name: pet.name, color: frontColor });
          // Load pet stats into context so StarmuPage shows correct values
          if (typeof pet.hp !== 'undefined') setHp(pet.hp);
          if (typeof pet.hunger !== 'undefined') setHunger(pet.hunger);
          if (typeof pet.happiness !== 'undefined') setHappiness(pet.happiness);
          localStorage.setItem('petId', pet._id || pet.id);
          navigate('/starmu-page');
        }
      } catch (err) {
        // ignore errors and let user create a new pet
        console.error('Error checking existing pet:', err);
      }
    })();
  }, []);
 
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
    // create pet on the backend then navigate to starmu page
    // Normalize API base here as well
    const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
    const normalized = rawBase.replace(/\/+$/g, '');
    const API_BASE = normalized.endsWith('/api') ? normalized : `${normalized}/api`;
    const ownerID = localStorage.getItem('userId');
    if (!ownerID) {
      // if not logged in, send user back to login
      navigate('/');
      return;
    }

    (async () => {
      try {
        // map frontend color keys to backend enum values
        const colorMap = {
          purple: 'Purple',
          pink: 'Pink',
          mintGreen: 'MintGreen',
          babyBlue: 'BabyBlue',
          beige: 'Beige'
        };
        const backendColor = colorMap[starmuData?.color] || starmuData?.color;

        const resp = await fetch(`${API_BASE}/pets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ownerID, name: starmuData?.name, color: backendColor })
        });
        const data = await resp.json();
        if (!resp.ok) {
          console.error('Failed to create pet', data);
          // Still navigate so user isn't blocked by backend error
          navigate('/starmu-page');
          return;
        }
        if (data && data._id) localStorage.setItem('petId', data._id);
        navigate('/starmu-page');
      } catch (err) {
        console.error('Network error creating pet', err);
        navigate('/starmu-page');
      }
    })();
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
