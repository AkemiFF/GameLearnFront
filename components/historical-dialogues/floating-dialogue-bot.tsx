"use client"

import { useState, useEffect } from "react"
import { MessageSquare } from "lucide-react"
import { TypingEffect } from "./typing-effect"

interface FloatingDialogueBotProps {
  message: string
  isTyping?: boolean
  characterName: string
}

export function FloatingDialogueBot({ message, isTyping = false, characterName }: FloatingDialogueBotProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setVisible(true)
    }
  }, [message])

  if (!visible || !message) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-[300px] md:max-w-[400px] animate-float">
      <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white border border-amber-500/50 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-1">
            <MessageSquare className="h-4 w-4 text-black" />
          </div>
          <div className="space-y-1">
            <div className="text-amber-400 text-sm font-medium">{characterName}</div>
            <div className="text-sm leading-relaxed">{isTyping ? <TypingEffect text={message} /> : message}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

