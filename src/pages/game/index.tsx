// /pages/game/index.tsx
"use client";

import { useEffect, useState } from "react";

const upgradesList = [
  { name: "Strength Boost", cost: 10, effect: 1, type: "click" },
  { name: "Auto Hunter", cost: 25, effect: 0.5, type: "auto" },
  { name: "Aura Upgrade", cost: 50, effect: 2, type: "multiplier" },
];

export default function GamePage() {
  const [xp, setXp] = useState<number>(0);
  const [clickPower, setClickPower] = useState<number>(1);
  const [autoPower, setAutoPower] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("hunter_game_state");
    if (saved) {
      const state = JSON.parse(saved);
      setXp(state.xp);
      setClickPower(state.clickPower);
      setAutoPower(state.autoPower);
      setMultiplier(state.multiplier);
    }
  }, []);

  // Auto XP logic
  useEffect(() => {
    const interval = setInterval(() => {
      setXp(prev => prev + autoPower * multiplier);
    }, 1000);
    return () => clearInterval(interval);
  }, [autoPower, multiplier]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("hunter_game_state", JSON.stringify({
      xp,
      clickPower,
      autoPower,
      multiplier
    }));
  }, [xp, clickPower, autoPower, multiplier]);

  const handleClick = () => {
    setXp(prev => prev + clickPower * multiplier);
  };

  const handleUpgrade = (upgrade: any) => {
    if (xp < upgrade.cost) return;
    setXp(prev => prev - upgrade.cost);
    if (upgrade.type === "click") setClickPower(prev => prev + upgrade.effect);
    if (upgrade.type === "auto") setAutoPower(prev => prev + upgrade.effect);
    if (upgrade.type === "multiplier") setMultiplier(prev => prev * upgrade.effect);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">Hunter Clicker: Rise to S-Rank</h1>
      <div className="text-2xl mb-4">XP: {xp.toFixed(1)}</div>
      <button
        onClick={handleClick}
        className="w-40 h-40 bg-red-500 rounded-full text-xl font-bold hover:bg-red-600"
      >
        Click!
      </button>

      <div className="mt-10 w-full max-w-md">
        <h2 className="text-xl mb-4">Upgrades</h2>
        {upgradesList.map((upgrade, index) => (
          <button
            key={index}
            onClick={() => handleUpgrade(upgrade)}
            className="block w-full mb-2 p-3 bg-gray-800 rounded hover:bg-gray-700 text-left"
          >
            {upgrade.name} - Cost: {upgrade.cost} XP
          </button>
        ))}
      </div>
    </div>
  );
}
