// TO FIX:
// - REPLACE CURRENCY WITH ASSET
// - REMOVE CLOSE BUTTON OUTSIDE OF POPUP

import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "../css/ShopButton.module.css";
import { useGame } from "../store/GameContext"; // Adjusted path as per your code

export default function ShopPopup({ isOpen, onClose }) {
    // Destructure all items and the buyItem function from the context
    const { shopItems: allItems, buyItem, coins } = useGame();
    const [category, setCategory] = useState("Food");

    // Filtering Logic
    const filteredItems = allItems.filter(item => {
        let expectedType;
        switch (category) {
            case 'Food':
                expectedType = 'food';
                break;
            case 'Toys':
                expectedType = 'toys'; 
                break;
            case 'Consumables':
                expectedType = 'clean,sleep'; 
                break;
            default:
                return false;
        }

        if (expectedType.length < 10) {
            return item.type === expectedType;
        } 
        
        const types = expectedType.split(',');
        return types.includes(item.type);
    });

    // Handler for the Buy button
    const handleBuy = (item) => {
        const success = buyItem(item);
        if (success) {
            // Optional: Add some user feedback for a successful purchase
            console.log(`Successfully bought ${item.name}!`);
        } else {
            // Optional: Add some user feedback for insufficient coins
            console.log(`Not enough coins to buy ${item.name}.`);
        }
    };


    if (!isOpen) return null;

return (
        // This is the full screen overlay
        <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Main shop container - will be positioned in the center of the screen */}
            <motion.div
                className={styles.popup}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
            >
                {/*Container for everything in shop*/}
                <div className={styles.shopContainer}>

                <div className={styles.titleContainer}>
                    <div className={styles.title}>STORE</div>
                    <button className={styles.closeButtonTop} onClick={onClose}>
                        <span className={styles.closeIcon}>&times;</span>
                    </button>
                </div>

                {/* Content of the shop starts AFTER the title container */}
                <div className={styles.contentWrapper}> {/* New wrapper for main content */}
                    <div className={styles.tabRow}>
                        {['Food', 'Toys', 'Consumables'].map(tab => (
                            <button
                                key={tab}
                                className={category === tab ? styles.tabActive : styles.tabInactive} 
                                onClick={() => setCategory(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className={styles.grid}>
                        {filteredItems.map((item) => (
                            <div key={item.id} className={styles.card}>
                                <div className={styles.cardContent}>
                                    <div className={styles.imagePlaceholder} />
                                    <p className={styles.itemName}>{item.name}</p>
                                    <p className={styles.itemPrice}>
                                        ${item.price.toFixed(0)}
                                    </p>
                                    <button 
                                        className={styles.buyButton}
                                        disabled={coins < item.price} 
                                        onClick={() => handleBuy(item)}
                                    >
                                        Buy
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {filteredItems.length === 0 && (
                        <p className={styles.noItemsMessage}>No items in this category yet.</p>
                    )}

                </div> {/* End contentWrapper */}
                
                {/*Money Display*/}
                <div className={styles.moneyDisplay}>
                    <div className={styles.currencyIcon}>$</div>
                    <div className={styles.coinAmount}>{coins.toString().padStart(7, '0')}</div>
                </div>

                </div>
            </motion.div>
            
            {/* Close Button is still outside the popup, at the bottom center of the screen */}
            <button className={styles.closeButton} onClick={onClose}>
                Close
            </button>
            
        </motion.div>
    );
}