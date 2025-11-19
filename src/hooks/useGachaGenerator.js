// useGachaGenerator.jsx
import { useState } from "react";

export default function useGachaGenerator(fetchReward) {
  const [isRolling, setIsRolling] = useState(false);
  const [resultItems, setResultItems] = useState([]);

  const rollGacha = async (category = "Accessory", numPulls = 1) => {
    setIsRolling(true);
    setResultItems([]);

    const results = [];

    const pools = {

      Accessory: [
        { id: 100, name: "Bow", type: "accessories", rarity: "Common" },
        { id: 101, name: "Leaf", type: "accessories", rarity: "Common" },
        { id: 102, name: "Earrings", type: "accessories", rarity: "Common" },
        { id: 103, name: "Flower Crown", type: "accessories", rarity: "Rare" },
        { id: 104, name: "Hat", type: "accessories", rarity: "Rare" },
        { id: 105, name: "Glasses", type: "accessories", rarity: "Rare" },
        { id: 107, name: "Crown", type: "accessories", rarity: "Epic" },
        { id: 108, name: "Planets", type: "accessories", rarity: "Epic" },
      ],

      Furniture: [
        { id: 200, name: "Chair", type: "furniture", rarity: "Common" },
        { id: 201, name: "Stool", type: "furniture", rarity: "Common" },
        { id: 202, name: "Shelf", type: "furniture", rarity: "Common" },
        { id: 203, name: "Hanging Stars", type: "furniture", rarity: "Rare" },
        { id: 204, name: "Garden Plant", type: "furniture", rarity: "Rare" },
        { id: 205, name: "Wind Chime", type: "furniture", rarity: "Rare" },
        { id: 206, name: "Throne", type: "furniture", rarity: "Epic" },
        { id: 208, name: "Window", type: "furniture", rarity: "Epic" },
      ],
    };

    const pool = pools[category] || pools.Accessory;

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
        const itemsOfRarity = pool.filter(item => item.rarity === rarity);
        const randomIndex = Math.floor(Math.random() * itemsOfRarity.length);
        results.push(itemsOfRarity[randomIndex]);
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
