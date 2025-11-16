// ==============================
// GachaPopup.jsx (Optimized)
// ==============================

//TO FIX
//Outside border


import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "../css/GachaButton.module.css";

import { useGame } from "../store/GameContext";
import DialogBox from "./DialogBox";
import GachaResultPopup from "./GachaResultPopup";
import useGachaGenerator from "../hooks/useGachaGenerator";


// ==============================
// Constants (placed outside for efficiency)
// ==============================
const GACHA_COST_PER_PULL = 1;
const COINS_TO_STARGLEAMS_RATE = 160;

const TABS = ["Accessory", "Furniture", "Exchange"];


// ==============================
// Small Subcomponents
// ==============================

// Shows a preview banner depending on selected category
function GachaBanner({ category }) {
  if (category === "Accessory")
    return <div className={styles.bannerPlaceholder}>Accessory Banner</div>;

  if (category === "Furniture")
    return <div className={styles.bannerPlaceholder}>Furniture Banner</div>;

  // Exchange Banner
  return (
    <div className={styles.bannerPlaceholder}>
      <p>Cost: <b>160 Coins</b> → <b>1 ✦ Stargleam</b></p>
      <p>Cost: <b>1600 Coins</b> → <b>10 ✦ Stargleam</b></p>
    </div>
  );
}


// Shows exchange buttons (only when Exchange tab is active)
function ExchangeButtons({ onExchange }) {
  return (
    <div className={styles.exchangeButtons}>
      <button className={styles.exchangeButton} onClick={() => onExchange(1)}>Exchange 1 ✦</button>
      <button className={styles.exchangeButton} onClick={() => onExchange(10)}>Exchange 10 ✦</button>
    </div>
  );
}


// Shows pull buttons (for Accessory / Furniture tabs)
function PullButtons({ onPull }) {
  return (
    <div className={styles.pullButtons}>
      <button className={styles.pullButton} onClick={() => onPull(1)}>Pull x1</button>
      <button className={styles.pullButton} onClick={() => onPull(10)}>Pull x10</button>
    </div>
  );
}



// ==============================
// Main Component
// ==============================
export default function GachaPopup({ isOpen, onClose }) {

  // ------------------------------
  // Hooks
  // ------------------------------
  const { isRolling, resultItems, rollGacha } = useGachaGenerator();
  const { coins, stargleams, addStargleams, spendStargleams, exchangeCoins } = useGame();

  // UI State
  const [category, setCategory] = useState("Accessory");
  const [dialogMessage, setDialogMessage] = useState(null);
  const [showResultPopup, setShowResultPopup] = useState(false);

  // Prevent rendering if closed
  if (!isOpen) return null;


  // ==============================
  // Currency Exchange Handler
  // (Converts coins → stargleams)
  // ==============================
  const handleExchange = (amount) => {
    const totalCost = amount * COINS_TO_STARGLEAMS_RATE;

    // Not enough coins
    if (coins < totalCost) {
      setDialogMessage("Not enough coins to exchange.");
      return;
    }

    // Apply currency changes
    addStargleams(amount);
    exchangeCoins(totalCost);

    // Success message
    setDialogMessage(`Exchanged ${totalCost} Coins for ${amount} Stargleam(s)!`);
  };

  // Gacha Roll Handler
  const handleRollGacha = async (numPulls) => {

    // Check stargleam balance before rolling
    if (stargleams < numPulls * GACHA_COST_PER_PULL) {
      setDialogMessage("Not enough stargleams.");
      return;
    }

    // Deduct cost
    spendStargleams(numPulls * GACHA_COST_PER_PULL);

    // Show result popup
    setShowResultPopup(true);

     // Perform the actual gacha roll (async)
    await rollGacha(category, numPulls);
  };


  return (
    <>
      {/* Main Gacha Popup */}
      <motion.div className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}>
        <motion.div className={styles.popup}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}>

          {/* Container for everything */}
          <div className={styles.gachaContainer}>

            {/* Title */}
            <div className={styles.titleContainer}>
              <div className={styles.title}>GACHA</div>
              <button className={styles.closeButtonTop} onClick={onClose}>
                  <span className={styles.closeIcon}>&times;</span>
              </button>
            </div>

            
            <div className={styles.contentWrapper}>

              {/*Tabs*/}
              <div className={styles.tabRow}>
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    className={category === tab ? styles.tabActive : styles.tabInactive}
                    onClick={() => setCategory(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Banner */}
              <GachaBanner category={category} />
            
            </div>

            <div className={styles.buttonAndCurrency}>

              <div className={styles.moneyPanel}>
                <div className={styles.moneyDisplay}>
                  <span className={styles.currencyIcon}>$</span>
                  <span className={styles.coinAmount}>{coins.toString().padStart(7, "0")}</span>
                </div>
              </div>

                {/* Buttons depending on selected tab */}
                {category === "Exchange" ? (
                  <ExchangeButtons onExchange={handleExchange} />
                ) : (
                  <PullButtons onPull={handleRollGacha} />
                )}

                {/*  Currency Display (Coins + Stargleams)*/}
                <div className={styles.moneyPanel}>
      
                  <div className={styles.moneyDisplayRight}>
                    <span className={styles.currencyIcon}>✦</span>
                    <span className={styles.coinAmount}>{stargleams.toString().padStart(7, "0")}</span>
                  </div>
                </div>

            </div>

      
          </div> {/* gachaContainer end*/}
        </motion.div>

        {/* Close Button */}
        <button className={styles.closeButton} onClick={onClose}>Close</button>

        {/* Dialog Box */}
        {dialogMessage && (
          <DialogBox 
            message={dialogMessage} 
            onClose={() => setDialogMessage(null)} 
          />
        )}
      </motion.div>

        {/* Result Popup */}
        {showResultPopup && (
        <GachaResultPopup
            items={resultItems}
            isRolling={isRolling}
            onClose={() => setShowResultPopup(false)}
        />
        )}
        
    </>
  );
}
