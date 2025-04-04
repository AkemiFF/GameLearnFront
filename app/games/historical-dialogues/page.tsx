"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Home, BookOpen, Award, Settings, Info, History } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { HistoricalCharacterCard } from "@/components/historical-dialogues/character-card"
import { historicalCharacters } from "@/data/historical-characters"
import { useMobile } from "@/hooks/use-mobile"

export default function HistoricalDialoguesPage() {
  const router = useRouter()
  const isMobile = useMobile()

  // Game state
  const [score, setScore] = useState(0)
  const [learnedFacts, setLearnedFacts] = useState<string[]>([])
  const [completedDialogues, setCompletedDialogues] = useState<string[]>([])
  const [showHelp, setShowHelp] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [activeTab, setActiveTab] = useState("characters")

  // Load saved state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedScore = localStorage.getItem("historical-dialogues-score")
      const savedFacts = localStorage.getItem("historical-dialogues-facts")
      const savedCompleted = localStorage.getItem("historical-dialogues-completed")

      if (savedScore) setScore(Number.parseInt(savedScore))
      if (savedFacts) setLearnedFacts(JSON.parse(savedFacts))
      if (savedCompleted) setCompletedDialogues(JSON.parse(savedCompleted))
    }
  }, [])

  // Handle character selection
  const handleCharacterSelect = (characterId: string) => {
    router.push(`/games/historical-dialogues/${characterId}`)
  }

  // Calculate progress percentage
  const progressPercentage = Math.round((completedDialogues.length / historicalCharacters.length) * 100)

  // Reset progress
  const handleResetProgress = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser votre progression ? Cette action est irréversible.")) {
      setCompletedDialogues([])
      setLearnedFacts([])
      setScore(0)

      // Clear localStorage
      localStorage.removeItem("historical-dialogues-score")
      localStorage.removeItem("historical-dialogues-facts")
      localStorage.removeItem("historical-dialogues-completed")

      setShowSettings(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 dark:from-slate-900 dark:to-amber-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-amber-600 dark:text-amber-500" />
              <span className="text-lg font-semibold">Dialogues Historiques</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setShowHelp(true)}>
                    <Info className="h-5 w-5" />
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
              <h1 className="text-3xl font-bold tracking-tight">Dialogues Historiques</h1>
              <p className="text-muted-foreground">
                Conversez avec des personnages historiques et découvrez l'Histoire
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                <span className="font-medium">{score} points</span>
              </div>
              <Badge variant="outline" className="ml-2">
                {completedDialogues.length}/{historicalCharacters.length} personnages rencontrés
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
          <Tabs defaultValue="characters" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="characters">Personnages</TabsTrigger>
              <TabsTrigger value="learned">Connaissances acquises</TabsTrigger>
              <TabsTrigger value="achievements">Réalisations</TabsTrigger>
            </TabsList>

            <TabsContent value="characters" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {historicalCharacters.map((character) => (
                  <HistoricalCharacterCard
                    key={character.id}
                    character={character}
                    isCompleted={completedDialogues.includes(character.id)}
                    onSelect={() => handleCharacterSelect(character.id)}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="learned" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Connaissances acquises</CardTitle>
                  <CardDescription>
                    {learnedFacts.length === 0
                      ? "Vous n'avez pas encore acquis de connaissances"
                      : `Vous avez découvert ${learnedFacts.length} faits historiques`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {learnedFacts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Aucune connaissance acquise</h3>
                      <p className="text-muted-foreground max-w-xs">
                        Dialoguez avec des personnages historiques pour découvrir des faits intéressants
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {learnedFacts.map((fact, index) => (
                        <div key={index} className="p-4 rounded-lg border bg-card/50">
                          <div className="flex gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
                              <BookOpen className="h-4 w-4" />
                            </div>
                            <p className="text-sm">{fact}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Réalisations</CardTitle>
                  <CardDescription>Suivez vos accomplissements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      className={`rounded-lg border p-4 ${completedDialogues.length >= 1 ? "bg-amber-100/50 dark:bg-amber-900/20" : "bg-muted/50"}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${completedDialogues.length >= 1 ? "bg-amber-500 text-white" : "bg-muted-foreground/20 text-muted-foreground"}`}
                        >
                          <History className="h-4 w-4" />
                        </div>
                        <div className="font-medium">Premier contact</div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Dialoguer avec votre premier personnage historique
                      </p>
                    </div>

                    <div
                      className={`rounded-lg border p-4 ${completedDialogues.length >= 3 ? "bg-amber-100/50 dark:bg-amber-900/20" : "bg-muted/50"}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${completedDialogues.length >= 3 ? "bg-amber-500 text-white" : "bg-muted-foreground/20 text-muted-foreground"}`}
                        >
                          <History className="h-4 w-4" />
                        </div>
                        <div className="font-medium">Explorateur du temps</div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Dialoguer avec 3 personnages historiques différents
                      </p>
                    </div>

                    <div
                      className={`rounded-lg border p-4 ${learnedFacts.length >= 10 ? "bg-amber-100/50 dark:bg-amber-900/20" : "bg-muted/50"}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${learnedFacts.length >= 10 ? "bg-amber-500 text-white" : "bg-muted-foreground/20 text-muted-foreground"}`}
                        >
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div className="font-medium">Érudit</div>
                      </div>
                      <p className="text-sm text-muted-foreground">Découvrir 10 faits historiques</p>
                    </div>

                    <div
                      className={`rounded-lg border p-4 ${score >= 500 ? "bg-amber-100/50 dark:bg-amber-900/20" : "bg-muted/50"}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${score >= 500 ? "bg-amber-500 text-white" : "bg-muted-foreground/20 text-muted-foreground"}`}
                        >
                          <Award className="h-4 w-4" />
                        </div>
                        <div className="font-medium">Historien en herbe</div>
                      </div>
                      <p className="text-sm text-muted-foreground">Obtenir 500 points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Help dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comment jouer</DialogTitle>
            <DialogDescription>
              Découvrez l'Histoire à travers des conversations avec des personnages historiques
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <History className="h-4 w-4 text-amber-600" />
                Dialogues
              </h3>
              <p className="text-sm text-muted-foreground">
                Choisissez un personnage historique et engagez une conversation avec lui. Posez des questions
                pertinentes et choisissez les bonnes réponses pour en apprendre davantage sur son époque et ses
                réalisations.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-600" />
                Apprentissage
              </h3>
              <p className="text-sm text-muted-foreground">
                Chaque dialogue vous permet de découvrir des faits historiques authentiques. Ces connaissances sont
                enregistrées dans votre journal personnel que vous pouvez consulter à tout moment.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-600" />
                Réalisations
              </h3>
              <p className="text-sm text-muted-foreground">
                Débloquez des réalisations en dialoguant avec différents personnages et en accumulant des connaissances.
                Suivez votre progression dans l'onglet "Réalisations".
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
            <DialogDescription>Personnalisez votre expérience</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
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
            <Button onClick={() => setShowSettings(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Introduction dialog */}
      <Dialog open={showIntro} onOpenChange={setShowIntro}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bienvenue dans Dialogues Historiques!</DialogTitle>
            <DialogDescription>
              Voyagez à travers le temps et conversez avec les grandes figures de l'Histoire
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-4">
            <History className="h-24 w-24 text-amber-500" />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Choisissez un personnage historique et engagez une conversation interactive. Posez des questions, découvrez
            des faits historiques authentiques et testez vos connaissances tout en vous amusant.
          </p>

          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setShowIntro(false)}>Commencer l'aventure</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

