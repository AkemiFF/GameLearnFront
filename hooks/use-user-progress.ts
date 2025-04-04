"use client"

import { useState, useEffect, useCallback } from "react"
import { HistoricalDialoguesService } from "@/services/historical-dialogues-service"
import type { UserProgress } from "@/types/historical-dialogues"

/**
 * Hook pour récupérer et gérer la progression de l'utilisateur
 */
export function useUserProgress(userId: string) {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  // Charger la progression initiale
  useEffect(() => {
    async function loadProgress() {
      if (!userId) return

      try {
        setLoading(true)
        const data = await HistoricalDialoguesService.getUserProgress(userId)
        setProgress(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load user progress"))
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [userId])

  // Fonction pour compléter un dialogue
  const completeDialogue = useCallback(
    async (characterId: string, score: number, discoveredFacts: string[]) => {
      if (!userId) return

      try {
        setLoading(true)
        const updatedProgress = await HistoricalDialoguesService.completeDialogue(
          userId,
          characterId,
          score,
          discoveredFacts,
        )
        setProgress(updatedProgress)
        return updatedProgress
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to update progress"))
        throw err
      } finally {
        setLoading(false)
      }
    },
    [userId],
  )

  return { progress, loading, error, completeDialogue }
}

