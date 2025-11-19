//GameContext.jsx

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";

const GameContext = createContext(null);

const clamp = (value) => Math.max(0, Math.min(100, value));

export const GameProvider = ({ children }) => {
  // ==========================
  // Pet stats
  // ==========================
  const [hp, setHp] = useState(() => JSON.parse(localStorage.getItem("hp")) ?? 50);
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

    // Consumables (healing items)
    { id: 7, name: "Health Potion (S)", type: "consumables", effect: 10, price: 160 },
    { id: 8, name: "Health Potion (M)", type: "consumables", effect: 25, price: 250 },
    { id: 9, name: "Health Potion (L)", type: "consumables", effect: 50, price: 500 },
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

    switch (item.type) {
      case "food":
        setHunger((v) => clamp(v + item.effect));
        break;
      case "toys":
        setHappiness((v) => clamp(v + item.effect));
        break;
      case "consumables":
        setHp((v) => clamp(v + item.effect));
        break;
      default:
        break;
    }

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
  // Customization items helpers
  // ==========================
  const addCustomizationItem = (item) => {
    setCustomizationItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const getCustomizationItemsWithOwnership = () => {
    return customizationItems.map((item) => ({
      ...item,
      owned: item.quantity > 0
    }));
  };

  // ==========================
  // Currency helpers
  // ==========================
  const addCoins = (amount) => setCoins((c) => c + amount);
  const addStargleams = (amount) => setStargleams((s) => s + amount);
  const spendCoins = (amount) => setCoins((c) => Math.max(0, c - amount));
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
  // Offline decay + Real-time decay
  // ==========================
  useEffect(() => {
    const MINS_PER_POINT = 0.6; 
    const DECAY_PER_TICK = 1 / (MINS_PER_POINT * 60); 

    const last = localStorage.getItem("lastUpdated");
    if (last) {
      const elapsedMinutes = Math.floor((Date.now() - Number(last)) / 60000);
      if (elapsedMinutes > 0) {
        const decayAmount = Math.floor(elapsedMinutes / MINS_PER_POINT);
        if (decayAmount > 0) {
          setHp((v) => clamp(v - Math.floor(decayAmount / 2)));
          setHunger((v) => clamp(v - decayAmount));
          setHappiness((v) => clamp(v - decayAmount));
        }
      }
    }

    const interval = setInterval(() => {
      setHp((v) => clamp(v - (DECAY_PER_TICK / 2)));
      setHunger((v) => clamp(v - DECAY_PER_TICK));
      setHappiness((v) => clamp(v - DECAY_PER_TICK));

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
  // Persist user changes to backend (debounced)
  // ==========================
  useEffect(() => {
    // Normalize the API base so it always includes `/api` and has no trailing slash.
    const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
    const normalized = rawBase.replace(/\/+$/g, '');
    const API_BASE = normalized.endsWith('/api') ? normalized : `${normalized}/api`;
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const timeout = setTimeout(async () => {
      try {
        await fetch(`${API_BASE}/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            coins,
            stargleams,
            inventoryItems,
            customizationItems
          })
        });
      } catch (err) {
        console.error('Failed to persist user data:', err);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [coins, stargleams, inventoryItems, customizationItems]);

  // ==========================
  // Persist pet stats to backend (debounced)
  // ==========================
  useEffect(() => {
    // Normalize the API base so it always includes `/api` and has no trailing slash.
    const rawBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
    const normalized = rawBase.replace(/\/+$/g, '');
    const API_BASE = normalized.endsWith('/api') ? normalized : `${normalized}/api`;
    const petId = localStorage.getItem('petId');
    if (!petId) return;

    const timeout = setTimeout(async () => {
      try {
        await fetch(`${API_BASE}/pets/${petId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hp, hunger, happiness })
        });
      } catch (err) {
        console.error('Failed to persist pet stats:', err);
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [hp, hunger, happiness]);

  // ==========================
  // Context values
  // ==========================
  const value = useMemo(() => ({
    hp, setHp,
    hunger, setHunger,
    happiness, setHappiness,
    coins, setCoins, stargleams, setStargleams,
    addCoins, addStargleams, spendStargleams,
    spendCoins,
    shopItems, buyItem,
    useItem,
    inventoryItems, setInventoryItems,
    customizationItems, setCustomizationItems,
    addCustomizationItem, // new
    getCustomizationItemsWithOwnership, // new
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
