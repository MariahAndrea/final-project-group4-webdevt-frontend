// useGachaGenerator.jsx
import { useState } from "react";
import { useGame } from "../store/GameContext";

export default function useGachaGenerator(fetchReward) {
  
  const [isRolling, setIsRolling] = useState(false);
  const [resultItems, setResultItems] = useState([]);
  const { gachaPoolData } = useGame();

  const rollGacha = async (category = "Accessory", numPulls = 1) => {
    setIsRolling(true);
    setResultItems([]);

    const results = [];

    const pool = gachaPoolData && gachaPoolData[category] || gachaPoolData && gachaPoolData["Accessory"] || [];

    if (pool.length === 0) {
      setIsRolling(false);
      return results;
      console.error("Gacha pool is empty for category:", category);
      return [];
    }

    const rarityWeights = {
      Common: 80,
      Rare: 15,
      Epic: 5,
    };

    // Helper to pick rarity based on weighted probability
    const pickRarity = () => {
      const rand = Math.random() * 100;
      if (rand < rarityWeights.Common) return "Common";
      else if (rand < rarityWeights.Common + rarityWeights.Rare) return "Rare";
      else return "Epic";
    };

    for (let i = 0; i < numPulls; i++) {
      if (fetchReward) {
        const reward = await fetchReward(category);
        results.push(reward);
      } else {
        // weighted random
        const rarity = pickRarity();
        let itemsOfRarity = pool.filter(item => item.rarity === rarity);

        if (itemsOfRarity.length === 0) {
          // Fallback if no items of this rarity
          itemsOfRarity = pool.filter(item => item.rarity === "Common");
        }

        if (itemsOfRarity.length === 0) {
          console.error("No items available in gacha pool for category:", category);
          results.push(null);
        } else {
          const randomIndex = Math.floor(Math.random() * itemsOfRarity.length);
          results.push(itemsOfRarity[randomIndex]);
        }
        
      }
    }

    // simulate animation
    await new Promise((res) => setTimeout(res, 1000));

    setResultItems(results);
    setIsRolling(false);

    return results;
  };

  return { isRolling, resultItems, rollGacha };
}
