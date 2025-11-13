// StarmuPage.jsx
// home page after starmu creation
import React, { useState } from "react";
import ShopPopup from "../components/ShopButton";
import InventoryPopup from "../components/InventoryButton";
import LoadingScreen from "../components/LoadingScreen";
import "../css/StarmuPage.css";
import usePreloadAssets from "../hooks/usePreloadAssets";

function StarmuPage() {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  // preload images for the Starmu page
  const loading = usePreloadAssets([
    "/images/bg_StarmuHome.png"
    // add more images as needed
  ]);

  const handleOpenShop = () => setIsShopOpen(true);
  const handleCloseShop = () => setIsShopOpen(false);

  const handleOpenInventory = () => setIsInventoryOpen(true);
  const handleCloseInventory = () => setIsInventoryOpen(false);

  if (loading) return <LoadingScreen show={true} />;

  return (
    <div className="starmupage-container">
      <div className="starmu-bg"></div>
      <div className="starmu-home-buttons">
        <div className="left-buttons">
          <button className="starmu-btn">?</button>
          <button className="starmu-btn">Daily Login</button>
          <button className="starmu-btn" onClick={handleOpenShop}>
            Store
          </button>
          <button className="starmu-btn" onClick={handleOpenInventory}>
            Inventory
          </button>
        </div>
        <div className="right-buttons">
          <button className="starmu-btn">Gacha</button>
          <button className="starmu-btn">Customize</button>
        </div>
      </div>

      <div className="starmu-top-panel">
        <div className="starmu-name">Starmu Name</div>
        <div className="starmu-status-panel">
          <div className="starmu-status health"></div>
          <div className="starmu-status hunger"></div>
          <div className="starmu-status happiness"></div>

          <div className="starmu-status-icon health"></div>
          <div className="starmu-status-icon hunger"></div>
          <div className="starmu-status-icon happiness"></div>
        </div>
        <div className="starmu-profile">profile</div>
      </div>

      <div className="starmu-placeholder"></div>

      {/* Popups */}
      <ShopPopup isOpen={isShopOpen} onClose={handleCloseShop} />
      <InventoryPopup isOpen={isInventoryOpen} onClose={handleCloseInventory} />
    </div>
  );
}

export default StarmuPage;
