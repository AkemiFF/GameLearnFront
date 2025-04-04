"use client"

import { motion } from "framer-motion"
import { Beaker, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface TutorialStep {
  title: string
  content: string
  target: string | null
}

interface TutorialOverlayProps {
  steps: TutorialStep[]
  currentStep: number
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
}

export function TutorialOverlay({ steps, currentStep, onNext, onPrevious, onClose }: TutorialOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-card border border-border rounded-lg max-w-md w-full p-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            {currentStep === 0 ? (
              <Beaker className="h-5 w-5" />
            ) : currentStep === steps.length - 1 ? (
              <Check className="h-5 w-5" />
            ) : (
              <span className="font-bold">{currentStep}</span>
            )}
          </div>
          <h3 className="text-xl font-bold">{steps[currentStep].title}</h3>
        </div>

        <p className="mb-6 text-muted-foreground">{steps[currentStep].content}</p>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Ignorer
          </Button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={onPrevious}>
                Précédent
              </Button>
            )}

            {currentStep < steps.length - 1 ? (
              <Button onClick={onNext}>Suivant</Button>
            ) : (
              <Button onClick={onClose}>Commencer</Button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

