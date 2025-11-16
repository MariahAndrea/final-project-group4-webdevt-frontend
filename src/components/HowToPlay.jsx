import React from "react";
import { motion } from "framer-motion";
import styles from "../css/HowToPlay.module.css";

// Utility function to parse the **bold** markdown
const parseContent = (content) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            // Remove the ** and wrap in <strong>
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};


export default function HowToPlay({ isOpen, onClose }) {
    
    // Define the sections for the guide
    const guideSections = [
        {
            title: "1. Caring for Your Starmu",
            content: "Your Starmu is a celestial companion with three vital stats: **HP (Health)**, **Hunger**, and **Happiness**. Use items from your **Inventory** to keep these stats high. If their HP drops to zero, they'll need time to recover!"
        },
        {
            title: "2. Earning Currency",
            content: "Click Rewards: Tap your Starmu on the home screen to earn **Coins ($)** and sometimes **Stargleams (✦)**."
        },
        {
            title: "3. Using the Shop & Gacha",
            content: "Use **Coins ($)** in the **Store** to buy essential items (food, medicine). Use the rarer **Stargleams (✦)** in the **Gacha** for a chance to win exclusive, powerful, or cosmetic items."
        },
        {
            title: "4. Customization",
            content: "Visit the **Customize** screen to change your Starmu's appearance using items won from the Gacha."
        },
    ];

    if (!isOpen) return null;

    return (
        // Full screen overlay
        <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Main popup container */}
            <motion.div
                className={styles.popup}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
            >
                {/* Container for everything in popup */}
                <div className={styles.guideContainer}>

                    {/* Title and Close Button */}
                    <div className={styles.titleContainer}>
                        <div className={styles.title}>HOW TO PLAY</div>
                        <button className={styles.closeButtonTop} onClick={onClose}>
                            <span className={styles.closeIcon}>&times;</span>
                        </button>
                    </div>

                    {/* Content Wrapper */}
                    <div className={styles.contentWrapper}>
                        {guideSections.map((section, index) => (
                            <div key={index} className={styles.sectionCard}>
                                <h3 className={styles.sectionTitle}>{section.title}</h3>
                                {/* Use the parseContent function here */}
                                <p className={styles.sectionContent}>
                                    {parseContent(section.content)}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </motion.div>
        </motion.div>
    );
}