"use client"

import { useEffect, useRef } from "react"

interface UseSoundProps {
  enabled: boolean
  sounds: {
    [key: string]: string
  }
}

export default function useSound({ enabled, sounds }: UseSoundProps) {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  useEffect(() => {
    // Preload sounds
    if (enabled) {
      Object.entries(sounds).forEach(([key, src]) => {
        const audio = new Audio()
        audio.src = src
        audio.preload = "auto"
        audioRefs.current[key] = audio
      })
    }

    return () => {
      // Cleanup
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause()
        audio.src = ""
      })
      audioRefs.current = {}
    }
  }, [enabled, sounds])

  const playSound = (key: string) => {
    if (!enabled) return

    const audio = audioRefs.current[key]
    if (audio) {
      // Reset and play
      audio.currentTime = 0
      audio.play().catch((err) => {
        // Handle autoplay restrictions
        console.log("Audio play failed:", err)
      })
    }
  }

  return { playSound }
}
