// LoadingScreen.jsx
import React from "react";
import styles from "../css/LoadingScreen.module.css";


export default function LoadingScreen({ show = false, text = "Loading..." }) {
  if (!show) return null; // hide entirely when not shown

  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingBox}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>{text}</p>
      </div>
    </div>
  );
}