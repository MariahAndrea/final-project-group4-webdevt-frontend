// GameContext.jsx
import React, { createContext, useContext, useState, useMemo, useEffect } from "react";

const GameContext = createContext(null);

const clamp = (value) => Math.max(0, Math.min(100, value));

export const GameProvider = ({ children }) => {
  // ==========================
  // Pet stats
  // ==========================
  const [name, setName] = useState("My Pet");
  const [hunger, setHunger] = useState(() => JSON.parse(localStorage.getItem("hunger")) ?? 50);
  const [energy, setEnergy] = useState(() => JSON.parse(localStorage.getItem("energy")) ?? 50);
  const [happiness, setHappiness] = useState(() => JSON.parse(localStorage.getItem("happiness")) ?? 50);
  const [cleanliness, setCleanliness] = useState(() => JSON.parse(localStorage.getItem("cleanliness")) ?? 50);

  // ==========================
  // Currency / level
  // ==========================
  const [coins, setCoins] = useState(() => JSON.parse(localStorage.getItem("coins")) ?? 0);
  const [stargleams, setStargleams] = useState(() => JSON.parse(localStorage.getItem("stargleams")) ?? 0);
  const [level, setLevel] = useState(() => JSON.parse(localStorage.getItem("level")) ?? 1);
  const [isGameOver, setIsGameOver] = useState(false);

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
    { id: 1, name: "Apple", type: "food", effect: 10, price: 3 },
    { id: 2, name: "Soap", type: "clean", effect: 20, price: 5 },
    { id: 3, name: "Ball", type: "toys", effect: 15, price: 7 },
    { id: 4, name: "Bed", type: "sleep", effect: 25, price: 10 },
    { id: 5, name: "Ball", type: "toys", effect: 15, price: 7 },
    { id: 6, name: "Ball", type: "toys", effect: 15, price: 7 },
    { id: 7, name: "Ball", type: "toys", effect: 15, price: 7 },
  ];

  // ==========================
  // Buy an item
  // ==========================
  const buyItem = (item) => {
    if (coins < item.price) return false;
    setCoins((c) => c - item.price);

    switch (item.type) {
      case "food":
        setHunger((h) => clamp(h + item.effect));
        break;
      case "clean":
        setCleanliness((c) => clamp(c + item.effect));
        break;
      case "play":
        setHappiness((h) => clamp(h + item.effect));
        break;
      case "sleep":
        setEnergy((e) => clamp(e + item.effect));
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
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });

    return true;
  };

  // ==========================
  // Helper functions for currency
  // ==========================
  const addCoins = (amount) => setCoins((c) => c + amount);
  const addStargleams = (amount) => setStargleams((s) => s + amount);
  const spendStargleams = (amount) => setStargleams((s) => Math.max(0, s - amount));
  const exchangeCoins = (amount) => setCoins((c) => Math.max(0, c - amount));

  // ==========================
  // Offline decay
  // ==========================
  useEffect(() => {
    const last = localStorage.getItem("lastUpdated");
    if (!last) return;
    const elapsedMinutes = Math.floor((Date.now() - Number(last)) / 60000);
    if (elapsedMinutes > 0) {
      const decay = elapsedMinutes;
      setHunger((h) => clamp(h - decay));
      setEnergy((e) => clamp(e - decay));
      setHappiness((h) => clamp(h - decay));
      setCleanliness((c) => clamp(c - decay));
    }
  }, []);

  // ==========================
  // Starmu creation state
  // ==========================
  const [starmuPhase, setStarmuPhase] = useState(
    () => JSON.parse(localStorage.getItem("starmuPhase")) ?? "cutscene"
  );

  const [starmuData, setStarmuData] = useState(
    () => JSON.parse(localStorage.getItem("starmuData")) ?? { color: "", name: "" }
  );

  // Helper to update starmu color
  const setStarmuColor = (color) => {
    setStarmuData(prev => ({ ...prev, color }));
  };

  // Starmu image map 
  const starmuImageMap = {
    purple: "/images/starmu_purple.png",
    pink: "/images/starmu_pink.png",
    mintGreen: "/images/starmu_mintgreen.png",
    babyBlue: "/images/starmu_blue.png",
    beige: "/images/starmu_beige.png",
  };

  // ==========================
  // Save to localStorage
  // ==========================
  useEffect(() => {
    localStorage.setItem("hunger", JSON.stringify(hunger));
    localStorage.setItem("energy", JSON.stringify(energy));
    localStorage.setItem("happiness", JSON.stringify(happiness));
    localStorage.setItem("cleanliness", JSON.stringify(cleanliness));
    localStorage.setItem("coins", JSON.stringify(coins));
    localStorage.setItem("level", JSON.stringify(level));
    localStorage.setItem("stargleams", JSON.stringify(stargleams));
    localStorage.setItem("lastUpdated", Date.now());
    localStorage.setItem("customizationItems", JSON.stringify(customizationItems));
    localStorage.setItem("inventoryItems", JSON.stringify(inventoryItems));

    // Save starmu creation
    localStorage.setItem("starmuPhase", JSON.stringify(starmuPhase));
    localStorage.setItem("starmuData", JSON.stringify(starmuData));
  }, [
    hunger,
    energy,
    happiness,
    cleanliness,
    coins,
    level,
    stargleams,
    starmuPhase,
    starmuData,
    customizationItems,
    inventoryItems,
  ]);

  // ==========================
  // Context values
  // ==========================
  const value = useMemo(
    () => ({
      name,
      hunger,
      energy,
      happiness,
      cleanliness,
      coins,
      level,
      isGameOver,
      shopItems,
      buyItem,
      inventoryItems,
      setInventoryItems,
      customizationItems,
      setCustomizationItems,
      stargleams,
      addCoins,
      addStargleams,
      spendStargleams,
      exchangeCoins,

      // Starmu creation
      starmuPhase,
      setStarmuPhase,
      starmuData,
      setStarmuData,
      setStarmuColor, 
      starmuImageMap,
    }),
    [
      name,
      hunger,
      energy,
      happiness,
      cleanliness,
      coins,
      level,
      isGameOver,
      stargleams,
      starmuPhase,
      starmuData,
      customizationItems,
      inventoryItems,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
};
