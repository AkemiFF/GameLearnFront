"use client"

import { CardFooter } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ContinentFilter } from "@/components/world-explorer/continent-filter"
import { CountryInfoPanel } from "@/components/world-explorer/country-info-panel"
import { EnhancedStats } from "@/components/world-explorer/enhanced-stats"
import { countries as allCountries } from "@/data/countries"
import { useMobile } from "@/hooks/use-mobile"
import { WorldExplorerService } from "@/services/world-explorer-service"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Globe, HelpCircle, Home, Map, Settings, Trophy } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Importer dynamiquement les composants qui utilisent Leaflet
const WorldMap2D = dynamic(() => import("@/components/world-explorer/world-map-2d"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-muted/20">
      <Globe className="h-12 w-12 text-primary animate-pulse" />
    </div>
  ),
})

const CountryQuiz = dynamic(
  () => import("@/components/world-explorer/country-quiz").then((mod) => ({ default: mod.CountryQuiz })),
  { ssr: false },
)

export default function WorldExplorerPage() {
  const router = useRouter()
  const isMobile = useMobile()

  // Game state
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [visitedCountries, setVisitedCountries] = useState<string[]>([])
  const [showHelp, setShowHelp] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [activeTab, setActiveTab] = useState("map")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof allCountries>([])
  const [continentFilter, setContinentFilter] = useState("all")
  const [isClient, setIsClient] = useState(false)

  // Settings
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">("normal")
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [mapStyle, setMapStyle] = useState("standard")

  // Calculate progress percentage
  const progressPercentage = allCountries.length > 0 ? (visitedCountries.length / allCountries.length) * 100 : 0

  // Vérifier si nous sommes côté client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialisation du jeu et chargement des données
  useEffect(() => {
    const initializeGame = async () => {
      const savedData = await WorldExplorerService.loadSavedData()
      if (savedData) {
        setScore(savedData.score)
        setTotalQuestions(savedData.totalQuestions)
        setVisitedCountries(savedData.visitedCountries)
      }
    }
    initializeGame()
  }, [])

  // Mettre à jour les données sauvegardées à chaque changement
  useEffect(() => {
    WorldExplorerService.saveGameData({ score, totalQuestions, visitedCountries })
  }, [score, totalQuestions, visitedCountries])

  // Get country data
  const countryData = selectedCountry ? allCountries.find((c) => c.code === selectedCountry) : null

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = allCountries.filter((country) => country.name.toLowerCase().includes(query)).slice(0, 5)

    setSearchResults(results)
  }, [searchQuery])

  // Filter countries by continent
  const filteredCountries = allCountries.filter((country) => {
    if (continentFilter === "all") return true
    return country.continent === continentFilter
  })

  // Handle country selection
  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode)
    setShowQuiz(true)
  }

  // Handle quiz completion
  const handleQuizComplete = (finalScore: number, questionCount: number) => {
    setScore((prev) => prev + finalScore)
    setTotalQuestions((prev) => prev + questionCount)

    if (selectedCountry && !visitedCountries.includes(selectedCountry)) {
      setVisitedCountries((prev) => [...prev, selectedCountry])
    }

    setShowQuiz(false)
    setSelectedCountry(null)
  }

  // Reset progress
  const handleResetProgress = () => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Êtes-vous sûr de vouloir réinitialiser votre progression ? Cette action est irréversible.")
    ) {
      setVisitedCountries([])
      setScore(0)
      setTotalQuestions(0)
      setShowSettings(false)
    }
  }

  // Si nous ne sommes pas encore côté client, afficher un état de chargement ou rien
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950">
        <div className="container py-6">
          <div className="flex items-center justify-center h-[80vh]">
            <Globe className="h-12 w-12 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">World Explorer</span>
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
        <div className="space-y-6">
          {/* Game info */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">World Explorer</h1>
              <p className="text-muted-foreground">Explorez le monde et testez vos connaissances géographiques</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <span className="font-medium">{score} points</span>
              </div>
              <Badge variant="outline" className="ml-2">
                {visitedCountries.length}/{allCountries.length} pays visités
              </Badge>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Progression</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="map" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="map">Carte du monde</TabsTrigger>
              <TabsTrigger value="visited">Pays visités</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className={`relative ${isMobile ? "h-[400px]" : "h-[600px]"} w-full overflow-hidden`}>
                        {/* World Map 2D */}
                        <WorldMap2D
                          onCountrySelect={handleCountrySelect}
                          visitedCountries={visitedCountries}
                          selectedCountry={selectedCountry}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 border-t">
                      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="text-sm text-muted-foreground">Cliquez sur un pays pour commencer un quiz</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setShowHelp(true)}>
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Comment jouer
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              // Sélectionner un pays aléatoire non visité
                              const unvisitedCountries = allCountries.filter((c) => !visitedCountries.includes(c.code))
                              if (unvisitedCountries.length > 0) {
                                const randomCountry =
                                  unvisitedCountries[Math.floor(Math.random() * unvisitedCountries.length)]
                                handleCountrySelect(randomCountry.code)
                              }
                            }}
                          >
                            Pays aléatoire
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </div>

                <div>
                  <CountryInfoPanel
                    countryCode={selectedCountry}
                    isVisited={selectedCountry ? visitedCountries.includes(selectedCountry) : false}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visited" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pays visités</CardTitle>
                  <CardDescription>
                    {visitedCountries.length === 0
                      ? "Vous n'avez encore visité aucun pays"
                      : `Vous avez visité ${visitedCountries.length} pays sur ${allCountries.length}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <ContinentFilter onFilterChange={setContinentFilter} />
                  </div>

                  {visitedCountries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Aucun pays visité</h3>
                      <p className="text-muted-foreground max-w-xs">
                        Cliquez sur un pays sur la carte pour commencer à explorer le monde
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {visitedCountries
                        .filter((countryCode) => {
                          if (continentFilter === "all") return true
                          const country = allCountries.find((c) => c.code === countryCode)
                          return country?.continent === continentFilter
                        })
                        .map((countryCode) => {
                          const country = allCountries.find((c) => c.code === countryCode)
                          if (!country) return null

                          return (
                            <motion.div
                              key={country.code}
                              className="flex flex-col items-center p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                              whileHover={{ scale: 1.05 }}
                              onClick={() => handleCountrySelect(country.code)}
                            >
                              <div className="w-12 h-8 mb-2 overflow-hidden rounded border">
                                <img
                                  src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                                  alt={`Drapeau ${country.name}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-sm font-medium text-center">{country.name}</span>
                            </motion.div>
                          )
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <EnhancedStats visitedCountries={visitedCountries} score={score} totalQuestions={totalQuestions} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Quiz dialog */}
      {/* Quiz dialog */}
      <AnimatePresence>
        {showQuiz && selectedCountry && countryData && (
          <Dialog
            open={showQuiz}
            onOpenChange={(open) => {
              setShowQuiz(open)
              if (!open) {
                setSelectedCountry(null)
              }
            }}
          >
            {/* <DialogContent className="fixed inset-0 flex items-center justify-center p-0 bg-transparent border-none shadow-none"> */}
            <DialogContent className=" z-[9999]">
              {/* <div className="relative w-full max-w-[95vw] md:max-w-2xl bg-background rounded-lg border shadow-lg p-6 m-4"> */}
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="w-8 h-5 overflow-hidden rounded">
                    <img
                      src={`https://flagcdn.com/w80/${countryData.code.toLowerCase()}.png`}
                      alt={`Drapeau ${countryData.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  Quiz: {countryData.name}
                </DialogTitle>
                <DialogDescription>Testez vos connaissances sur {countryData.name}</DialogDescription>
              </DialogHeader>

              {isClient && (
                <CountryQuiz
                  country={countryData}
                  onComplete={handleQuizComplete}
                  difficulty={difficulty}
                  soundEnabled={soundEnabled}
                />
              )}
              {/* </div> */}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Help dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comment jouer</DialogTitle>
            <DialogDescription>Découvrez le monde et testez vos connaissances géographiques</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Map className="h-4 w-4 text-primary" />
                Exploration
              </h3>
              <p className="text-sm text-muted-foreground">
                Cliquez sur n'importe quel pays de la carte pour commencer un quiz sur ce pays. Vous pouvez filtrer les
                pays par continent et utiliser la barre de recherche pour trouver un pays spécifique.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                Quiz et indices
              </h3>
              <p className="text-sm text-muted-foreground">
                Répondez aux questions pour gagner des points. Si vous êtes bloqué, vous pouvez demander un indice, mais
                cela réduira les points que vous pouvez gagner pour cette question.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                Progression
              </h3>
              <p className="text-sm text-muted-foreground">
                Suivez votre progression dans l'onglet "Statistiques". Essayez de visiter tous les pays et de collecter
                le maximum de points pour devenir un expert en géographie mondiale.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowHelp(false)}>J'ai compris</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paramètres</DialogTitle>
            <DialogDescription>Personnalisez votre expérience de jeu</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Difficulté des questions</div>
                <div className="text-sm text-muted-foreground">Ajustez le niveau de difficulté des quiz</div>
              </div>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Difficulté" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Facile</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="hard">Difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Style de carte</div>
                <div className="text-sm text-muted-foreground">Choisissez le style de la carte</div>
              </div>
              <Select value={mapStyle} onValueChange={setMapStyle}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="terrain">Terrain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Sons et effets</div>
                <div className="text-sm text-muted-foreground">Activer ou désactiver les sons du jeu</div>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Réinitialiser la progression</div>
                <div className="text-sm text-muted-foreground">Effacer toutes vos données de jeu</div>
              </div>
              <Button variant="destructive" size="sm" onClick={handleResetProgress}>
                Réinitialiser
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowSettings(false)}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Introduction dialog */}
      <Dialog open={showIntro} onOpenChange={setShowIntro}>
        <DialogContent className="sm:max-w-md z-[9999]">
          <DialogHeader>
            <DialogTitle>Bienvenue dans World Explorer!</DialogTitle>
            <DialogDescription>Prêt à découvrir le monde et tester vos connaissances?</DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-4">
            <Globe className="h-24 w-24 text-primary" />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Explorez notre carte interactive et cliquez sur n'importe quel pays pour commencer un quiz. Répondez
            correctement aux questions pour gagner des points et suivez votre progression.
          </p>

          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setShowIntro(false)}>Commencer l'exploration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  )
}

