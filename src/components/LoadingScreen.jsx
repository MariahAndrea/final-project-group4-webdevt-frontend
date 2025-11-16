import React, { useEffect, useState } from "react";
import styles from "../css/LoadingScreen.module.css";

export default function LoadingScreen({ show = false, text = "Loading..." }) {
  const [visible, setVisible] = useState(show);
  const [fadeOut, setFadeOut] = useState(false);

  // Trigger fade out when show becomes false
  useEffect(() => {
    if (!show && visible) {
      setFadeOut(true);
      const timer = setTimeout(() => setVisible(false), 500); // match CSS transition duration
      return () => clearTimeout(timer);
    } else if (show) {
      setVisible(true);
      setFadeOut(false);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.loadingOverlay} ${fadeOut ? styles.fadeOut : ""}`}
    >
      <div className={styles.loadingBox}>
        <p className={styles.loadingText}>{text}</p>
        <div className={styles.loadingSpinner}></div>
     </div>
    </div>
  );
}
