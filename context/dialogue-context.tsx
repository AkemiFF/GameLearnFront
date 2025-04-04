"use client"

import { useAuth } from "@/context/auth-context"
import { useDialogueScenario } from "@/hooks/use-dialogue-scenario"
import { useUserProgress } from "@/hooks/use-user-progress"
import { saveLocalProgress } from "@/lib/storage-utils"
import type { DialogueState, HistoricalCharacter, MessageType } from "@/types/historical-dialogues"
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

interface DialogueContextType {
  messages: MessageType[]
  setMessages: (messages: MessageType[]) => void
  inputValue: string
  setInputValue: (value: string) => void
  dialogueState: DialogueState
  setDialogueState: (state: DialogueState) => void
  currentMood: "neutral" | "happy" | "thinking" | "surprised"
  setCurrentMood: (mood: "neutral" | "happy" | "thinking" | "surprised") => void
  discoveredFacts: string[]
  setDiscoveredFacts: (facts: string[]) => void
  score: number
  setScore: (score: number) => void
  currentQuizIndex: number
  setCurrentQuizIndex: (index: number) => void
  handleSendMessage: () => void
  handleQuizAnswer: (isCorrect: boolean) => void
  handleCompleteDialogue: () => void
  loading: boolean
  error: Error | null
}

const DialogueContext = createContext<DialogueContextType | null>(null)

export function DialogueProvider({
  children,
  character,
}: {
  children: ReactNode
  character: HistoricalCharacter
}) {
  const { user } = useAuth()
  const userId = user?.id || "local"

  const { scenario, loading: scenarioLoading, error: scenarioError } = useDialogueScenario(character.id)
  const { progress, loading: progressLoading, error: progressError, completeDialogue } = useUserProgress(userId)

  // État du dialogue
  const [messages, setMessages] = useState<MessageType[]>([])
  const [inputValue, setInputValue] = useState("")
  const [dialogueState, setDialogueState] = useState<DialogueState>("intro")
  const [currentMood, setCurrentMood] = useState<"neutral" | "happy" | "thinking" | "surprised">("neutral")
  const [discoveredFacts, setDiscoveredFacts] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [initializedRef, setInitializedRef] = useState(false)

  // Initialiser le dialogue
  useEffect(() => {
    if (character && scenario && !initializedRef) {
      setInitializedRef(true)

      // Ajouter le message d'introduction
      const introJson = {
        mood: "neutral" as const,
        message: scenario.introduction,
      }

      const introMessage: MessageType = {
        id: `char-intro-${Date.now()}`,
        sender: "character",
        content: JSON.stringify(introJson),
        isTyping: true,
        mood: introJson.mood,
      }

      setMessages([introMessage])
      setCurrentMood(introJson.mood)

      // Après l'intro, passer à l'état de chat libre
      const timer = setTimeout(() => {
        setDialogueState("free-chat")
        // Mettre à jour le message pour ne plus être en train de taper
        setMessages((prev) => prev.map((msg) => (msg.id === introMessage.id ? { ...msg, isTyping: false } : msg)))
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [character, scenario, initializedRef])

  // Gérer l'envoi d'un message
  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || !character || !scenario) return

    // Ajouter le message de l'utilisateur
    const userMessage: MessageType = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: inputValue,
      isTyping: false,
      mood: "neutral",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simuler la réflexion du personnage
    setCurrentMood("thinking")

    // Générer la réponse du personnage
    setTimeout(() => {
      let responseText = ""
      let newMood: "neutral" | "happy" | "surprised" | "thinking" = "neutral"
      let newFact: string | null = null

      // Vérifier les mots-clés dans le message de l'utilisateur
      const lowerCaseInput = inputValue.toLowerCase()

      // Trouver une réponse correspondante
      const matchingResponse = scenario.responses.find((r) =>
        r.keywords.some((keyword) => lowerCaseInput.includes(keyword)),
      )

      if (matchingResponse) {
        responseText = matchingResponse.text
        newMood = matchingResponse.mood || "neutral"
        newFact = matchingResponse.fact || null
      } else {
        // Réponse par défaut si aucun mot-clé ne correspond
        responseText = scenario.defaultResponses[Math.floor(Math.random() * scenario.defaultResponses.length)]
        newMood = "neutral"
      }

      // Créer une réponse JSON avec l'humeur
      const responseJson = {
        mood: newMood,
        message: responseText,
      }

      // Ajouter la réponse du personnage avec indicateur de frappe
      const characterMessage: MessageType = {
        id: `char-${Date.now()}`,
        sender: "character",
        content: JSON.stringify(responseJson),
        isTyping: true,
        mood: newMood,
      }

      setMessages((prev) => [...prev, characterMessage])
      setCurrentMood(newMood)

      // Ajouter le fait découvert s'il y en a un
      if (newFact && !discoveredFacts.includes(newFact)) {
        setDiscoveredFacts((prev) => [...prev, newFact!])
        setScore((prev) => prev + 50)
      }

      // Après un délai, supprimer l'indicateur de frappe
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === characterMessage.id ? { ...msg, isTyping: false } : msg)))
      }, 1500)

      // Vérifier si nous devons passer au quiz après plusieurs échanges
      if (messages.filter((m) => m.sender === "user").length >= 5 && dialogueState === "free-chat") {
        setTimeout(() => {
          const quizIntroJson = {
            mood: "neutral" as const,
            message: scenario.quizIntroduction,
          }

          const quizIntroMessage: MessageType = {
            id: `quiz-intro-${Date.now()}`,
            sender: "character",
            content: JSON.stringify(quizIntroJson),
            isTyping: true,
            mood: quizIntroJson.mood,
          }

          setMessages((prev) => [...prev, quizIntroMessage])

          setTimeout(() => {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === quizIntroMessage.id ? { ...msg, isTyping: false } : msg)),
            )
            setDialogueState("quiz")
          }, 2000)
        }, 3000)
      }
    }, 1500)
  }, [inputValue, character, scenario, messages, dialogueState, discoveredFacts])

  // Gérer la réponse au quiz
  const handleQuizAnswer = useCallback(
    (isCorrect: boolean) => {
      if (!scenario) return

      // Ajouter des points pour une réponse correcte
      if (isCorrect) {
        setScore((prev) => prev + 100)
        setCurrentMood("happy")
      } else {
        setCurrentMood("surprised")
      }

      // Créer une réponse JSON avec l'humeur
      const responseJson = {
        mood: isCorrect ? ("happy" as const) : ("surprised" as const),
        message: isCorrect
          ? scenario.quizzes[currentQuizIndex].correctResponse
          : scenario.quizzes[currentQuizIndex].incorrectResponse,
      }

      // Ajouter la réponse en fonction de l'exactitude
      const responseMessage: MessageType = {
        id: `quiz-response-${Date.now()}`,
        sender: "character",
        content: JSON.stringify(responseJson),
        isTyping: true,
        mood: responseJson.mood,
      }

      setMessages((prev) => [...prev, responseMessage])

      // Après un délai, supprimer l'indicateur de frappe
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === responseMessage.id ? { ...msg, isTyping: false } : msg)))
      }, 1500)

      // Passer à la question suivante ou à la conclusion
      setTimeout(() => {
        if (currentQuizIndex < scenario.quizzes.length - 1) {
          setCurrentQuizIndex((prev) => prev + 1)
        } else {
          // Fin du quiz, passer à la conclusion
          const conclusionJson = {
            mood: "neutral" as const,
            message: scenario.conclusion,
          }

          const conclusionMessage: MessageType = {
            id: `conclusion-${Date.now()}`,
            sender: "character",
            content: JSON.stringify(conclusionJson),
            isTyping: true,
            mood: conclusionJson.mood,
          }

          setMessages((prev) => [...prev, conclusionMessage])

          setTimeout(() => {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === conclusionMessage.id ? { ...msg, isTyping: false } : msg)),
            )
            setDialogueState("conclusion")
          }, 2000)
        }
      }, 2000)
    },
    [scenario, currentQuizIndex],
  )

  // Gérer la fin du dialogue
  const handleCompleteDialogue = useCallback(() => {
    // Sauvegarder la progression
    if (user) {
      // Si l'utilisateur est connecté, utiliser l'API
      completeDialogue(character.id, score, discoveredFacts)
    } else {
      // Sinon, utiliser le stockage local
      saveLocalProgress(score, character.id, discoveredFacts)
    }

    // Rediriger vers la page principale des dialogues historiques
    window.location.href = "/games/historical-dialogues"
  }, [user, character.id, score, discoveredFacts, completeDialogue])

  return (
    <DialogueContext.Provider
      value={{
        messages,
        setMessages,
        inputValue,
        setInputValue,
        dialogueState,
        setDialogueState,
        currentMood,
        setCurrentMood,
        discoveredFacts,
        setDiscoveredFacts,
        score,
        setScore,
        currentQuizIndex,
        setCurrentQuizIndex,
        handleSendMessage,
        handleQuizAnswer,
        handleCompleteDialogue,
        loading: scenarioLoading || progressLoading,
        error: scenarioError || progressError,
      }}
    >
      {children}
    </DialogueContext.Provider>
  )
}

export function useDialogue() {
  const context = useContext(DialogueContext)
  if (!context) {
    throw new Error("useDialogue must be used within a DialogueProvider")
  }
  return context
}

