"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PuzzleSwitchesProps {
  solution: string
  onSolve: () => void
  onFail: () => void
}

export function PuzzleSwitches({ solution, onSolve, onFail }: PuzzleSwitchesProps) {
  const [switchStates, setSwitchStates] = useState([false, false, false, false])
  const [switchOrder, setSwitchOrder] = useState<number[]>([])

  const handleSwitchToggle = (index: number) => {
    const newSwitchStates = [...switchStates]
    newSwitchStates[index] = !newSwitchStates[index]
    setSwitchStates(newSwitchStates)

    if (newSwitchStates[index]) {
      setSwitchOrder([...switchOrder, index + 1])
    } else {
      setSwitchOrder(switchOrder.filter((num) => num !== index + 1))
    }
  }

  const handleSwitchesSubmit = () => {
    const order = switchOrder.join("")

    if (order === solution) {
      // Success
      onSolve()
    } else {
      // Failure
      onFail()

      // Reset switches
      setSwitchStates([false, false, false, false])
      setSwitchOrder([])
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Activez les interrupteurs dans le bon ordre:</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((num, i) => (
          <motion.button
            key={num}
            className={cn(
              "aspect-square rounded-lg bg-gradient-to-br flex items-center justify-center border transition-colors relative overflow-hidden",
              switchStates[i]
                ? "from-purple-700 to-indigo-900 border-purple-400"
                : "from-gray-800 to-gray-900 border-white/20 hover:border-white/50",
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSwitchToggle(i)}
          >
            <span className="text-2xl font-bold text-white">{num}</span>
            <div
              className={cn("absolute bottom-0 left-0 right-0 h-1", switchStates[i] ? "bg-purple-500" : "bg-red-500")}
            ></div>
          </motion.button>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
          onClick={() => {
            setSwitchStates([false, false, false, false])
            setSwitchOrder([])
          }}
          disabled={switchOrder.length === 0}
        >
          Réinitialiser
        </Button>
        <Button
          className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 border-0 text-white"
          onClick={handleSwitchesSubmit}
          disabled={switchOrder.length < 4}
        >
          Activer le protocole
        </Button>
      </div>
    </div>
  )
}

