import { allCountries, type Country } from "@/data/countries"

interface GameData {
  score: number
  totalQuestions: number
  visitedCountries: string[]
}

const GAME_DATA_KEY = "world-explorer-data"

export const WorldExplorerService = {
  async loadSavedData(): Promise<GameData | null> {
    if (typeof window === "undefined") return null

    try {
      const storedData = localStorage.getItem(GAME_DATA_KEY)
      if (storedData) {
        return JSON.parse(storedData) as GameData
      }
    } catch (error) {
      console.error("Failed to load saved game data:", error)
    }
    return null
  },

  async saveGameData(data: GameData): Promise<void> {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(GAME_DATA_KEY, JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save game data:", error)
    }
  },

  async addVisitedCountry(countryCode: string): Promise<void> {
    // This function is not being used, and there is no logic on how to add new visited countries
    // In a real-world scenario, you would fetch the list, add to it and then save.
    console.warn(`addVisitedCountry(${countryCode}): Function not yet implemented.`)
  },

  async getCountries(): Promise<Country[]> {
    return allCountries
  },
}

