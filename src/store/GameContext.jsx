//GameContext.jsx
import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import gachaPoolData from "../../public/json/gachaPool.json";

const GameContext = createContext(null);
const clamp = (value) => Math.max(0, Math.min(100, value));

const saveCustomizationItemsToLocalStorage = (items) => {
  try{
    localStorage.setItem("customizationItems", JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save customization items to localStorage:", error);
  }
}

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
    try{
      const saved = localStorage.getItem("inventoryItems");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load inventory items:", error);
      return [];
    }
  });

  const [customizationItems, setCustomizationItems] = useState(() => {
    try{
      const saved = localStorage.getItem("customizationItems");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load customization items from localStorage:", error);
      return [];
    }
    
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
      const safePrev = prev || [];
      const existing = safePrev.find((i) => i.id === item.id);
      if (existing) {
        return safePrev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...safePrev, { ...item, quantity: 1 }];
    });

    return true;
  };

  // ==========================
  // Use item
  // ==========================
  const useItem = (itemId) => {
    const item = (inventoryItems || []).find((i) => i.id === itemId);
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
      (prev || [])
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
  const addCustomizationItem = useCallback((item) => {
    if (!item || !item.id) {
      console.error("Invalid item provided to addCustomizationItem:", item);
      return;
    }
    setCustomizationItems((prev) => {

      // check to avoid TypeError: Cannot read properties of undefined (reading 'find')
      const safePrev = prev || [];
      const existing = safePrev.find((i) => i.id === item.id);
      let newItems;

      if (existing) {
        newItems = safePrev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...safePrev, { ...item, quantity: 1, isEquipped: false }];
      }

      saveCustomizationItemsToLocalStorage(newItems); 
      return newItems;
    });
  }, []);

  const toggleEquipStatus = useCallback((itemId) => {
    setCustomizationItems((prev) => {
      const safePrev = prev || [];
      const itemToToggle = safePrev.find((item) => item.id === itemId);

      if (!itemToToggle || itemToToggle.quantity < 1) return safePrev; 

      const newItems = safePrev.map((item) => {
        if (item.id === itemId) {
          return { ...item, isEquipped: !item.isEquipped };
        } else if (item.type === itemToToggle.type && item.isEquipped) {
          return { ...item, isEquipped: false };
        }
        return item;
    });

    saveCustomizationItemsToLocalStorage(newItems);
    return newItems;
    });
  }, []);

  const getCustomizationItemsWithOwnership = () => {
    return customizationItems;
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
  // Context values
  // ==========================
  const value = useMemo(() => ({
    hp, setHp,
    hunger, setHunger,
    happiness, setHappiness,
    coins, stargleams,
    addCoins, addStargleams, spendStargleams,
    spendCoins,
    shopItems, buyItem,
    useItem,
    inventoryItems, setInventoryItems,
    ownedCustomizationItems: customizationItems, 
    setCustomizationItems,
    addCustomizationItem, 
    toggleEquipStatus,
    getCustomizationItemsWithOwnership, 
    starmuPhase, setStarmuPhase,
    starmuData, setStarmuData,
    setStarmuColor,
    starmuImageMap,
    gachaPoolData,
  }), [
    hp, hunger, happiness, coins, stargleams, inventoryItems, customizationItems, starmuPhase, starmuData, gachaPoolData
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
};
