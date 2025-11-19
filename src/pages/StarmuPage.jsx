// StarmuPage.jsx
// Home page after Starmu creation
import React, { useState } from "react";
import ShopPopup from "../components/ShopButton";
import InventoryPopup from "../components/InventoryButton";
import GachaPopup from "../components/GachaButton";
import LoadingScreen from "../components/LoadingScreen";
import HowToPlay from "../components/HowToPlay.jsx";
import CustomizePopup from "../components/CustomizeButton.jsx";
import useRewardGenerator from "../hooks/useRewardGenerator";
import usePreloadAssets from "../hooks/usePreloadAssets";
import "../css/StarmuPage.css";
import { useGame } from "../store/GameContext";
import DialogBox from "../components/DialogBox";      // ➜ Added
import { useNavigate } from "react-router-dom";       // ➜ Added
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function StarmuPage() {
  // --------------------------
  // Popup state
  // --------------------------
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isGachaOpen, setIsGachaOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [clickRewards, setClickRewards] = useState([]); // Track reward pop-ups
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false); // ➜ Added

  const [equippedItems, setEquippedItems] = useState(() => {
    const savedItems = localStorage.getItem('equippedItems');
    return savedItems ? JSON.parse(savedItems) : {
      accessory: null, // item ID of the equipped accessory
      furniture: null, // item ID of the equipped furniture
    };
  });

  const accessoryImageMap = {
    100: "/images/accessory/bow.png",
    101: "/images/accessory/earrings.png",
    102: "/images/accessory/leaf.png",
    103: "/images/accessory/flowercrown.png",
    104: "/images/accessory/hat.png",
    105: "/images/accessory/glasses.png",
    107: "/images/accessory/crown.png",
    108: "/images/accessory/planets.png",
  };

  const furnitureImageMap = {
    // IDs aligned with `public/json/gachaPool.json` Furniture array
    200: "/images/furniture/stool.png",
    201: "/images/furniture/cushion.png",
    202: "/images/furniture/poster.png",
    203: "/images/furniture/hangingstars.png",
    204: "/images/furniture/gardenplant.png",
    205: "/images/furniture/windchime.png",
    206: "/images/furniture/fishtank.png",
    207: "/images/furniture/window.png",
  };

  const equippedAccessoryId = equippedItems.accessory;
  const equippedAccessoryImg = accessoryImageMap[equippedAccessoryId];

  const equippedFurnitureId = equippedItems.furniture;
  const equippedFurnitureImg = furnitureImageMap[equippedFurnitureId];

  const navigate = useNavigate(); // ➜ Added

  // --------------------------
  // Game state from context
  // --------------------------
  const { 
    coins, 
    stargleams, 
    addCoins, 
    addStargleams,
    starmuData,      // { color, name }
    starmuImageMap,  // color → image URL
    hunger,
    hp,
    happiness,
  } = useGame();

  const { setStarmuData, setHp, setHunger, setHappiness } = useGame();

  useEffect(() => {
    // Normalize the API base so it always includes `/api` and has no trailing slash.
    const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
    const normalized = rawBase.replace(/\/+$/g, '');
    const API_BASE = normalized.endsWith('/api') ? normalized : `${normalized}/api`;
    const petId = localStorage.getItem('petId');
    // If context already has name and color, no need to fetch
    if (starmuData?.name && starmuData?.color) return;

    (async () => {
      try {
        let pet = null;

        if (petId) {
          const resp = await fetch(`${API_BASE}/pets/${petId}`);
          if (resp.ok) pet = await resp.json();
        } else {
          // fallback: if no petId, try fetching by ownerID
          const ownerID = localStorage.getItem('userId');
          if (!ownerID) return;
          const resp = await fetch(`${API_BASE}/pets/owner/${ownerID}`);
          if (!resp.ok) return;
          const body = await resp.json();
          const pets = body?.pets || [];
          if (pets.length > 0) pet = pets[0];
        }

        if (!pet) return;

        // map backend enum to frontend key
        const backendToFrontend = {
          Purple: 'purple',
          Pink: 'pink',
          MintGreen: 'mintGreen',
          BabyBlue: 'babyBlue',
          Beige: 'beige'
        };
        const frontColor = backendToFrontend[pet.color] || pet.color;
        setStarmuData({ ...starmuData, name: pet.name, color: frontColor });
        if (typeof pet.hp !== 'undefined') setHp(pet.hp);
        if (typeof pet.hunger !== 'undefined') setHunger(pet.hunger);
        if (typeof pet.happiness !== 'undefined') setHappiness(pet.happiness);
        localStorage.setItem('petId', pet._id || pet.id);
      } catch (err) {
        console.error('Failed to fetch pet on StarmuPage:', err);
      }
    })();
  }, []);

  const { getRandomReward } = useRewardGenerator();

  // --------------------------
  // Preload background images
  // --------------------------
  const loading = usePreloadAssets([
    "/images/bg_StarmuHome.png",
    // ➜ ADDED: Preload accessory images
    ...Object.values(accessoryImageMap),
    ...Object.values(furnitureImageMap)
  ]);

  // --------------------------
  // Button handlers
  // --------------------------
  const handleOpenShop = () => setIsShopOpen(true);
  const handleCloseShop = () => setIsShopOpen(false);

  const handleOpenInventory = () => setIsInventoryOpen(true);
  const handleCloseInventory = () => setIsInventoryOpen(false);

  const handleOpenGacha = () => setIsGachaOpen(true);
  const handleCloseGacha = () => setIsGachaOpen(false);

  const handleOpenCustomize = () => setIsCustomizeOpen(true);
  const handleCloseCustomize = () => setIsCustomizeOpen(false);

  const handleOpenHowToPlay = () => setIsHowToPlayOpen(true);
  const handleCloseHowToPlay = () => setIsHowToPlayOpen(false);

  const handleOpenLogoutDialog = () => setIsLogoutDialogOpen(true); // ➜ Added



  // --------------------------
  // Placeholder click → generate rewards
  // --------------------------
  const handlePlaceholderClick = (e) => {
    const { coinsReward, stargleamReward } = getRandomReward();

    // Add to player's currency
    addCoins(coinsReward);
    addStargleams(stargleamReward);

    // Build reward text
    let rewardText = "";
    if (coinsReward > 0) rewardText += `+$${coinsReward} `;
    if (stargleamReward > 0) rewardText += `+✦${stargleamReward}`;
    if (!rewardText) return;

    const newReward = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
      text: rewardText.trim(),
    };
    setClickRewards((prev) => [...prev, newReward]);

    // Remove popup after 1.5s
    setTimeout(() => {
      setClickRewards((prev) => prev.filter(r => r.id !== newReward.id));
    }, 1500);
  };

  // --------------------------
  // Show loading screen while assets preload
  // --------------------------
  if (loading) return <LoadingScreen show={true} />;

  // --------------------------
  // Determine Starmu image based on selected color
  // --------------------------
  const starmuImg = starmuData.color 
    ? starmuImageMap[starmuData.color]  // Dynamic image from selected color
    : "/images/starmu.png";             // Default image

  return (
    <div className="starmupage-container">
      <div className="starmu-bg"></div>

      {/* --------------------------
          Equipped Furniture (Background Items) ➜ ADDED SECTION
      -------------------------- */}
      {equippedFurnitureImg && (
        <AnimatePresence>
          <motion.img
            key={equippedFurnitureId}
            src={equippedFurnitureImg}
            alt="Equipped Furniture"
            className="equipped-furniture" 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>
      )}

      {/* --------------------------
          Home Buttons
      -------------------------- */}
      <div className="starmu-home-buttons">
        <div className="left-buttons">
          <button className="starmu-btn" onClick={handleOpenHowToPlay}>
            <div className="btn-icon help"></div>
            <div className="btn-label">Help</div>
          </button>
          <button className="starmu-btn" onClick={handleOpenShop}>
            <div className="btn-icon shop"></div>
            <div className="btn-label">Shop</div>
          </button>
          <button className="starmu-btn" onClick={handleOpenInventory}>
            <div className="btn-icon inventory"></div>
            <div className="btn-label">Inventory</div>
          </button>
        </div>
        <div className="right-buttons">
          <button className="starmu-btn" onClick={handleOpenGacha}>
            <div className="btn-icon gacha"></div>
            <div className="btn-label">Gacha</div>
          </button>
          <button className="starmu-btn" onClick={handleOpenCustomize}>
            <div className="btn-icon customize"></div>
            <div className="btn-label">Customize</div>
          </button>
        </div>
      </div>

      {/* --------------------------
          Top Panel (Stats & Profile)
      -------------------------- */}
      <div className="starmu-top-panel">
        <div className="outside-border">
          <div className="panel-container">

            <div className="starmu-details">
              <div className="starmu-name">{starmuData?.name || "Starmu Name"}</div>
              <div className="starmu-currency-panel">
                {/* Coin Currency */}
                <div className="currency-display">
                  <span className="currency-icon coin"></span>
                  <span className="currency-amount">{coins.toString().padStart(7, "0")}</span>
                </div>
                {/* Stargleam Currency */}
                <div className="currency-display">
                  <span className="currency-icon stargleam"></span>
                  <span className="currency-amount">{stargleams.toString().padStart(7, "0")}</span>
                </div>
              </div>
            </div>

            {/* Status Bars */}
            <div className="starmu-status-panel">
              <div className="starmu-stat-container">
                {/* HP */}
                <div className="starmu-status">
                  <div className="stat-detail">
                    <div className="status-icon health"></div>
                    <div className="status-name">HP</div>
                  </div>
                  <div className="stat-bar">
                    <div
                      className="bar-placeholder"
                      style={{ width: `${hp}%`, transition: "width 0.3s" }}
                    ></div>
                  </div>
                </div>

                {/* Hunger */}
                <div className="starmu-status">
                  <div className="stat-detail">
                    <div className="status-icon hunger"></div>
                    <div className="status-name">Hunger</div>
                  </div>
                  <div className="stat-bar">
                    <div
                      className="bar-placeholder"
                      style={{ width: `${hunger}%`, transition: "width 0.3s" }}
                    ></div>
                  </div>
                </div>

                {/* Happiness */}
                <div className="starmu-status">
                  <div className="stat-detail">
                    <div className="status-icon happiness"></div>
                    <div className="status-name">Happiness</div>
                  </div>
                  <div className="stat-bar">
                    <div
                      className="bar-placeholder"
                      style={{ width: `${happiness}%`, transition: "width 0.3s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="outside-border-2">
          <div 
            className="starmu-profile"
            onClick={handleOpenLogoutDialog}  // ➜ Modified
          >
            <div className="btn-icon profile"></div>
            <div className="btn-label">Logout</div>
          </div>
        </div>
      </div>

      {/* --------------------------
          Clickable Starmu Placeholder
      -------------------------- */}
      <div
        className="starmu-placeholder"
        onClick={handlePlaceholderClick}
        style={{ backgroundImage: `url(${starmuImg})` }}
      >
        {/* ➜ ADDED: Equipped Accessory Image */}
        {equippedAccessoryImg && (
          <AnimatePresence>
            <motion.img
              key={equippedAccessoryId} // Use key to re-trigger animation on change
              src={equippedAccessoryImg}
              alt="Equipped Accessory"
              className="equipped-accessory" // You'll need to define this in CSS
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>
        )}
      </div>

      {/* --------------------------
          Reward Popups
      -------------------------- */}
      {clickRewards.map((r) => (
        <div 
          key={r.id} 
          className="reward-popup"
          style={{
            "--x": `${r.x}px`,
            "--y": `${r.y}px`,
          }}
        >
          {r.text}
        </div>
      ))}

      {/* --------------------------
          Popups
      -------------------------- */}
      <ShopPopup isOpen={isShopOpen} onClose={handleCloseShop} />
      <InventoryPopup isOpen={isInventoryOpen} onClose={handleCloseInventory} />
      <GachaPopup isOpen={isGachaOpen} onClose={handleCloseGacha} />
      <CustomizePopup 
            isOpen={isCustomizeOpen} 
            onClose={handleCloseCustomize} 
            equippedItems={equippedItems} // <-- MUST BE PASSED
            setEquippedItems={setEquippedItems} // <-- And this one
        />
      <HowToPlay isOpen={isHowToPlayOpen} onClose={handleCloseHowToPlay} />

      {/* --------------------------
          Logout Dialog
      -------------------------- */}
      {isLogoutDialogOpen && (
        <DialogBox
          message="Are you sure you want to logout?"
          onClose={() => {
            // Unequip items and clear persisted equipped state
            setEquippedItems({ accessory: null, furniture: null });
            try { localStorage.removeItem('equippedItems'); } catch (e) {}
            setIsLogoutDialogOpen(false);
            navigate("/", { replace: true });
          }}
        />
      )}
    </div>
  );
}

export default StarmuPage;
