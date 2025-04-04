"use client"

import { useState, useEffect, useRef } from "react"
import { MessageSquare, BookOpen, Send, X, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CharacterPortrait } from "@/components/historical-dialogues/character-portrait"
import { TypingEffect } from "@/components/historical-dialogues/typing-effect"
import { FactCard } from "@/components/historical-dialogues/fact-card"
import { QuizQuestion } from "@/components/historical-dialogues/quiz-question"
import type { HistoricalCharacter } from "@/data/historical-characters"
import { getDialogueForCharacter } from "@/data/dialogue-scenarios"

interface DialogueInterfaceProps {
  character: HistoricalCharacter
  onComplete: (score: number, facts: string[]) => void
}

type MessageType = {
  id: string
  sender: "user" | "character"
  content: string
  isTyping?: boolean
}

type DialogueState = "intro" | "free-chat" | "quiz" | "conclusion"

export function DialogueInterface({ character, onComplete }: DialogueInterfaceProps) {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [inputValue, setInputValue] = useState("")
  const [dialogueState, setDialogueState] = useState<DialogueState>("intro")
  const [currentMood, setCurrentMood] = useState<"neutral" | "happy" | "thinking" | "surprised">("neutral")
  const [discoveredFacts, setDiscoveredFacts] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("dialogue")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const dialogueScenario = getDialogueForCharacter(character.id)

  // Initialize dialogue
  useEffect(() => {
    // Add introduction message
    const introMessage = {
      id: `char-intro-${Date.now()}`,
      sender: "character",
      content: dialogueScenario.introduction,
      isTyping: true,
    } as MessageType

    setMessages([introMessage])

    // After intro, show the first predefined options
    const timer = setTimeout(() => {
      setDialogueState("free-chat")
    }, 2000)

    return () => clearTimeout(timer)
  }, [character.id, dialogueScenario.introduction])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return

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
      let response = ""
      let newMood: "neutral" | "happy" | "surprised" = "neutral"
      let newFact: string | null = null

      // Check for keywords in user message to determine response
      const lowerCaseInput = inputValue.toLowerCase()

      // Find matching response from dialogue data
      const matchingResponse = dialogueScenario.responses.find((r) =>
        r.keywords.some((keyword) => lowerCaseInput.includes(keyword)),
      )

      if (matchingResponse) {
        response = matchingResponse.text
        newMood = matchingResponse.mood || "neutral"
        newFact = matchingResponse.fact || null
      } else {
        // Default response if no keywords match
        response =
          dialogueScenario.defaultResponses[Math.floor(Math.random() * dialogueScenario.defaultResponses.length)]
        newMood = "neutral"
      }

      // Add character response
      const characterMessage = {
        id: `char-${Date.now()}`,
        sender: "character",
        content: response,
        isTyping: true,
      }

      setMessages((prev) => [...prev, characterMessage])
      setCurrentMood(newMood)

      // Add discovered fact if there is one
      if (newFact && !discoveredFacts.includes(newFact)) {
        setDiscoveredFacts((prev) => [...prev, newFact!])
        setScore((prev) => prev + 50)

        // Show notification for new fact
        // This could be implemented with a toast notification
      }

      // Check if we should transition to quiz after several exchanges
      if (messages.filter((m) => m.sender === "user").length >= 5 && dialogueState === "free-chat") {
        setTimeout(() => {
          const quizIntroMessage = {
            id: `quiz-intro-${Date.now()}`,
            sender: "character",
            content: dialogueScenario.quizIntroduction,
            isTyping: true,
          }
          setMessages((prev) => [...prev, quizIntroMessage])
          setDialogueState("quiz")
        }, 2000)
      }
    }, 1500)
  }

  // Handle quiz answer
  const handleQuizAnswer = (isCorrect: boolean) => {
    // Add points for correct answer
    if (isCorrect) {
      setScore((prev) => prev + 100)
      setCurrentMood("happy")
    } else {
      setCurrentMood("surprised")
    }

    // Add response based on correctness
    const responseMessage = {
      id: `quiz-response-${Date.now()}`,
      sender: "character",
      content: isCorrect
        ? dialogueScenario.quizzes[currentQuizIndex].correctResponse
        : dialogueScenario.quizzes[currentQuizIndex].incorrectResponse,
      isTyping: true,
    }

    setMessages((prev) => [...prev, responseMessage])

    // Move to next quiz or conclusion
    setTimeout(() => {
      if (currentQuizIndex < dialogueScenario.quizzes.length - 1) {
        setCurrentQuizIndex((prev) => prev + 1)
      } else {
        // End of quiz, move to conclusion
        const conclusionMessage = {
          id: `conclusion-${Date.now()}`,
          sender: "character",
          content: dialogueScenario.conclusion,
          isTyping: true,
        }

        setMessages((prev) => [...prev, conclusionMessage])
        setDialogueState("conclusion")
      }
    }, 2000)
  }

  // Handle dialogue completion
  const handleCompleteDialogue = () => {
    onComplete(score, discoveredFacts)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden">
            <img
              src={character.portraitUrl || "/placeholder.svg"}
              alt={character.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold">{character.name}</h3>
            <p className="text-xs text-muted-foreground">{character.period}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-amber-100/50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
            <Award className="h-3 w-3 mr-1" />
            {score} points
          </Badge>

          <Button variant="ghost" size="icon" onClick={handleCompleteDialogue}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <Tabs defaultValue="dialogue" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <div className="border-b px-4">
          <TabsList className="h-10">
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
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="dialogue" className="h-full flex flex-col m-0 data-[state=active]:flex-1">
            {/* Character portrait and dialogue area */}
            <div className="flex flex-col h-full">
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      {message.isTyping ? <TypingEffect text={message.content} /> : <p>{message.content}</p>}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Character portrait (only visible in quiz and conclusion states) */}
              {(dialogueState === "quiz" || dialogueState === "conclusion") && (
                <div className="relative h-64 border-t">
                  <div className="absolute bottom-0 left-0 right-0 h-64">
                    <CharacterPortrait character={character} mood={currentMood} />
                  </div>

                  {/* Quiz question overlay */}
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
              )}

              {/* Input area (only in free-chat state) */}
              {dialogueState === "free-chat" && (
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Posez une question..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="facts" className="h-full overflow-y-auto p-4 space-y-4 m-0">
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
        </div>
      </Tabs>
    </div>
  )
}

