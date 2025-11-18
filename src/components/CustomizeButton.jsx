import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../css/CustomizeButton.module.css"; // Corrected path to step up two levels
import { useGame } from "../store/GameContext"; // Corrected path to step up two levels

export default function CustomizePopup({ isOpen, onClose }) {
    // Destructure customization items from the context
    // Assuming 'customizationItems' and item structure similar to inventory
    const { customizationItems } = useGame();
    const [category, setCategory] = useState("All");

    const filteredItems = category === "All"
        ? customizationItems
        : customizationItems.filter(item => item.type === category.toLowerCase());

    // Closing popup when clicking outside the container
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
                    exit={{ opacity: 0 }} // Overlay fade out
                >
                    {/* Sliding container from bottom */}
                    <motion.div
                        className={styles.popup}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }} // Slide down exit animation
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
                                        filteredItems.map(item => (
                                            <div key={item.id} className={styles.itemCard}>
                                                <div className={styles.imagePlaceholder} />
                                                <p className={styles.itemName}>{item.name}</p>
                                                <p className={styles.itemCount}>x{item.quantity}</p>
                                            </div>
                                        ))
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