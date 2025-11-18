//GameContext.jsx

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";

const GameContext = createContext(null);

const clamp = (value) => Math.max(0, Math.min(100, value));

export const GameProvider = ({ children }) => {
  // ==========================
  // Pet stats
  // ==========================
  const [hp, setHp] = useState(() => JSON.parse(localStorage.getItem("hp")) ?? 100);
  const [hunger, setHunger] = useState(() => JSON.parse(localStorage.getItem("hunger")) ?? 50);
  const [happiness, setHappiness] = useState(() => JSON.parse(localStorage.getItem("happiness")) ?? 50);

  // ==========================
  // Currency
  // ==========================
  const [coins, setCoins] = useState(() => JSON.parse(localStorage.getItem("coins")) ?? 0);
  const [stargleams, setStargleams] = useState(() => JSON.parse(localStorage.getItem("stargleams")) ?? 0);

  // ==========================
  // Inventory
  // ==========================
  const [inventoryItems, setInventoryItems] = useState(() => {
    const saved = localStorage.getItem("inventoryItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [customizationItems, setCustomizationItems] = useState(() => {
    const saved = localStorage.getItem("customizationItems");
    return saved ? JSON.parse(saved) : [];
  });

  // ==========================
  // Shop items
  // ==========================
  const shopItems = [
    // Food items (increase hunger)
    { id: 1, name: "Apple", type: "food", effect: 10, price: 3 },
    { id: 2, name: "Cookie", type: "food", effect: 15, price: 4 },
    { id: 3, name: "Sandwich", type: "food", effect: 20, price: 6 },

    // Toys (increase happiness)
    { id: 4, name: "Ball", type: "toys", effect: 15, price: 7 },
    { id: 5, name: "Plushie", type: "toys", effect: 20, price: 9 },
    { id: 6, name: "Toy Car", type: "toys", effect: 18, price: 8 },
    { id: 10, name: "Plushie", type: "toys", effect: 20, price: 9 },
    { id: 11, name: "Toy Car", type: "toys", effect: 18, price: 8 },
    { id: 12, name: "Plushie", type: "toys", effect: 20, price: 9 },
    { id: 13, name: "Toy Car", type: "toys", effect: 18, price: 8 },

    // Consumables (healing items)
    { id: 7, name: "Small Health Potion", type: "consumables", effect: 10, price: 5 },
    { id: 8, name: "Medium Health Potion", type: "consumables", effect: 25, price: 12 },
    { id: 9, name: "Large Health Potion", type: "consumables", effect: 50, price: 20 },

  ];


  // ==========================
  // Buy item
  // ==========================
  const buyItem = (item) => {
    if (coins < item.price) return false;
    setCoins((c) => c - item.price);

    switch (item.type) {
      case "hp":
        setHp((v) => clamp(v + item.effect));
        break;
      case "hunger":
        setHunger((v) => clamp(v + item.effect));
        break;
      case "happiness":
        setHappiness((v) => clamp(v + item.effect));
        break;
      default:
        break;
    }

    setInventoryItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    return true;
  };

  // ==========================
  // Use item
  // ==========================
  const useItem = (itemId) => {
    const item = inventoryItems.find((i) => i.id === itemId);
    if (!item || item.quantity <= 0) return false;

    // Apply effect based on type
    switch (item.type) {
      case "food":
        setHunger((v) => clamp(v + item.effect));
        break;

      case "toys":
        setHappiness((v) => clamp(v + item.effect));
        break;

      case "consumables":   // <-- NEW: Health potions
        setHp((v) => clamp(v + item.effect));
        break;

      default:
        break;
    }

    // Reduce quantity
    setInventoryItems((prev) =>
      prev
        .map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );

    return true;
  };

  // ==========================
  // Currency helpers
  // ==========================
  const addCoins = (amount) => setCoins((c) => c + amount);
  const addStargleams = (amount) => setStargleams((s) => s + amount);
  const spendStargleams = (amount) => setStargleams((s) => Math.max(0, s - amount));

  // ==========================
  // Starmu creation state
  // ==========================
  const [starmuPhase, setStarmuPhase] = useState(
    () => JSON.parse(localStorage.getItem("starmuPhase")) ?? "cutscene"
  );
  const [starmuData, setStarmuData] = useState(
    () => JSON.parse(localStorage.getItem("starmuData")) ?? { color: "", name: "" }
  );
  const setStarmuColor = (color) => setStarmuData((prev) => ({ ...prev, color }));

  const starmuImageMap = {
    purple: "/images/starmu_purple.png",
    pink: "/images/starmu_pink.png",
    mintGreen: "/images/starmu_mintgreen.png",
    babyBlue: "/images/starmu_blue.png",
    beige: "/images/starmu_beige.png",
  };

  // ==========================
  // Offline decay + initialize real-time decay
  // ==========================
  useEffect(() => {
    // Offline decay
    const last = localStorage.getItem("lastUpdated");
    if (last) {
      const elapsedMinutes = Math.floor((Date.now() - Number(last)) / 60000);
      if (elapsedMinutes > 0) {
        const decay = elapsedMinutes;
        setHp((v) => clamp(v - Math.floor(decay / 2)));
        setHunger((v) => clamp(v - decay));
        setHappiness((v) => clamp(v - decay));
      }
    }

    // Real-time decay
    const interval = setInterval(() => {
      setHp((v) => clamp(v - 0.1));
      setHunger((v) => clamp(v - 0.2));
      setHappiness((v) => clamp(v - 0.2));

      // AUTO HP REGEN — updated
      if (hunger >= 80 && happiness >= 80) {
        setHp((v) => clamp(v + 1));
      }

      localStorage.setItem("lastUpdated", Date.now());
    }, 1000);


    return () => clearInterval(interval);
  }, [hunger, happiness]);

  // ==========================
  // Save state to localStorage
  // ==========================
  useEffect(() => {
    localStorage.setItem("hp", JSON.stringify(hp));
    localStorage.setItem("hunger", JSON.stringify(hunger));
    localStorage.setItem("happiness", JSON.stringify(happiness));
    localStorage.setItem("coins", JSON.stringify(coins));
    localStorage.setItem("stargleams", JSON.stringify(stargleams));
    localStorage.setItem("inventoryItems", JSON.stringify(inventoryItems));
    localStorage.setItem("customizationItems", JSON.stringify(customizationItems));
    localStorage.setItem("starmuPhase", JSON.stringify(starmuPhase));
    localStorage.setItem("starmuData", JSON.stringify(starmuData));
  }, [
    hp, hunger, happiness, coins, stargleams,
    inventoryItems, customizationItems, starmuPhase, starmuData
  ]);

  // ==========================
  // Context values
  // ==========================
  const value = useMemo(() => ({
    hp, setHp,
    hunger, setHunger,
    happiness, setHappiness,
    coins, stargleams,
    addCoins, addStargleams, spendStargleams,
    shopItems, buyItem,

    
    useItem,
    inventoryItems, setInventoryItems,
    customizationItems, setCustomizationItems,
    starmuPhase, setStarmuPhase,
    starmuData, setStarmuData,
    setStarmuColor,
    starmuImageMap
  }), [
    hp, hunger, happiness, coins, stargleams,
    inventoryItems, customizationItems, starmuPhase, starmuData
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
};
