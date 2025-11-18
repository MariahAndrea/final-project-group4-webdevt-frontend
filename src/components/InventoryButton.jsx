// InventoryButton.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../css/InventoryButton.module.css";
import { useGame } from "../store/GameContext";

export default function InventoryPopup({ isOpen, onClose }) {
    const { inventoryItems, useItem } = useGame();
    const [category, setCategory] = useState("All");

    // Fix: match types exactly ("food", "toys", "consumables")
    const filteredItems =
        category === "All"
            ? inventoryItems
            : inventoryItems.filter(
                  (item) => item.type === category.toLowerCase()
              );

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // NEW: Handle clicking item
    const handleUseItem = (itemId) => {
        const result = useItem(itemId); // apply effect + remove 1 quantity
        if (result) {
            console.log("Item used:", itemId);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.overlay}
                    onClick={handleOverlayClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={styles.popup}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 70, damping: 12 }}
                    >

                        <div className={styles.inventoryContainer}>
                            <div className={styles.titleContainer}>
                                <div className={styles.title}>INVENTORY</div>
                                <button className={styles.closeButtonTop} onClick={onClose}>
                                    <span className={styles.closeIcon}>&times;</span>
                                </button>
                            </div>
                            {/* Tabs */}
                            <div className={styles.tabRow}>
                                {["All", "Food", "Toys", "Consumables"].map((tab) => (
                                    <button
                                        key={tab}
                                        className={
                                            category === tab
                                                ? styles.tabActive
                                                : styles.tabInactive
                                        }
                                        onClick={() => setCategory(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Items grid */}
                            <div className={styles.inventoryGrid}>
                                <div className={styles.horizontalScroll}>
                                    {filteredItems.length > 0 ? (
                                        filteredItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className={styles.itemCard}
                                                onClick={() => handleUseItem(item.id)} // NEW: usable
                                            >
                                                <div className={styles.imagePlaceholder} />
                                                <p className={styles.itemName}>{item.name}</p>
                                                <p className={styles.itemCount}>x{item.quantity}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className={styles.noItemsMessage}>
                                            No items yet.
                                        </p>
                                    )}
                                </div>

                        </div>

                    </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
