// Types pour les personnages historiques
export interface HistoricalCharacter {
  id: string
  name: string
  period: string
  short_description: string | null
  portrait_url: string | null
  birth_year: number | null
  death_year: number | null
  nationality: string
  tags: { name: string }[]
  achievements: { description: string }[]
}

// Types pour les réponses de dialogue
export interface DialogueResponse {
  keywords: string[]
  text: string
  mood?: "neutral" | "happy" | "thinking" | "surprised"
  fact?: string
}

// Types pour les options de quiz
export interface QuizOption {
  text: string
  isCorrect: boolean
}

// Types pour les questions de quiz
export interface QuizItem {
  question: string
  options: QuizOption[]
  correctResponse: string
  incorrectResponse: string
}

// Types pour les scénarios de dialogue
export interface DialogueScenario {
  introduction: string
  responses: DialogueResponse[]
  defaultResponses: string[]
  quizIntroduction: string
  quizzes: QuizItem[]
  conclusion: string
}

// Types pour la progression de l'utilisateur
export interface UserProgress {
  userId: string
  totalScore: number
  completedDialogues: string[]
  discoveredFacts: string[]
}

// Types pour les messages dans l'interface de dialogue
export interface MessageType {
  id: string
  sender: "user" | "character"
  content: string
  isTyping?: boolean
  mood?: "neutral" | "happy" | "thinking" | "surprised"
}

// Types pour les états de dialogue
export type DialogueState = "intro" | "free-chat" | "quiz" | "conclusion"

// Types pour les réponses AI formatées en JSON
export interface AIResponseType {
  mood: "neutral" | "happy" | "thinking" | "surprised"
  message: string
}

