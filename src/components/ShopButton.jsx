// ShopPopup.jsx
// TO FIX:
// - REPLACE CURRENCY WITH ASSET
// - REMOVE CLOSE BUTTON OUTSIDE OF POPUP

import React, { useState, useEffect } from "react"; // Added useEffect
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import styles from "../css/ShopButton.module.css";
import { useGame } from "../store/GameContext"; // Adjusted path as per your code

// NEW: Success Notification Component
const SuccessPopup = ({ itemName }) => {
    return (
        <motion.div
            className={styles.successNotification}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <span className={styles.successIcon}>🎉</span>
            <p className={styles.successMessage}>
                Successfully purchased {itemName}!
            </p>
            <span className={styles.successIcon}>🎉</span>
        </motion.div>
    );
};

export default function ShopPopup({ isOpen, onClose }) {
    // Destructure all items and the buyItem function from the context
    const { shopItems: allItems, buyItem, coins } = useGame();
    const [category, setCategory] = useState("Food");
    // NEW: State for notification
    const [notification, setNotification] = useState(null); // {name: '...', type: 'success'}

    // NEW: Effect to clear the notification after a delay
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 3000); // Notification lasts for 3 seconds
            return () => clearTimeout(timer); // Cleanup on unmount or state change
        }
    }, [notification]);


    // Filtering Logic (No changes needed here)
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
                expectedType = 'consumables';
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
            // Updated: Set success notification state
            console.log(`Successfully bought ${item.name}!`);
            setNotification({ name: item.name, type: 'success' });
        } else {
            // Optional: Add some user feedback for insufficient coins
            console.log(`Not enough coins to buy ${item.name}.`);
            // You could add a 'failure' notification here if needed
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

                        {filteredItems.length === 0 && (
                            <p className={styles.noItemsMessage}>No items in this category yet.</p>
                        )}

                        {filteredItems.map((item) => (
                            <div key={item.id} className={styles.card}>
                                <div className={styles.cardContent}>
                                    <img
                                        src={item.image || '/images/starmu.png'}
                                        alt={item.name}
                                        className={styles.itemImage}
                                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/starmu.png'; }}
                                    />
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
                    

                </div> {/* End contentWrapper */}

                {/*Money Display*/}
                <div className={styles.moneyDisplay}>
                    <div className={styles.currencyIconCoin}></div>
                    <div className={styles.coinAmount}>{coins.toString().padStart(7, '0')}</div>
                </div>

                </div>
            </motion.div>

        
        <div className={styles.notificationCenter}>
            <AnimatePresence>
                {notification && notification.type === 'success' && (
                    // The success popup content itself will now use absolute positioning relative to its new parent
                    <SuccessPopup itemName={notification.name} />
                )}
            </AnimatePresence>
        </div>

        </motion.div>
    );
}