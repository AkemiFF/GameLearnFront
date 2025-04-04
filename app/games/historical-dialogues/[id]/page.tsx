"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ArrowLeft, Home, BookOpen, Award, MessageSquare, History } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CharacterIllustration } from "@/components/historical-dialogues/character-illustration"
import { TypingEffect } from "@/components/historical-dialogues/typing-effect"
import { QuizQuestion } from "@/components/historical-dialogues/quiz-question"
import { FactCard } from "@/components/historical-dialogues/fact-card"
import { historicalCharacters } from "@/data/historical-characters"
import { getDialogueForCharacter } from "@/data/dialogue-scenarios"
import { useMobile } from "@/hooks/use-mobile"

type MessageType = {
  id: string
  sender: "user" | "character"
  content: string
  isTyping?: boolean
  mood?: "neutral" | "happy" | "thinking" | "surprised"
}

type DialogueState = "intro" | "free-chat" | "quiz" | "conclusion"

// Type for AI response JSON
type AIResponseType = {
  mood: "neutral" | "happy" | "thinking" | "surprised"
  message: string
}

export default function HistoricalDialoguePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isMobile = useMobile()
  const characterId = params.id

  // Find character data
  const character = historicalCharacters.find((c) => c.id === characterId)

  // Game state
  const [messages, setMessages] = useState<MessageType[]>([])
  const [inputValue, setInputValue] = useState("")
  const [dialogueState, setDialogueState] = useState<DialogueState>("intro")
  const [currentMood, setCurrentMood] = useState<"neutral" | "happy" | "thinking" | "surprised">("neutral")
  const [discoveredFacts, setDiscoveredFacts] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("dialogue")
  const [currentCharacterMessage, setCurrentCharacterMessage] = useState<MessageType | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)

  // Get dialogue scenario
  const dialogueScenario = character ? getDialogueForCharacter(character.id) : null

  // If character not found, redirect to main page
  useEffect(() => {
    if (!character) {
      router.push("/games/historical-dialogues")
    }
  }, [character, router])

  // Parse AI response JSON
  const parseAIResponse = (text: string): { parsedResponse: AIResponseType | null; plainText: string } => {
    try {
      // Check if the text starts with a JSON structure
      if (text.trim().startsWith("{") && text.includes('"mood"') && text.includes('"message"')) {
        const jsonEndIndex = text.indexOf("}") + 1
        const jsonPart = text.substring(0, jsonEndIndex)
        const remainingText = text.substring(jsonEndIndex).trim()

        const parsedJson = JSON.parse(jsonPart) as AIResponseType

        // Return the parsed JSON and the remaining text (if any)
        return {
          parsedResponse: parsedJson,
          plainText: parsedJson.message + (remainingText ? " " + remainingText : ""),
        }
      }
    } catch (error) {
      console.error("Error parsing AI response:", error)
    }

    // If not JSON or parsing failed, return the original text
    return { parsedResponse: null, plainText: text }
  }

  // Initialize dialogue
  useEffect(() => {
    if (character && dialogueScenario && !initializedRef.current) {
      initializedRef.current = true

      // Add introduction message with JSON format
      const introJson = {
        mood: "neutral" as const,
        message: dialogueScenario.introduction,
      }

      const introMessage = {
        id: `char-intro-${Date.now()}`,
        sender: "character",
        content: JSON.stringify(introJson),
        isTyping: true,
        mood: introJson.mood,
      }

      setMessages([introMessage])
      setCurrentCharacterMessage(introMessage)
      setCurrentMood(introJson.mood)

      // After intro, show the first predefined options
      const timer = setTimeout(() => {
        setDialogueState("free-chat")
        // Update the message to not be typing anymore
        setMessages((prev) => prev.map((msg) => (msg.id === introMessage.id ? { ...msg, isTyping: false } : msg)))
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [character, dialogueScenario])

  // Update current character message when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const characterMessages = messages.filter((msg) => msg.sender === "character")
      if (characterMessages.length > 0) {
        const latestMessage = characterMessages[characterMessages.length - 1]
        // Only update if the message is different to avoid infinite loops
        if (!currentCharacterMessage || latestMessage.id !== currentCharacterMessage.id) {
          setCurrentCharacterMessage(latestMessage)

          // Update mood if the message has a mood
          if (latestMessage.mood && latestMessage.mood !== currentMood) {
            setCurrentMood(latestMessage.mood)
          }
        }
      }
    }
  }, [messages, currentCharacterMessage, currentMood])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Save progress when dialogue is completed
  const saveProgress = useCallback(
    (newScore: number, newFacts: string[]) => {
      if (!character) return

      // Get existing data from localStorage
      const savedScore = localStorage.getItem("historical-dialogues-score") || "0"
      const savedFacts = localStorage.getItem("historical-dialogues-facts") || "[]"
      const savedCompleted = localStorage.getItem("historical-dialogues-completed") || "[]"

      // Parse data
      const totalScore = Number.parseInt(savedScore) + newScore
      const allFacts = [...JSON.parse(savedFacts), ...newFacts.filter((fact) => !JSON.parse(savedFacts).includes(fact))]
      const completedDialogues = JSON.parse(savedCompleted)

      // Add current character if not already completed
      if (!completedDialogues.includes(character.id)) {
        completedDialogues.push(character.id)
      }

      // Save updated data
      localStorage.setItem("historical-dialogues-score", totalScore.toString())
      localStorage.setItem("historical-dialogues-facts", JSON.stringify(allFacts))
      localStorage.setItem("historical-dialogues-completed", JSON.stringify(completedDialogues))
    },
    [character],
  )

  // Handle sending a message
  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || !character || !dialogueScenario) return

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: inputValue,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate character thinking
    setCurrentMood("thinking")

    // Generate character response
    setTimeout(() => {
      let responseText = ""
      let newMood: "neutral" | "happy" | "surprised" = "neutral"
      let newFact: string | null = null

      // Check for keywords in user message to determine response
      const lowerCaseInput = inputValue.toLowerCase()

      // Find matching response from dialogue data
      const matchingResponse = dialogueScenario.responses.find((r) =>
        r.keywords.some((keyword) => lowerCaseInput.includes(keyword)),
      )

      if (matchingResponse) {
        responseText = matchingResponse.text
        newMood = matchingResponse.mood || "neutral"
        newFact = matchingResponse.fact || null
      } else {
        // Default response if no keywords match
        responseText =
          dialogueScenario.defaultResponses[Math.floor(Math.random() * dialogueScenario.defaultResponses.length)]
        newMood = "neutral"
      }

      // Create JSON response with mood
      const responseJson = {
        mood: newMood,
        message: responseText,
      }

      // Add character response with typing indicator
      const characterMessage = {
        id: `char-${Date.now()}`,
        sender: "character",
        content: JSON.stringify(responseJson),
        isTyping: true,
        mood: newMood,
      }

      setMessages((prev) => [...prev, characterMessage])
      setCurrentMood(newMood)

      // Add discovered fact if there is one
      if (newFact && !discoveredFacts.includes(newFact)) {
        setDiscoveredFacts((prev) => [...prev, newFact!])
        setScore((prev) => prev + 50)
      }

      // After a delay, remove the typing indicator
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === characterMessage.id ? { ...msg, isTyping: false } : msg)))
      }, 1500)

      // Check if we should transition to quiz after several exchanges
      if (messages.filter((m) => m.sender === "user").length >= 5 && dialogueState === "free-chat") {
        setTimeout(() => {
          const quizIntroJson = {
            mood: "neutral" as const,
            message: dialogueScenario.quizIntroduction,
          }

          const quizIntroMessage = {
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
  }, [inputValue, character, dialogueScenario, messages, dialogueState, discoveredFacts])

  // Handle quiz answer
  const handleQuizAnswer = useCallback(
    (isCorrect: boolean) => {
      if (!dialogueScenario) return

      // Add points for correct answer
      if (isCorrect) {
        setScore((prev) => prev + 100)
        setCurrentMood("happy")
      } else {
        setCurrentMood("surprised")
      }

      // Create response JSON with mood
      const responseJson = {
        mood: isCorrect ? ("happy" as const) : ("surprised" as const),
        message: isCorrect
          ? dialogueScenario.quizzes[currentQuizIndex].correctResponse
          : dialogueScenario.quizzes[currentQuizIndex].incorrectResponse,
      }

      // Add response based on correctness
      const responseMessage = {
        id: `quiz-response-${Date.now()}`,
        sender: "character",
        content: JSON.stringify(responseJson),
        isTyping: true,
        mood: responseJson.mood,
      }

      setMessages((prev) => [...prev, responseMessage])

      // After a delay, remove the typing indicator
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === responseMessage.id ? { ...msg, isTyping: false } : msg)))
      }, 1500)

      // Move to next quiz or conclusion
      setTimeout(() => {
        if (currentQuizIndex < dialogueScenario.quizzes.length - 1) {
          setCurrentQuizIndex((prev) => prev + 1)
        } else {
          // End of quiz, move to conclusion
          const conclusionJson = {
            mood: "neutral" as const,
            message: dialogueScenario.conclusion,
          }

          const conclusionMessage = {
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

            // Save progress
            saveProgress(score, discoveredFacts)
          }, 2000)
        }
      }, 2000)
    },
    [dialogueScenario, currentQuizIndex, score, discoveredFacts, saveProgress],
  )

  // Handle dialogue completion
  const handleCompleteDialogue = useCallback(() => {
    saveProgress(score, discoveredFacts)
    router.push("/games/historical-dialogues")
  }, [router, saveProgress, score, discoveredFacts])

  // Get display message from JSON content
  const getDisplayMessage = (content: string): string => {
    try {
      const parsed = JSON.parse(content) as AIResponseType
      return parsed.message
    } catch (e) {
      // If parsing fails, return the original content
      return content
    }
  }

  if (!character || !dialogueScenario) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 dark:from-slate-900 dark:to-amber-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/games/historical-dialogues")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-amber-600 dark:text-amber-500" />
              <span className="text-lg font-semibold">Dialogue avec {character.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className="bg-amber-100/50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
            >
              <Award className="h-3 w-3 mr-1" />
              {score} points
            </Badge>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-10rem)]">
          {/* Character Illustration */}
          <div className="relative h-full rounded-lg overflow-hidden border bg-white/50 dark:bg-white/5 flex items-center justify-center">
            <CharacterIllustration
              character={character}
              mood={currentMood}
              message={currentCharacterMessage ? getDisplayMessage(currentCharacterMessage.content) : undefined}
              isTyping={currentCharacterMessage?.isTyping}
            />

            {/* Period indicator */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs">
              {character.period}
            </div>

            {/* Quiz overlay */}
            {dialogueState === "quiz" && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent">
                <QuizQuestion
                  question={dialogueScenario.quizzes[currentQuizIndex].question}
                  options={dialogueScenario.quizzes[currentQuizIndex].options}
                  onAnswer={handleQuizAnswer}
                />
              </div>
            )}

            {/* Conclusion overlay */}
            {dialogueState === "conclusion" && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent">
                <div className="text-center space-y-4">
                  <h3 className="font-bold text-lg">Dialogue terminé!</h3>
                  <p className="text-sm text-muted-foreground">
                    Vous avez découvert {discoveredFacts.length} faits historiques et gagné {score} points.
                  </p>
                  <Button onClick={handleCompleteDialogue}>Terminer la conversation</Button>
                </div>
              </div>
            )}
          </div>

          {/* Dialogue and facts */}
          <div className="h-full flex flex-col">
            <Tabs defaultValue="dialogue" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start">
                <TabsTrigger
                  value="dialogue"
                  className="data-[state=active]:bg-amber-100/50 dark:data-[state=active]:bg-amber-900/20"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Dialogue
                </TabsTrigger>
                <TabsTrigger
                  value="facts"
                  className="data-[state=active]:bg-amber-100/50 dark:data-[state=active]:bg-amber-900/20"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Faits découverts ({discoveredFacts.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dialogue" className="flex-1 flex flex-col m-0 data-[state=active]:flex-1">
                {/* Messages area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 border rounded-lg bg-card/50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {message.isTyping ? (
                          <TypingEffect
                            text={message.sender === "character" ? getDisplayMessage(message.content) : message.content}
                          />
                        ) : (
                          <p>{message.sender === "character" ? getDisplayMessage(message.content) : message.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input area (only in free-chat state) */}
                {dialogueState === "free-chat" && (
                  <div className="mt-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Posez une question..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage}>Envoyer</Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="facts"
                className="flex-1 overflow-y-auto p-4 space-y-4 m-0 border rounded-lg bg-card/50"
              >
                {discoveredFacts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun fait découvert</h3>
                    <p className="text-muted-foreground max-w-xs">
                      Posez des questions pertinentes au personnage pour découvrir des faits historiques
                    </p>
                  </div>
                ) : (
                  discoveredFacts.map((fact, index) => <FactCard key={index} fact={fact} character={character} />)
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

