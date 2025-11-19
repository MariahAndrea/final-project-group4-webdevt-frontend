// CustomizeButton.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../css/CustomizeButton.module.css";
import { useGame } from "../store/GameContext";

export default function CustomizePopup({ isOpen, onClose, equippedItems, setEquippedItems }) {
    // Destructure customization items from the context
    const { customizationItems } = useGame();
    const [category, setCategory] = useState("All");

    // Filter items based on selected category
    const filteredItems = category === "All"
        ? customizationItems
        : customizationItems.filter(item => item.type === category.toLowerCase());

    // Toggle equip/remove for one per type
    const toggleEquip = (item) => {
        const type = item.type === 'accessories' ? 'accessory' : item.type;
        
        setEquippedItems(prev => {
            const newState = {
                ...prev,
                [type]: prev[type] === item.id ? null : item.id
            };
            // Save the entire equipped state to local storage
            localStorage.setItem('equippedItems', JSON.stringify(newState));
            return newState;
        });
    };

    // Close popup when clicking outside the container
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const categories = ["All", "Accessories", "Furniture"];

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
                    {/* Sliding container from bottom */}
                    <motion.div
                        className={styles.popup}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 70, damping: 12 }}
                    >
                        <div className={styles.customizeContainer}>
                            <div className={styles.titleContainer}>
                                <div className={styles.title}>CUSTOMIZE</div>
                                <button className={styles.closeButtonTop} onClick={onClose}>
                                    <span className={styles.closeIcon}>&times;</span>
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className={styles.tabRow}>
                                {categories.map(tab => (
                                    <button
                                        key={tab}
                                        className={category === tab ? styles.tabActive : styles.tabInactive}
                                        onClick={() => setCategory(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Horizontal scrollable grid */}
                            <div className={styles.customizeGrid}>
                                <div className={styles.horizontalScroll}>
                                    {filteredItems.length > 0 ? (
                                        filteredItems.map(item => {
                                            const typeKey = item.type === 'accessories' ? 'accessory' : item.type;
                                            const equippedId = equippedItems[typeKey];
                                            const isEquipped = equippedId !== null && Number(equippedId) === Number(item.id);
                                            return (
                                                <div key={item.id} className={styles.itemCard}>
                                                    <div className={styles.imagePlaceholder} />
                                                    <p className={styles.itemName}>{item.name}</p>

                                                    {/* Equip/Remove button */}
                                                    <button
                                                        className={`${styles.equipButton} ${isEquipped ? styles.equipped : styles.remove}`}
                                                        onClick={() => toggleEquip(item)}
                                                    >
                                                        {isEquipped ? "Equipped" : "Equip"}
                                                    </button>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className={styles.noItemsMessage}>No customization items yet.</p>
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
