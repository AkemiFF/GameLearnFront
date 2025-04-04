"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PuzzleCodeProps {
  solution: string
  onSolve: () => void
  onFail: () => void
}

export function PuzzleCode({ solution, onSolve, onFail }: PuzzleCodeProps) {
  const [codeInputs, setCodeInputs] = useState(["", "", "", ""])

  const handleCodeInputChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newInputs = [...codeInputs]
      newInputs[index] = value
      setCodeInputs(newInputs)

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-input-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  const handleCodeSubmit = () => {
    const code = codeInputs.join("")

    if (code === solution) {
      // Success
      onSolve()
    } else {
      // Failure
      onFail()

      // Shake effect for wrong code
      const codeContainer = document.getElementById("code-container")
      if (codeContainer) {
        codeContainer.classList.add("animate-shake")
        setTimeout(() => {
          codeContainer.classList.remove("animate-shake")
        }, 500)
      }

      // Reset inputs
      setCodeInputs(["", "", "", ""])
      // Focus first input
      const firstInput = document.getElementById("code-input-0")
      if (firstInput) firstInput.focus()
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Entrez le code d'accès:</h3>
      <div id="code-container" className="flex justify-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <Input
            key={i}
            id={`code-input-${i}`}
            type="text"
            maxLength={1}
            value={codeInputs[i]}
            onChange={(e) => handleCodeInputChange(i, e.target.value)}
            className="w-12 h-12 text-center text-lg font-bold bg-black/30 border-white/20 text-white focus:border-purple-500 focus:ring-purple-500"
          />
        ))}
      </div>
      <div className="flex justify-center">
        <Button
          className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 border-0 text-white"
          onClick={handleCodeSubmit}
        >
          Valider
        </Button>
      </div>
    </div>
  )
}

