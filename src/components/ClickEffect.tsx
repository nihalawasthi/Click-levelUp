"use client"

import { motion } from "framer-motion"

interface ClickEffectProps {
  x: number
  y: number
  value: number
}

export default function ClickEffect({ x, y, value }: ClickEffectProps) {
  const formatValue = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    } else {
      return num.toFixed(1)
    }
  }

  return (
    <motion.div
      className="absolute pointer-events-none text-cyan-300 font-bold text-lg z-10"
      initial={{ opacity: 1, scale: 0.5, x, y }}
      animate={{
        opacity: 0,
        scale: 1.5,
        y: y - 50,
        x: x + (Math.random() * 40 - 20),
      }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      +{formatValue(value)}
    </motion.div>
  )
}
