"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { HistoricalCharacter } from "@/data/historical-characters"

interface CharacterPortraitProps {
  character: HistoricalCharacter
  mood: "neutral" | "happy" | "thinking" | "surprised"
}

export function CharacterPortrait({ character, mood }: CharacterPortraitProps) {
  const [currentPortrait, setCurrentPortrait] = useState("")

  useEffect(() => {
    // Set the appropriate portrait based on mood
    // In a real implementation, you would have different portrait images for each mood
    // For now, we'll just use the same portrait for all moods
    setCurrentPortrait(character.portraitUrl)
  }, [character, mood])

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background appropriate to character's era */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-950/50"></div>

      {/* Character portrait */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mood}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-full flex items-end justify-center"
        >
          <img
            src={currentPortrait || "/placeholder.svg"}
            alt={character.name}
            className="h-full object-contain object-bottom"
          />
        </motion.div>
      </AnimatePresence>

      {/* Mood indicator */}
      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs">
        {mood === "neutral" && "😐 Neutre"}
        {mood === "happy" && "😊 Content"}
        {mood === "thinking" && "🤔 Réfléchit"}
        {mood === "surprised" && "😲 Surpris"}
      </div>
    </div>
  )
}

