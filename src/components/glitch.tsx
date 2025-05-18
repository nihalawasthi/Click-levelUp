"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { motion, useAnimation } from "framer-motion"

interface GlitchEffectProps {
  children: React.ReactNode
  isActive?: boolean
}

export default function GlitchEffect({ children, isActive = true }: GlitchEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Generate random glitch parameters
  const generateGlitchParams = () => {
    return {
      translateX: Math.random() * 10 - 5,
      translateY: Math.random() * 10 - 5,
      skewX: (Math.random() * 4 - 2) * 0.5,
      skewY: (Math.random() * 2 - 1) * 0.5,
      scaleX: 1 + (Math.random() * 0.1 - 0.05),
      scaleY: 1 + (Math.random() * 0.1 - 0.05),
      blurAmount: `${Math.random() * 2}px`,
      clipPath: Math.random() > 0.7 ? `inset(${Math.random() * 40}% 0 ${Math.random() * 40}% 0)` : undefined,
    }
  }

  // Update dimensions when container size changes
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          })
        }
      })

      resizeObserver.observe(containerRef.current)
      return () => resizeObserver.disconnect()
    }
  }, [])

  // Run glitch animation sequence
  useEffect(() => {
    if (!isActive) return

    let timeout: NodeJS.Timeout

    const runGlitchSequence = async () => {
      // Random number of glitches in sequence (2-5)
      const glitchCount = Math.floor(Math.random() * 4) + 2

      for (let i = 0; i < glitchCount; i++) {
        const params = generateGlitchParams()

        // Apply glitch transform
        await controls.start({
          x: params.translateX,
          y: params.translateY,
          skewX: params.skewX,
          skewY: params.skewY,
          scaleX: params.scaleX,
          scaleY: params.scaleY,
          filter: `blur(${params.blurAmount})`,
          clipPath: params.clipPath,
          transition: { duration: 0.1, ease: "linear" },
        })

        // Reset to normal briefly
        await controls.start({
          x: 0,
          y: 0,
          skewX: 0,
          skewY: 0,
          scaleX: 1,
          scaleY: 1,
          filter: "blur(0px)",
          clipPath: "none",
          transition: { duration: 0.1, ease: "linear" },
        })
      }

      // Random delay before next glitch sequence
      timeout = setTimeout(runGlitchSequence, Math.random() * 2000 + 500)
    }

    runGlitchSequence()

    return () => clearTimeout(timeout)
  }, [controls, isActive])

  // Create RGB shift layers
  const createShiftLayer = (color: string, animate = true) => {
    return (
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          mixBlendMode: "screen",
          backgroundColor: color,
          opacity: 0.5,
          pointerEvents: "none",
        }}
        animate={
          animate
            ? {
                x: [0, Math.random() * 10 - 5, 0],
                opacity: [0.3, 0.5, 0.3],
              }
            : {}
        }
        transition={{
          duration: 0.2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        {children}
      </motion.div>
    )
  }

  // Generate random noise pattern
  const generateNoise = () => {
    const noiseCanvas = document.createElement("canvas")
    const ctx = noiseCanvas.getContext("2d")

    if (!ctx) return ""

    noiseCanvas.width = 100
    noiseCanvas.height = 100

    const imageData = ctx.createImageData(100, 100)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255
      data[i] = value
      data[i + 1] = value
      data[i + 2] = value
      data[i + 3] = Math.random() * 50 // Semi-transparent
    }

    ctx.putImageData(imageData, 0, 0)
    return noiseCanvas.toDataURL()
  }

  const [noisePattern, setNoisePattern] = useState("")

  useEffect(() => {
    setNoisePattern(generateNoise())
  }, [])

  // Generate random glitch blocks
  const glitchBlocks = Array.from({ length: 8 }).map((_, i) => {
    const width = Math.random() * 30 + 5
    const height = Math.random() * 5 + 1
    const top = Math.random() * 100
    const left = Math.random() * 100

    return (
      <motion.div
        key={i}
        className="absolute bg-cyan-100 pointer-events-none z-20"
        style={{
          width: `${width}%`,
          height: `${height}px`,
          top: `${top}%`,
          left: `${left}%`,
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.8, 0],
          x: [-10, 5, 0],
        }}
        transition={{
          duration: 0.2,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: Math.random() * 3 + 1,
        }}
      />
    )
  })

  return (
    <div className="relative" ref={containerRef}>
      {/* Main content with glitch effect */}
      <motion.div className="relative z-10" animate={controls}>
        {children}
      </motion.div>

      {/* RGB shift layers - these create the color separation effect */}
      {isActive && (
        <>
          {createShiftLayer("rgba(255, 0, 0, 0.2)", true)}
          {createShiftLayer("rgba(0, 255, 0, 0.2)", true)}
          {createShiftLayer("rgba(0, 0, 255, 0.2)", true)}
        </>
      )}

      {/* Scan lines */}
      {isActive && (
        <div
          className="absolute inset-0 pointer-events-none z-30 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.1),
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px,
              transparent 2px
            )`,
            backgroundSize: "100% 2px",
            mixBlendMode: "overlay",
          }}
        />
      )}

      {/* Noise overlay */}
      {isActive && noisePattern && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-20 opacity-10"
          style={{
            backgroundImage: `url(${noisePattern})`,
            mixBlendMode: "overlay",
          }}
          animate={{
            opacity: [0.05, 0.1, 0.05],
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      )}

      {/* Random glitch blocks */}
      {isActive && glitchBlocks}

      {/* Border glitch effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            border: "1px solid rgba(0, 255, 255, 0.5)",
            boxShadow: "0 0 10px rgba(0, 255, 255, 0.5)",
          }}
          animate={{
            opacity: [0, 1, 0],
            x: [-2, 2, 0],
            y: [1, -1, 0],
          }}
          transition={{
            duration: 0.3,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: Math.random() * 2 + 1,
          }}
        />
      )}
    </div>
  )
}

