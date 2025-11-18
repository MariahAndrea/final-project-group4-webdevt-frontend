// StarmuPage.jsx
// home page after starmu creation
import React, { useState } from "react";
import ShopPopup from "../components/ShopButton";
import InventoryPopup from "../components/InventoryButton";
import GachaPopup from "../components/GachaButton"; 
import LoadingScreen from "../components/LoadingScreen";
import HowToPlay from "../components/HowToPlay.jsx";
import CustomizePopup from "../components/CustomizeButton.jsx";
import useRewardGenerator from "../hooks/useRewardGenerator";
import "../css/StarmuPage.css";
import usePreloadAssets from "../hooks/usePreloadAssets";
import { useGame } from "../store/GameContext";


function StarmuPage() {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isGachaOpen, setIsGachaOpen] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [clickRewards, setClickRewards] = useState([]); // Track reward pop-ups
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  const { 
    coins, 
    stargleams, 
    addCoins, 
    addStargleams,
    starmuData
  } = useGame();

  const { getRandomReward } = useRewardGenerator();

  // Preload images for the Starmu page
  const loading = usePreloadAssets([
    "/images/bg_StarmuHome.png"
  ]);

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


  // Handle placeholder click to generate rewards
  const handlePlaceholderClick = (e) => {
  const { coinsReward, stargleamReward } = getRandomReward();

  // Add to player's currency using helper functions
  addCoins(coinsReward);
  addStargleams(stargleamReward);

    // Construct the reward text depending on what is earned
    let rewardText = "";
    if (coinsReward > 0) rewardText += `+$${coinsReward} `;
    if (stargleamReward > 0) rewardText += `+✦${stargleamReward}`;

    // If nothing earned, do nothing
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


  if (loading) return <LoadingScreen show={true} />;

  return (
    <div className="starmupage-container">
      <div className="starmu-bg"></div>

      {/* Home Buttons */}
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

      {/* Top Panel */}
      <div className="starmu-top-panel">

        <div className="outside-border"> {/*Just the colored border outside*/}
          <div className="panel-container">

            <div className="starmu-details">
              <div className="starmu-name">{starmuData?.name || "Starmu Name"}</div>
                <div className="starmu-currency-panel">
                 {/* ---------- COIN CURRENCY ---------- */}
                  <div className="currency-display"> {/*Coin display*/}
                    <span className="currency-icon coin"></span>
                    <span className="currency-amount">{coins.toString().padStart(7, "0")}</span>
                  </div>
                  {/* ---------- STARGLEAM CURRENCY ---------- */}
                  <div className="currency-display">
                    <span className="currency-icon stargleam"></span>
                    <span className="currency-amount">{stargleams.toString().padStart(7, "0")}</span>
                  </div>
                </div>
            </div>

            
            <div className="starmu-status-panel">
              <div className="starmu-stat-container">

                {/* ---------- HEALTH STATUS ---------- */}
                <div className="starmu-status">
                  <div className="stat-detail">
                    <div className="status-icon health"></div>
                    <div className="status-name">HP</div>
                  </div>

                  <div className="stat-bar">
                    <div className="bar-placeholder"></div>
                  </div>
                </div>

                {/* ---------- HUNGER STATUS ---------- */}
                <div className="starmu-status">
                  <div className="stat-detail">
                    <div className="status-icon hunger"></div>
                    <div className="status-name">Hunger</div>
                  </div>

                  <div className="stat-bar">
                    <div className="bar-placeholder"></div>
                  </div>
                </div>
                
                {/* ---------- HAPPINESS STATUS ---------- */}
                <div className="starmu-status">
                  <div className="stat-detail">
                    <div className="status-icon happiness"></div>
                    <div className="status-name">Happiness</div>
                  </div>

                  <div className="stat-bar">
                    <div className="bar-placeholder"></div>
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

      {/* Clickable Placeholder */}
      <div className="starmu-placeholder" onClick={handlePlaceholderClick}></div>

      {/* Reward Popups */}
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

      {/* Popups */}
      <ShopPopup isOpen={isShopOpen} onClose={handleCloseShop} />
      <InventoryPopup isOpen={isInventoryOpen} onClose={handleCloseInventory} />
      <GachaPopup isOpen={isGachaOpen} onClose={handleCloseGacha} />
      <CustomizePopup isOpen={isCustomizeOpen} onClose={handleCloseCustomize} />
      <HowToPlay isOpen={isHowToPlayOpen} onClose={handleCloseHowToPlay} />
    </div>
  );
}

export default StarmuPage;