// DialogBox.jsx
import React from "react";
import styles from "../css/DialogBox.module.css";
import { motion } from "framer-motion";

export default function DialogBox({ message, onClose }) {
    return (
        <motion.div 
            className={styles.overlay}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
        >
            <motion.div 
                className={styles.box}
                initial={{ scale: 0.8 }} 
                animate={{ scale: 1 }}
            >
                <p className={styles.message}>{message}</p>
                <button className={styles.closeButton} onClick={onClose}>
                    OK
                </button>
            </motion.div>
        </motion.div>
    );
}
