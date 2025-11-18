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

  const { getRandomReward } = useRewardGenerator();

  // --------------------------
  // Preload background images
  // --------------------------
  const loading = usePreloadAssets([
    "/images/bg_StarmuHome.png"
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

    
  console.log("HP:", hp, "Hunger:", hunger, "Happiness:", happiness);

  return (
    <div className="starmupage-container">
      <div className="starmu-bg"></div>

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
          <div className="starmu-profile">profile</div>
        </div>
      </div>

      {/* --------------------------
          Clickable Starmu Placeholder
      -------------------------- */}
      <div
        className="starmu-placeholder"
        onClick={handlePlaceholderClick}
        style={{ backgroundImage: `url(${starmuImg})` }}
      ></div>

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
      <CustomizePopup isOpen={isCustomizeOpen} onClose={handleCloseCustomize} />
      <HowToPlay isOpen={isHowToPlayOpen} onClose={handleCloseHowToPlay} />
    </div>
  );
}

export default StarmuPage;
