"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Lightbulb, RotateCcw, Save } from "lucide-react"

interface SimulationResultsProps {
  results: {
    oxygenProduced: number
    glucoseProduced: number
    plantGrowth: number
    efficiency: number
  }
  onReset: () => void
  onSaveNotes: () => void
}

export function SimulationResults({ results, onReset, onSaveNotes }: SimulationResultsProps) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-md bg-card backdrop-blur-md rounded-lg border border-border p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Résultats de l'expérience
        </h3>

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Efficacité globale</span>
              <span className="font-mono">{Math.round(results.efficiency * 100)}%</span>
            </div>
            <Progress
              value={results.efficiency * 100}
              className={`h-2 ${results.efficiency > 0.7
                  ? "bg-green-500"
                  : results.efficiency > 0.4
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-white/70">Oxygène produit</Label>
              <div className="font-mono text-lg">{results.oxygenProduced.toFixed(2)} ml</div>
            </div>

            <div className="space-y-1">
              <Label className="text-white/70">Glucose produit</Label>
              <div className="font-mono text-lg">{results.glucoseProduced.toFixed(2)} mg</div>
            </div>

            <div className="space-y-1">
              <Label className="text-white/70">Croissance de la plante</Label>
              <div className="font-mono text-lg">{results.plantGrowth.toFixed(2)} mm</div>
            </div>

            <div className="space-y-1">
              <Label className="text-white/70">Durée de l'expérience</Label>
              <div className="font-mono text-lg">5:00 min</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Nouvelle expérience
          </Button>

          <Button className="flex-1" onClick={onSaveNotes}>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer les notes
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

