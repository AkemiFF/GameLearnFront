"use client"

import { useState, useEffect } from "react"
import { HistoricalDialoguesService } from "@/services/historical-dialogues-service"
import type { DialogueScenario } from "@/types/historical-dialogues"

/**
 * Hook pour récupérer et gérer un scénario de dialogue
 */
export function useDialogueScenario(characterId: string) {
  const [scenario, setScenario] = useState<DialogueScenario | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadScenario() {
      if (!characterId) return

      try {
        setLoading(true)
        const data = await HistoricalDialoguesService.getDialogueScenario(characterId)
        setScenario(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load dialogue scenario"))
      } finally {
        setLoading(false)
      }
    }

    loadScenario()
  }, [characterId])

  return { scenario, loading, error }
}

