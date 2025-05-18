"use client"

import type React from "react"

import { useEffect, useState, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import BackGround from "../../components/background"
import {
  ChevronUp,
  ChevronDown,
  Zap,
  Clock,
  Award,
  Target,
  Cpu,
  BarChart,
  Trophy,
  RotateCcw,
  Sparkles,
  Flame,
  Bolt,
  Rocket,
  Star,
  Settings,
  Volume2,
  VolumeX,
  Info,
  X,
  Layers,
  Maximize,
  Minimize,
} from "lucide-react"
import ClickEffect from "../../components/ClickEffect"
import ParticleBackground from "../../components/ParticleBackground"
import { useNavigate } from "react-router-dom"
import useSound from "../../hooks/useSound"

// Game constants
const RANKS = ["F", "E", "D", "C", "B", "A", "S", "S+", "SS", "SSS"]
const XP_PER_RANK = [0, 1000, 5000, 20000, 100000, 500000, 2000000, 10000000, 50000000, 200000000]
const RANK_COLORS = {
  F: "text-gray-400",
  E: "text-green-400",
  D: "text-blue-400",
  C: "text-purple-400",
  B: "text-yellow-400",
  A: "text-orange-400",
  S: "text-red-400",
  "S+": "text-pink-400",
  SS: "text-cyan-400",
  SSS: "text-white",
}

// Achievement definitions
const ACHIEVEMENTS = [
  {
    id: "click_1",
    name: "First Strike",
    description: "Click the button for the first time",
    requirement: "clicks",
    value: 1,
    reward: 10,
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: "click_100",
    name: "Click Enthusiast",
    description: "Click 100 times",
    requirement: "clicks",
    value: 100,
    reward: 100,
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: "click_1000",
    name: "Click Master",
    description: "Click 1,000 times",
    requirement: "clicks",
    value: 1000,
    reward: 1000,
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: "click_10000",
    name: "Click God",
    description: "Click 10,000 times",
    requirement: "clicks",
    value: 10000,
    reward: 10000,
    icon: <Target className="w-5 h-5" />,
  },
  {
    id: "xp_1000",
    name: "XP Collector",
    description: "Reach 1,000 total XP",
    requirement: "totalXp",
    value: 1000,
    reward: 100,
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "xp_10000",
    name: "XP Hoarder",
    description: "Reach 10,000 total XP",
    requirement: "totalXp",
    value: 10000,
    reward: 500,
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "xp_100000",
    name: "XP Tycoon",
    description: "Reach 100,000 total XP",
    requirement: "totalXp",
    value: 100000,
    reward: 2000,
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "xp_1000000",
    name: "XP Millionaire",
    description: "Reach 1,000,000 total XP",
    requirement: "totalXp",
    value: 1000000,
    reward: 10000,
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "rank_e",
    name: "E-Rank Hunter",
    description: "Reach E-Rank",
    requirement: "rank",
    value: "E",
    reward: 200,
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "rank_d",
    name: "D-Rank Hunter",
    description: "Reach D-Rank",
    requirement: "rank",
    value: "D",
    reward: 500,
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "rank_c",
    name: "C-Rank Hunter",
    description: "Reach C-Rank",
    requirement: "rank",
    value: "C",
    reward: 1000,
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "rank_b",
    name: "B-Rank Hunter",
    description: "Reach B-Rank",
    requirement: "rank",
    value: "B",
    reward: 2000,
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "rank_a",
    name: "A-Rank Hunter",
    description: "Reach A-Rank",
    requirement: "rank",
    value: "A",
    reward: 5000,
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "rank_s",
    name: "S-Rank Hunter",
    description: "Reach S-Rank",
    requirement: "rank",
    value: "S",
    reward: 10000,
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "rank_ss",
    name: "SS-Rank Hunter",
    description: "Reach SS-Rank",
    requirement: "rank",
    value: "SS",
    reward: 50000,
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "rank_sss",
    name: "SSS-Rank Hunter",
    description: "Reach SSS-Rank",
    requirement: "rank",
    value: "SSS",
    reward: 100000,
    icon: <Award className="w-5 h-5" />,
  },
  {
    id: "upgrade_10",
    name: "Upgrade Novice",
    description: "Purchase 10 upgrades",
    requirement: "totalUpgrades",
    value: 10,
    reward: 500,
    icon: <Cpu className="w-5 h-5" />,
  },
  {
    id: "upgrade_25",
    name: "Upgrade Adept",
    description: "Purchase 25 upgrades",
    requirement: "totalUpgrades",
    value: 25,
    reward: 1000,
    icon: <Cpu className="w-5 h-5" />,
  },
  {
    id: "upgrade_50",
    name: "Upgrade Expert",
    description: "Purchase 50 upgrades",
    requirement: "totalUpgrades",
    value: 50,
    reward: 2500,
    icon: <Cpu className="w-5 h-5" />,
  },
  {
    id: "upgrade_100",
    name: "Upgrade Master",
    description: "Purchase 100 upgrades",
    requirement: "totalUpgrades",
    value: 100,
    reward: 5000,
    icon: <Cpu className="w-5 h-5" />,
  },
  {
    id: "prestige_1",
    name: "Reborn",
    description: "Prestige for the first time",
    requirement: "prestiges",
    value: 1,
    reward: 1000,
    icon: <RotateCcw className="w-5 h-5" />,
  },
  {
    id: "prestige_5",
    name: "Cycle of Rebirth",
    description: "Prestige 5 times",
    requirement: "prestiges",
    value: 5,
    reward: 5000,
    icon: <RotateCcw className="w-5 h-5" />,
  },
  {
    id: "prestige_10",
    name: "Master of Cycles",
    description: "Prestige 10 times",
    requirement: "prestiges",
    value: 10,
    reward: 10000,
    icon: <RotateCcw className="w-5 h-5" />,
  },
  {
    id: "critical_10",
    name: "Lucky Strike",
    description: "Get 10 critical clicks",
    requirement: "criticalClicks",
    value: 10,
    reward: 500,
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: "critical_100",
    name: "Fortune's Favorite",
    description: "Get 100 critical clicks",
    requirement: "criticalClicks",
    value: 100,
    reward: 2000,
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: "ability_10",
    name: "Ability User",
    description: "Use abilities 10 times",
    requirement: "abilitiesUsed",
    value: 10,
    reward: 500,
    icon: <Flame className="w-5 h-5" />,
  },
  {
    id: "ability_50",
    name: "Ability Master",
    description: "Use abilities 50 times",
    requirement: "abilitiesUsed",
    value: 50,
    reward: 2000,
    icon: <Flame className="w-5 h-5" />,
  },
  {
    id: "offline_1h",
    name: "Time Traveler",
    description: "Collect 1 hour of offline progress",
    requirement: "offlineTime",
    value: 3600,
    reward: 1000,
    icon: <Clock className="w-5 h-5" />,
  },
  {
    id: "offline_24h",
    name: "Chronos",
    description: "Collect 24 hours of offline progress",
    requirement: "offlineTime",
    value: 86400,
    reward: 10000,
    icon: <Clock className="w-5 h-5" />,
  },
]

// Special abilities
const ABILITIES = [
  {
    id: "frenzy",
    name: "Click Frenzy",
    description: "Double click power for 30 seconds",
    cooldown: 120,
    duration: 30,
    cost: 1000,
    unlockRank: "E",
    icon: <Bolt className="w-5 h-5" />,
    effect: (state: any) => ({
      ...state,
      tempClickMultiplier: state.tempClickMultiplier * 2,
    }),
  },
  {
    id: "goldRush",
    name: "Gold Rush",
    description: "Triple XP gains for 20 seconds",
    cooldown: 180,
    duration: 20,
    cost: 2500,
    unlockRank: "D",
    icon: <Sparkles className="w-5 h-5" />,
    effect: (state: any) => ({
      ...state,
      tempMultiplier: state.tempMultiplier * 3,
    }),
  },
  {
    id: "autoBoost",
    name: "Auto Boost",
    description: "Double auto power for 60 seconds",
    cooldown: 240,
    duration: 60,
    cost: 5000,
    unlockRank: "C",
    icon: <Rocket className="w-5 h-5" />,
    effect: (state: any) => ({
      ...state,
      tempAutoMultiplier: state.tempAutoMultiplier * 2,
    }),
  },
  {
    id: "criticalMass",
    name: "Critical Mass",
    description: "100% critical chance for 15 seconds",
    cooldown: 300,
    duration: 15,
    cost: 10000,
    unlockRank: "B",
    icon: <Flame className="w-5 h-5" />,
    effect: (state: any) => ({
      ...state,
      criticalChance: 100,
    }),
  },
  {
    id: "timeWarp",
    name: "Time Warp",
    description: "Instantly gain 2 minutes of production",
    cooldown: 360,
    duration: 0,
    cost: 25000,
    unlockRank: "A",
    icon: <Clock className="w-5 h-5" />,
    effect: (state: any) => {
      const xpGain = state.autoPower * state.multiplier * state.tempMultiplier * state.tempAutoMultiplier * 120
      return {
        ...state,
        xp: state.xp + xpGain,
        totalXp: state.totalXp + xpGain,
      }
    },
  },
]

// Prestige rewards
const calculatePrestigeRewards = (totalXp: number) => {
  const prestigePoints = Math.floor(Math.sqrt(totalXp / 10000))
  const prestigeMultiplier = 1 + prestigePoints * 0.1
  return { prestigePoints, prestigeMultiplier }
}

export default function GamePage() {
  const navigate = useNavigate()
  const [xp, setXp] = useState<number>(0)
  const [totalXp, setTotalXp] = useState<number>(0)
  const [clickPower, setClickPower] = useState<number>(1)
  const [autoPower, setAutoPower] = useState<number>(0)
  const [multiplier, setMultiplier] = useState<number>(1)
  const [rank, setRank] = useState<string>("F")
  const [level, setLevel] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<string>("click")
  const [clickEffects, setClickEffects] = useState<{ x: number; y: number; value: number; isCritical: boolean }[]>([])
  const [showUpgrades, setShowUpgrades] = useState<boolean>(true)
  const [lastSaved, setLastSaved] = useState<string>("")
  const [notifications, setNotifications] = useState<{ message: string; type: string }[]>([])
  const [activePanel, setActivePanel] = useState<string>("game")
  const [achievements, setAchievements] = useState<{ [key: string]: boolean }>({})
  const [stats, setStats] = useState<{
    clicks: number
    totalUpgrades: number
    criticalClicks: number
    abilitiesUsed: number
    offlineTime: number
    prestiges: number
  }>({
    clicks: 0,
    totalUpgrades: 0,
    criticalClicks: 0,
    abilitiesUsed: 0,
    offlineTime: 0,
    prestiges: 0,
  })
  const [prestigePoints, setPrestigePoints] = useState<number>(0)
  const [prestigeMultiplier, setPrestigeMultiplier] = useState<number>(1)
  const [showPrestigeConfirm, setShowPrestigeConfirm] = useState<boolean>(false)
  const [criticalChance, setCriticalChance] = useState<number>(5) // 5% base critical chance
  const [criticalMultiplier, setCriticalMultiplier] = useState<number>(5) // 5x damage on critical
  const [activeAbilities, setActiveAbilities] = useState<{ [key: string]: { endTime: number } }>({})
  const [abilityCooldowns, setAbilityCooldowns] = useState<{ [key: string]: number }>({})
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true)
  const [showTutorial, setShowTutorial] = useState<boolean>(false)
  const [tutorialStep, setTutorialStep] = useState<number>(0)
  const [tempClickMultiplier, setTempClickMultiplier] = useState<number>(1)
  const [tempMultiplier, setTempMultiplier] = useState<number>(1)
  const [tempAutoMultiplier, setTempAutoMultiplier] = useState<number>(1)
  const [lastOnlineTime, setLastOnlineTime] = useState<number>(Date.now())
  const [showOfflineProgress, setShowOfflineProgress] = useState<boolean>(false)
  const [offlineXpGained, setOfflineXpGained] = useState<number>(0)
  const [offlineTimeAway, setOfflineTimeAway] = useState<number>(0)
  const [fullscreen, setFullscreen] = useState<boolean>(false)

  const clickAreaRef = useRef<HTMLDivElement>(null)
  const username = localStorage.getItem("username") || "Hunter"

  // Sound effects
  const { playSound } = useSound({
    enabled: soundEnabled,
    sounds: {
      click: "/sounds/click.mp3",
      upgrade: "/sounds/upgrade.mp3",
      achievement: "/sounds/achievement.mp3",
      rankUp: "/sounds/rank-up.mp3",
      ability: "/sounds/ability.mp3",
      critical: "/sounds/critical.mp3",
      prestige: "/sounds/prestige.mp3",
    },
  })

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
        maxLevel: 20,
      },
      {
        id: "c2",
        name: "Weapon Enhancement",
        description: "Increase click power by 5",
        baseCost: 100,
        costMultiplier: 1.8,
        effect: 5,
        level: 0,
        maxLevel: 15,
      },
      {
        id: "c3",
        name: "Combat Technique",
        description: "Increase click power by 25",
        baseCost: 1000,
        costMultiplier: 2,
        effect: 25,
        level: 0,
        maxLevel: 10,
      },
      {
        id: "c4",
        name: "Special Attack",
        description: "Increase click power by 100",
        baseCost: 10000,
        costMultiplier: 2.5,
        effect: 100,
        level: 0,
        maxLevel: 10,
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
        maxLevel: 5,
      },
      {
        id: "c6",
        name: "Critical Training",
        description: "Increase critical chance by 1%",
        baseCost: 5000,
        costMultiplier: 2,
        effect: 1,
        level: 0,
        maxLevel: 20,
        unlockRank: "D",
        special: "criticalChance",
      },
      {
        id: "c7",
        name: "Critical Power",
        description: "Increase critical multiplier by 0.5x",
        baseCost: 15000,
        costMultiplier: 2.5,
        effect: 0.5,
        level: 0,
        maxLevel: 10,
        unlockRank: "C",
        special: "criticalMultiplier",
      },
      {
        id: "c8",
        name: "Legendary Weapon",
        description: "Increase click power by 2,500",
        baseCost: 1000000,
        costMultiplier: 3.5,
        effect: 2500,
        level: 0,
        maxLevel: 5,
        unlockRank: "S",
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
        maxLevel: 20,
      },
      {
        id: "a2",
        name: "Hunter Team",
        description: "Generate 2 XP per second",
        baseCost: 250,
        costMultiplier: 1.8,
        effect: 2,
        level: 0,
        maxLevel: 15,
      },
      {
        id: "a3",
        name: "Hunter Guild",
        description: "Generate 10 XP per second",
        baseCost: 2500,
        costMultiplier: 2,
        effect: 10,
        level: 0,
        maxLevel: 10,
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
        maxLevel: 10,
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
        maxLevel: 5,
      },
      {
        id: "a6",
        name: "Quantum Hunters",
        description: "Generate 1,000 XP per second",
        baseCost: 2500000,
        costMultiplier: 3.5,
        effect: 1000,
        level: 0,
        unlockRank: "S",
        maxLevel: 5,
      },
      {
        id: "a7",
        name: "Dimensional Harvesters",
        description: "Generate 5,000 XP per second",
        baseCost: 25000000,
        costMultiplier: 4,
        effect: 5000,
        level: 0,
        unlockRank: "SS",
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
      {
        id: "m6",
        name: "Cosmic Amplification",
        description: "Multiply all XP gains by 25",
        baseCost: 5000000,
        costMultiplier: 10,
        effect: 25,
        level: 0,
        unlockRank: "SS",
        maxLevel: 1,
      },
    ],
    prestige: [
      {
        id: "p1",
        name: "Prestige Power",
        description: "Increase base click power by 1",
        baseCost: 1,
        costMultiplier: 1.5,
        effect: 1,
        level: 0,
        maxLevel: 50,
        currency: "prestige",
        special: "baseClickPower",
      },
      {
        id: "p2",
        name: "Prestige Auto",
        description: "Increase base auto power by 0.5",
        baseCost: 1,
        costMultiplier: 1.5,
        effect: 0.5,
        level: 0,
        maxLevel: 50,
        currency: "prestige",
        special: "baseAutoPower",
      },
      {
        id: "p3",
        name: "Prestige Efficiency",
        description: "Reduce upgrade costs by 5%",
        baseCost: 2,
        costMultiplier: 2,
        effect: 0.05,
        level: 0,
        maxLevel: 10,
        currency: "prestige",
        special: "costReduction",
      },
      {
        id: "p4",
        name: "Prestige Critical",
        description: "Increase base critical chance by 1%",
        baseCost: 3,
        costMultiplier: 2,
        effect: 1,
        level: 0,
        maxLevel: 15,
        currency: "prestige",
        special: "baseCriticalChance",
      },
      {
        id: "p5",
        name: "Prestige Offline",
        description: "Increase offline progress efficiency by 10%",
        baseCost: 3,
        costMultiplier: 1.5,
        effect: 0.1,
        level: 0,
        maxLevel: 10,
        currency: "prestige",
        special: "offlineEfficiency",
      },
    ],
  }

  const [upgradeState, setUpgradeState] = useState(upgrades)
  const [baseClickPower, setBaseClickPower] = useState<number>(1)
  const [baseAutoPower, setBaseAutoPower] = useState<number>(0)
  const [baseCriticalChance, setBaseCriticalChance] = useState<number>(5)
  const [costReduction, setCostReduction] = useState<number>(0)
  const [offlineEfficiency, setOfflineEfficiency] = useState<number>(0.5) // 50% base offline efficiency

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Hunter Clicker!",
      content:
        "This game is all about clicking to gain XP and becoming the strongest hunter. Let me guide you through the basics.",
      target: null,
    },
    {
      title: "Click to Gain XP",
      content:
        "Click the big circular button in the center to gain XP. Each click gives you XP based on your click power.",
      target: "click-area",
    },
    {
      title: "Upgrade Your Hunter",
      content:
        "Use your XP to purchase upgrades. There are different categories of upgrades that enhance different aspects of your hunter.",
      target: "upgrades-panel",
    },
    {
      title: "Auto Hunters",
      content:
        "Auto hunters generate XP automatically over time. Purchase auto upgrades to increase your passive income.",
      target: "auto-tab",
    },
    {
      title: "Multipliers",
      content: "Multipliers increase all your XP gains. They're expensive but provide a huge boost to your progress.",
      target: "multiplier-tab",
    },
    {
      title: "Special Abilities",
      content: "As you rank up, you'll unlock special abilities that provide temporary boosts. Use them strategically!",
      target: "abilities-panel",
    },
    {
      title: "Prestige System",
      content: "Once you've progressed far enough, you can prestige to reset your progress but gain permanent bonuses.",
      target: "prestige-panel",
    },
    {
      title: "Achievements",
      content: "Complete achievements to earn bonus XP and track your progress.",
      target: "achievements-panel",
    },
    {
      title: "You're Ready!",
      content: "That's all you need to know to get started. Happy clicking and good luck on your journey to SSS-Rank!",
      target: null,
    },
  ]

  // Calculate effective values with all multipliers
  const effectiveClickPower = useMemo(() => {
    return clickPower * multiplier * tempClickMultiplier * prestigeMultiplier
  }, [clickPower, multiplier, tempClickMultiplier, prestigeMultiplier])

  const effectiveAutoPower = useMemo(() => {
    return autoPower * multiplier * tempMultiplier * tempAutoMultiplier * prestigeMultiplier
  }, [autoPower, multiplier, tempMultiplier, tempAutoMultiplier, prestigeMultiplier])

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("hunter_game_state")
    if (saved) {
      try {
        const state = JSON.parse(saved)
        setXp(state.xp || 0)
        setTotalXp(state.totalXp || state.xp || 0)
        setClickPower(state.clickPower || 1)
        setAutoPower(state.autoPower || 0)
        setMultiplier(state.multiplier || 1)
        setRank(state.rank || "F")
        setLevel(state.level || 1)
        setAchievements(state.achievements || {})
        setStats(
          state.stats || {
            clicks: 0,
            totalUpgrades: 0,
            criticalClicks: 0,
            abilitiesUsed: 0,
            offlineTime: 0,
            prestiges: 0,
          },
        )
        setPrestigePoints(state.prestigePoints || 0)
        setPrestigeMultiplier(state.prestigeMultiplier || 1)
        setCriticalChance(state.criticalChance || 5)
        setCriticalMultiplier(state.criticalMultiplier || 5)
        setBaseClickPower(state.baseClickPower || 1)
        setBaseAutoPower(state.baseAutoPower || 0)
        setBaseCriticalChance(state.baseCriticalChance || 5)
        setCostReduction(state.costReduction || 0)
        setOfflineEfficiency(state.offlineEfficiency || 0.5)
        setSoundEnabled(state.soundEnabled !== undefined ? state.soundEnabled : true)
        setLastOnlineTime(state.lastOnlineTime || Date.now())

        if (state.upgradeState) {
          setUpgradeState(state.upgradeState)
        }

        // Check for offline progress
        const currentTime = Date.now()
        const lastTime = state.lastOnlineTime || currentTime
        const timeAway = Math.floor((currentTime - lastTime) / 1000) // seconds

        if (timeAway > 60 && state.autoPower > 0) {
          // Only if away for more than 1 minute and has auto power
          const maxOfflineTime = 24 * 60 * 60 // 24 hours in seconds
          const cappedTimeAway = Math.min(timeAway, maxOfflineTime)
          const efficiency = state.offlineEfficiency || 0.5
          const xpGained = Math.floor(
            state.autoPower * state.multiplier * state.prestigeMultiplier * cappedTimeAway * efficiency,
          )

          setOfflineXpGained(xpGained)
          setOfflineTimeAway(cappedTimeAway)
          setShowOfflineProgress(true)

          // Update stats for offline time achievement
          setStats((prev) => ({
            ...prev,
            offlineTime: (prev.offlineTime || 0) + cappedTimeAway,
          }))
        } else {
          addNotification(`Welcome back, ${username}!`, "info")
        }
      } catch (e) {
        console.error("Error loading saved game:", e)
      }
    } else {
      // First time playing, show tutorial
      setShowTutorial(true)
    }
  }, [])

  // Auto XP logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoPower > 0) {
        const gain = effectiveAutoPower
        setXp((prev) => prev + gain)
        setTotalXp((prev) => prev + gain)

        // Randomly show auto gain notification (5% chance)
        if (Math.random() < 0.05) {
          addNotification(`Auto hunters gained +${formatNumber(gain)} XP`, "auto")
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [autoPower, multiplier, tempMultiplier, tempAutoMultiplier, prestigeMultiplier])

  // Save to localStorage every 10 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGame()
    }, 10000)
    return () => clearInterval(saveInterval)
  }, [
    xp,
    totalXp,
    clickPower,
    autoPower,
    multiplier,
    rank,
    level,
    upgradeState,
    achievements,
    stats,
    prestigePoints,
    prestigeMultiplier,
    criticalChance,
    criticalMultiplier,
    baseClickPower,
    baseAutoPower,
    baseCriticalChance,
    costReduction,
    offlineEfficiency,
    soundEnabled,
  ])

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
        playSound("rankUp")
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

  // Check for achievements
  useEffect(() => {
    ACHIEVEMENTS.forEach((achievement) => {
      // Skip if already achieved
      if (achievements[achievement.id]) return

      let achieved = false

      // Check if requirement is met
      if (achievement.requirement === "clicks" && stats.clicks >= achievement.value) {
        achieved = true
      } else if (achievement.requirement === "totalXp" && totalXp >= achievement.value) {
        achieved = true
      } else if (achievement.requirement === "rank" && RANKS.indexOf(rank) >= RANKS.indexOf(achievement.value)) {
        achieved = true
      } else if (achievement.requirement === "totalUpgrades" && stats.totalUpgrades >= achievement.value) {
        achieved = true
      } else if (achievement.requirement === "prestiges" && stats.prestiges >= achievement.value) {
        achieved = true
      } else if (achievement.requirement === "criticalClicks" && stats.criticalClicks >= achievement.value) {
        achieved = true
      } else if (achievement.requirement === "abilitiesUsed" && stats.abilitiesUsed >= achievement.value) {
        achieved = true
      } else if (achievement.requirement === "offlineTime" && stats.offlineTime >= achievement.value) {
        achieved = true
      }

      if (achieved) {
        // Update achievements state
        setAchievements((prev) => ({
          ...prev,
          [achievement.id]: true,
        }))

        // Add XP reward
        setXp((prev) => prev + achievement.reward)
        setTotalXp((prev) => prev + achievement.reward)

        // Show notification
        addNotification(`Achievement Unlocked: ${achievement.name}! +${achievement.reward} XP`, "achievement")
        playSound("achievement")
      }
    })
  }, [stats, rank, totalXp, achievements])

  // Handle ability cooldowns and active abilities
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()

      // Update cooldowns
      setAbilityCooldowns((prev) => {
        const newCooldowns = { ...prev }
        Object.keys(newCooldowns).forEach((abilityId) => {
          if (newCooldowns[abilityId] > 0) {
            newCooldowns[abilityId] -= 1
          }
        })
        return newCooldowns
      })

      // Check active abilities
      setActiveAbilities((prev) => {
        const newActiveAbilities = { ...prev }
        let changed = false

        Object.entries(newActiveAbilities).forEach(([abilityId, data]) => {
          if (now >= data.endTime) {
            delete newActiveAbilities[abilityId]
            changed = true

            // Reset temporary multipliers when ability expires
            const ability = ABILITIES.find((a) => a.id === abilityId)
            if (ability) {
              if (abilityId === "frenzy") {
                setTempClickMultiplier(1)
                addNotification(`${ability.name} has expired!`, "ability")
              } else if (abilityId === "goldRush") {
                setTempMultiplier(1)
                addNotification(`${ability.name} has expired!`, "ability")
              } else if (abilityId === "autoBoost") {
                setTempAutoMultiplier(1)
                addNotification(`${ability.name} has expired!`, "ability")
              } else if (abilityId === "criticalMass") {
                setCriticalChance(
                  baseCriticalChance +
                    upgradeState.click.find((u) => u.id === "c6")?.level *
                      upgradeState.click.find((u) => u.id === "c6")?.effect || 0,
                )
                addNotification(`${ability.name} has expired!`, "ability")
              }
            }
          }
        })

        return changed ? newActiveAbilities : prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [upgradeState, baseCriticalChance])

  // Toggle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const saveGame = () => {
    const gameState = {
      xp,
      totalXp,
      clickPower,
      autoPower,
      multiplier,
      rank,
      level,
      upgradeState,
      achievements,
      stats,
      prestigePoints,
      prestigeMultiplier,
      criticalChance,
      criticalMultiplier,
      baseClickPower,
      baseAutoPower,
      baseCriticalChance,
      costReduction,
      offlineEfficiency,
      soundEnabled,
      lastOnlineTime: Date.now(),
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

    // Update click stats
    setStats((prev) => ({
      ...prev,
      clicks: prev.clicks + 1,
    }))

    // Check for critical hit
    const isCritical = Math.random() * 100 < criticalChance
    const criticalMult = isCritical ? criticalMultiplier : 1

    if (isCritical) {
      setStats((prev) => ({
        ...prev,
        criticalClicks: prev.criticalClicks + 1,
      }))
      playSound("critical")
    } else {
      playSound("click")
    }

    const gain = effectiveClickPower * criticalMult
    setXp((prev) => prev + gain)
    setTotalXp((prev) => prev + gain)

    // Add click effect
    setClickEffects((prev) => [...prev, { x, y, value: gain, isCritical }])

    // Remove click effect after animation
    setTimeout(() => {
      setClickEffects((prev) => prev.slice(1))
    }, 1000)
  }

  const calculateUpgradeCost = (upgrade: any) => {
    const baseCost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level))
    // Apply cost reduction if it's not a prestige upgrade
    if (upgrade.currency !== "prestige") {
      return Math.floor(baseCost * (1 - costReduction))
    }
    return baseCost
  }

  const handleUpgrade = (category: string, upgradeId: string) => {
    const upgradeCopy = { ...upgradeState }
    const upgrade = upgradeCopy[category as keyof typeof upgradeCopy].find((u) => u.id === upgradeId)

    if (!upgrade) return

    const cost = calculateUpgradeCost(upgrade)
    const currency = upgrade.currency === "prestige" ? prestigePoints : xp

    if (currency < cost) {
      addNotification(
        `Not enough ${upgrade.currency === "prestige" ? "Prestige Points" : "XP"} for this upgrade!`,
        "error",
      )
      return
    }

    if (upgrade.level >= upgrade.maxLevel) {
      addNotification("Upgrade already at maximum level!", "error")
      return
    }

    // Deduct cost
    if (upgrade.currency === "prestige") {
      setPrestigePoints((prev) => prev - cost)
    } else {
      setXp((prev) => prev - cost)
    }

    upgrade.level += 1

    // Update total upgrades stat
    setStats((prev) => ({
      ...prev,
      totalUpgrades: prev.totalUpgrades + 1,
    }))

    // Apply upgrade effect
    if (category === "click") {
      if (upgrade.special === "criticalChance") {
        setCriticalChance((prev) => prev + upgrade.effect)
      } else if (upgrade.special === "criticalMultiplier") {
        setCriticalMultiplier((prev) => prev + upgrade.effect)
      } else {
        setClickPower((prev) => prev + upgrade.effect)
      }
      addNotification(`Click upgrade purchased!`, "upgrade")
    } else if (category === "auto") {
      setAutoPower((prev) => prev + upgrade.effect)
      addNotification(`Auto upgrade purchased!`, "upgrade")
    } else if (category === "multiplier") {
      setMultiplier((prev) => prev * upgrade.effect)
      addNotification(`Multiplier upgrade purchased!`, "upgrade")
    } else if (category === "prestige") {
      if (upgrade.special === "baseClickPower") {
        setBaseClickPower((prev) => prev + upgrade.effect)
        setClickPower((prev) => prev + upgrade.effect)
      } else if (upgrade.special === "baseAutoPower") {
        setBaseAutoPower((prev) => prev + upgrade.effect)
        setAutoPower((prev) => prev + upgrade.effect)
      } else if (upgrade.special === "costReduction") {
        setCostReduction((prev) => prev + upgrade.effect)
      } else if (upgrade.special === "baseCriticalChance") {
        setBaseCriticalChance((prev) => prev + upgrade.effect)
        setCriticalChance((prev) => prev + upgrade.effect)
      } else if (upgrade.special === "offlineEfficiency") {
        setOfflineEfficiency((prev) => Math.min(prev + upgrade.effect, 1))
      }
      addNotification(`Prestige upgrade purchased!`, "upgrade")
    }

    setUpgradeState(upgradeCopy)
    playSound("upgrade")
  }

  const handleUseAbility = (abilityId: string) => {
    const ability = ABILITIES.find((a) => a.id === abilityId)
    if (!ability) return

    // Check if on cooldown
    if (abilityCooldowns[abilityId] > 0) {
      addNotification(`${ability.name} is still on cooldown!`, "error")
      return
    }

    // Check if enough XP
    if (xp < ability.cost) {
      addNotification(`Not enough XP to use ${ability.name}!`, "error")
      return
    }

    // Check if rank requirement met
    if (ability.unlockRank && RANKS.indexOf(rank) < RANKS.indexOf(ability.unlockRank)) {
      addNotification(`${ability.name} requires ${ability.unlockRank}-Rank!`, "error")
      return
    }

    // Deduct cost
    setXp((prev) => prev - ability.cost)

    // Update stats
    setStats((prev) => ({
      ...prev,
      abilitiesUsed: prev.abilitiesUsed + 1,
    }))

    // Set cooldown
    setAbilityCooldowns((prev) => ({
      ...prev,
      [abilityId]: ability.cooldown,
    }))

    // Apply ability effect
    if (ability.duration > 0) {
      // For duration-based abilities
      setActiveAbilities((prev) => ({
        ...prev,
        [abilityId]: {
          endTime: Date.now() + ability.duration * 1000,
        },
      }))

      // Apply temporary effects
      if (abilityId === "frenzy") {
        setTempClickMultiplier(2)
      } else if (abilityId === "goldRush") {
        setTempMultiplier(3)
      } else if (abilityId === "autoBoost") {
        setTempAutoMultiplier(2)
      } else if (abilityId === "criticalMass") {
        setCriticalChance(100)
      }

      addNotification(`${ability.name} activated for ${ability.duration} seconds!`, "ability")
    } else {
      // For instant abilities
      if (abilityId === "timeWarp") {
        const xpGain = effectiveAutoPower * 120 // 2 minutes of production
        setXp((prev) => prev + xpGain)
        setTotalXp((prev) => prev + xpGain)
        addNotification(`Time Warp gained ${formatNumber(xpGain)} XP!`, "ability")
      }
    }

    playSound("ability")
  }

  const handlePrestige = () => {
    // Calculate prestige rewards
    const { prestigePoints: newPoints, prestigeMultiplier: newMultiplier } = calculatePrestigeRewards(totalXp)

    if (newPoints <= prestigePoints) {
      addNotification("You need more XP to gain prestige points!", "error")
      setShowPrestigeConfirm(false)
      return
    }

    // Update stats
    setStats((prev) => ({
      ...prev,
      prestiges: prev.prestiges + 1,
    }))

    // Reset progress but keep prestige upgrades
    setXp(0)
    setClickPower(baseClickPower)
    setAutoPower(baseAutoPower)
    setMultiplier(1)
    setRank("F")
    setLevel(1)

    // Reset regular upgrades
    const resetUpgrades = { ...upgradeState }
    Object.keys(resetUpgrades).forEach((category) => {
      if (category !== "prestige") {
        resetUpgrades[category as keyof typeof resetUpgrades].forEach((upgrade) => {
          upgrade.level = 0
        })
      }
    })

    // Set new prestige values
    setPrestigePoints(newPoints)
    setPrestigeMultiplier(newMultiplier)
    setUpgradeState(resetUpgrades)

    // Reset temporary multipliers
    setTempClickMultiplier(1)
    setTempMultiplier(1)
    setTempAutoMultiplier(1)

    // Reset active abilities and cooldowns
    setActiveAbilities({})
    setAbilityCooldowns({})

    // Show notification
    addNotification(
      `Prestige complete! You now have ${newPoints} Prestige Points and a ${newMultiplier.toFixed(1)}x multiplier!`,
      "prestige",
    )
    setShowPrestigeConfirm(false)

    // Play sound
    playSound("prestige")

    // Save game
    localStorage.setItem("user_rank", "F")
    saveGame()
  }

  const collectOfflineProgress = () => {
    setXp((prev) => prev + offlineXpGained)
    setTotalXp((prev) => prev + offlineXpGained)
    setShowOfflineProgress(false)
    addNotification(`Collected ${formatNumber(offlineXpGained)} XP from offline progress!`, "auto")
  }

  const isUpgradeAvailable = (upgrade: any) => {
    if (upgrade.unlockRank && RANKS.indexOf(rank) < RANKS.indexOf(upgrade.unlockRank)) {
      return false
    }
    return upgrade.level < upgrade.maxLevel
  }

  const canAffordUpgrade = (upgrade: any) => {
    const cost = calculateUpgradeCost(upgrade)
    return upgrade.currency === "prestige" ? prestigePoints >= cost : xp >= cost
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + "B"
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + "K"
    } else {
      return num.toFixed(1)
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${minutes}m ${secs}s`
    } else {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return `${hours}h ${minutes}m`
    }
  }

  const calculateXpPerSecond = () => {
    return effectiveAutoPower
  }

  const calculateProgress = () => {
    const currentRankIndex = RANKS.indexOf(rank)
    if (currentRankIndex >= RANKS.length - 1) return 100

    const currentRankXP = XP_PER_RANK[currentRankIndex]
    const nextRankXP = XP_PER_RANK[currentRankIndex + 1]

    return ((xp - currentRankXP) / (nextRankXP - currentRankXP)) * 100
  }

  const calculateAchievementProgress = () => {
    const totalAchievements = ACHIEVEMENTS.length
    const completedAchievements = Object.values(achievements).filter(Boolean).length
    return (completedAchievements / totalAchievements) * 100
  }

  const viewHunterId = () => {
    navigate("/hunterid")
  }

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep((prev) => prev + 1)
    } else {
      setShowTutorial(false)
    }
  }

  const prevTutorialStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep((prev) => prev - 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-cyan-100 overflow-hidden relative">
      <BackGround />
      <ParticleBackground rank={rank} />

      {/* Offline Progress Modal */}
      {showOfflineProgress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[#0a0e17] border-2 border-cyan-500/50 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">Welcome Back!</h2>
            <p className="mb-4">You were away for {formatTime(offlineTimeAway)}.</p>
            <p className="mb-6">Your auto hunters collected:</p>

            <div className="bg-cyan-900/30 p-4 rounded-lg mb-6 text-center">
              <span className="text-3xl font-bold text-cyan-300">{formatNumber(offlineXpGained)}</span>
              <span className="text-xl ml-2">XP</span>
            </div>

            <div className="text-sm text-cyan-400/60 mb-6">
              Efficiency: {Math.round(offlineEfficiency * 100)}% (Upgrade in Prestige tab to improve)
            </div>

            <button
              onClick={collectOfflineProgress}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold transition-colors"
            >
              Collect XP
            </button>
          </div>
        </div>
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[#0a0e17] border-2 border-cyan-500/50 rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowTutorial(false)}
              className="absolute top-2 right-2 text-cyan-400/60 hover:text-cyan-300"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-2 text-cyan-300">{tutorialSteps[tutorialStep].title}</h2>
            <p className="mb-6">{tutorialSteps[tutorialStep].content}</p>

            <div className="flex justify-between">
              <button
                onClick={prevTutorialStep}
                className={`px-4 py-2 rounded ${tutorialStep > 0 ? "bg-cyan-900/50 hover:bg-cyan-800/50" : "bg-gray-800/50 cursor-not-allowed"}`}
                disabled={tutorialStep === 0}
              >
                Previous
              </button>

              <button onClick={nextTutorialStep} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded">
                {tutorialStep < tutorialSteps.length - 1 ? "Next" : "Start Playing"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prestige Confirmation Modal */}
      {showPrestigeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[#0a0e17] border-2 border-cyan-500/50 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">Confirm Prestige</h2>
            <p className="mb-4">Are you sure you want to prestige? This will:</p>

            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Reset your XP to 0</li>
              <li>Reset your rank to F</li>
              <li>Reset all regular upgrades</li>
              <li>Keep all prestige upgrades</li>
              <li>Award you with {calculatePrestigeRewards(totalXp).prestigePoints} Prestige Points</li>
              <li>
                Set your prestige multiplier to {calculatePrestigeRewards(totalXp).prestigeMultiplier.toFixed(1)}x
              </li>
            </ul>

            <div className="flex justify-between">
              <button
                onClick={() => setShowPrestigeConfirm(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
              >
                Cancel
              </button>

              <button onClick={handlePrestige} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded">
                Confirm Prestige
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-[#0a0e17] border-2 border-cyan-500/50 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-cyan-300">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-cyan-400/60 hover:text-cyan-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Sound Effects</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-3 py-1 rounded ${soundEnabled ? "bg-cyan-600" : "bg-gray-700"}`}
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span>Fullscreen</span>
                <button onClick={toggleFullscreen} className="px-3 py-1 rounded bg-cyan-900/50 hover:bg-cyan-800/50">
                  {fullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span>Show Tutorial</span>
                <button
                  onClick={() => {
                    setShowSettings(false)
                    setTutorialStep(0)
                    setShowTutorial(true)
                  }}
                  className="px-3 py-1 rounded bg-cyan-900/50 hover:bg-cyan-800/50"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>

              <div className="pt-4 border-t border-cyan-900/50">
                <button
                  onClick={() => {
                    saveGame()
                    setShowSettings(false)
                    addNotification("Game saved successfully!", "info")
                  }}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded"
                >
                  Save Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                        : notification.type === "achievement"
                          ? "bg-green-900/80"
                          : notification.type === "ability"
                            ? "bg-orange-900/80"
                            : notification.type === "prestige"
                              ? "bg-pink-900/80"
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
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-wider glitch">
              <span className="text-cyan-300">HUNTER</span> CLICKER
            </h1>
            <p className="text-cyan-400/60">Rise to SSS-Rank</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 rounded-full bg-cyan-900/30 border border-cyan-500/50 flex items-center justify-center hover:bg-cyan-800/30"
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="text-right">
              <p className="text-sm text-cyan-400/60">Last saved: {lastSaved || "Never"}</p>
              <button onClick={viewHunterId} className="text-sm text-cyan-300 hover:text-cyan-100 underline">
                View Hunter ID
              </button>
            </div>
            <div
              className={`w-12 h-12 rounded-full bg-cyan-900/30 border border-cyan-500/50 flex items-center justify-center ${RANK_COLORS[rank]}`}
            >
              <span className="text-xl font-bold">{rank}</span>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-black/30 border border-cyan-900/50 rounded-lg overflow-hidden">
            <button
              onClick={() => setActivePanel("game")}
              className={`px-6 py-3 flex items-center gap-2 ${activePanel === "game" ? "bg-cyan-900/50 text-cyan-300" : "text-cyan-400/60 hover:bg-cyan-900/30"}`}
            >
              <Target className="w-4 h-4" /> Game
            </button>
            <button
              onClick={() => setActivePanel("abilities")}
              className={`px-6 py-3 flex items-center gap-2 ${activePanel === "abilities" ? "bg-cyan-900/50 text-cyan-300" : "text-cyan-400/60 hover:bg-cyan-900/30"}`}
            >
              <Flame className="w-4 h-4" /> Abilities
            </button>
            <button
              onClick={() => setActivePanel("achievements")}
              className={`px-6 py-3 flex items-center gap-2 ${activePanel === "achievements" ? "bg-cyan-900/50 text-cyan-300" : "text-cyan-400/60 hover:bg-cyan-900/30"}`}
            >
              <Trophy className="w-4 h-4" /> Achievements
            </button>
            <button
              onClick={() => setActivePanel("prestige")}
              className={`px-6 py-3 flex items-center gap-2 ${activePanel === "prestige" ? "bg-cyan-900/50 text-cyan-300" : "text-cyan-400/60 hover:bg-cyan-900/30"}`}
            >
              <RotateCcw className="w-4 h-4" /> Prestige
            </button>
          </div>
        </div>

        {/* Main Game Panel */}
        {activePanel === "game" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Panel */}
            <div className="lg:col-span-1 bg-black/30 border border-cyan-900/50 rounded-lg p-4 h-fit" id="stats-panel">
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
                    <span className={RANK_COLORS[rank]}>{rank} Rank</span>
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
                    <div className="text-xl font-bold">{formatNumber(effectiveClickPower)}</div>
                    <div className="text-xs text-cyan-400/60">Per Click</div>
                  </div>

                  <div className="bg-cyan-950/30 p-3 rounded border border-cyan-900/50">
                    <div className="flex items-center gap-2 text-cyan-300 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Auto Power</span>
                    </div>
                    <div className="text-xl font-bold">{formatNumber(effectiveAutoPower)}</div>
                    <div className="text-xs text-cyan-400/60">Per Second</div>
                  </div>

                  <div className="bg-cyan-950/30 p-3 rounded border border-cyan-900/50">
                    <div className="flex items-center gap-2 text-cyan-300 mb-1">
                      <Zap className="w-4 h-4" />
                      <span className="text-sm">Multiplier</span>
                    </div>
                    <div className="text-xl font-bold">
                      x{(multiplier * tempMultiplier * prestigeMultiplier).toFixed(2)}
                    </div>
                    <div className="text-xs text-cyan-400/60">All XP Gains</div>
                  </div>

                  <div className="bg-cyan-950/30 p-3 rounded border border-cyan-900/50">
                    <div className="flex items-center gap-2 text-cyan-300 mb-1">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">Critical</span>
                    </div>
                    <div className="text-xl font-bold">{criticalChance.toFixed(1)}%</div>
                    <div className="text-xs text-cyan-400/60">x{criticalMultiplier.toFixed(1)} Damage</div>
                  </div>
                </div>

                <div className="bg-cyan-950/30 p-3 rounded border border-cyan-900/50">
                  <div className="flex items-center gap-2 text-cyan-300 mb-1">
                    <Layers className="w-4 h-4" />
                    <span className="text-sm">Prestige</span>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <div className="text-xl font-bold">{prestigePoints}</div>
                      <div className="text-xs text-cyan-400/60">Points</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">x{prestigeMultiplier.toFixed(1)}</div>
                      <div className="text-xs text-cyan-400/60">Multiplier</div>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-950/30 p-3 rounded border border-cyan-900/50">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2 text-cyan-300">
                      <Trophy className="w-4 h-4" />
                      <span className="text-sm">Achievements</span>
                    </div>
                    <span className="text-xs text-cyan-400/60">
                      {Object.values(achievements).filter(Boolean).length}/{ACHIEVEMENTS.length}
                    </span>
                  </div>
                  <div className="w-full bg-cyan-950/50 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400" style={{ width: `${calculateAchievementProgress()}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Click Area */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center" id="click-area">
              <div
                ref={clickAreaRef}
                onClick={handleClick}
                className={`w-64 h-64 rounded-full bg-gradient-to-br from-cyan-900/30 to-purple-900/30 border-4 ${
                  rank === "SSS"
                    ? "border-white/50"
                    : rank === "SS"
                      ? "border-cyan-500/50"
                      : rank === "S+"
                        ? "border-pink-500/50"
                        : rank === "S"
                          ? "border-red-500/50"
                          : rank === "A"
                            ? "border-orange-500/50"
                            : rank === "B"
                              ? "border-yellow-500/50"
                              : rank === "C"
                                ? "border-purple-500/50"
                                : rank === "D"
                                  ? "border-blue-500/50"
                                  : rank === "E"
                                    ? "border-green-500/50"
                                    : "border-gray-500/50"
                } flex items-center justify-center cursor-pointer relative overflow-hidden hover:from-cyan-800/30 hover:to-purple-800/30 transition-all duration-200 shadow-[0_0_15px_rgba(80,255,255,0.3)]`}
              >
                {/* Click effects */}
                {clickEffects.map((effect, index) => (
                  <ClickEffect
                    key={index}
                    x={effect.x}
                    y={effect.y}
                    value={effect.value}
                    isCritical={effect.isCritical}
                  />
                ))}

                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-300">CLICK</div>
                  <div className="text-sm text-cyan-400/80">+{formatNumber(effectiveClickPower)} XP</div>
                  <div className="text-xs text-cyan-400/60 mt-1">{criticalChance}% Crit Chance</div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <div className="text-2xl font-bold">{formatNumber(xp)} XP</div>
                <div className="text-sm text-cyan-400/60">
                  {autoPower > 0 ? `+${formatNumber(calculateXpPerSecond())} XP/sec` : "No passive income yet"}
                </div>

                {/* Active abilities indicators */}
                {Object.keys(activeAbilities).length > 0 && (
                  <div className="mt-4 flex gap-2 justify-center">
                    {Object.entries(activeAbilities).map(([abilityId, data]) => {
                      const ability = ABILITIES.find((a) => a.id === abilityId)
                      if (!ability) return null

                      const timeLeft = Math.max(0, Math.floor((data.endTime - Date.now()) / 1000))
                      return (
                        <div
                          key={abilityId}
                          className="px-2 py-1 bg-orange-900/50 rounded-full text-xs flex items-center gap-1"
                        >
                          {ability.icon}
                          <span>
                            {ability.name}: {timeLeft}s
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Upgrades Panel */}
            <div
              className="lg:col-span-1 bg-black/30 border border-cyan-900/50 rounded-lg overflow-hidden"
              id="upgrades-panel"
            >
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
                      id="click-tab"
                      onClick={() => setActiveTab("click")}
                      className={`px-4 py-2 text-sm ${activeTab === "click" ? "text-cyan-300 border-b-2 border-cyan-300" : "text-cyan-400/60"}`}
                    >
                      <Target className="w-4 h-4 inline mr-1" /> Click
                    </button>
                    <button
                      id="auto-tab"
                      onClick={() => setActiveTab("auto")}
                      className={`px-4 py-2 text-sm ${activeTab === "auto" ? "text-cyan-300 border-b-2 border-cyan-300" : "text-cyan-400/60"}`}
                    >
                      <Clock className="w-4 h-4 inline mr-1" /> Auto
                    </button>
                    <button
                      id="multiplier-tab"
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
        )}

        {/* Abilities Panel */}
        {activePanel === "abilities" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="abilities-panel">
            {ABILITIES.map((ability) => {
              const isUnlocked = !ability.unlockRank || RANKS.indexOf(rank) >= RANKS.indexOf(ability.unlockRank)
              const isOnCooldown = abilityCooldowns[ability.id] > 0
              const isActive = activeAbilities[ability.id] !== undefined
              const canAfford = xp >= ability.cost

              return (
                <div
                  key={ability.id}
                  className={`p-4 rounded-lg border ${
                    !isUnlocked
                      ? "bg-gray-900/30 border-gray-800/50"
                      : isActive
                        ? "bg-orange-900/30 border-orange-500/50"
                        : isOnCooldown
                          ? "bg-blue-900/30 border-blue-800/50"
                          : !canAfford
                            ? "bg-red-900/30 border-red-800/50"
                            : "bg-cyan-900/30 border-cyan-800/50 hover:bg-cyan-800/30 cursor-pointer"
                  }`}
                  onClick={() => isUnlocked && !isOnCooldown && !isActive && handleUseAbility(ability.id)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isActive ? "bg-orange-800/50" : "bg-cyan-950/50"
                      }`}
                    >
                      {ability.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">{ability.name}</h3>
                        <span className={`text-sm ${canAfford ? "text-cyan-300" : "text-red-400"}`}>
                          {formatNumber(ability.cost)} XP
                        </span>
                      </div>

                      <p className="text-sm text-cyan-400/80 mb-2">{ability.description}</p>

                      {!isUnlocked ? (
                        <div className="text-xs bg-purple-900/80 text-purple-300 px-2 py-1 rounded inline-block">
                          Unlocks at {ability.unlockRank}-Rank
                        </div>
                      ) : isActive ? (
                        <div className="w-full bg-orange-950/50 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500"
                            style={{
                              width: `${((activeAbilities[ability.id].endTime - Date.now()) / (ability.duration * 1000)) * 100}%`,
                            }}
                          />
                        </div>
                      ) : isOnCooldown ? (
                        <div className="w-full bg-blue-950/50 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{
                              width: `${((ability.cooldown - abilityCooldowns[ability.id]) / ability.cooldown) * 100}%`,
                            }}
                          />
                        </div>
                      ) : (
                        <div className="text-xs text-cyan-400/60">
                          Cooldown: {ability.cooldown}s | Duration:{" "}
                          {ability.duration > 0 ? `${ability.duration}s` : "Instant"}
                        </div>
                      )}
                    </div>
                  </div>

                  {(isActive || isOnCooldown) && (
                    <div className="mt-2 text-center text-sm">
                      {isActive ? (
                        <span className="text-orange-300">
                          Active: {Math.max(0, Math.ceil((activeAbilities[ability.id].endTime - Date.now()) / 1000))}s
                          remaining
                        </span>
                      ) : (
                        <span className="text-blue-300">Cooldown: {abilityCooldowns[ability.id]}s remaining</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Achievements Panel */}
        {activePanel === "achievements" && (
          <div className="bg-black/30 border border-cyan-900/50 rounded-lg p-4" id="achievements-panel">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5" /> Achievements
              </h2>
              <span className="text-sm text-cyan-400/60">
                {Object.values(achievements).filter(Boolean).length}/{ACHIEVEMENTS.length} Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACHIEVEMENTS.map((achievement) => {
                const isCompleted = achievements[achievement.id]
                return (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded border ${
                      isCompleted ? "bg-green-900/30 border-green-800/50" : "bg-gray-900/30 border-gray-800/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted ? "bg-green-800/50" : "bg-gray-800/50"
                        }`}
                      >
                        {achievement.icon}
                      </div>

                      <div>
                        <h3 className="font-bold">{achievement.name}</h3>
                        <p className="text-xs text-cyan-400/80">{achievement.description}</p>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-cyan-400/60">+{achievement.reward} XP</span>
                          {isCompleted && <span className="text-xs text-green-400">Completed</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Prestige Panel */}
        {activePanel === "prestige" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="prestige-panel">
            <div className="bg-black/30 border border-cyan-900/50 rounded-lg p-4">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <RotateCcw className="w-5 h-5" /> Prestige System
              </h2>

              <div className="space-y-4">
                <p className="text-sm text-cyan-400/80">
                  Prestige resets your progress but grants permanent bonuses. The more XP you've earned, the more
                  Prestige Points you'll receive.
                </p>

                <div className="bg-purple-900/30 border border-purple-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Current Prestige Points:</span>
                    <span className="font-bold text-purple-300">{prestigePoints}</span>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Current Prestige Multiplier:</span>
                    <span className="font-bold text-purple-300">x{prestigeMultiplier.toFixed(1)}</span>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Total XP Earned:</span>
                    <span className="font-bold">{formatNumber(totalXp)}</span>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Prestige Points Available:</span>
                    <span className="font-bold text-purple-300">
                      {calculatePrestigeRewards(totalXp).prestigePoints}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">New Prestige Multiplier:</span>
                    <span className="font-bold text-purple-300">
                      x{calculatePrestigeRewards(totalXp).prestigeMultiplier.toFixed(1)}
                    </span>
                  </div>

                  <button
                    onClick={() => setShowPrestigeConfirm(true)}
                    className={`w-full py-2 mt-2 rounded ${
                      calculatePrestigeRewards(totalXp).prestigePoints > prestigePoints
                        ? "bg-purple-600 hover:bg-purple-500"
                        : "bg-gray-700 cursor-not-allowed"
                    }`}
                    disabled={calculatePrestigeRewards(totalXp).prestigePoints <= prestigePoints}
                  >
                    Prestige Now
                  </button>
                </div>

                <div className="text-sm text-cyan-400/60">
                  <p>What happens when you prestige:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Your XP resets to 0</li>
                    <li>Your rank resets to F</li>
                    <li>All regular upgrades are reset</li>
                    <li>You keep all prestige upgrades</li>
                    <li>You gain permanent prestige bonuses</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-black/30 border border-cyan-900/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Star className="w-5 h-5" /> Prestige Upgrades
                </h2>
                <span className="text-sm text-purple-300">{prestigePoints} Points Available</span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {upgradeState.prestige.map((upgrade) => (
                  <div
                    key={upgrade.id}
                    className={`p-3 rounded border ${
                      !isUpgradeAvailable(upgrade)
                        ? "bg-gray-900/30 border-gray-800/50"
                        : canAffordUpgrade(upgrade)
                          ? "bg-purple-950/30 border-purple-800/50 hover:bg-purple-900/30 cursor-pointer"
                          : "bg-red-950/30 border-red-900/50"
                    }`}
                    onClick={() => isUpgradeAvailable(upgrade) && handleUpgrade("prestige", upgrade.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          {upgrade.name}
                          {upgrade.level >= upgrade.maxLevel && (
                            <span className="text-xs bg-yellow-900/80 text-yellow-300 px-1 rounded">MAX</span>
                          )}
                        </div>
                        <div className="text-xs text-cyan-400/60">{upgrade.description}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm ${canAffordUpgrade(upgrade) ? "text-purple-300" : "text-red-400"}`}>
                          {calculateUpgradeCost(upgrade)} Points
                        </div>
                        <div className="text-xs text-cyan-400/60">
                          Level: {upgrade.level}/{upgrade.maxLevel}
                        </div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    {upgrade.level > 0 && upgrade.level < upgrade.maxLevel && (
                      <div className="w-full bg-purple-950/50 h-1 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-purple-400"
                          style={{ width: `${(upgrade.level / upgrade.maxLevel) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
