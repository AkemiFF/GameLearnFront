"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PuzzleSequenceProps {
  solution: string
  onSolve: () => void
  onFail: () => void
}

export function PuzzleSequence({ solution, onSolve, onFail }: PuzzleSequenceProps) {
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([])

  const handleSequenceItemClick = (base: string) => {
    if (sequenceOrder.length < 4 && !sequenceOrder.includes(base)) {
      setSequenceOrder([...sequenceOrder, base])
    }
  }

  const handleSequenceSubmit = () => {
    const sequence = sequenceOrder.join("")

    if (sequence === solution) {
      // Success
      onSolve()
    } else {
      // Failure
      onFail()

      // Reset sequence
      setSequenceOrder([])
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Alignez les bases azotées:</h3>
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-4 gap-2">
          {["A", "T", "G", "C"].map((base, i) => (
            <motion.button
              key={i}
              className={cn(
                "w-16 h-16 rounded-lg bg-gradient-to-br from-purple-700 to-indigo-900 flex items-center justify-center text-2xl font-bold border border-white/20 hover:border-white/50 transition-colors",
                sequenceOrder.includes(base) && "opacity-50 cursor-not-allowed",
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !sequenceOrder.includes(base) && handleSequenceItemClick(base)}
              disabled={sequenceOrder.includes(base)}
            >
              {base}
            </motion.button>
          ))}
        </div>
        <div className="w-full h-16 rounded-lg bg-black/30 border border-white/20 flex items-center justify-center text-lg gap-2">
          {sequenceOrder.length > 0 ? (
            sequenceOrder.map((base, i) => (
              <motion.div
                key={i}
                className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-xl font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {base}
              </motion.div>
            ))
          ) : (
            <span className="text-white/50">Sélectionnez les bases dans l'ordre</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => setSequenceOrder([])}
            disabled={sequenceOrder.length === 0}
          >
            Réinitialiser
          </Button>
          <Button
            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 border-0 text-white"
            onClick={handleSequenceSubmit}
            disabled={sequenceOrder.length < 4}
          >
            Valider
          </Button>
        </div>
      </div>
    </div>
  )
}

