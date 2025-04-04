/**
 * Configuration pour l'API backend
 */

// URL de base de l'API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Endpoints pour les dialogues historiques
export const HISTORICAL_DIALOGUES_ENDPOINTS = {
  // Personnages
  CHARACTERS: "/historical-dialogues/characters/",
  CHARACTER_BY_ID: (id: string) => `/historical-dialogues/characters/${id}/`,

  // Scénarios de dialogue
  SCENARIOS: "/historical-dialogues/scenarios/",
  SCENARIO_BY_CHARACTER_ID: (id: string) => `/historical-dialogues/scenarios/${id}/`,

  // Progression utilisateur
  USER_PROGRESS: "/historical-dialogues/progress/",
  USER_PROGRESS_BY_ID: (userId: string) => `/historical-dialogues/progress/${userId}/`,
  COMPLETE_DIALOGUE: (userId: string) => `/historical-dialogues/progress/${userId}/complete-dialogue/`,
}

// Configuration des requêtes
export const API_CONFIG = {
  // En-têtes par défaut
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },

  // Timeout en millisecondes
  TIMEOUT: 10000,

  // Nombre de tentatives en cas d'échec
  RETRY_COUNT: 3,
}

// Messages d'erreur
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: "Erreur de connexion au serveur. Veuillez vérifier votre connexion internet.",
  SERVER_ERROR: "Le serveur a rencontré une erreur. Veuillez réessayer plus tard.",
  NOT_FOUND: "La ressource demandée n'a pas été trouvée.",
  UNAUTHORIZED: "Vous n'êtes pas autorisé à accéder à cette ressource.",
  GENERIC_ERROR: "Une erreur est survenue. Veuillez réessayer.",
}

