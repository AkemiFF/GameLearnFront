"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { HelpCircle, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface QuizQuestionProps {
  question: string
  options: { text: string; isCorrect: boolean }[]
  onAnswer: (isCorrect: boolean) => void
}

export function QuizQuestion({ question, options, onAnswer }: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return

    setSelectedOption(index)
  }

  const handleSubmit = () => {
    if (selectedOption === null || isAnswered) return

    const isCorrect = options[selectedOption].isCorrect
    setIsAnswered(true)

    // Delay to show the result before calling onAnswer
    setTimeout(() => {
      onAnswer(isCorrect)

      // Reset state for next question
      setSelectedOption(null)
      setIsAnswered(false)
    }, 1500)
  }

  return (
    <Card className="border-amber-200 dark:border-amber-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-500" />
          Question
        </CardTitle>
        <CardDescription>{question}</CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="space-y-2">
          {options.map((option, index) => (
            <motion.div
              key={index}
              whileTap={{ scale: 0.98 }}
              className={`
                p-3 rounded-md border cursor-pointer transition-colors
                ${selectedOption === index ? "border-primary bg-primary/10" : "hover:bg-muted"}
                ${isAnswered && option.isCorrect ? "border-green-500 bg-green-100/50 dark:bg-green-900/20" : ""}
                ${isAnswered && selectedOption === index && !option.isCorrect ? "border-red-500 bg-red-100/50 dark:bg-red-900/20" : ""}
              `}
              onClick={() => handleOptionSelect(index)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{option.text}</span>

                {isAnswered && option.isCorrect && <CheckCircle className="h-5 w-5 text-green-500" />}

                {isAnswered && selectedOption === index && !option.isCorrect && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={handleSubmit} disabled={selectedOption === null || isAnswered} className="w-full">
          Valider
        </Button>
      </CardFooter>
    </Card>
  )
}

