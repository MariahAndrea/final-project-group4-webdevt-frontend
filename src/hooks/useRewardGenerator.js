// src/hooks/useRewardGenerator.js
export default function useRewardGenerator() {
  const getRandomReward = () => {
    const roll = Math.random() * 100;

    let coinsReward = 0;
    let stargleamReward = 0;

    if (roll <= 99) {
      const coinAmountRoll = Math.random() * 100;
      if (coinAmountRoll <= 70) coinsReward = 3;
      else if (coinAmountRoll <= 95) coinsReward = 5;
      else coinsReward = 25;
    } else {
      const stargleamAmountRoll = Math.random() * 100;
      if (stargleamAmountRoll <= 80) stargleamReward = 1;
      else if (stargleamAmountRoll <= 95) stargleamReward = 3;
      else stargleamReward = 5;
    }

    return { coinsReward, stargleamReward };
  };

  return { getRandomReward };
}
