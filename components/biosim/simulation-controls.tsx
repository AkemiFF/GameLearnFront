"use client"

import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SimulationControlsProps {
  simulationRunning: boolean
  simulationSpeed: number
  showResults: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSpeedChange: (value: string) => void
}

export function SimulationControls({
  simulationRunning,
  simulationSpeed,
  showResults,
  onStart,
  onPause,
  onReset,
  onSpeedChange,
}: SimulationControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {simulationRunning && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Vitesse:</span>
          <Select value={simulationSpeed.toString()} onValueChange={onSpeedChange}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Vitesse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">Lente</SelectItem>
              <SelectItem value="1">Normale</SelectItem>
              <SelectItem value="2">Rapide</SelectItem>
              <SelectItem value="4">Très rapide</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button variant="outline" size="sm" onClick={onReset}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Réinitialiser
      </Button>

      <Button
        size="sm"
        className={`${
          simulationRunning
            ? "bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white"
            : "bg-primary hover:bg-primary/90 text-primary-foreground"
        }`}
        onClick={simulationRunning ? onPause : onStart}
        disabled={showResults}
      >
        {simulationRunning ? (
          <>
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            Démarrer
          </>
        )}
      </Button>
    </div>
  )
}

