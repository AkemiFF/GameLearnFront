"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Leaf, Dna, FlaskRoundIcon as Flask, Heart, Brain } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface Experiment {
  id: string
  title: string
  description: string
  difficulty: string
  duration: string
  icon: React.ReactNode
  variables: string[]
  image: string
}

interface ExperimentListProps {
  experiments: Experiment[]
  selectedExperiment: string
  onSelectExperiment: (id: string) => void
}

// Modifier la fonction ExperimentList pour adapter les couleurs au thème
export function ExperimentList({ experiments, selectedExperiment, onSelectExperiment }: ExperimentListProps) {
  return (
    <div className="space-y-2" id="experiment-list">
      {experiments.map((experiment) => (
        <motion.div
          key={experiment.id}
          className={cn(
            "flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
            selectedExperiment === experiment.id ? "bg-primary/10 border-primary/50" : "hover:bg-muted",
          )}
          onClick={() => onSelectExperiment(experiment.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            {experiment.icon}
          </div>
          <div className="flex-1 space-y-1">
            <p className="font-medium leading-none">{experiment.title}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Badge variant="outline" className="mr-2 text-[10px]">
                {experiment.difficulty}
              </Badge>
              <span>{experiment.duration}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export const experimentsList: Experiment[] = [
  {
    id: "photosynthesis",
    title: "Photosynthèse",
    description:
      "Simulez le processus de photosynthèse et observez comment les plantes convertissent la lumière en énergie",
    difficulty: "Débutant",
    duration: "5-10 min",
    icon: <Leaf className="h-5 w-5" />,
    variables: ["light", "co2", "water", "temperature"],
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "cell_division",
    title: "Division cellulaire",
    description:
      "Observez le processus de mitose et comment les cellules se divisent pour la croissance et la réparation",
    difficulty: "Intermédiaire",
    duration: "10-15 min",
    icon: <Dna className="h-5 w-5" />,
    variables: ["nutrients", "temperature", "growth_factors"],
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "enzyme_activity",
    title: "Activité enzymatique",
    description:
      "Étudiez comment les enzymes catalysent les réactions biochimiques et les facteurs qui affectent leur activité",
    difficulty: "Avancé",
    duration: "15-20 min",
    icon: <Flask className="h-5 w-5" />,
    variables: ["ph", "temperature", "substrate_concentration", "enzyme_concentration"],
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "heart_simulation",
    title: "Simulation cardiaque",
    description: "Explorez le fonctionnement du cœur humain et les facteurs qui influencent le rythme cardiaque",
    difficulty: "Intermédiaire",
    duration: "10-15 min",
    icon: <Heart className="h-5 w-5" />,
    variables: ["exercise_level", "stress", "oxygen_level"],
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "neural_network",
    title: "Réseau neuronal",
    description: "Découvrez comment les neurones communiquent et comment se forment les connexions synaptiques",
    difficulty: "Avancé",
    duration: "15-20 min",
    icon: <Brain className="h-5 w-5" />,
    variables: ["stimulus_strength", "neurotransmitter_level", "receptor_density"],
    image: "/placeholder.svg?height=200&width=400",
  },
]

