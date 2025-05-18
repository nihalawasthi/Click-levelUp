"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import BackGround from "../../components/background"
import { ChevronUp, ChevronDown, Zap, Clock, Award, Target, Cpu, BarChart } from "lucide-react"
import ClickEffect from "../../components/ClickEffect"
import { useNavigate } from "react-router-dom"

// Game constants
const RANKS = ["F", "E", "D", "C", "B", "A", "S"]
const XP_PER_RANK = [0, 1000, 5000, 20000, 100000, 500000, 2000000]

export default function GamePage() {
  const navigate = useNavigate()
  const [xp, setXp] = useState<number>(0)
  const [clickPower, setClickPower] = useState<number>(1)
  const [autoPower, setAutoPower] = useState<number>(0)
  const [multiplier, setMultiplier] = useState<number>(1)
  const [rank, setRank] = useState<string>("F")
  const [level, setLevel] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<string>("click")
  const [clickEffects, setClickEffects] = useState<{ x: number; y: number; value: number }[]>([])
  const [showUpgrades, setShowUpgrades] = useState<boolean>(true)
  const [lastSaved, setLastSaved] = useState<string>("")
  const [notifications, setNotifications] = useState<{ message: string; type: string }[]>([])

  const clickAreaRef = useRef<HTMLDivElement>(null)
  const username = localStorage.getItem("username") || "Hunter"

  // Upgrade categories
  const upgrades = {
    click: [
      {
        id: "c1",
        name: "Basic Training",
        description: "Increase click power by 1",
        baseCost: 10,
        costMultiplier: 1.5,
        effect: 1,
        level: 0,
        maxLevel: 10,
      },
      {
        id: "c2",
        name: "Weapon Enhancement",
        description: "Increase click power by 5",
        baseCost: 100,
        costMultiplier: 1.8,
        effect: 5,
        level: 0,
        maxLevel: 10,
      },
      {
        id: "c3",
        name: "Combat Technique",
        description: "Increase click power by 25",
        baseCost: 1000,
        costMultiplier: 2,
        effect: 25,
        level: 0,
        maxLevel: 5,
      },
      {
        id: "c4",
        name: "Special Attack",
        description: "Increase click power by 100",
        baseCost: 10000,
        costMultiplier: 2.5,
        effect: 100,
        level: 0,
        maxLevel: 5,
      },
      {
        id: "c5",
        name: "Ultimate Strike",
        description: "Increase click power by 500",
        baseCost: 100000,
        costMultiplier: 3,
        effect: 500,
        level: 0,
        unlockRank: "B",
        maxLevel: 3,
      },
    ],
    auto: [
      {
        id: "a1",
        name: "Auto Hunter Recruit",
        description: "Generate 0.5 XP per second",
        baseCost: 25,
        costMultiplier: 1.6,
        effect: 0.5,
        level: 0,
        maxLevel: 10,
      },
      {
        id: "a2",
        name: "Hunter Team",
        description: "Generate 2 XP per second",
        baseCost: 250,
        costMultiplier: 1.8,
        effect: 2,
        level: 0,
        maxLevel: 10,
      },
      {
        id: "a3",
        name: "Hunter Guild",
        description: "Generate 10 XP per second",
        baseCost: 2500,
        costMultiplier: 2,
        effect: 10,
        level: 0,
        maxLevel: 5,
      },
      {
        id: "a4",
        name: "Automated System",
        description: "Generate 50 XP per second",
        baseCost: 25000,
        costMultiplier: 2.5,
        effect: 50,
        level: 0,
        unlockRank: "C",
        maxLevel: 5,
      },
      {
        id: "a5",
        name: "AI Hunting Network",
        description: "Generate 250 XP per second",
        baseCost: 250000,
        costMultiplier: 3,
        effect: 250,
        level: 0,
        unlockRank: "A",
        maxLevel: 3,
      },
    ],
    multiplier: [
      {
        id: "m1",
        name: "Aura Enhancement",
        description: "Multiply all XP gains by 1.5",
        baseCost: 50,
        costMultiplier: 2,
        effect: 1.5,
        level: 0,
        maxLevel: 3,
      },
      {
        id: "m2",
        name: "Energy Amplifier",
        description: "Multiply all XP gains by 2",
        baseCost: 500,
        costMultiplier: 2.5,
        effect: 2,
        level: 0,
        maxLevel: 2,
      },
      {
        id: "m3",
        name: "Quantum Accelerator",
        description: "Multiply all XP gains by 3",
        baseCost: 5000,
        costMultiplier: 3,
        effect: 3,
        level: 0,
        unlockRank: "D",
        maxLevel: 1,
      },
      {
        id: "m4",
        name: "Time Distortion",
        description: "Multiply all XP gains by 5",
        baseCost: 50000,
        costMultiplier: 4,
        effect: 5,
        level: 0,
        unlockRank: "B",
        maxLevel: 1,
      },
      {
        id: "m5",
        name: "Reality Bender",
        description: "Multiply all XP gains by 10",
        baseCost: 500000,
        costMultiplier: 5,
        effect: 10,
        level: 0,
        unlockRank: "S",
        maxLevel: 1,
      },
    ],
  }

  const [upgradeState, setUpgradeState] = useState(upgrades)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("hunter_game_state")
    if (saved) {
      try {
        const state = JSON.parse(saved)
        setXp(state.xp || 0)
        setClickPower(state.clickPower || 1)
        setAutoPower(state.autoPower || 0)
        setMultiplier(state.multiplier || 1)
        setRank(state.rank || "F")
        setLevel(state.level || 1)

        if (state.upgradeState) {
          setUpgradeState(state.upgradeState)
        }

        addNotification(`Welcome back, ${username}!`, "info")
      } catch (e) {
        console.error("Error loading saved game:", e)
      }
    }
  }, [])

  // Auto XP logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoPower > 0) {
        const gain = autoPower * multiplier
        setXp((prev) => prev + gain)

        // Randomly show auto gain notification (10% chance)
        if (Math.random() < 0.1) {
          addNotification(`Auto hunters gained +${gain.toFixed(1)} XP`, "auto")
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [autoPower, multiplier])

  // Save to localStorage every 10 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGame()
    }, 10000)
    return () => clearInterval(saveInterval)
  }, [xp, clickPower, autoPower, multiplier, rank, level, upgradeState])

  // Check for rank up
  useEffect(() => {
    const currentRankIndex = RANKS.indexOf(rank)
    if (currentRankIndex < RANKS.length - 1) {
      const nextRankXP = XP_PER_RANK[currentRankIndex + 1]
      if (xp >= nextRankXP) {
        const newRank = RANKS[currentRankIndex + 1]
        setRank(newRank)
        localStorage.setItem("user_rank", newRank)
        addNotification(`RANK UP! You are now ${newRank}-Rank!`, "rankup")
      }
    }
  }, [xp, rank])

  // Clear notifications after 3 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prev) => prev.slice(1))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notifications])

  const saveGame = () => {
    const gameState = {
      xp,
      clickPower,
      autoPower,
      multiplier,
      rank,
      level,
      upgradeState,
    }

    localStorage.setItem("hunter_game_state", JSON.stringify(gameState))
    localStorage.setItem("user_rank", rank)
    localStorage.setItem("level", level.toString())

    const now = new Date()
    setLastSaved(now.toLocaleTimeString())
  }

  const addNotification = (message: string, type: string) => {
    setNotifications((prev) => [...prev, { message, type }])
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickAreaRef.current) return

    const rect = clickAreaRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const gain = clickPower * multiplier
    setXp((prev) => prev + gain)

    // Add click effect
    setClickEffects((prev) => [...prev, { x, y, value: gain }])

    // Remove click effect after animation
    setTimeout(() => {
      setClickEffects((prev) => prev.slice(1))
    }, 1000)
  }

  const calculateUpgradeCost = (upgrade: any) => {
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level))
  }

  const handleUpgrade = (category: string, upgradeId: string) => {
    const upgradeCopy = { ...upgradeState }
    const upgrade = upgradeCopy[category as keyof typeof upgradeCopy].find((u) => u.id === upgradeId)

    if (!upgrade) return

    const cost = calculateUpgradeCost(upgrade)

    if (xp < cost) {
      addNotification("Not enough XP for this upgrade!", "error")
      return
    }

    if (upgrade.level >= upgrade.maxLevel) {
      addNotification("Upgrade already at maximum level!", "error")
      return
    }

    setXp((prev) => prev - cost)
    upgrade.level += 1

    // Apply upgrade effect
    if (category === "click") {
      setClickPower((prev) => prev + upgrade.effect)
      addNotification(`Click power increased by ${upgrade.effect}!`, "upgrade")
    } else if (category === "auto") {
      setAutoPower((prev) => prev + upgrade.effect)
      addNotification(`Auto power increased by ${upgrade.effect}/sec!`, "upgrade")
    } else if (category === "multiplier") {
      setMultiplier((prev) => prev * upgrade.effect)
      addNotification(`XP multiplier increased by ${upgrade.effect}x!`, "upgrade")
    }

    setUpgradeState(upgradeCopy)
  }

  const isUpgradeAvailable = (upgrade: any) => {
    if (upgrade.unlockRank && RANKS.indexOf(rank) < RANKS.indexOf(upgrade.unlockRank)) {
      return false
    }
    return upgrade.level < upgrade.maxLevel
  }

  const canAffordUpgrade = (upgrade: any) => {
    return xp >= calculateUpgradeCost(upgrade)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + "K"
    } else {
      return num.toFixed(1)
    }
  }

  const calculateXpPerSecond = () => {
    return autoPower * multiplier
  }

  const calculateProgress = () => {
    const currentRankIndex = RANKS.indexOf(rank)
    if (currentRankIndex >= RANKS.length - 1) return 100

    const currentRankXP = XP_PER_RANK[currentRankIndex]
    const nextRankXP = XP_PER_RANK[currentRankIndex + 1]

    return ((xp - currentRankXP) / (nextRankXP - currentRankXP)) * 100
  }

  const viewHunterId = () => {
    navigate("/hunterid")
  }

  return (
    <div className="min-h-screen w-[full] bg-[#0a0e17] text-cyan-100 overflow-hidden relative">
      <BackGround />

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={`p-2 rounded shadow-lg ${
                notification.type === "error"
                  ? "bg-red-900/80"
                  : notification.type === "upgrade"
                    ? "bg-purple-900/80"
                    : notification.type === "rankup"
                      ? "bg-yellow-900/80"
                      : notification.type === "auto"
                        ? "bg-blue-900/80"
                        : "bg-cyan-900/80"
              }`}
            >
              {notification.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-wider glitch">
              <span className="text-cyan-300">HUNTER</span> CLICKER
            </h1>
            <p className="text-cyan-400/60">Rise to S-Rank</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-cyan-400/60">Last saved: {lastSaved || "Never"}</p>
              <button onClick={viewHunterId} className="text-sm text-cyan-300 hover:text-cyan-100 underline">
                View Hunter ID
              </button>
            </div>
            <div className="w-12 h-12 rounded-full bg-cyan-900/30 border border-cyan-500/50 flex items-center justify-center">
              <span className="text-xl font-bold">{rank}</span>
            </div>
          </div>
        </header>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Panel */}
          <div className="lg:col-span-1 bg-black/30 border border-cyan-900/50 rounded-lg p-4 h-fit">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BarChart className="w-5 h-5" /> Stats
              </h2>
              <span className="text-sm text-cyan-400/60">Hunter: {username}</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>XP</span>
                  <span>{formatNumber(xp)}</span>
                </div>
                <div className="w-full bg-cyan-950/50 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${calculateProgress()}%` }} />
                </div>
                <div className="flex justify-between text-xs mt-1 text-cyan-400/60">
                  <span>{rank} Rank</span>
                  <span>
                    {RANKS.indexOf(rank) < RANKS.length - 1
                      ? `Next: ${RANKS[RANKS.indexOf(rank) + 1]} (${formatNumber(XP_PER_RANK[RANKS.indexOf(rank) + 1])})`
                      : "Max Rank Achieved!"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-cyan-950/30 p-3 rounded border border-cyan-900/50">
                  <div className="flex items-center gap-2 text-cyan-300 mb-1">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">Click Power</span>
                  </div>
                  <div className="text-xl font-bold">{formatNumber(clickPower)}</div>
                  <div className="text-xs text-cyan-400/60">Per Click</div>
                </div>

                <div className="bg-cyan-950/30 p-3 rounded border border-cyan-900/50">
                  <div className="flex items-center gap-2 text-cyan-300 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Auto Power</span>
                  </div>
                  <div className="text-xl font-bold">{formatNumber(autoPower)}</div>
                  <div className="text-xs text-cyan-400/60">Per Second</div>
                </div>

                <div className="bg-cyan-950/30 p-3 rounded border border-cyan-900/50">
                  <div className="flex items-center gap-2 text-cyan-300 mb-1">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm">Multiplier</span>
                  </div>
                  <div className="text-xl font-bold">x{multiplier.toFixed(2)}</div>
                  <div className="text-xs text-cyan-400/60">All XP Gains</div>
                </div>

                <div className="bg-cyan-950/30 p-3 rounded border border-cyan-900/50">
                  <div className="flex items-center gap-2 text-cyan-300 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">Total XP/sec</span>
                  </div>
                  <div className="text-xl font-bold">{formatNumber(calculateXpPerSecond())}</div>
                  <div className="text-xs text-cyan-400/60">Passive Income</div>
                </div>
              </div>

              <button
                onClick={() => saveGame()}
                className="w-full py-2 bg-cyan-900/50 hover:bg-cyan-800/50 border border-cyan-700/50 rounded transition-colors text-sm"
              >
                Save Game
              </button>
            </div>
          </div>

          {/* Click Area */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <div
              ref={clickAreaRef}
              onClick={handleClick}
              className="w-64 h-64 rounded-full bg-gradient-to-br from-cyan-900/30 to-purple-900/30 border-4 border-cyan-500/30 flex items-center justify-center cursor-pointer relative overflow-hidden hover:from-cyan-800/30 hover:to-purple-800/30 transition-all duration-200 shadow-[0_0_15px_rgba(80,255,255,0.3)]"
            >
              {/* Click effects */}
              {clickEffects.map((effect, index) => (
                <ClickEffect key={index} x={effect.x} y={effect.y} value={effect.value} />
              ))}

              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-300">CLICK</div>
                <div className="text-sm text-cyan-400/80">+{formatNumber(clickPower * multiplier)} XP</div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="text-2xl font-bold">{formatNumber(xp)} XP</div>
              <div className="text-sm text-cyan-400/60">
                {autoPower > 0 ? `+${formatNumber(calculateXpPerSecond())} XP/sec` : "No passive income yet"}
              </div>
            </div>
          </div>

          {/* Upgrades Panel */}
          <div className="lg:col-span-1 bg-black/30 border border-cyan-900/50 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-cyan-900/50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Cpu className="w-5 h-5" /> Upgrades
              </h2>
              <button onClick={() => setShowUpgrades(!showUpgrades)} className="text-cyan-300 hover:text-cyan-100">
                {showUpgrades ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {showUpgrades && (
              <div className="p-4">
                <div className="flex border-b border-cyan-900/50 mb-4">
                  <button
                    onClick={() => setActiveTab("click")}
                    className={`px-4 py-2 text-sm ${activeTab === "click" ? "text-cyan-300 border-b-2 border-cyan-300" : "text-cyan-400/60"}`}
                  >
                    <Target className="w-4 h-4 inline mr-1" /> Click
                  </button>
                  <button
                    onClick={() => setActiveTab("auto")}
                    className={`px-4 py-2 text-sm ${activeTab === "auto" ? "text-cyan-300 border-b-2 border-cyan-300" : "text-cyan-400/60"}`}
                  >
                    <Clock className="w-4 h-4 inline mr-1" /> Auto
                  </button>
                  <button
                    onClick={() => setActiveTab("multiplier")}
                    className={`px-4 py-2 text-sm ${activeTab === "multiplier" ? "text-cyan-300 border-b-2 border-cyan-300" : "text-cyan-400/60"}`}
                  >
                    <Zap className="w-4 h-4 inline mr-1" /> Multiplier
                  </button>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {upgradeState[activeTab as keyof typeof upgradeState].map((upgrade) => (
                    <div
                      key={upgrade.id}
                      className={`p-3 rounded border ${
                        !isUpgradeAvailable(upgrade)
                          ? "bg-gray-900/30 border-gray-800/50"
                          : canAffordUpgrade(upgrade)
                            ? "bg-cyan-950/30 border-cyan-800/50 hover:bg-cyan-900/30 cursor-pointer"
                            : "bg-red-950/30 border-red-900/50"
                      }`}
                      onClick={() => isUpgradeAvailable(upgrade) && handleUpgrade(activeTab, upgrade.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium flex items-center gap-1">
                            {upgrade.name}
                            {upgrade.level >= upgrade.maxLevel && (
                              <span className="text-xs bg-yellow-900/80 text-yellow-300 px-1 rounded">MAX</span>
                            )}
                            {upgrade.unlockRank && RANKS.indexOf(rank) < RANKS.indexOf(upgrade.unlockRank) && (
                              <span className="text-xs bg-purple-900/80 text-purple-300 px-1 rounded">
                                {upgrade.unlockRank} Rank
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-cyan-400/60">{upgrade.description}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm ${canAffordUpgrade(upgrade) ? "text-cyan-300" : "text-red-400"}`}>
                            {formatNumber(calculateUpgradeCost(upgrade))} XP
                          </div>
                          <div className="text-xs text-cyan-400/60">
                            Level: {upgrade.level}/{upgrade.maxLevel}
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      {upgrade.level > 0 && upgrade.level < upgrade.maxLevel && (
                        <div className="w-full bg-cyan-950/50 h-1 rounded-full overflow-hidden mt-2">
                          <div
                            className="h-full bg-cyan-400"
                            style={{ width: `${(upgrade.level / upgrade.maxLevel) * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
