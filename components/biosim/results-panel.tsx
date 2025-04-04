"use client"

import { Info, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ResultsPanelProps {
  results: {
    oxygenProduced: number
    glucoseProduced: number
    plantGrowth: number
    efficiency: number
  }
  simulationTime: number
  variables: {
    light: number
    co2: number
    water: number
    temperature: number
  }
}

export function ResultsPanel({ results, simulationTime, variables }: ResultsPanelProps) {
  return (
    <Card className="border-border bg-card/80 backdrop-blur-sm" id="results-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Observations en temps réel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border border-border bg-card/80 p-3">
              <div className="text-xs text-muted-foreground mb-1">Oxygène produit</div>
              <div className="font-mono text-lg">{(results.oxygenProduced * (simulationTime / 100)).toFixed(2)} ml</div>
            </div>

            <div className="rounded-lg border border-border bg-card/80 p-3">
              <div className="text-xs text-muted-foreground mb-1">Glucose produit</div>
              <div className="font-mono text-lg">
                {(results.glucoseProduced * (simulationTime / 100)).toFixed(2)} mg
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card/80 p-3">
              <div className="text-xs text-muted-foreground mb-1">Croissance</div>
              <div className="font-mono text-lg">{(results.plantGrowth * (simulationTime / 100)).toFixed(2)} mm</div>
            </div>

            <div className="rounded-lg border border-border bg-card/80 p-3">
              <div className="text-xs text-muted-foreground mb-1">Efficacité</div>
              <div className="font-mono text-lg">{Math.round(results.efficiency * 100)}%</div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card/80 p-4">
            <h4 className="font-medium mb-2">Analyse en cours</h4>
            <p className="text-sm text-muted-foreground">
              {results.efficiency > 0.7
                ? "Les conditions sont optimales pour la photosynthèse. La plante produit efficacement de l'oxygène et du glucose."
                : results.efficiency > 0.4
                  ? "Les conditions sont acceptables mais pas optimales. Essayez d'ajuster les variables pour améliorer l'efficacité."
                  : "Les conditions sont défavorables à la photosynthèse. La plante a du mal à produire de l'énergie."}
            </p>

            {variables.light < 30 && (
              <div className="mt-2 flex items-start gap-2 text-sm">
                <Info className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                <span>L'intensité lumineuse est faible, ce qui limite la photosynthèse.</span>
              </div>
            )}

            {variables.co2 < 30 && (
              <div className="mt-2 flex items-start gap-2 text-sm">
                <Info className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                <span>La concentration en CO₂ est insuffisante pour une photosynthèse optimale.</span>
              </div>
            )}

            {variables.water < 30 && (
              <div className="mt-2 flex items-start gap-2 text-sm">
                <Info className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                <span>Le manque d'eau limite les réactions chimiques de la photosynthèse.</span>
              </div>
            )}

            {Math.abs(variables.temperature - 25) > 10 && (
              <div className="mt-2 flex items-start gap-2 text-sm">
                <Info className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                <span>La température s'éloigne trop de la zone optimale (autour de 25°C).</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

