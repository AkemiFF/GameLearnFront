"use client"

import { useState, useEffect } from "react"
import { HistoricalDialoguesService } from "@/services/historical-dialogues-service"
import type { HistoricalCharacter } from "@/types/historical-dialogues"

/**
 * Hook pour récupérer et gérer les personnages historiques
 */
export function useHistoricalCharacters() {
  const [characters, setCharacters] = useState<HistoricalCharacter[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadCharacters() {
      try {
        setLoading(true)
        const data = await HistoricalDialoguesService.getAllCharacters()
        setCharacters(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load characters"))
      } finally {
        setLoading(false)
      }
    }

    loadCharacters()
  }, [])

  return { characters, loading, error }
}

