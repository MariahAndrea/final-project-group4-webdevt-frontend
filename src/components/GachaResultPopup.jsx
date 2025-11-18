// ==============================
// GachaResultPopup.jsx
// ==============================

import React from "react";
import styles from "../css/GachaResultPopup.module.css";

export default function GachaResultPopup({ items, isRolling, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>

      <div className={styles.resultContainer}>
        {/* If rolling, show spinner */}
        {isRolling ? (
          <div className={styles.rollingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.rollingText}>Rolling...</p>
          </div>
        ) : (
          <>
            <h2 className={styles.title}>🎉 You got 🎉</h2>

            {/* Results appear after rolling finishes */}
            <div className={styles.resultGrid}>
              {items.map((item, index) => (
                <div className={styles.resultCard} key={index}>
                  <p><b>{item.name}</b></p>
                  <p>{item.rarity}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Close button */}
        <button className={styles.confirmButton} onClick={onClose}>
          Close
        </button>

      </div>
      
      </div>
    </div>
  );
}
