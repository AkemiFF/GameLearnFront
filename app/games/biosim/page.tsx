"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Home, Beaker, HelpCircle, Settings, Maximize, Minimize } from "lucide-react"
// Importer useTheme en haut du fichier
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useFullscreen } from "@/hooks/use-fullscreen"

// Import components
import { SimulationCanvas } from "@/components/biosim/simulation-canvas"
import { SimulationControls } from "@/components/biosim/simulation-controls"
import { ExperimentList, experimentsList } from "@/components/biosim/experiment-list"
import { VariablesPanel } from "@/components/biosim/variables-panel"
import { ResultsPanel } from "@/components/biosim/results-panel"
import { SimulationResults } from "@/components/biosim/simulation-results"
import { TutorialOverlay } from "@/components/biosim/tutorial-overlay"
import { SettingsDialog } from "@/components/biosim/settings-dialog"
import { HelpDialog } from "@/components/biosim/help-dialog"
import { TheoryContent } from "@/components/biosim/theory-content"
import { NotesPanel } from "@/components/biosim/notes-panel"

// Tutorial steps
const tutorialSteps = [
  {
    title: "Bienvenue dans BioSim",
    content:
      "Ce laboratoire virtuel vous permet de réaliser des expériences scientifiques interactives. Suivez ce tutoriel pour apprendre les bases.",
    target: null,
  },
  {
    title: "Choisir une expérience",
    content:
      "Commencez par sélectionner une expérience dans la liste à gauche. Chaque expérience explore un concept scientifique différent.",
    target: "experiment-list",
  },
  {
    title: "Ajuster les variables",
    content:
      "Utilisez les curseurs pour modifier les variables de l'expérience. Observez comment ces changements affectent les résultats.",
    target: "variables-panel",
  },
  {
    title: "Lancer la simulation",
    content:
      "Appuyez sur le bouton Démarrer pour lancer la simulation. Vous pouvez ajuster la vitesse ou mettre en pause à tout moment.",
    target: "simulation-controls",
  },
  {
    title: "Analyser les résultats",
    content: "Une fois la simulation terminée, analysez les résultats et tirez des conclusions scientifiques.",
    target: "results-panel",
  },
  {
    title: "C'est parti !",
    content: "Vous êtes maintenant prêt à explorer le monde fascinant de la biologie. Bonne expérimentation !",
    target: null,
  },
]

export default function BioSimPage() {
  // Remplacer la ligne de déclaration du router par:
  const router = useRouter()
  const { theme } = useTheme()
  const containerRef = useRef(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef)

  // UI state
  const [activeTab, setActiveTab] = useState("lab")
  const [selectedExperiment, setSelectedExperiment] = useState("photosynthesis")
  const [showHelp, setShowHelp] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [highQuality, setHighQuality] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Simulation state
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [simulationTime, setSimulationTime] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [variables, setVariables] = useState({
    light: 50,
    co2: 50,
    water: 50,
    temperature: 25,
  })
  const [results, setResults] = useState({
    oxygenProduced: 0,
    glucoseProduced: 0,
    plantGrowth: 0,
    efficiency: 0,
  })
  const [achievements, setAchievements] = useState([
    {
      id: "first_experiment",
      title: "Premier pas scientifique",
      description: "Complétez votre première expérience",
      unlocked: false,
    },
    {
      id: "optimal_conditions",
      title: "Conditions optimales",
      description: "Atteignez 90% d'efficacité dans une expérience",
      unlocked: false,
    },
    {
      id: "scientist",
      title: "Scientifique en herbe",
      description: "Complétez 5 expériences différentes",
      unlocked: false,
    },
  ])

  // Get current experiment
  const currentExperiment = experimentsList.find((exp) => exp.id === selectedExperiment) || experimentsList[0]

  // Simulation logic
  useEffect(() => {
    if (!simulationRunning) return

    const interval = setInterval(() => {
      setSimulationTime((prev) => {
        if (prev >= 100) {
          setSimulationRunning(false)
          setShowResults(true)
          return 100
        }
        return prev + simulationSpeed
      })

      // Update results based on variables and time
      updateResults()
    }, 100)

    return () => clearInterval(interval)
  }, [simulationRunning, simulationSpeed, variables])

  // Update results based on variables
  const updateResults = useCallback(() => {
    if (selectedExperiment === "photosynthesis") {
      // Calculate results based on variables
      const lightFactor = variables.light / 100
      const co2Factor = variables.co2 / 100
      const waterFactor = variables.water / 100
      const tempFactor = 1 - Math.abs((variables.temperature - 25) / 25)

      const efficiency = lightFactor * co2Factor * waterFactor * tempFactor

      setResults({
        oxygenProduced: efficiency * 50,
        glucoseProduced: efficiency * 30,
        plantGrowth: efficiency * 20,
        efficiency: efficiency,
      })

      // Check for achievements
      if (efficiency >= 0.9 && !achievements.find((a) => a.id === "optimal_conditions").unlocked) {
        const newAchievements = [...achievements]
        const index = newAchievements.findIndex((a) => a.id === "optimal_conditions")
        newAchievements[index].unlocked = true
        setAchievements(newAchievements)
      }
    }
  }, [selectedExperiment, variables, achievements])

  // Start simulation
  const startSimulation = useCallback(() => {
    setSimulationRunning(true)
    setSimulationTime(0)
    setShowResults(false)

    // Unlock first experiment achievement if not already unlocked
    if (!achievements.find((a) => a.id === "first_experiment").unlocked) {
      const newAchievements = [...achievements]
      const index = newAchievements.findIndex((a) => a.id === "first_experiment")
      newAchievements[index].unlocked = true
      setAchievements(newAchievements)
    }
  }, [achievements])

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setSimulationRunning(false)
    setSimulationTime(0)
    setShowResults(false)
    setVariables({
      light: 50,
      co2: 50,
      water: 50,
      temperature: 25,
    })
    setResults({
      oxygenProduced: 0,
      glucoseProduced: 0,
      plantGrowth: 0,
      efficiency: 0,
    })
  }, [])

  // Handle variable change
  const handleVariableChange = useCallback((variable: string, value: number[]) => {
    setVariables((prev) => ({
      ...prev,
      [variable]: value[0],
    }))
  }, [])

  // Tutorial handlers
  const handleNextTutorialStep = useCallback(() => {
    setTutorialStep((prev) => Math.min(prev + 1, tutorialSteps.length - 1))
  }, [])

  const handlePrevTutorialStep = useCallback(() => {
    setTutorialStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const handleCloseTutorial = useCallback(() => {
    setShowTutorial(false)
    setTutorialStep(0)
  }, [])

  const handleStartTutorial = useCallback(() => {
    setShowTutorial(true)
    setTutorialStep(0)
  }, [])

  // Reset progress
  const handleResetProgress = useCallback(() => {
    resetSimulation()
    setAchievements(achievements.map((a) => ({ ...a, unlocked: false })))
  }, [achievements, resetSimulation])

  // Ajouter un effet pour détecter les changements de thème et mettre à jour l'animation
  // Ajouter cet useEffect après les autres useEffects
  useEffect(() => {
    // Forcer une mise à jour de l'animation quand le thème change
    const handleThemeChange = () => {
      // Réinitialiser brièvement la simulation pour rafraîchir les couleurs
      if (simulationRunning) {
        setSimulationRunning(false)
        setTimeout(() => setSimulationRunning(true), 50)
      }
    }

    // Observer les changements de thème
    const observer = new MutationObserver(handleThemeChange)

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      observer.disconnect()
    }
  }, [simulationRunning])

  return (
    // Remplacer la div principale (première div du return) par:
    <div
      ref={containerRef}
      className={`min-h-screen text-foreground ${
        theme === "dark"
          ? "bg-gradient-to-br from-indigo-950 to-slate-900"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      }`}
    >
      {/* Audio element for sound effects */}
      <audio ref={audioRef} className="hidden" />

      {/* Header */}
      {/* Remplacer le header par: */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">BioSim - Laboratoire Virtuel</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setShowHelp(true)}>
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Aide</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paramètres</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? "Quitter le plein écran" : "Plein écran"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-6">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Modifier les cartes pour utiliser les couleurs du thème */}
            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-primary" />
                  Expériences
                </CardTitle>
                <CardDescription>Sélectionnez une expérience à réaliser</CardDescription>
              </CardHeader>
              <CardContent>
                <ExperimentList
                  experiments={experimentsList}
                  selectedExperiment={selectedExperiment}
                  onSelectExperiment={setSelectedExperiment}
                />
              </CardContent>
            </Card>

            <Card className="border-border bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-400" />
                  Réalisations
                </CardTitle>
                <CardDescription>Vos accomplissements scientifiques</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`rounded-lg border p-3 transition-colors ${
                      achievement.unlocked
                        ? "border-amber-500/50 bg-amber-500/10"
                        : "border-border bg-muted/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {achievement.unlocked ? (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                          <Check className="h-3 w-3" />
                        </div>
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/40">
                          <Lock className="h-3 w-3" />
                        </div>
                      )}
                      <p className="font-medium">{achievement.title}</p>
                    </div>
                    <p className="mt-1 text-xs text-white/70">{achievement.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main lab area */}
          <div className="space-y-6">
            <Tabs defaultValue="lab" className="space-y-6" onValueChange={setActiveTab}>
              <div className="flex items-center justify-between">
                {/* Modifier les TabsList pour utiliser les couleurs du thème */}
                <TabsList className="bg-muted border border-border">
                  <TabsTrigger
                    value="lab"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  >
                    Laboratoire
                  </TabsTrigger>
                  <TabsTrigger
                    value="theory"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  >
                    Théorie
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                  >
                    Notes
                  </TabsTrigger>
                </TabsList>

                <SimulationControls
                  simulationRunning={simulationRunning}
                  simulationSpeed={simulationSpeed}
                  showResults={showResults}
                  onStart={startSimulation}
                  onPause={() => setSimulationRunning(false)}
                  onReset={resetSimulation}
                  onSpeedChange={(value) => setSimulationSpeed(Number(value))}
                />
              </div>

              <TabsContent value="lab" className="space-y-6 mt-0">
                <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                  {/* Simulation area */}
                  {/* Modifier la carte de simulation pour utiliser les couleurs du thème */}
                  <Card className="border-border bg-card/80 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="border-b border-border bg-card/80">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {currentExperiment.icon}
                          <span>{currentExperiment.title}</span>
                        </CardTitle>
                      </div>

                      {simulationRunning && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progression</span>
                            <span>{Math.round(simulationTime)}%</span>
                          </div>
                          <Progress value={simulationTime} className="h-1" />
                        </div>
                      )}
                    </CardHeader>

                    {/* Modifier la section de simulation pour améliorer l'apparence */}
                    <CardContent className="p-0 relative">
                      <div className="relative aspect-video w-full overflow-hidden">
                        <SimulationCanvas
                          simulationRunning={simulationRunning}
                          showResults={showResults}
                          simulationSpeed={simulationSpeed}
                          selectedExperiment={selectedExperiment}
                          highQuality={highQuality}
                          variables={variables}
                        />

                        {!simulationRunning && !showResults && (
                          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                            <div className="rounded-full bg-primary/10 p-4 mb-4">
                              <Beaker className="h-12 w-12 text-primary opacity-80" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Prêt à expérimenter</h3>
                            <p className="text-muted-foreground text-center max-w-md mb-6">
                              Ajustez les variables à droite puis cliquez sur Démarrer pour lancer la simulation
                            </p>
                            <Button
                              onClick={startSimulation}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                              <Play className="mr-2 h-4 w-4" />
                              Démarrer la simulation
                            </Button>
                          </div>
                        )}

                        <AnimatePresence>
                          {showResults && (
                            <SimulationResults
                              results={results}
                              onReset={resetSimulation}
                              onSaveNotes={() => setActiveTab("notes")}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Variables panel */}
                  {/* Modifier la carte des variables pour utiliser les couleurs du thème */}
                  <Card className="border-border bg-card/80 backdrop-blur-sm" id="variables-panel">
                    <CardHeader>
                      <CardTitle>Variables</CardTitle>
                      <CardDescription>Ajustez les paramètres de l'expérience</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <VariablesPanel
                        experimentId={selectedExperiment}
                        variables={variables}
                        onVariableChange={handleVariableChange}
                        simulationRunning={simulationRunning}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Results panel - only shown when simulation is running or complete */}
                {(simulationRunning || showResults) && (
                  <ResultsPanel results={results} simulationTime={simulationTime} variables={variables} />
                )}
              </TabsContent>

              <TabsContent value="theory" className="mt-0">
                <TheoryContent experimentId={selectedExperiment} />
              </TabsContent>

              <TabsContent value="notes" className="mt-0">
                <NotesPanel
                  experimentTitle={currentExperiment.title}
                  showResults={showResults}
                  results={results}
                  variables={variables}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Help dialog */}
      <HelpDialog open={showHelp} onOpenChange={setShowHelp} onStartTutorial={handleStartTutorial} />

      {/* Settings dialog */}
      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        highQuality={highQuality}
        onHighQualityChange={setHighQuality}
        soundEnabled={soundEnabled}
        onSoundEnabledChange={setSoundEnabled}
        onRestartTutorial={handleStartTutorial}
        onResetProgress={handleResetProgress}
      />

      {/* Tutorial overlay */}
      <AnimatePresence>
        {showTutorial && (
          <TutorialOverlay
            steps={tutorialSteps}
            currentStep={tutorialStep}
            onNext={handleNextTutorialStep}
            onPrevious={handlePrevTutorialStep}
            onClose={handleCloseTutorial}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function Award(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  )
}

function Check(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function Lock(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function Play(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

