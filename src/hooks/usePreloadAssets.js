//usePreloadAssets.js

// custom hook to preload assets (images, etc.)
// returns true if still loading, false when done
import { useState, useEffect } from "react";

export default function usePreloadAssets(assetUrls = [], delayMs = 1500) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      const promises = assetUrls.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve; // resolve even if image fails
          })
      );

      await Promise.all(promises);

      // wait additional delay before hiding loading screen
      setTimeout(() => setLoading(false), delayMs);
    };

    if (assetUrls.length > 0) loadAssets();
    else setTimeout(() => setLoading(false), delayMs);
  }, [assetUrls, delayMs]);

  return loading;
}
