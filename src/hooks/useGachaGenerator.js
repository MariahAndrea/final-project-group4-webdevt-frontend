// useGachaGenerator.jsx
import { useState } from "react";

export default function useGachaGenerator(fetchReward) {
  const [isRolling, setIsRolling] = useState(false);
  const [resultItems, setResultItems] = useState([]);

  const rollGacha = async (category = "Accessory", numPulls = 1) => {
    setIsRolling(true);
    setResultItems([]);

    const results = [];

    for (let i = 0; i < numPulls; i++) {
      if (fetchReward) {
        // fetch from API/DB
        const reward = await fetchReward(category);
        results.push(reward);
      } else {
        // fallback local random generation
        const pools = {

          Accessory: [
            // Common
            { name: "Hat", rarity: "Common" },
            { name: "Gloves", rarity: "Common" },
            { name: "Socks", rarity: "Common" },
            // Rare
            { name: "Scarf", rarity: "Rare" },
            { name: "Belt", rarity: "Rare" },
            { name: "Boots", rarity: "Rare" },
            // Epic
            { name: "Crown", rarity: "Epic" },
            { name: "Cape", rarity: "Epic" },
            { name: "Halo", rarity: "Epic" },
          ],

          Furniture: [
            // Common
            { name: "Chair", rarity: "Common" },
            { name: "Stool", rarity: "Common" },
            { name: "Shelf", rarity: "Common" },
            // Rare
            { name: "Table", rarity: "Rare" },
            { name: "Lamp", rarity: "Rare" },
            { name: "Cabinet", rarity: "Rare" },
            // Epic
            { name: "Throne", rarity: "Epic" },
            { name: "Chandelier", rarity: "Epic" },
            { name: "Wardrobe", rarity: "Epic" },
          ],
        };
        const pool = pools[category] || pools.Accessory;
        const randomIndex = Math.floor(Math.random() * pool.length);
        results.push(pool[randomIndex]);
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
