"use client"

import { useState, useEffect } from "react"
import type { Country } from "@/data/countries"

interface AiHintProps {
  country: Country
  question: string
  hint: string
}

export function AiHint({ country, question, hint }: AiHintProps) {
  const [isGenerating, setIsGenerating] = useState(true)
  const [generatedHint, setGeneratedHint] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  // Simulate AI hint generation
  useEffect(() => {
    if (isGenerating) {
      const timer = setTimeout(() => {
        if (currentIndex < hint.length) {
          setGeneratedHint(hint.substring(0, currentIndex + 1))
          setCurrentIndex(currentIndex + 1)
        } else {
          setIsGenerating(false)
        }
      }, 20)

      return () => clearTimeout(timer)
    }
  }, [isGenerating, currentIndex, hint])

  return (
    <div className="text-sm">
      {isGenerating ? (
        <div className="flex items-center gap-2">
          <span>{generatedHint}</span>
          <span className="inline-block h-4 w-1 bg-amber-500 animate-pulse"></span>
        </div>
      ) : (
        <p>{hint}</p>
      )}
    </div>
  )
}

