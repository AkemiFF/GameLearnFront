"use client"

import { AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Beaker,
  CheckIcon,
  HelpCircle,
  Home,
  LockIcon,
  Maximize,
  Minimize,
  PlayIcon,
  Settings,
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { useFullscreen } from "@/hooks/use-fullscreen"

// Import components
import { ExperimentList } from "@/components/biosim/experiment-list"
import { HelpDialog } from "@/components/biosim/help-dialog"
import { NotesPanel } from "@/components/biosim/notes-panel"
import { ResultsPanel } from "@/components/biosim/results-panel"
import { SettingsDialog } from "@/components/biosim/settings-dialog"
import { SimulationCanvas } from "@/components/biosim/simulation-canvas"
import { SimulationControls } from "@/components/biosim/simulation-controls"
import { SimulationResults } from "@/components/biosim/simulation-results"
import { TheoryContent } from "@/components/biosim/theory-content"
import { TutorialOverlay } from "@/components/biosim/tutorial-overlay"
import { BASE_URL } from "@/lib/host"

// Types pour les données d'API
interface Experiment {
  id: string
  title: string
  description: string
  difficulty: string
  duration: string
  icon: string
  image: string
  theory_content: string
  variables: string[] // Add the missing 'variables' property
}

export interface ExperimentVariable {
  id: number;
  name: string;
  display_name: string;
  description: string;
  min_value: number;
  max_value: number;
  default_value: number;
  unit: string;
  color: string;
  icon: string;
}


// Interface pour les résultats attendus
interface ExpectedResult {
  id: number
  name: string
  description: string
  expected_value: number
  tolerance: number
  unit: string
  experiment: string
  variable: number
}

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

const initialExperiments = [
  {
    id: "0",
    title: "Defi scientific",
    description: "Faire un defi scientifique",
    difficulty: "intermediate",
    duration: "21",
    icon: "science",
    image: "http://localhost:8000/experiments/Acces_granted_fjKsLx2.jpg",
    theory_content:
      '### Endpoints API pour BioSim et Escape Game\r\n\r\n## Endpoints BioSim\r\n\r\n### Gestion des expériences\r\n\r\n- **GET /api/biosim/experiments/** - Liste toutes les expériences disponibles\r\n- **GET /api/biosim/experiments/id/** - Détails d\'une expérience spécifique\r\n- **POST /api/biosim/experiments/** - Crée une nouvelle expérience (admin uniquement)\r\n- **PUT /api/biosim/experiments/id/** - Met à jour une expérience (admin uniquement)\r\n- **DELETE /api/biosim/experiments/id/** - Supprime une expérience (admin uniquement)\r\n- **GET /api/biosim/experiments/featured/** - Liste les expériences mises en avant\r\n\r\n\r\n### Variables d\'expérience\r\n\r\n- **GET /api/biosim/variables/** - Liste toutes les variables\r\n- **GET /api/biosim/variables/id/** - Détails d\'une variable spécifique\r\n- **GET /api/biosim/experiments/experiment_id/variables/** - Variables pour une expérience spécifique\r\n- **POST /api/biosim/variables/** - Crée une nouvelle variable (admin uniquement)\r\n- **PUT /api/biosim/variables/id/** - Met à jour une variable (admin uniquement)\r\n\r\n\r\n### Résultats de simulation\r\n\r\n- **GET /api/biosim/results/** - Liste les résultats de l\'utilisateur connecté\r\n- **GET /api/biosim/results/id/** - Détails d\'un résultat spécifique\r\n- **POST /api/biosim/results/** - Enregistre un nouveau résultat de simulation\r\n- **GET /api/biosim/experiments/experiment_id/results/** - Résultats pour une expérience spécifique\r\n- **GET /api/biosim/results/stats/** - Statistiques sur les résultats de l\'utilisateur\r\n\r\n\r\n### Notes utilisateur\r\n\r\n- **GET /api/biosim/notes/** - Liste les notes de l\'utilisateur connecté\r\n- **GET /api/biosim/notes/id/** - Détails d\'une note spécifique\r\n- **POST /api/biosim/notes/** - Crée une nouvelle note\r\n- **PUT /api/biosim/notes/id/** - Met à jour une note\r\n- **DELETE /api/biosim/notes/id/** - Supprime une note\r\n- **GET /api/biosim/experiments/experiment_id/notes/** - Notes pour une expérience spécifique\r\n\r\n\r\n### Réalisations\r\n\r\n- **GET /api/biosim/achievements/** - Liste toutes les réalisations disponibles\r\n- **GET /api/biosim/achievements/id/** - Détails d\'une réalisation spécifique\r\n- **GET /api/biosim/user-achievements/** - Réalisations débloquées par l\'utilisateur\r\n- **POST /api/biosim/user-achievements/unlock/achievement_id/** - Débloque une réalisation\r\n\r\n\r\n### Préférences utilisateur\r\n\r\n- **GET /api/biosim/preferences/** - Obtient les préférences de l\'utilisateur\r\n- **PUT /api/biosim/preferences/** - Met à jour les préférences de l\'utilisateur\r\n\r\n## Format des requêtes et réponses\r\n\r\nToutes les API renvoient et acceptent des données au format JSON. Voici un exemple de réponse pour une requête d\'expérience BioSim :\r\n\r\n```json\r\n{\r\n  "id": 1,\r\n  "title": "Photosynthèse",\r\n  "description": "Explorez le processus de photosynthèse dans les plantes",\r\n  "difficulty": "MEDIUM",\r\n  "subject": "BIOLOGY",\r\n  "thumbnail_url": "/media/experiments/photosynthesis.jpg",\r\n  "created_at": "2023-04-15T10:30:00Z",\r\n  "updated_at": "2023-04-15T10:30:00Z",\r\n  "is_featured": true,\r\n  "variables": [\r\n    {\r\n      "id": 1,\r\n      "name": "light_intensity",\r\n      "display_name": "Intensité lumineuse",\r\n      "min_value": 0,\r\n      "max_value": 100,\r\n      "default_value": 50,\r\n      "unit": "lux"\r\n    },\r\n    {\r\n      "id": 2,\r\n      "name": "co2_level",\r\n      "display_name": "Niveau de CO2",\r\n      "min_value": 0,\r\n      "max_value": 1000,\r\n      "default_value": 400,\r\n      "unit": "ppm"\r\n    }\r\n  ]\r\n}\r\n```',
    variables: [],
  },
  {
    id: "0",
    title: "Plante",
    description: "Exprerience avec les plantes",
    difficulty: "beginner",
    duration: "180",
    icon: "plante",
    image: "http://localhost:8000/experiments/Acces_granted.jpg",
    theory_content: "Pour le teste",
    variables: [],
  },
]

export default function BioSimPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const containerRef = useRef(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef)

  // UI state
  const [activeTab, setActiveTab] = useState("lab")
  const [selectedExperimentId, setSelectedExperimentId] = useState<string | null>(initialExperiments[0].id)
  const [showHelp, setShowHelp] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTutorial, setShowTutorial] = useState(true)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [highQuality, setHighQuality] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Ajouter ces états dans le composant BioSimPage
  const [isSavingNotes, setIsSavingNotes] = useState(false)
  const [simulationStartTime, setSimulationStartTime] = useState<Date | null>(null)
  // Data state
  const [experiments, setExperiments] = useState<Experiment[]>(initialExperiments)
  const [experimentVariables, setExperimentVariables] = useState<ExperimentVariable[]>([])
  const [expectedResults, setExpectedResults] = useState<ExpectedResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulation state
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [simulationTime, setSimulationTime] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [variableValues, setVariableValues] = useState<{
    light: number
    co2: number
    water: number
    temperature: number
  }>({
    light: 0,
    co2: 0,
    water: 0,
    temperature: 0,
  })

  // Correction des erreurs de syntaxe pour les états results et achievements
  const [results, setResults] = useState({
    oxygenProduced: 0,
    glucoseProduced: 0,
    plantGrowth: 0,
    efficiency: 0,
    variableScores: {} as Record<
      number,
      { score: number; expected: number; actual: number; unit: string; name: string }
    >,
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

  const handleResetProgress = useCallback(() => {
    // Add your reset progress logic here
    console.log("Resetting progress...")
  }, [])

  // Fetch experiments from API
  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${BASE_URL}/biosim/experiments/`)
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()
        setExperiments(data)
        // Select first experiment by default if available
        if (data.length > 0 && !selectedExperimentId) {
          setSelectedExperimentId(data[0].id)
        }
      } catch (error) {
        console.error("Error fetching experiments:", error)
        setError("Impossible de charger les expériences. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchExperiments()
  }, [selectedExperimentId])

  // Fetch variables for selected experiment
  useEffect(() => {
    const fetchVariables = async () => {
      if (!selectedExperimentId) return

      try {
        setLoading(true)
        const response = await fetch(`${BASE_URL}/biosim/experiments/${selectedExperimentId}/variables/`)
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()
        setExperimentVariables(data)

        // Initialize variable values with defaults
        const initialValues: Record<string, number> = {}
        data.forEach((variable: ExperimentVariable) => {
          initialValues[variable.name] = variable.default_value
        })
        setVariableValues({
          light: initialValues.light || 0,
          co2: initialValues.co2 || 0,
          water: initialValues.water || 0,
          temperature: initialValues.temperature || 0,
        })
      } catch (error) {
        console.error("Error fetching variables:", error)
        setError("Impossible de charger les variables. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchVariables()
  }, [selectedExperimentId])

  // Fetch expected results for selected experiment
  useEffect(() => {
    const fetchExpectedResults = async () => {
      if (!selectedExperimentId) return

      try {
        setLoading(true)
        const response = await fetch(`${BASE_URL}/biosim/expected-results/`)
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()

        // Filter results for the current experiment
        const filteredResults = data.filter((result: ExpectedResult) => result.experiment === selectedExperimentId)

        setExpectedResults(filteredResults)
      } catch (error) {
        console.error("Error fetching expected results:", error)
        setError("Impossible de charger les résultats attendus. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    fetchExpectedResults()
  }, [selectedExperimentId])

  // Get current experiment
  const currentExperiment = experiments.find((exp) => exp.id === selectedExperimentId) || null

  // Calculate score for a variable based on how close it is to the expected value
  const calculateVariableScore = useCallback(
    (variableId: number, value: number) => {
      const expectedResult = expectedResults.find((result) => result.variable === variableId)

      if (!expectedResult) return { score: 0, expected: 0, actual: value, unit: "", name: "Inconnue" }

      const { expected_value, tolerance, unit, name } = expectedResult

      // Calculate how far the value is from the expected value
      const difference = Math.abs(value - expected_value)

      // If within tolerance, score is between 0.5 and 1.0 based on how close it is
      if (difference <= tolerance) {
        // Perfect score if exactly matching
        if (difference === 0) return { score: 1.0, expected: expected_value, actual: value, unit, name }

        // Otherwise, score between 0.5 and 1.0 based on proximity
        const score = 1.0 - difference / (tolerance * 2)
        return { score: Math.max(0.5, score), expected: expected_value, actual: value, unit, name }
      }

      // If outside tolerance, score is between 0.0 and 0.5 based on how far it is
      // The further away, the closer to 0
      const maxDifference = expected_value * 2 // Arbitrary maximum difference
      const score = 0.5 * (1 - Math.min(1, (difference - tolerance) / maxDifference))
      return { score: Math.max(0, score), expected: expected_value, actual: value, unit, name }
    },
    [expectedResults],
  )

  // Update results based on variables
  const updateResults = useCallback(() => {
    // Map variable names to their IDs for easier lookup
    const variableNameToId: Record<string, number> = {}
    experimentVariables.forEach((variable) => {
      variableNameToId[variable.name] = variable.id
    })

    // Calculate scores for each variable
    const variableScores: Record<
      number,
      { score: number; expected: number; actual: number; unit: string; name: string }
    > = {}
    let totalScore = 0
    let variablesWithExpectedResults = 0

    // Process each variable that has a value set by the user
    Object.entries(variableValues).forEach(([variableName, value]) => {
      const variableId = variableNameToId[variableName]
      if (!variableId) return

      const scoreData = calculateVariableScore(variableId, value)
      variableScores[variableId] = scoreData

      // Only count variables that have expected results
      if (expectedResults.some((result) => result.variable === variableId)) {
        totalScore += scoreData.score
        variablesWithExpectedResults++
      }
    })

    // Calculate overall efficiency (average of all variable scores)
    const efficiency = variablesWithExpectedResults > 0 ? totalScore / variablesWithExpectedResults : 0

    // Set results based on efficiency
    setResults({
      oxygenProduced: efficiency * 50,
      glucoseProduced: efficiency * 30,
      plantGrowth: efficiency * 20,
      efficiency,
      variableScores,
    })

    // Check for achievements
    if (efficiency >= 0.9 && !achievements.find((a) => a.id === "optimal_conditions")?.unlocked) {
      const newAchievements = [...achievements]
      const index = newAchievements.findIndex((a) => a.id === "optimal_conditions")
      if (index !== -1) {
        newAchievements[index].unlocked = true
        setAchievements(newAchievements)
      }
    }
  }, [variableValues, experimentVariables, expectedResults, achievements, calculateVariableScore])

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
  }, [simulationRunning, simulationSpeed, updateResults])

  // Modifier la fonction startSimulation pour enregistrer l'heure de début
  const startSimulation = useCallback(() => {
    setSimulationRunning(true)
    setSimulationTime(0)
    setShowResults(false)
    setSimulationStartTime(new Date())

    // Unlock first experiment achievement if not already unlocked
    if (!achievements.find((a) => a.id === "first_experiment")?.unlocked) {
      const newAchievements = [...achievements]
      const index = newAchievements.findIndex((a) => a.id === "first_experiment")
      if (index !== -1) {
        newAchievements[index].unlocked = true
        setAchievements(newAchievements)
      }
    }
  }, [achievements])

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setSimulationRunning(false)
    setSimulationTime(0)
    setShowResults(false)

    // Reset variables to default values
    const defaultValues: Record<string, number> = {}
    experimentVariables.forEach((variable) => {
      defaultValues[variable.name] = variable.default_value
    })
    setVariableValues({
      light: defaultValues.light || 0,
      co2: defaultValues.co2 || 0,
      water: defaultValues.water || 0,
      temperature: defaultValues.temperature || 0,
    })

    setResults({
      oxygenProduced: 0,
      glucoseProduced: 0,
      plantGrowth: 0,
      efficiency: 0,
      variableScores: {},
    })
  }, [experimentVariables])

  // Handle variable change
  const handleVariableChange = useCallback((variableName: string, value: number[]) => {
    setVariableValues((prev) => ({
      ...prev,
      [variableName]: value[0],
    }))
  }, [])

  // Handle experiment selection
  const handleExperimentSelect = useCallback(
    (experimentId: string) => {
      setSelectedExperimentId(experimentId)
      resetSimulation()
    },
    [resetSimulation],
  )

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

  // Handle theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      if (simulationRunning) {
        setSimulationRunning(false)
        setTimeout(() => setSimulationRunning(true), 50)
      }
    }

    const observer = new MutationObserver(handleThemeChange)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      observer.disconnect()
    }
  }, [simulationRunning])

  // Create an icon component based on the icon string
  const getIconComponent = (iconName: string) => {
    // This is a simplified version - in a real app, you'd map icon names to actual components
    return <Beaker className="h-5 w-5" />
  }

  // Ajouter cette fonction pour sauvegarder les résultats et les notes
  const saveResultsAndNotes = useCallback(
    async (title: string, content: string) => {
      if (!selectedExperimentId || !currentExperiment) {
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder les résultats: aucune expérience sélectionnée.",
          variant: "destructive",
        })
        return
      }

      setIsSavingNotes(true)

      try {
        // Calculer la durée de l'expérience en secondes
        const duration = simulationStartTime
          ? Math.round((new Date().getTime() - simulationStartTime.getTime()) / 1000)
          : 300 // 5 minutes par défaut

        // Préparer les données des résultats
        const resultsData = {
          experiment: selectedExperimentId,
          variables_config: variableValues,
          results_data: {
            oxygenProduced: results.oxygenProduced,
            glucoseProduced: results.glucoseProduced,
            plantGrowth: results.plantGrowth,
            efficiency: results.efficiency,
            variableScores: results.variableScores,
          },
          notes: content,
          duration: duration,
          completed: true,
        }

        // Envoyer les résultats à l'API
        const resultsResponse = await fetch(`${BASE_URL}/biosim/results/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resultsData),
        })

        if (!resultsResponse.ok) {
          throw new Error(`Erreur lors de l'enregistrement des résultats: ${resultsResponse.status}`)
        }

        // Préparer les données des notes
        const notesData = {
          experiment: selectedExperimentId,
          experiment_title: currentExperiment.title,
          title: title,
          content: content,
        }

        // Envoyer les notes à l'API
        const notesResponse = await fetch(`${BASE_URL}/biosim/notes/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notesData),
        })

        if (!notesResponse.ok) {
          throw new Error(`Erreur lors de l'enregistrement des notes: ${notesResponse.status}`)
        }

        // Débloquer l'achievement si l'efficacité est supérieure à 90%
        if (results.efficiency >= 0.9) {
          try {
            await fetch(`${BASE_URL}/biosim/user-achievements/unlock/optimal_conditions/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            })
          } catch (error) {
            console.error("Erreur lors du déblocage de l'achievement:", error)
          }
        }

        toast({
          title: "Succès",
          description: "Vos résultats et notes ont été enregistrés avec succès.",
        })

        // Passer à l'onglet des notes
        setActiveTab("notes")
      } catch (error) {
        console.error("Erreur lors de la sauvegarde:", error)
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'enregistrement de vos données.",
          variant: "destructive",
        })
      } finally {
        setIsSavingNotes(false)
      }
    },
    [selectedExperimentId, currentExperiment, variableValues, results, simulationStartTime],
  )

  return (
    <div
      ref={containerRef}
      className={`min-h-screen text-foreground ${theme === "dark"
        ? "bg-gradient-to-br from-indigo-950 to-slate-900"
        : "bg-gradient-to-br from-blue-50 to-indigo-100"
        }`}
    >
      {/* Audio element for sound effects */}
      <audio ref={audioRef} className="hidden" />

      {/* Header */}
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
        {loading && !experiments.length ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Experiments list */}
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
                    experiments={experiments}
                    selectedExperiment={selectedExperimentId || ""}
                    onSelectExperiment={handleExperimentSelect}
                  />
                </CardContent>
              </Card>

              {/* Achievements */}
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
                      className={`rounded-lg border p-3 transition-colors ${achievement.unlocked
                        ? "border-amber-500/50 bg-amber-500/10"
                        : "border-border bg-muted/50 opacity-60"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        {achievement.unlocked ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                            <CheckIcon className="h-3 w-3" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/40">
                            <LockIcon className="h-3 w-3" />
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
                    <Card className="border-border bg-card/80 backdrop-blur-sm overflow-hidden">
                      <CardHeader className="border-b border-border bg-card/80">
                      </CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {currentExperiment && getIconComponent(currentExperiment.icon)}
                          <span>{currentExperiment?.title || "Sélectionnez une expérience"}</span>
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
                      variables={Object.entries(experimentVariables.reduce((acc, variable) => {
                        acc[variable.name] = variableValues[variable.name] || variable.default_value;
                        return acc;
                      }, {} as Record<string, number>)).map(([key, value]) => (
                        <div key={key}>{`${key}: ${value}`}</div>
                      ))}

                      <CardContent className="p-0 relative">
                        <div className="relative aspect-video w-full overflow-hidden">
                          <SimulationCanvas
                            simulationRunning={simulationRunning}
                            showResults={showResults}
                            simulationSpeed={simulationSpeed}
                            selectedExperiment={selectedExperimentId || ""}
                            highQuality={highQuality}
                            variables={{
                              light: variableValues.light || 0,
                              co2: variableValues.co2 || 0,
                              water: variableValues.water || 0,
                              temperature: variableValues.temperature || 0,
                            }}
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
                                disabled={!selectedExperimentId}
                              >
                                <PlayIcon className="mr-2 h-4 w-4" />
                                Démarrer la simulation
                              </Button>
                            </div>
                          )}

                          <AnimatePresence>
                            {showResults && (
                              <SimulationResults
                                results={results}
                                experimentId={selectedExperimentId || ""}
                                experimentTitle={currentExperiment?.title || ""}
                                variableValues={experimentVariables.reduce((acc, variable) => {
                                  acc[variable.name] = variableValues[variable.name] || variable.default_value;
                                  return acc;
                                }, {} as Record<string, number>)}
                                onReset={resetSimulation}
                                onSaveNotes={saveResultsAndNotes}
                                isSaving={isSavingNotes}
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Variables panel */}
                    <Card className="border-border bg-card/80 backdrop-blur-sm" id="variables-panel">
                      <CardHeader>
                        <CardTitle>Variables</CardTitle>
                        <CardDescription>Ajustez les paramètres de l'expérience</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loading && selectedExperimentId ? (
                          <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                          </div>
                        ) : !selectedExperimentId ? (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="h-12 w-12 text-muted-foreground mb-4">
                              <Beaker className="h-12 w-12 opacity-50" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">Aucune expérience sélectionnée</h3>
                            <p className="text-muted-foreground max-w-xs">
                              Veuillez sélectionner une expérience dans la liste à gauche pour voir les variables
                              disponibles.
                            </p>
                          </div>
                        ) : experimentVariables.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="h-12 w-12 text-muted-foreground mb-4">
                              <Settings className="h-12 w-12 opacity-50" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">Aucune variable disponible</h3>
                            <p className="text-muted-foreground max-w-xs">
                              Cette expérience ne comporte pas de variables ajustables.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {experimentVariables.map((variable) => (
                              <div key={variable.id} className="space-y-4">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: variable.color || "#3b82f6" }}
                                      ></div>
                                      <label htmlFor={`var-${variable.name}`} className="font-medium">
                                        {variable.display_name}
                                      </label>
                                    </div>
                                    <span className="text-sm font-mono">
                                      {variableValues[variable.name] || variable.default_value}
                                      {variable.unit ? ` ${variable.unit}` : ""}
                                    </span>
                                  </div>
                                  <input
                                    id={`var-${variable.name}`}
                                    type="range"
                                    min={variable.min_value}
                                    max={variable.max_value}
                                    step={(variable.max_value - variable.min_value) / 100}
                                    value={variableValues[variable.name] || variable.default_value}
                                    onChange={(e) =>
                                      handleVariableChange(variable.name, [Number.parseFloat(e.target.value)])
                                    }
                                    disabled={simulationRunning}
                                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                                  />
                                  <p className="text-xs text-muted-foreground">{variable.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Results panel - only shown when simulation is running or complete */}
                  {(simulationRunning || showResults) && (
                    <ResultsPanel
                      results={results}
                      simulationTime={simulationTime}
                      variables={variableValues}
                    />
                  )}
                </TabsContent>

                <TabsContent value="theory" className="mt-0">
                  <TheoryContent
                    experimentId={selectedExperimentId || ""}
                    theoryContent={currentExperiment?.theory_content || ""}
                  />
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  <NotesPanel
                    experimentTitle={currentExperiment?.title || ""}
                    showResults={showResults}
                    results={results}
                    variables={variableValues}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
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

