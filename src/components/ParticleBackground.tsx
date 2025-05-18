"use client"

import { useEffect, useRef } from "react"

interface ParticleBackgroundProps {
  rank: string
}

export default function ParticleBackground({ rank }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Particle settings based on rank
    const getParticleSettings = () => {
      switch (rank) {
        case "SSS":
          return {
            count: 150,
            color: ["#ffffff", "#00ffff", "#ff00ff", "#ffff00"],
            size: { min: 1, max: 3 },
            speed: { min: 0.2, max: 0.8 },
            glow: 10,
          }
        case "SS":
          return {
            count: 120,
            color: ["#00ffff", "#0088ff", "#00ffaa"],
            size: { min: 1, max: 3 },
            speed: { min: 0.2, max: 0.7 },
            glow: 8,
          }
        case "S+":
          return {
            count: 100,
            color: ["#ff00ff", "#ff0088", "#ff00aa"],
            size: { min: 1, max: 2.5 },
            speed: { min: 0.2, max: 0.6 },
            glow: 6,
          }
        case "S":
          return {
            count: 80,
            color: ["#ff0000", "#ff3300", "#ff6600"],
            size: { min: 1, max: 2.5 },
            speed: { min: 0.1, max: 0.5 },
            glow: 5,
          }
        case "A":
          return {
            count: 60,
            color: ["#ff6600", "#ff8800", "#ffaa00"],
            size: { min: 0.8, max: 2 },
            speed: { min: 0.1, max: 0.4 },
            glow: 4,
          }
        case "B":
          return {
            count: 50,
            color: ["#ffff00", "#dddd00", "#aaaa00"],
            size: { min: 0.8, max: 2 },
            speed: { min: 0.1, max: 0.3 },
            glow: 3,
          }
        case "C":
          return {
            count: 40,
            color: ["#aa00ff", "#8800ff", "#6600ff"],
            size: { min: 0.6, max: 1.5 },
            speed: { min: 0.1, max: 0.3 },
            glow: 2,
          }
        case "D":
          return {
            count: 30,
            color: ["#0000ff", "#0044ff", "#0088ff"],
            size: { min: 0.6, max: 1.5 },
            speed: { min: 0.05, max: 0.2 },
            glow: 2,
          }
        case "E":
          return {
            count: 20,
            color: ["#00ff00", "#00dd00", "#00aa00"],
            size: { min: 0.5, max: 1 },
            speed: { min: 0.05, max: 0.2 },
            glow: 1,
          }
        default: // F rank
          return {
            count: 10,
            color: ["#aaaaaa", "#888888", "#666666"],
            size: { min: 0.5, max: 1 },
            speed: { min: 0.05, max: 0.1 },
            glow: 0,
          }
      }
    }

    const settings = getParticleSettings()

    // Create particles
    const particles: {
      x: number
      y: number
      size: number
      color: string
      speedX: number
      speedY: number
    }[] = []

    for (let i = 0; i < settings.count; i++) {
      const size = Math.random() * (settings.size.max - settings.size.min) + settings.size.min
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        color: settings.color[Math.floor(Math.random() * settings.color.length)],
        speedX:
          (Math.random() * (settings.speed.max - settings.speed.min) + settings.speed.min) *
          (Math.random() > 0.5 ? 1 : -1),
        speedY:
          (Math.random() * (settings.speed.max - settings.speed.min) + settings.speed.min) *
          (Math.random() > 0.5 ? 1 : -1),
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color

        // Add glow effect based on rank
        if (settings.glow > 0) {
          ctx.shadowBlur = settings.glow
          ctx.shadowColor = particle.color
        }

        ctx.fill()
        ctx.closePath()

        // Reset shadow
        ctx.shadowBlur = 0
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [rank])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-30" />
}
