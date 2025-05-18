"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import GlitchEffect from "./glitch"
import { useNavigate } from "react-router-dom"

interface AlarmWindowProps {
  onClose: () => void
}

export const AlarmWindow: React.FC<AlarmWindowProps> = ({ onClose }) => {
  const [currentPanel, setCurrentPanel] = useState("first")
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchIntensity, setGlitchIntensity] = useState(0)
  const navigate = useNavigate()
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("Male");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    localStorage.setItem("username", username);
    localStorage.setItem("gender", gender);
    localStorage.setItem("xp", "0");
    localStorage.setItem("joined_at", String(Date.now()));
    localStorage.setItem("rank", "F");
    localStorage.setItem("level", "1");
    

    handlePanelChange("fourth");
  };

  const handlePanelChange = (nextPanel: string) => {
    setIsGlitching(true)
    setGlitchIntensity(1)

    setTimeout(() => {
      setCurrentPanel(nextPanel)

      // Only fade out glitch if it's not the fourth panel
      if (nextPanel !== "fourth") {
        const fadeOutGlitch = () => {
          setGlitchIntensity((prev) => {
            const newIntensity = prev - 0.1
            if (newIntensity <= 0) {
              setIsGlitching(false)
              return 0
            }
            setTimeout(fadeOutGlitch, 50)
            return newIntensity
          })
        }
        setTimeout(fadeOutGlitch, 500)
      }
    }, 1000)
  }

  useEffect(() => {
    if (currentPanel === "fourth") {
      // Maintain full glitch intensity until navigation
      setIsGlitching(true)
      setGlitchIntensity(1)

      const timer = setTimeout(() => {
        // Clean up glitch state before navigation
        setIsGlitching(false)
        setGlitchIntensity(0)
        navigate("/game")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentPanel, navigate])

  useEffect(() => {
    if (currentPanel === "first") {
      const timer = setTimeout(() => handlePanelChange("second"), 1000)
      return () => clearTimeout(timer)
    }
  }, [currentPanel])

  if (currentPanel === "closed") return null

  const GlitchText = ({ children, probability = 0.3 }: { children: string; probability?: number }) => {
    if (!isGlitching) return <>{children}</>

    return (
      <>
        {children.split("").map((char, index) => {
          const shouldGlitch = Math.random() < probability * glitchIntensity

          if (shouldGlitch && char !== " ") {
            const glitchChar = String.fromCharCode(Math.floor(Math.random() * 26) + 65)
            return (
              <motion.span
                key={index}
                animate={{
                  opacity: [1, 0.5, 1],
                  y: [0, -2, 0],
                }}
                transition={{ duration: 0.2 }}
                className="text-cyan-300"
              >
                {glitchChar}
              </motion.span>
            )
          }

          return <span key={index}>{char}</span>
        })}
      </>
    )
  }

  const content = (
    <div className={`status-window p-8 relative ${isGlitching ? "glitching" : ""}`}>
      {/* Glitch lines that appear randomly */}
      {isGlitching && (
        <>
          <motion.div
            className="absolute h-[1px] bg-cyan-300 left-0 right-0 z-20 opacity-80"
            style={{ top: `${Math.random() * 100}%` }}
            animate={{
              scaleY: [1, 3, 1],
              opacity: [0, 0.8, 0],
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute w-[1px] bg-cyan-300 top-0 bottom-0 z-20 opacity-80"
            style={{ left: `${Math.random() * 100}%` }}
            animate={{
              scaleX: [1, 3, 1],
              opacity: [0, 0.8, 0],
            }}
            transition={{ duration: 0.3 }}
          />
        </>
      )}

      <div className="flex items-center justify-center gap-4 mb-6">
        <motion.p
          className="text-cyan-100 neon-text"
          animate={
            isGlitching
              ? {
                scale: [1, 1.05, 0.95, 1],
                rotate: [0, 1, -1, 0],
              }
              : {}
          }
          transition={{ duration: 0.3 }}
        >
          <AlertCircle className="w-8 h-8" />
        </motion.p>
        <motion.h2
          className="text-2xl font-bold neon-text tracking-widest"
          animate={
            isGlitching
              ? {
                x: [0, -2, 3, 0],
                letterSpacing: ["0.1em", "0.13em", "0.08em", "0.1em"],
              }
              : {}
          }
          transition={{ duration: 0.3 }}
        >
          <GlitchText>NOTIFICATION</GlitchText>
        </motion.h2>
      </div>

      <AnimatePresence mode="wait">
        {currentPanel === "first" && (
          <motion.p
            key="first"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-xl text-cyan-100 mb-8"
          >
            <GlitchText>You have acquired the qualifications</GlitchText>
            <br />
            <GlitchText>to be a </GlitchText>
            <span className="font-bold">
              <GlitchText>Player</GlitchText>
            </span>
            .
          </motion.p>
        )}

        {currentPanel === "second" && (
          <motion.div
            key="second"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-xl text-cyan-100 mb-8"
          >
            <p className="text-center text-xl text-cyan-100 mb-8">
              <span className="font-bold">
                <GlitchText>WARNING:</GlitchText>
              </span>{" "}
              <GlitchText>Once you enter the game, there is no going back.</GlitchText>
              <br /> <GlitchText>Will you accept?</GlitchText>
            </p>
            <div className="flex justify-center gap-4">
              <motion.button
                onClick={() => handlePanelChange("third")}
                className="px-8 py-2 border-2 border-cyan-100 text-cyan-100 hover:bg-cyan-100 hover:text-black transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GlitchText>ACCEPT</GlitchText>
              </motion.button>
              <motion.button
                onClick={() => handlePanelChange("closed")}
                className="px-8 py-2 border-2 border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GlitchText>DECLINE</GlitchText>
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentPanel === "third" && (
          <motion.div key="third" className="text-center text-cyan-100 space-y-4">
            <p className="text-lg">
              <GlitchText>Please enter your player details:</GlitchText>
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-2 border border-cyan-100 bg-black/50 text-cyan-100"
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2 border border-cyan-100 bg-black/50 text-cyan-100"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <motion.button
                type="submit"
                className="px-6 py-2 border border-cyan-100 text-cyan-100 hover:bg-cyan-100/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GlitchText>START GAME</GlitchText>
              </motion.button>
            </form>
          </motion.div>
        )}



        {currentPanel === "fourth" && (
          <motion.div key="fourth" className="text-center text-cyan-100 space-y-4">
            <p className="text-lg">
              <span className="font-medium">
                <GlitchText>INITIALIZING:</GlitchText>
              </span>{" "}
              <GlitchText>Player status confirmed.</GlitchText>
              <br /> <GlitchText>Welcome to the game. Prepare for entry.</GlitchText>
            </p>
            <div className="pt-4">
              <div className="w-full bg-cyan-950/50 h-2 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-cyan-100 ${isGlitching ? "glitch-progress" : ""}`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              </div>
              <p className="text-xs text-cyan-100 mt-2">
                <GlitchText>SYSTEM CALIBRATION IN PROGRESS</GlitchText>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className={`notification-frame max-w-2xl w-full ${isGlitching ? "glitch-border" : ""}`}>
        <GlitchEffect isActive={isGlitching}>{content}</GlitchEffect>
      </div>
    </div>
  )
}