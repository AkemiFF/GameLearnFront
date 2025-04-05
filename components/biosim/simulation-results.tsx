"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Lightbulb,
  RotateCcw,
  Save,
  Download,
  Share2,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Interface SimulationResultsProps
interface SimulationResultsProps {
  results: {
    oxygenProduced: number
    glucoseProduced: number
    plantGrowth: number
    efficiency: number
    variableScores?: Record<
      number,
      {
        score: number
        expected: number
        actual: number
        unit: string
        name: string
      }
    >
  }
  experimentId: string
  experimentTitle: string
  variableValues: Record<string, number>
  onReset: () => void
  onSaveNotes: (title: string, content: string) => Promise<void>
  isSaving?: boolean
}

export function SimulationResults({
  results,
  experimentId,
  experimentTitle,
  variableValues,
  onReset,
  onSaveNotes,
  isSaving = false,
}: SimulationResultsProps) {
  const { variableScores = {} } = results
  const hasVariableScores = Object.keys(variableScores).length > 0
  const efficiency = Math.round(results.efficiency * 100)

  // États pour les notes
  const [noteTitle, setNoteTitle] = useState(`Résultats: ${experimentTitle}`)
  const [noteContent, setNoteContent] = useState("")
  const [activeTab, setActiveTab] = useState("results")
  const [isNotesExpanded, setIsNotesExpanded] = useState(false)

  // Fonction pour obtenir la couleur en fonction du score
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-500"
    if (score >= 0.5) return "text-amber-500"
    return "text-red-500"
  }

  // Fonction pour obtenir l'icône en fonction du score
  const getScoreIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (score >= 0.5) return <AlertCircle className="h-4 w-4 text-amber-500" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  // Fonction pour obtenir la classe de couleur pour la barre de progression
  const getProgressColorClass = (value: number) => {
    if (value >= 70) return "bg-gradient-to-r from-green-500 to-emerald-500"
    if (value >= 40) return "bg-gradient-to-r from-amber-500 to-yellow-500"
    return "bg-gradient-to-r from-red-500 to-rose-500"
  }

  // Générer automatiquement un contenu de note basé sur les résultats
  const generateNoteContent = () => {
    let content = `# Rapport d'expérience: ${experimentTitle}\n\n`
    content += `## Résultats globaux\n`
    content += `- **Efficacité globale**: ${efficiency}%\n`
    content += `- **Oxygène produit**: ${results.oxygenProduced.toFixed(2)} ml\n`
    content += `- **Glucose produit**: ${results.glucoseProduced.toFixed(2)} mg\n`
    content += `- **Croissance de la plante**: ${results.plantGrowth.toFixed(2)} mm\n\n`

    if (hasVariableScores) {
      content += `## Variables et paramètres\n`
      Object.entries(variableScores).forEach(([variableId, data]) => {
        const scorePercentage = Math.round(data.score * 100)
        const evaluation = scorePercentage >= 80 ? "Excellent" : scorePercentage >= 50 ? "Acceptable" : "Insuffisant"

        content += `### ${data.name}\n`
        content += `- **Valeur utilisée**: ${data.actual} ${data.unit}\n`
        content += `- **Valeur attendue**: ${data.expected} ${data.unit}\n`
        content += `- **Précision**: ${scorePercentage}% (${evaluation})\n\n`
      })
    }

    content += `## Observations et conclusions\n`
    content += `[Ajoutez vos observations personnelles ici]\n\n`
    content += `## Pistes d'amélioration\n`

    if (hasVariableScores) {
      Object.entries(variableScores)
        .filter(([_, data]) => data.score < 0.8)
        .forEach(([_, data]) => {
          content += `- ${data.name}: ${data.actual < data.expected
              ? `Augmenter la valeur pour se rapprocher de ${data.expected} ${data.unit}`
              : `Diminuer la valeur pour se rapprocher de ${data.expected} ${data.unit}`
            }\n`
        })
    }

    return content
  }

  // Pré-remplir le contenu de la note lors du premier rendu
  useEffect(() => {
    setNoteContent(generateNoteContent())
  }, [results, experimentTitle]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-2xl bg-card shadow-lg rounded-xl border border-border overflow-hidden max-h-[90vh] flex flex-col">
        {/* En-tête avec titre et badge d'efficacité */}
        <div className="bg-muted/50 p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Résultats de l'expérience
          </h3>
          <Badge
            variant={efficiency >= 70 ? "default" : efficiency >= 40 ? "outline" : "destructive"}
            className={`${efficiency >= 70 ? "bg-green-500" : ""} text-sm px-3 py-1`}
          >
            {getScoreIcon(results.efficiency / 1)}
            <span className="ml-1">Efficacité: {efficiency}%</span>
          </Badge>
        </div>

        {/* Onglets pour naviguer entre les résultats et les notes */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 pt-2 border-b border-border">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="results">Résultats</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="results" className="mt-0 space-y-6">
              {/* Carte d'efficacité globale */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">Efficacité globale</h4>
                      <span className="font-mono text-lg font-bold">{efficiency}%</span>
                    </div>
                    <Progress value={efficiency} className={`h-3 rounded-full ${getProgressColorClass(efficiency)}`} />
                    <p className="text-sm text-muted-foreground">
                      {efficiency >= 80
                        ? "Excellentes conditions ! La plante se développe de manière optimale."
                        : efficiency >= 50
                          ? "Conditions acceptables. Certains paramètres pourraient être améliorés."
                          : "Conditions défavorables. La plante a du mal à se développer."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Grille des métriques principales */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4">
                    <Label className="text-blue-700 dark:text-blue-300 font-medium">Oxygène produit</Label>
                    <div className="font-mono text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                      {results.oxygenProduced.toFixed(2)} <span className="text-sm font-normal">ml</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <Label className="text-green-700 dark:text-green-300 font-medium">Glucose produit</Label>
                    <div className="font-mono text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
                      {results.glucoseProduced.toFixed(2)} <span className="text-sm font-normal">mg</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
                  <CardContent className="p-4">
                    <Label className="text-amber-700 dark:text-amber-300 font-medium">Croissance</Label>
                    <div className="font-mono text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">
                      {results.plantGrowth.toFixed(2)} <span className="text-sm font-normal">mm</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4">
                    <Label className="text-purple-700 dark:text-purple-300 font-medium">Durée</Label>
                    <div className="font-mono text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">
                      5:00 <span className="text-sm font-normal">min</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Comparaison avec les valeurs attendues */}
              {hasVariableScores && (
                <Collapsible open={true} className="border rounded-lg overflow-hidden">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 border-b font-medium">
                    <span>Comparaison avec les valeurs attendues</span>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 space-y-4">
                    {Object.entries(variableScores).map(([variableId, data]) => {
                      const scorePercentage = Math.round(data.score * 100)
                      return (
                        <div key={variableId} className="border rounded-lg overflow-hidden">
                          <div className="flex justify-between items-center p-3 bg-muted/30">
                            <div className="flex items-center gap-2">
                              {getScoreIcon(data.score)}
                              <span className="font-medium">{data.name}</span>
                            </div>
                            <Badge
                              variant={
                                scorePercentage >= 80 ? "default" : scorePercentage >= 50 ? "outline" : "destructive"
                              }
                              className={`${scorePercentage >= 80 ? "bg-green-500" : ""}`}
                            >
                              {scorePercentage}%
                            </Badge>
                          </div>
                          <div className="p-3 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-muted/30 rounded-md p-2">
                                <span className="text-xs text-muted-foreground block">Valeur attendue</span>
                                <p className="font-mono font-medium">
                                  {data.expected} {data.unit}
                                </p>
                              </div>
                              <div className="bg-muted/30 rounded-md p-2">
                                <span className="text-xs text-muted-foreground block">Votre valeur</span>
                                <p className="font-mono font-medium">
                                  {data.actual} {data.unit}
                                </p>
                              </div>
                            </div>
                            <Progress
                              value={scorePercentage}
                              className={`h-1.5 rounded-full ${getProgressColorClass(scorePercentage)}`}
                            />
                            {data.score < 0.8 && (
                              <div className="flex items-start gap-2 text-sm bg-muted/20 p-2 rounded-md">
                                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <p className="text-muted-foreground">
                                  {data.actual < data.expected
                                    ? `Pour améliorer les résultats, augmentez la valeur pour vous rapprocher de ${data.expected} ${data.unit}`
                                    : `Pour améliorer les résultats, diminuez la valeur pour vous rapprocher de ${data.expected} ${data.unit}`}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </TabsContent>

            <TabsContent value="notes" className="mt-0 space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="note-title" className="text-base font-medium">
                    Titre du rapport
                  </Label>
                  <Input
                    id="note-title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Titre de votre note"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="note-content" className="text-base font-medium">
                      Contenu du rapport
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                      className="h-8 px-2"
                    >
                      {isNotesExpanded ? (
                        <ChevronUp className="h-4 w-4 mr-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 mr-1" />
                      )}
                      {isNotesExpanded ? "Réduire" : "Agrandir"}
                    </Button>
                  </div>
                  <Textarea
                    id="note-content"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Vos observations et conclusions..."
                    rows={isNotesExpanded ? 15 : 8}
                    className="mt-1.5 font-mono text-sm"
                  />
                </div>

                <div className="bg-muted/30 rounded-lg p-3 text-sm">
                  <h5 className="font-medium mb-2 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    Conseils pour votre rapport
                  </h5>
                  <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                    <li>Décrivez vos observations pendant l'expérience</li>
                    <li>Analysez les écarts entre les valeurs attendues et obtenues</li>
                    <li>Proposez des hypothèses pour expliquer ces écarts</li>
                    <li>Suggérez des améliorations pour de futures expériences</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Actions en bas */}
        <div className="p-4 border-t border-border bg-muted/30 flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2 sm:flex-1">
            <Button variant="outline" className="flex-1" onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Nouvelle expérience
            </Button>

            <Button variant="outline" size="icon" className="hidden sm:flex">
              <Download className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon" className="hidden sm:flex">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <Button
            className="sm:flex-1 bg-primary hover:bg-primary/90"
            onClick={() => onSaveNotes(noteTitle, noteContent)}
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Enregistrement..." : "Enregistrer les notes"}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

