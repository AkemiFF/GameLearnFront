/**
 * Utilitaires pour gérer le stockage local de la progression
 * Utilisé comme solution de secours lorsque l'API n'est pas disponible
 */

import type { UserProgress } from "@/types/historical-dialogues"

// Clés de stockage local
const STORAGE_KEYS = {
  SCORE: "historical-dialogues-score",
  COMPLETED: "historical-dialogues-completed",
  FACTS: "historical-dialogues-facts",
}

/**
 * Récupère la progression de l'utilisateur depuis le stockage local
 */
export function getLocalProgress(): UserProgress {
  if (typeof window === "undefined") {
    return {
      userId: "",
      totalScore: 0,
      completedDialogues: [],
      discoveredFacts: [],
    }
  }

  const savedScore = localStorage.getItem(STORAGE_KEYS.SCORE) || "0"
  const savedCompleted = localStorage.getItem(STORAGE_KEYS.COMPLETED) || "[]"
  const savedFacts = localStorage.getItem(STORAGE_KEYS.FACTS) || "[]"

  return {
    userId: "local",
    totalScore: Number.parseInt(savedScore),
    completedDialogues: JSON.parse(savedCompleted),
    discoveredFacts: JSON.parse(savedFacts),
  }
}

/**
 * Sauvegarde la progression dans le stockage local
 */
export function saveLocalProgress(
  score: number,
  characterId: string | null = null,
  newFacts: string[] = [],
): UserProgress {
  if (typeof window === "undefined") {
    return {
      userId: "",
      totalScore: score,
      completedDialogues: characterId ? [characterId] : [],
      discoveredFacts: newFacts,
    }
  }

  // Récupérer les données existantes
  const savedScore = localStorage.getItem(STORAGE_KEYS.SCORE) || "0"
  const savedCompleted = localStorage.getItem(STORAGE_KEYS.COMPLETED) || "[]"
  const savedFacts = localStorage.getItem(STORAGE_KEYS.FACTS) || "[]"

  // Analyser les données
  const totalScore = Number.parseInt(savedScore) + score
  const completedDialogues = JSON.parse(savedCompleted) as string[]
  const discoveredFacts = JSON.parse(savedFacts) as string[]

  // Ajouter le personnage actuel s'il n'est pas déjà complété
  if (characterId && !completedDialogues.includes(characterId)) {
    completedDialogues.push(characterId)
  }

  // Ajouter les nouveaux faits s'ils ne sont pas déjà découverts
  const updatedFacts = [...discoveredFacts, ...newFacts.filter((fact) => !discoveredFacts.includes(fact))]

  // Sauvegarder les données mises à jour
  localStorage.setItem(STORAGE_KEYS.SCORE, totalScore.toString())
  localStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify(completedDialogues))
  localStorage.setItem(STORAGE_KEYS.FACTS, JSON.stringify(updatedFacts))

  return {
    userId: "local",
    totalScore,
    completedDialogues,
    discoveredFacts: updatedFacts,
  }
}

