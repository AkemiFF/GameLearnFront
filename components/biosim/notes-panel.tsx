"use client"

import { FileText, Save, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface NotesPanelProps {
  experimentTitle: string
  showResults: boolean
  results: {
    oxygenProduced: number
    glucoseProduced: number
    plantGrowth: number
    efficiency: number
  }
  variables: {
    light: number
    co2: number
    water: number
    temperature: number
  }
}

export function NotesPanel({ experimentTitle, showResults, results, variables }: NotesPanelProps) {
  const defaultObservations = showResults
    ? `
J'ai observé que:
- L'efficacité globale de la photosynthèse était de ${Math.round(results.efficiency * 100)}%
- La production d'oxygène a atteint ${results.oxygenProduced.toFixed(2)} ml
- La production de glucose a atteint ${results.glucoseProduced.toFixed(2)} mg
- La croissance de la plante a été de ${results.plantGrowth.toFixed(2)} mm

Les conditions étaient:
- Intensité lumineuse: ${variables.light}%
- Concentration en CO₂: ${variables.co2}%
- Disponibilité en eau: ${variables.water}%
- Température: ${variables.temperature}°C
`
    : ""

  return (
    <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-cyan-400" />
          Notes de laboratoire
        </CardTitle>
        <CardDescription className="text-white/70">Enregistrez vos observations et conclusions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Titre de l'expérience</Label>
          <input
            type="text"
            placeholder="Ex: Effet de l'intensité lumineuse sur la photosynthèse"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue={`Expérience: ${experimentTitle}`}
          />
        </div>

        <div className="space-y-2">
          <Label>Observations</Label>
          <textarea
            placeholder="Notez vos observations pendant l'expérience..."
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue={defaultObservations}
          />
        </div>

        {/* <div className="space-y-2">
          <Label>Conclusions</Label>
          <textarea
            placeholder="Quelles conclusions tirez-vous de cette expérience ?"
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
 */}
        <div className="flex justify-end gap-2">
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Partager
          </Button>

          <Button>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

