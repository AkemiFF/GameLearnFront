"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  X,
  HelpCircle,
  ChevronRight,
  Clock,
  Trophy,
  Lightbulb,
  Flag,
  MapPin,
  Languages,
  Coins,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Country } from "@/data/countries"

interface CountryQuizProps {
  country: Country
  onComplete: (score: number, questionCount: number) => void
  difficulty?: "easy" | "normal" | "hard"
  soundEnabled?: boolean
}

// Composant AiHint simplifié pour éviter les dépendances
function AiHint({ hint }: { hint: string }) {
  const [isGenerating, setIsGenerating] = useState(true)
  const [generatedHint, setGeneratedHint] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  // Simulate AI hint generation
  useEffect(() => {
    if (isGenerating) {
      const timer = setTimeout(() => {
        if (currentIndex < hint.length) {
          setGeneratedHint(hint.substring(0, currentIndex + 1))
          setCurrentIndex(currentIndex + 1)
        } else {
          setIsGenerating(false)
        }
      }, 20)

      return () => clearTimeout(timer)
    }
  }, [isGenerating, currentIndex, hint])

  return (
    <div className="text-sm">
      {isGenerating ? (
        <div className="flex items-center gap-2">
          <span>{generatedHint}</span>
          <span className="inline-block h-4 w-1 bg-amber-500 animate-pulse"></span>
        </div>
      ) : (
        <p>{hint}</p>
      )}
    </div>
  )
}

export function CountryQuiz({ country, onComplete, difficulty = "normal", soundEnabled = true }: CountryQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [usedHint, setUsedHint] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isComplete, setIsComplete] = useState(false)
  const [quizCategory, setQuizCategory] = useState<string>("mixed")
  const [questions, setQuestions] = useState<any[]>([])

  // Audio refs
  const correctSoundRef = useRef<HTMLAudioElement | null>(null)
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null)
  const completeSoundRef = useRef<HTMLAudioElement | null>(null)
  const tickSoundRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio elements
  useEffect(() => {
    if (typeof window !== "undefined") {
      correctSoundRef.current = new Audio("/sounds/correct.mp3")
      wrongSoundRef.current = new Audio("/sounds/wrong.mp3")
      completeSoundRef.current = new Audio("/sounds/complete.mp3")
      tickSoundRef.current = new Audio("/sounds/tick.mp3")

      // Set volume
      if (correctSoundRef.current) correctSoundRef.current.volume = 0.5
      if (wrongSoundRef.current) wrongSoundRef.current.volume = 0.5
      if (completeSoundRef.current) completeSoundRef.current.volume = 0.5
      if (tickSoundRef.current) tickSoundRef.current.volume = 0.2
    }

    return () => {
      // Cleanup
      if (correctSoundRef.current) correctSoundRef.current = null
      if (wrongSoundRef.current) wrongSoundRef.current = null
      if (completeSoundRef.current) completeSoundRef.current = null
      if (tickSoundRef.current) tickSoundRef.current = null
    }
  }, [])

  // Play sound
  const playSound = (type: "correct" | "wrong" | "complete" | "tick") => {
    if (!soundEnabled || typeof window === "undefined") return

    switch (type) {
      case "correct":
        if (correctSoundRef.current) {
          correctSoundRef.current.currentTime = 0
          correctSoundRef.current.play().catch((e) => console.error("Error playing sound:", e))
        }
        break
      case "wrong":
        if (wrongSoundRef.current) {
          wrongSoundRef.current.currentTime = 0
          wrongSoundRef.current.play().catch((e) => console.error("Error playing sound:", e))
        }
        break
      case "complete":
        if (completeSoundRef.current) {
          completeSoundRef.current.currentTime = 0
          completeSoundRef.current.play().catch((e) => console.error("Error playing sound:", e))
        }
        break
      case "tick":
        if (tickSoundRef.current) {
          tickSoundRef.current.currentTime = 0
          tickSoundRef.current.play().catch((e) => console.error("Error playing sound:", e))
        }
        break
    }
  }

  // Generate questions based on difficulty and category
  useEffect(() => {
    // Set time limit based on difficulty
    switch (difficulty) {
      case "easy":
        setTimeLeft(45)
        break
      case "normal":
        setTimeLeft(30)
        break
      case "hard":
        setTimeLeft(20)
        break
    }

    // Generate questions
    const generatedQuestions = generateQuestions(country, difficulty, quizCategory)
    setQuestions(generatedQuestions)
  }, [country, difficulty, quizCategory])

  // Timer effect
  useEffect(() => {
    if (!isAnswered && !isComplete && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)

        // Play tick sound when time is running low
        if (timeLeft <= 5) {
          playSound("tick")
        }
      }, 1000)

      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isAnswered && !isComplete) {
      handleAnswer(-1) // Time's up, wrong answer
    }
  }, [timeLeft, isAnswered, isComplete])

  // Handle answer selection
  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
    setIsAnswered(true)

    const isCorrect = index === questions[currentQuestion].correctAnswer

    // Play sound
    if (isCorrect) {
      playSound("correct")
    } else {
      playSound("wrong")
    }

    // Calculate points (base: 100, with hint: 50, wrong: 0)
    if (isCorrect) {
      // Adjust points based on difficulty
      let basePoints = 100
      switch (difficulty) {
        case "easy":
          basePoints = 75
          break
        case "normal":
          basePoints = 100
          break
        case "hard":
          basePoints = 150
          break
      }

      // Adjust for hint usage
      const pointsEarned = usedHint ? Math.floor(basePoints / 2) : basePoints

      // Add time bonus for hard difficulty
      const timeBonus = difficulty === "hard" ? Math.floor(timeLeft * 2) : 0

      setScore(score + pointsEarned + timeBonus)
    }
  }

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setShowHint(false)
      setUsedHint(false)

      // Reset timer based on difficulty
      switch (difficulty) {
        case "easy":
          setTimeLeft(45)
          break
        case "normal":
          setTimeLeft(30)
          break
        case "hard":
          setTimeLeft(20)
          break
      }
    } else {
      setIsComplete(true)
      playSound("complete")
    }
  }

  // Handle quiz completion
  const handleComplete = () => {
    onComplete(score, questions.length * 100)
  }

  // Show hint
  const handleShowHint = () => {
    setShowHint(true)
    setUsedHint(true)
  }

  // Calculate progress percentage
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100

  // Get question icon based on type
  const getQuestionIcon = (type: string) => {
    switch (type) {
      case "capital":
        return <MapPin className="h-5 w-5 text-primary" />
      case "flag":
        return <Flag className="h-5 w-5 text-primary" />
      case "language":
        return <Languages className="h-5 w-5 text-primary" />
      case "currency":
        return <Coins className="h-5 w-5 text-primary" />
      case "population":
        return <Users className="h-5 w-5 text-primary" />
      default:
        return <HelpCircle className="h-5 w-5 text-primary" />
    }
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!isComplete ? (
        <>
          {/* Category selector (only for first question) */}
          {currentQuestion === 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={quizCategory === "mixed" ? "default" : "outline"}
                size="sm"
                onClick={() => setQuizCategory("mixed")}
              >
                Mixte
              </Button>
              <Button
                variant={quizCategory === "geography" ? "default" : "outline"}
                size="sm"
                onClick={() => setQuizCategory("geography")}
              >
                Géographie
              </Button>
              <Button
                variant={quizCategory === "culture" ? "default" : "outline"}
                size="sm"
                onClick={() => setQuizCategory("culture")}
              >
                Culture
              </Button>
              <Button
                variant={quizCategory === "history" ? "default" : "outline"}
                size="sm"
                onClick={() => setQuizCategory("history")}
              >
                Histoire
              </Button>
            </div>
          )}

          {/* Progress and timer */}
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1 mr-4">
              <div className="flex items-center justify-between text-xs">
                <span>
                  Question {currentQuestion + 1}/{questions.length}
                </span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                timeLeft < 10 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-muted"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span className="font-mono font-medium">{timeLeft}s</span>
            </div>
          </div>

          {/* Question */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {questions[currentQuestion] && getQuestionIcon(questions[currentQuestion].type)}
              <h3 className="text-lg font-medium">{questions[currentQuestion]?.question}</h3>
            </div>

            {/* Question image (if any) */}
            {questions[currentQuestion]?.image && (
              <div className="flex justify-center">
                <div className="rounded-lg overflow-hidden border max-w-xs">
                  <img
                    src={questions[currentQuestion].image || "/placeholder.svg"}
                    alt="Question"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            {/* Difficulty badge */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {difficulty === "easy" ? "Facile" : difficulty === "normal" ? "Normal" : "Difficile"}
              </Badge>

              {difficulty === "hard" && (
                <div className="text-xs text-muted-foreground">Bonus de temps: +2 points/seconde</div>
              )}
            </div>

            {/* Hint */}
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md p-3"
                >
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-300">Indice</p>
                      <AiHint hint={questions[currentQuestion]?.hint} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Answer options */}
            <div className="space-y-3">
              {questions[currentQuestion]?.options.map((option: string, index: number) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                    isAnswered && selectedAnswer === index
                      ? index === questions[currentQuestion].correctAnswer
                        ? "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700"
                        : "bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700"
                      : isAnswered && index === questions[currentQuestion].correctAnswer
                        ? "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700"
                        : "hover:bg-muted"
                  }`}
                  onClick={() => !isAnswered && handleAnswer(index)}
                >
                  <div className="flex-1">{option}</div>
                  {isAnswered &&
                    (index === questions[currentQuestion].correctAnswer ? (
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : selectedAnswer === index ? (
                      <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                    ) : null)}
                </motion.div>
              ))}
            </div>

            {/* Explanation (after answering) */}
            {isAnswered && questions[currentQuestion]?.explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-muted p-3 rounded-md text-sm"
              >
                <p className="font-medium mb-1">Explication:</p>
                <p>{questions[currentQuestion].explanation}</p>
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" size="sm" onClick={handleShowHint} disabled={isAnswered || showHint}>
              <Lightbulb className="mr-2 h-4 w-4" />
              Indice (-50%)
            </Button>

            <Button size="sm" onClick={handleNextQuestion} disabled={!isAnswered}>
              {currentQuestion < questions.length - 1 ? (
                <>
                  Suivant
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Terminer"
              )}
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-1">Quiz terminé !</h3>
            <p className="text-muted-foreground">
              Vous avez obtenu {score} points sur {questions.length * 100} possibles
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Score</span>
              <span>{Math.round((score / (questions.length * 100)) * 100)}%</span>
            </div>
            <Progress value={(score / (questions.length * 100)) * 100} className="h-2" />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Button variant="outline" className="flex-1" onClick={() => onComplete(0, questions.length * 100)}>
              Réessayer
            </Button>
            <Button className="flex-1" onClick={handleComplete}>
              Continuer l'exploration
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Function to generate questions based on difficulty and category
function generateQuestions(country: Country, difficulty: string, category: string) {
  const questions = []

  // Basic questions (always included)
  questions.push({
    type: "capital",
    question: `Quelle est la capitale de ${country.name} ?`,
    options: generateCapitalOptions(country.capital),
    correctAnswer: 0,
    hint: `La capitale de ${country.name} commence par la lettre "${country.capital[0]}".`,
    explanation: `La capitale de ${country.name} est ${country.capital}.`,
  })

  questions.push({
    type: "flag",
    question: `À quel pays appartient ce drapeau ?`,
    image: `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`,
    options: [country.name, ...generateCountryOptions(country.name, 3)],
    correctAnswer: 0,
    hint: `Ce pays se trouve en ${country.continent}.`,
    explanation: `Ce drapeau appartient à ${country.name}.`,
  })

  // Geography questions
  if (category === "geography" || category === "mixed") {
    questions.push({
      type: "geography",
      question: `Sur quel continent se trouve ${country.name} ?`,
      options: ["Europe", "Asie", "Afrique", "Amérique du Nord", "Amérique du Sud", "Océanie"],
      correctAnswer: ["Europe", "Asie", "Afrique", "Amérique du Nord", "Amérique du Sud", "Océanie"].indexOf(
        country.continent,
      ),
      hint: `${country.name} est situé à l'est/ouest/nord/sud de...`,
      explanation: `${country.name} est situé sur le continent ${country.continent}.`,
    })
  }

  // Language questions
  if (category === "culture" || category === "mixed") {
    questions.push({
      type: "language",
      question: `Quelle langue est officiellement parlée en ${country.name} ?`,
      options: generateLanguageOptions(country.language),
      correctAnswer: 0,
      hint: `La langue officielle de ${country.name} est d'origine latine/germanique/slave...`,
      explanation: `La langue officielle de ${country.name} est le ${country.language}.`,
    })
  }

  // Currency questions
  if (category === "economy" || category === "mixed") {
    questions.push({
      type: "currency",
      question: `Quelle est la monnaie utilisée en ${country.name} ?`,
      options: generateCurrencyOptions(country.currency),
      correctAnswer: 0,
      hint: `La monnaie de ${country.name} est utilisée dans plusieurs/peu de pays.`,
      explanation: `La monnaie utilisée en ${country.name} est ${country.currency}.`,
    })
  }

  // Population questions
  if (category === "geography" || category === "mixed") {
    questions.push({
      type: "population",
      question: `Quelle est la population approximative de ${country.name} ?`,
      options: generatePopulationOptions(country.population),
      correctAnswer: 0,
      hint: `La population de ${country.name} est ${country.population > 10000000 ? "supérieure" : "inférieure"} à 10 millions d'habitants.`,
      explanation: `La population de ${country.name} est d'environ ${formatPopulation(country.population)}.`,
    })
  }

  // Add more questions based on difficulty
  if (difficulty === "hard") {
    // Add harder questions for hard difficulty
    questions.push({
      type: "history",
      question: `Quel événement historique important s'est produit en ${country.name} ?`,
      options: generateHistoricalEvents(country.name),
      correctAnswer: 0,
      hint: `Cet événement est lié à l'histoire politique/culturelle/économique de ${country.name}.`,
      explanation: `Cet événement a eu un impact significatif sur l'histoire de ${country.name}.`,
    })
  }

  // Shuffle and limit questions based on difficulty
  const shuffledQuestions = shuffleArray(questions)

  switch (difficulty) {
    case "easy":
      return shuffledQuestions.slice(0, 3)
    case "normal":
      return shuffledQuestions.slice(0, 5)
    case "hard":
      return shuffledQuestions.slice(0, 7)
    default:
      return shuffledQuestions.slice(0, 5)
  }
}

// Helper functions to generate quiz options
function generateCapitalOptions(correctCapital: string): string[] {
  // In a real app, these would be randomly selected from a database
  const otherCapitals = ["Paris", "Londres", "Berlin", "Madrid", "Rome", "Lisbonne", "Bruxelles", "Amsterdam"]
  const options = [correctCapital]

  while (options.length < 4) {
    const randomCapital = otherCapitals[Math.floor(Math.random() * otherCapitals.length)]
    if (!options.includes(randomCapital)) {
      options.push(randomCapital)
    }
  }

  return shuffleArray(options)
}

function generateCountryOptions(correctCountry: string, count: number): string[] {
  // In a real app, these would be randomly selected from a database
  const otherCountries = ["France", "Allemagne", "Espagne", "Italie", "Royaume-Uni", "Portugal", "Belgique", "Pays-Bas"]
  const options = []

  while (options.length < count) {
    const randomCountry = otherCountries[Math.floor(Math.random() * otherCountries.length)]
    if (!options.includes(randomCountry) && randomCountry !== correctCountry) {
      options.push(randomCountry)
    }
  }

  return options
}

function generateLanguageOptions(correctLanguage: string): string[] {
  const otherLanguages = ["Français", "Anglais", "Espagnol", "Allemand", "Italien", "Portugais", "Russe", "Arabe"]
  const options = [correctLanguage]

  while (options.length < 4) {
    const randomLanguage = otherLanguages[Math.floor(Math.random() * otherLanguages.length)]
    if (!options.includes(randomLanguage)) {
      options.push(randomLanguage)
    }
  }

  return shuffleArray(options)
}

function generateCurrencyOptions(correctCurrency: string): string[] {
  const otherCurrencies = [
    "Euro (€)",
    "Dollar américain ($)",
    "Livre sterling (£)",
    "Yen (¥)",
    "Franc suisse (CHF)",
    "Yuan (¥)",
    "Rouble (₽)",
    "Real (R$)",
  ]
  const options = [correctCurrency]

  while (options.length < 4) {
    const randomCurrency = otherCurrencies[Math.floor(Math.random() * otherCurrencies.length)]
    if (!options.includes(randomCurrency)) {
      options.push(randomCurrency)
    }
  }

  return shuffleArray(options)
}

function generatePopulationOptions(correctPopulation: number): string[] {
  const formattedPopulation = formatPopulation(correctPopulation)
  const options = [formattedPopulation]

  // Generate 3 other options that are different but plausible
  const variations = [0.5, 2, 5]

  for (const variation of variations) {
    const factor = Math.random() < 0.5 ? variation : 1 / variation
    const newPopulation = Math.round(correctPopulation * factor)
    options.push(formatPopulation(newPopulation))
  }

  return shuffleArray(options)
}

function generateHistoricalEvents(country: string): string[] {
  // This would be replaced with actual historical events for each country
  return [
    `Révolution de ${1700 + Math.floor(Math.random() * 300)}`,
    `Guerre de ${1800 + Math.floor(Math.random() * 200)}`,
    `Indépendance en ${1800 + Math.floor(Math.random() * 200)}`,
    `Réforme économique de ${1900 + Math.floor(Math.random() * 100)}`,
  ]
}

function formatPopulation(population: number): string {
  if (population >= 1000000) {
    return `${(population / 1000000).toFixed(1)} millions`
  } else if (population >= 1000) {
    return `${(population / 1000).toFixed(0)} milliers`
  } else {
    return population.toString()
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export default CountryQuiz

