import React, { useMemo } from "react";
import styles from "../css/GachaResultPopup.module.css";
import { useGame } from "../store/GameContext";

export default function GachaResultPopup({ items, isRolling, onClose }) {

  const { ownedCustomizationItems } = useGame();

  const safeOwnedItems = ownedCustomizationItems || []; 

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
                {items.filter(Boolean).map((item, index) => {

                  // How many copies player already owns before this roll
                  const ownedBefore = safeOwnedItems.find(ci => ci.id === item.id)?.quantity ?? 0;

                  // Count how many times this item has already appeared in the current roll BEFORE this index
                  const duplicatesInRollBefore = items
                    .slice(0, index)
                    .filter(prev => prev.id === item.id).length;

                  // Total copies before this card
                  const totalBeforeThis = ownedBefore + duplicatesInRollBefore;

                  // Show "Already Owned" if this is not the first copy (total > 1)
                  const showOwnedTag = totalBeforeThis >= 1;

                  return (
                    <div className={styles.resultCard} key={index}>
                      <p><b>{item.name}</b></p>
                      <p>{item.rarity}</p>

                    </div>
                  );
                })}
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
