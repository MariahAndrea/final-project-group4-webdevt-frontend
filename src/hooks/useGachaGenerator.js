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
                // 🔑 ADDED ID (Accessory IDs start at 10)
            { id: 100, name: "Hat", type: "accessories", rarity: "Common" },
            { id: 101, name: "Gloves", type: "accessories", rarity: "Common" },
            { id: 102, name: "Socks", type: "accessories", rarity: "Common" },
            { id: 103, name: "Scarf", type: "accessories", rarity: "Rare" },
            { id: 104, name: "Belt", type: "accessories", rarity: "Rare" },
            { id: 105, name: "Boots", type: "accessories", rarity: "Rare" },
            { id: 106, name: "Crown", type: "accessories", rarity: "Epic" },
            { id: 107, name: "Cape", type: "accessories", rarity: "Epic" },
            { id: 108, name: "Halo", type: "accessories", rarity: "Epic" },
          ],

          Furniture: [
                // 🔑 ADDED ID (Furniture IDs start at 20)
            { id: 200, name: "Chair", type: "furniture", rarity: "Common" },
            { id: 201, name: "Stool", type: "furniture", rarity: "Common" },
            { id: 202, name: "Shelf", type: "furniture", rarity: "Common" },
            { id: 203, name: "Table", type: "furniture", rarity: "Rare" },
            { id: 204, name: "Lamp", type: "furniture", rarity: "Rare" },
            { id: 205, name: "Cabinet", type: "furniture", rarity: "Rare" },
            { id: 206, name: "Throne", type: "furniture", rarity: "Epic" },
            { id: 207, name: "Chandelier", type: "furniture", rarity: "Epic" },
            { id: 208, name: "Wardrobe", type: "furniture", rarity: "Epic" },
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