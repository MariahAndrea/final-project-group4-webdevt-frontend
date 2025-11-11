import React, { createContext, useContext, useState, useMemo, useEffect } from "react"; // 1. Added useEffect

const GameContext = createContext(null);

// Utility function to ensure stats stay between 0 and 100
const clamp = (value) => {
  return Math.max(0, Math.min(100, value));
};

export const GameProvider = ({ children }) => {
//pet stats
  const [name, setName] = useState("My Pet");
  const [hunger, setHunger] = useState(() => JSON.parse(localStorage.getItem("hunger")) ?? 50); // 0 = starving, 100 = full
  const [energy, setEnergy] = useState(() => JSON.parse(localStorage.getItem("energy")) ?? 50); // 0 = exhausted, 100 = energized
  const [happiness, setHappiness] = useState(() => JSON.parse(localStorage.getItem("happiness")) ?? 50); // 0 = sad, 100 = happy
  const [cleanliness, setCleanliness] = useState(() => JSON.parse(localStorage.getItem("cleanliness")) ?? 50); // 0 = dirty, 100 = clean

  const [coins, setCoins] = useState(() => JSON.parse(localStorage.getItem("coins")) ?? 0);
  const [level, setLevel] = useState(() => JSON.parse(localStorage.getItem("level")) ?? 1);
  const [isGameOver, setIsGameOver] = useState(false);

// Shop (editable)
  const shopItems = [
    { id: 1, name: "Apple", type: "food", effect: 10, price: 3 },
    { id: 2, name: "Soap", type: "clean", effect: 20, price: 5 },
    { id: 3, name: "Ball", type: "play", effect: 15, price: 7 },
    { id: 4, name: "Bed", type: "sleep", effect: 25, price: 10 },
  ];
  
//effects
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
    return true;
  };

  // Offline decay on initial load
  useEffect(() => { // 2. useEffect is now available
    const last = localStorage.getItem("lastUpdated");
    if (!last) return;
    const elapsedMinutes = Math.floor((Date.now() - Number(last)) / 60000);
    if (elapsedMinutes > 0) {
      const decayAmount = elapsedMinutes; // 1 per min
      setHunger((h) => clamp(h - decayAmount));
      setEnergy((e) => clamp(e - decayAmount));
      setHappiness((h) => clamp(h - decayAmount));
      setCleanliness((c) => clamp(c - decayAmount));
    }
  }, []);

// Save to localStorage on stat changes
  useEffect(() => { // 2. useEffect is now available
    localStorage.setItem("hunger", JSON.stringify(hunger));
    localStorage.setItem("energy", JSON.stringify(energy));
    localStorage.setItem("happiness", JSON.stringify(happiness));
    localStorage.setItem("cleanliness", JSON.stringify(cleanliness));
    localStorage.setItem("coins", JSON.stringify(coins));
    localStorage.setItem("level", JSON.stringify(level));
    localStorage.setItem("lastUpdated", Date.now());
  }, [hunger, energy, happiness, cleanliness, coins, level]);

  const value = useMemo(() => ({
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
  }), [name, hunger, energy, happiness, cleanliness, coins, level, isGameOver]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
};