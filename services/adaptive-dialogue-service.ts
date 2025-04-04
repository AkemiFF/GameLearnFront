/**
 * Service adaptatif pour les dialogues historiques
 * Utilise l'API si disponible, sinon utilise les données locales
 */

import { HistoricalDialoguesService } from "./historical-dialogues-service"
import { getFallbackCharacter, getFallbackScenario, fallbackCharacters } from "@/lib/fallback-data"
import { getLocalProgress, saveLocalProgress } from "@/lib/storage-utils"
import type { HistoricalCharacter, DialogueScenario, UserProgress } from "@/types/historical-dialogues"

/**
 * Vérifie si l'API est disponible
 */
async function isApiAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/health-check/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // Timeout court pour ne pas bloquer l'interface
      signal: AbortSignal.timeout(2000),
    })
    return response.ok
  } catch (error) {
    console.warn("API health check failed:", error)
    return false
  }
}

/**
 * Service adaptatif pour les dialogues historiques
 */
export const AdaptiveDialogueService = {
  /**
   * Récupère tous les personnages historiques
   */
  async getAllCharacters(): Promise<HistoricalCharacter[]> {
    try {
      if (await isApiAvailable()) {
        return await HistoricalDialoguesService.getAllCharacters()
      }
    } catch (error) {
      console.warn("Failed to fetch characters from API, using fallback data:", error)
    }

    // Utiliser les données de secours
    return fallbackCharacters
  },

  /**
   * Récupère un personnage historique par son ID
   */
  async getCharacterById(characterId: string): Promise<HistoricalCharacter | null> {
    try {
      if (await isApiAvailable()) {
        return await HistoricalDialoguesService.getCharacterById(characterId)
      }
    } catch (error) {
      console.warn(`Failed to fetch character ${characterId} from API, using fallback data:`, error)
    }

    // Utiliser les données de secours
    const character = getFallbackCharacter(characterId)
    return character || null
  },

  /**
   * Récupère le scénario de dialogue pour un personnage
   */
  async getDialogueScenario(characterId: string): Promise<DialogueScenario | null> {
    try {
      if (await isApiAvailable()) {
        return await HistoricalDialoguesService.getDialogueScenario(characterId)
      }
    } catch (error) {
      console.warn(`Failed to fetch scenario for ${characterId} from API, using fallback data:`, error)
    }

    // Utiliser les données de secours
    const scenario = getFallbackScenario(characterId)
    return scenario || null
  },

  /**
   * Récupère la progression de l'utilisateur
   */
  async getUserProgress(userId: string): Promise<UserProgress> {
    try {
      if (await isApiAvailable()) {
        return await HistoricalDialoguesService.getUserProgress(userId)
      }
    } catch (error) {
      console.warn(`Failed to fetch progress for user ${userId} from API, using local storage:`, error)
    }

    // Utiliser le stockage local
    return getLocalProgress()
  },

  /**
   * Complète un dialogue et met à jour la progression
   */
  async completeDialogue(
    userId: string,
    characterId: string,
    score: number,
    discoveredFacts: string[],
  ): Promise<UserProgress> {
    try {
      if (await isApiAvailable()) {
        return await HistoricalDialoguesService.completeDialogue(userId, characterId, score, discoveredFacts)
      }
    } catch (error) {
      console.warn(`Failed to update progress for user ${userId} via API, using local storage:`, error)
    }

    // Utiliser le stockage local
    return saveLocalProgress(score, characterId, discoveredFacts)
  },
}

