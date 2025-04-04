"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Award,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  HelpCircle,
  Home,
  Info,
  Star,
  Trophy,
  X,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.id

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isPaused, setIsPaused] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Mock game data based on ID
  const game = {
    id: gameId,
    title: "Quiz Avancé: Système Solaire",
    type: "Quiz",
    category: "Sciences",
    difficulty: "Intermédiaire",
    duration: "15 min",
    description:
      "Testez vos connaissances sur le système solaire avec ce quiz interactif. Découvrez des faits fascinants sur les planètes, les étoiles et les phénomènes astronomiques.",
    thumbnail: "/placeholder.svg?height=300&width=600",
    questions: [
      {
        id: 1,
        question: "Quelle est la planète la plus proche du Soleil ?",
        options: ["Vénus", "Mercure", "Mars", "Terre"],
        correctAnswer: 1,
        hint: "C'est la plus petite planète du système solaire.",
      },
      {
        id: 2,
        question: "Combien de planètes composent notre système solaire ?",
        options: ["7", "8", "9", "10"],
        correctAnswer: 1,
        hint: "Pluton n'est plus considérée comme une planète depuis 2006.",
      },
      {
        id: 3,
        question: "Quelle planète est connue pour ses anneaux spectaculaires ?",
        options: ["Jupiter", "Uranus", "Neptune", "Saturne"],
        correctAnswer: 3,
        hint: "Ses anneaux sont composés principalement de particules de glace.",
      },
      {
        id: 4,
        question: "Quelle est la plus grande planète du système solaire ?",
        options: ["Terre", "Saturne", "Jupiter", "Neptune"],
        correctAnswer: 2,
        hint: "Elle est si grande qu'elle pourrait contenir plus de 1300 Terres.",
      },
      {
        id: 5,
        question: "Combien de temps met la lumière du Soleil pour atteindre la Terre ?",
        options: ["8 minutes", "8 secondes", "8 heures", "8 jours"],
        correctAnswer: 0,
        hint: "La lumière voyage à environ 300 000 km par seconde.",
      },
    ],
  }

  useEffect(() => {
    if (!isPaused && !showResults && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResults) {
      handleNextQuestion()
    }
  }, [timeLeft, isPaused, showResults])

  const handleAnswerSelect = (index) => {
    if (!isAnswered) {
      setSelectedAnswer(index)
      setIsAnswered(true)

      if (index === game.questions[currentQuestion].correctAnswer) {
        setScore(score + 1)
      }
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < game.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setShowHint(false)
      setTimeLeft(60)
    } else {
      setShowResults(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setShowResults(false)
    setShowHint(false)
    setTimeLeft(60)
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / game.questions.length) * 100
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">EduPlay Studio</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={togglePause}>
              {isPaused ? "Reprendre" : "Pause"}
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl"
        >
          {/* Game info */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{game.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge>{game.type}</Badge>
                <Badge variant="outline">{game.category}</Badge>
                <Badge variant="outline">{game.difficulty}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{game.duration}</span>
                </div>
              </div>
            </div>
            {!showResults && (
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">
                  Question {currentQuestion + 1}/{game.questions.length}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{timeLeft}s</span>
                </div>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {!showResults && (
            <div className="mb-8">
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          )}

          {/* Quiz content */}
          {!showResults ? (
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-xl">{game.questions[currentQuestion].question}</CardTitle>
                {showHint && (
                  <CardDescription className="mt-2 flex items-start gap-2 rounded-lg bg-primary/10 p-3 text-sm">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{game.questions[currentQuestion].hint}</span>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-6">
                <RadioGroup value={selectedAnswer !== null ? selectedAnswer.toString() : undefined}>
                  {game.questions[currentQuestion].options.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="mb-4 last:mb-0"
                    >
                      <div
                        className={`flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                          isAnswered && index === selectedAnswer
                            ? index === game.questions[currentQuestion].correctAnswer
                              ? "border-green-500 bg-green-50"
                              : "border-red-500 bg-red-50"
                            : isAnswered && index === game.questions[currentQuestion].correctAnswer
                              ? "border-green-500 bg-green-50"
                              : ""
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} disabled={isAnswered} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base font-medium">
                          {option}
                        </Label>
                        {isAnswered && (
                          <div className="ml-auto">
                            {index === game.questions[currentQuestion].correctAnswer ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : index === selectedAnswer ? (
                              <X className="h-5 w-5 text-red-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t bg-muted/20 p-4">
                <Button variant="outline" onClick={() => setShowHint(true)} disabled={showHint}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Indice
                </Button>
                <Button onClick={handleNextQuestion} disabled={!isAnswered}>
                  {currentQuestion < game.questions.length - 1 ? (
                    <>
                      Question suivante
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Voir les résultats"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <Trophy className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Quiz terminé !</CardTitle>
                  <CardDescription>
                    Vous avez obtenu {score} sur {game.questions.length} points
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6 space-y-2 text-center">
                    <div className="text-4xl font-bold">{Math.round((score / game.questions.length) * 100)}%</div>
                    <Progress value={(score / game.questions.length) * 100} className="h-2" />
                    <div className="text-sm text-muted-foreground">
                      {score === game.questions.length
                        ? "Parfait ! Vous avez tout bon !"
                        : score >= game.questions.length / 2
                          ? "Bien joué ! Vous avez réussi ce quiz."
                          : "Continuez à vous entraîner pour améliorer votre score."}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Récompenses obtenues</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <motion.div
                        initial={{ opacity: 0, rotateY: 90 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex flex-col items-center justify-center rounded-lg border p-4 text-center"
                      >
                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <Star className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-sm font-medium">Quiz Complété</div>
                        <div className="text-xs text-muted-foreground">+50 XP</div>
                      </motion.div>

                      {score >= game.questions.length / 2 && (
                        <motion.div
                          initial={{ opacity: 0, rotateY: 90 }}
                          animate={{ opacity: 1, rotateY: 0 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          className="flex flex-col items-center justify-center rounded-lg border p-4 text-center"
                        >
                          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Trophy className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-sm font-medium">Bon Score</div>
                          <div className="text-xs text-muted-foreground">+25 XP</div>
                        </motion.div>
                      )}

                      {score === game.questions.length && (
                        <motion.div
                          initial={{ opacity: 0, rotateY: 90 }}
                          animate={{ opacity: 1, rotateY: 0 }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                          className="flex flex-col items-center justify-center rounded-lg border p-4 text-center"
                        >
                          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Award className="h-6 w-6 text-primary" />
                          </div>
                          <div className="text-sm font-medium">Score Parfait</div>
                          <div className="text-xs text-muted-foreground">+100 XP</div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 border-t p-6 sm:flex-row">
                  <Button variant="outline" className="w-full" onClick={resetQuiz}>
                    Recommencer le quiz
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/games">Explorer d'autres jeux</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Pause dialog */}
      <Dialog open={isPaused} onOpenChange={setIsPaused}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jeu en pause</DialogTitle>
            <DialogDescription>Prenez une pause. Votre temps est arrêté.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h3 className="mb-2 font-medium">Progression actuelle</h3>
            <div className="mb-4 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>
                  Question {currentQuestion + 1} sur {game.questions.length}
                </span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              Score actuel: {score} / {currentQuestion}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Quitter le jeu</Link>
            </Button>
            <Button onClick={() => setIsPaused(false)}>Continuer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33F3"][Math.floor(Math.random() * 5)],
                top: `${Math.random() * -10}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: ["0vh", "100vh"],
                x: [`${Math.random() * 10 - 5}vw`, `${Math.random() * 20 - 10}vw`],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                ease: "easeOut",
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

