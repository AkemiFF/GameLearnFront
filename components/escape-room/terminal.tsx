"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TerminalProps {
  onCommand: (command: string) => void
  terminalHistory: Array<{ type: string; text: string }>
}

export function Terminal({ onCommand, terminalHistory }: TerminalProps) {
  const [terminalInput, setTerminalInput] = useState("")
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalHistory])

  const handleTerminalCommand = (e: React.FormEvent) => {
    e.preventDefault()
    if (terminalInput.trim()) {
      onCommand(terminalInput.trim())
      setTerminalInput("")
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div
        ref={terminalRef}
        className="bg-black border border-green-900 rounded-md p-4 h-[300px] overflow-y-auto flex flex-col gap-1"
      >
        {terminalHistory.map((entry, index) => (
          <div
            key={index}
            className={cn(
              "text-sm",
              entry.type === "system" ? "text-green-500" : entry.type === "user" ? "text-green-300" : "text-red-500",
            )}
          >
            {entry.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleTerminalCommand} className="flex gap-2 mt-2">
        <span className="text-green-500">{">"}</span>
        <Input
          value={terminalInput}
          onChange={(e) => setTerminalInput(e.target.value)}
          className="flex-1 bg-transparent border-0 text-green-500 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
          placeholder="Entrez une commande..."
          autoFocus
        />
      </form>
    </div>
  )
}

