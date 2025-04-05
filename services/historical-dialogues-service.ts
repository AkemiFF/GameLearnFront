import type { DialogueScenario, HistoricalCharacter, UserProgress } from "@/types/historical-dialogues"
import fetchAPI from "./api"

/**
 * Service pour gérer les requêtes API liées aux dialogues historiques
 */
export const HistoricalDialoguesService = {
  /**
   * Récupère tous les personnages historiques
   */
  async getAllCharacters(): Promise<HistoricalCharacter[]> {
    return fetchAPI<HistoricalCharacter[]>("/historical_dialog/characters/")
  },

  /**
   * Récupère un personnage historique par son ID
   */
  async getCharacterById(characterId: string): Promise<HistoricalCharacter> {
    return fetchAPI<HistoricalCharacter>(`/historical_dialog/characters/${characterId}/`)
  },

  /**
   * Récupère le scénario de dialogue pour un personnage
   */
  async getDialogueScenario(characterId: string): Promise<DialogueScenario> {
    return fetchAPI<DialogueScenario>(`/historical_dialog/scenarios/${characterId}/`)
  },

  /**
   * Récupère la progression de l'utilisateur
   */
  async getUserProgress(userId: string): Promise<UserProgress> {
    return fetchAPI<UserProgress>(`/historical_dialog/progress/${userId}/`)
  },

  /**
   * Met à jour la progression de l'utilisateur
   */
  async updateUserProgress(
    userId: string,
    data: {
      score?: number
      completedDialogue?: string
      discoveredFacts?: string[]
    },
  ): Promise<UserProgress> {
    return fetchAPI<UserProgress>(`/historical_dialog/progress/${userId}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  },

  /**
   * Marque un dialogue comme terminé et met à jour le score et les faits découverts
   */
  async completeDialogue(
    userId: string,
    characterId: string,
    score: number,
    discoveredFacts: string[],
  ): Promise<UserProgress> {
    return fetchAPI<UserProgress>(`/historical_dialog/progress/${userId}/complete-dialogue/`, {
      method: "POST",
      body: JSON.stringify({
        characterId,
        score,
        discoveredFacts,
      }),
    })
  },
}

