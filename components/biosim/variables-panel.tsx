"use client"

import { Info } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface VariablesPanelProps {
  experimentId: string
  variables: {
    light: number
    co2: number
    water: number
    temperature: number
  }
  onVariableChange: (variable: string, value: number[]) => void
  simulationRunning: boolean
}

export function VariablesPanel({ experimentId, variables, onVariableChange, simulationRunning }: VariablesPanelProps) {
  if (experimentId !== "photosynthesis") {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="h-12 w-12 text-muted-foreground mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 3a2 2 0 0 0-2 2" />
            <path d="M19 3a2 2 0 0 1 2 2" />
            <path d="M21 19a2 2 0 0 1-2 2" />
            <path d="M5 21a2 2 0 0 1-2-2" />
            <path d="M9 3h1" />
            <path d="M9 21h1" />
            <path d="M14 3h1" />
            <path d="M14 21h1" />
            <path d="M3 9v1" />
            <path d="M21 9v1" />
            <path d="M3 14v1" />
            <path d="M21 14v1" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">Expérience en développement</h3>
        <p className="text-muted-foreground max-w-xs">
          Cette expérience sera disponible prochainement. Essayez l'expérience de photosynthèse en attendant !
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500 dark:bg-yellow-400"></div>
              <Label>Intensité lumineuse</Label>
            </div>
            <span className="text-sm font-mono">{variables.light}%</span>
          </div>
          <Slider
            value={[variables.light]}
            min={0}
            max={100}
            step={1}
            disabled={simulationRunning}
            onValueChange={(value) => onVariableChange("light", value)}
            className="[&>span:first-child]:bg-muted [&>span:first-child_span]:bg-yellow-500 dark:[&>span:first-child_span]:bg-yellow-400"
          />
          <p className="text-xs text-muted-foreground">
            Contrôle l'intensité de la lumière disponible pour la photosynthèse.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600 dark:bg-green-400"></div>
              <Label>Concentration en CO₂</Label>
            </div>
            <span className="text-sm font-mono">{variables.co2}%</span>
          </div>
          <Slider
            value={[variables.co2]}
            min={0}
            max={100}
            step={1}
            disabled={simulationRunning}
            onValueChange={(value) => onVariableChange("co2", value)}
            className="[&>span:first-child]:bg-muted [&>span:first-child_span]:bg-green-600 dark:[&>span:first-child_span]:bg-green-400"
          />
          <p className="text-xs text-muted-foreground">Détermine la quantité de dioxyde de carbone disponible.</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400"></div>
              <Label>Disponibilité en eau</Label>
            </div>
            <span className="text-sm font-mono">{variables.water}%</span>
          </div>
          <Slider
            value={[variables.water]}
            min={0}
            max={100}
            step={1}
            disabled={simulationRunning}
            onValueChange={(value) => onVariableChange("water", value)}
            className="[&>span:first-child]:bg-muted [&>span:first-child_span]:bg-blue-600 dark:[&>span:first-child_span]:bg-blue-400"
          />
          <p className="text-xs text-muted-foreground">Contrôle la quantité d'eau disponible pour la plante.</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600 dark:bg-red-400"></div>
              <Label>Température</Label>
            </div>
            <span className="text-sm font-mono">{variables.temperature}°C</span>
          </div>
          <Slider
            value={[variables.temperature]}
            min={5}
            max={45}
            step={1}
            disabled={simulationRunning}
            onValueChange={(value) => onVariableChange("temperature", value)}
            className="[&>span:first-child]:bg-muted [&>span:first-child_span]:bg-red-600 dark:[&>span:first-child_span]:bg-red-400"
          />
          <p className="text-xs text-muted-foreground">Définit la température ambiante (optimale autour de 25°C).</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card/80 p-4">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h4 className="font-medium mb-1">À propos de cette expérience</h4>
            <p className="text-sm text-muted-foreground">
              La photosynthèse est le processus par lequel les plantes convertissent la lumière, l'eau et le CO₂ en
              glucose et oxygène. Les conditions optimales varient selon les espèces.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

