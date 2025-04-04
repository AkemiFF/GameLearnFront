"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  TerminalIcon,
  Lightbulb,
  Lock,
  LogOut,
  Puzzle,
  RotateCcw,
  Search,
  Shield,
  Zap,
  Trophy,
  AlertTriangle,
  Compass,
  Key,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { useFullscreen } from "@/hooks/use-fullscreen"

// Import components
import { PuzzleCode } from "@/components/escape-room/puzzle-code"
import { PuzzleSequence } from "@/components/escape-room/puzzle-sequence"
import { PuzzleSwitches } from "@/components/escape-room/puzzle-switches"
import { Terminal } from "@/components/escape-room/terminal"
import { GameMap } from "@/components/escape-room/game-map"
import { Inventory } from "@/components/escape-room/inventory"
import { GameHeader } from "@/components/escape-room/game-header"
import { BackgroundEffects } from "@/components/escape-room/background-effects"
import { EmergencyAlert } from "@/components/escape-room/emergency-alert"

export default function EscapeRoomPage() {
  const params = useParams()
  const router = useRouter()
  const isMobile = useMobile()
  const gameId = params.id
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const { isFullscreen, toggleFullscreen } = useFullscreen(gameContainerRef)

  // Game state
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [unlockedPuzzles, setUnlockedPuzzles] = useState([0])
  const [inventory, setInventory] = useState([])
  const [hints, setHints] = useState([])
  const [showHint, setShowHint] = useState(false)
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes in seconds
  const [isPaused, setIsPaused] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [terminalHistory, setTerminalHistory] = useState([
    { type: "system", text: "Système ADN-OS v3.5 initialisé..." },
    { type: "system", text: "Bienvenue dans le laboratoire de génétique." },
    { type: "system", text: "Tapez 'aide' pour afficher les commandes disponibles." },
  ])
  const [showConfetti, setShowConfetti] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [lowPerformanceMode, setLowPerformanceMode] = useState(false)
  const [showEmergency, setShowEmergency] = useState(false)

  // Refs
  const audioRef = useRef(null)

  // Mock game data
  const game = useMemo(
    () => ({
      id: gameId,
      title: "Escape Room: Mystères de l'ADN",
      type: "Escape Room",
      category: "Biologie",
      difficulty: "Difficile",
      duration: "60 min",
      description:
        "Vous êtes enfermé dans un laboratoire de génétique et devez résoudre des énigmes basées sur l'ADN pour vous échapper avant que le temps ne s'écoule.",
      background: "bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800",
      puzzles: [
        {
          id: 1,
          title: "Accès au Laboratoire",
          description:
            "Déchiffrez le code d'accès au laboratoire principal en utilisant la séquence d'ADN. Indice: A=1, T=20, G=7, C=3.",
          hint: "Les bases azotées de l'ADN peuvent être représentées par les lettres A, T, G et C. Convertissez ces lettres en chiffres selon leur position dans l'alphabet: A=1, T=20, G=7, C=3. La séquence ATGC donne donc 1-20-7-3.",
          solution: "1472",
          type: "code",
          image: "/placeholder.svg?height=300&width=500",
        },
        {
          id: 2,
          title: "Microscope Électronique",
          description: "Alignez correctement les brins d'ADN pour former une double hélice complète.",
          hint: "A s'associe toujours avec T, et G s'associe toujours avec C dans la structure de l'ADN.",
          solution: "ATGC",
          type: "sequence",
          image: "/placeholder.svg?height=300&width=500",
          requiresItem: "carte_accès",
        },
        {
          id: 3,
          title: "Synthèse Protéique",
          description: "Complétez le processus de synthèse protéique en plaçant les éléments dans le bon ordre.",
          hint: "La synthèse protéique suit l'ordre: ADN → ARNm → Ribosome → Protéine.",
          solution: "ACGT",
          type: "order",
          image: "/placeholder.svg?height=300&width=500",
        },
        {
          id: 4,
          title: "Séquençage Génomique",
          description: "Identifiez la mutation génétique qui a causé l'incident de laboratoire.",
          hint: "Comparez les séquences et trouvez celle qui diffère des autres. Utilisez la commande 'mutation' dans le terminal après avoir analysé les données.",
          solution: "MUTATION",
          type: "terminal",
          image: "/placeholder.svg?height=300&width=500",
        },
        {
          id: 5,
          title: "Chambre de Décontamination",
          description: "Activez le protocole de décontamination pour sortir du laboratoire en toute sécurité.",
          hint: "Le protocole nécessite l'activation de 4 interrupteurs dans un ordre spécifique basé sur les découvertes précédentes. L'ordre est 4-2-1-3.",
          solution: "4213",
          type: "switches",
          image: "/placeholder.svg?height=300&width=500",
          requiresItem: "carte_sécurité",
        },
      ],
      items: [
        {
          id: "carte_accès",
          name: "Carte d'accès",
          description: "Permet d'accéder aux zones sécurisées du laboratoire.",
          icon: <Key className="h-5 w-5" />,
        },
        {
          id: "loupe",
          name: "Loupe",
          description: "Permet d'examiner les détails des indices.",
          icon: <Search className="h-5 w-5" />,
        },
        {
          id: "carte_sécurité",
          name: "Badge de sécurité",
          description: "Autorise l'accès à la chambre de décontamination.",
          icon: <Shield className="h-5 w-5" />,
        },
        {
          id: "tablette",
          name: "Tablette de données",
          description: "Contient des informations sur les expériences génétiques.",
          icon: <TerminalIcon className="h-5 w-5" />,
        },
      ],
      map: [
        { id: 0, name: "Entrée", x: 20, y: 20, connections: [1] },
        { id: 1, name: "Laboratoire Principal", x: 50, y: 20, connections: [0, 2, 3] },
        { id: 2, name: "Salle des Microscopes", x: 80, y: 20, connections: [1, 4] },
        { id: 3, name: "Laboratoire de Synthèse", x: 50, y: 50, connections: [1, 4] },
        { id: 4, name: "Centre de Séquençage", x: 80, y: 50, connections: [2, 3, 5] },
        { id: 5, name: "Chambre de Décontamination", x: 80, y: 80, connections: [4] },
      ],
    }),
    [gameId],
  )

  // Timer effect
  useEffect(() => {
    if (!isPaused && timeLeft > 0 && !showSuccess) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)

      // Emergency warning when time is running low
      if (timeLeft === 300) {
        // 5 minutes left
        setShowEmergency(true)
        setTimeout(() => setShowEmergency(false), 5000)
        if (soundEnabled && audioRef.current) {
          audioRef.current.play()
        }
      }

      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showSuccess) {
      setShowGameOver(true)
    }
  }, [timeLeft, isPaused, showSuccess, soundEnabled])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Handle terminal command
  const handleTerminalCommand = (command) => {
    setTerminalHistory([...terminalHistory, { type: "user", text: `> ${command}` }])

    // Process command
    if (command === "aide" || command === "help") {
      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "system",
          text: "Commandes disponibles: aide, analyser, séquencer, mutation, sortie",
        },
      ])
    } else if (command === "analyser") {
      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "system",
          text: "Analyse de l'échantillon en cours... Séquence ADN détectée: ATGCTAGCTAGCTA",
        },
      ])
    } else if (command === "séquencer") {
      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "system",
          text: "Séquençage en cours... Comparaison avec la base de données... Anomalie détectée dans le segment 4.",
        },
      ])
    } else if (command === "mutation") {
      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "system",
          text: "Mutation identifiée: substitution de base A→G à la position 247. Cette mutation est responsable de l'incident.",
        },
      ])

      // If this is the current puzzle and it's a terminal type, solve it
      if (currentPuzzle === 3 && game.puzzles[currentPuzzle].type === "terminal") {
        setTerminalHistory((prev) => [
          ...prev,
          {
            type: "system",
            text: "Félicitations! Vous avez identifié la cause de l'incident. Accès au système de décontamination accordé.",
          },
        ])
        setTimeout(() => {
          setShowTerminal(false)
          handlePuzzleSolved()
        }, 2000)
      }
    } else if (command === "sortie" || command === "exit") {
      setShowTerminal(false)
    } else {
      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "error",
          text: "Commande non reconnue. Tapez 'aide' pour voir les commandes disponibles.",
        },
      ])
    }
  }

  // Handle puzzle solved
  const handlePuzzleSolved = () => {
    // Add reward animation
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)

    // Play success sound
    if (soundEnabled && audioRef.current) {
      audioRef.current.src = "/success.mp3" // This is a placeholder, you would need to add this file
      audioRef.current.play().catch((e) => console.error("Audio play failed:", e))
    }

    // Add item to inventory if applicable
    if (currentPuzzle === 0) {
      addItemToInventory("carte_accès")
    } else if (currentPuzzle === 1) {
      addItemToInventory("carte_sécurité")
    } else if (currentPuzzle === 2) {
      addItemToInventory("tablette")
    } else if (currentPuzzle === 3) {
      addItemToInventory("loupe")
    }

    // Unlock next puzzle
    if (currentPuzzle < game.puzzles.length - 1) {
      const nextPuzzle = currentPuzzle + 1
      setUnlockedPuzzles([...unlockedPuzzles, nextPuzzle])
      setCurrentPuzzle(nextPuzzle)
    } else {
      // Game completed
      setShowSuccess(true)
    }
  }

  // Add item to inventory
  const addItemToInventory = (itemId) => {
    const item = game.items.find((i) => i.id === itemId)
    if (item && !inventory.some((i) => i.id === itemId)) {
      setInventory([...inventory, item])
    }
  }

  // Use hint
  const useHint = () => {
    if (!hints.includes(currentPuzzle)) {
      setHints([...hints, currentPuzzle])
    }
    setShowHint(true)
  }

  // Handle puzzle failure
  const handlePuzzleFail = () => {
    // Add penalty
    setTimeLeft(Math.max(0, timeLeft - 60)) // Penalty: -1 minute
  }

  // Get progress percentage
  const getProgressPercentage = () => {
    return (currentPuzzle / game.puzzles.length) * 100
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div ref={gameContainerRef} className={cn("min-h-screen text-white overflow-hidden", game.background)}>
      {/* Audio element for sound effects */}
      <audio ref={audioRef} className="hidden" />

      {/* Background effects */}
      <BackgroundEffects lowPerformanceMode={lowPerformanceMode} />

      {/* Emergency warning overlay */}
      <AnimatePresence>
        {showEmergency && <EmergencyAlert timeLeft={timeLeft} formatTime={formatTime} />}
      </AnimatePresence>

      {/* Header */}
      <GameHeader
        title="EduPlay Studio"
        timeLeft={timeLeft}
        formatTime={formatTime}
        onPause={() => setIsPaused(true)}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        soundEnabled={soundEnabled}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onBack={() => router.back()}
      />

      {/* Main content */}
      <main className="container py-8 relative z-10">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mx-auto max-w-5xl">
          {/* Game info */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Lock className="h-6 w-6 text-purple-400" />
              {game.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge className="bg-purple-600 hover:bg-purple-700">{game.type}</Badge>
              <Badge variant="outline" className="text-white border-white/20">
                {game.category}
              </Badge>
              <Badge variant="outline" className="text-white border-white/20">
                {game.difficulty}
              </Badge>
            </div>
          </motion.div>

          {/* Progress */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-sm font-medium">
                {currentPuzzle}/{game.puzzles.length} énigmes
              </span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-fuchsia-500"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Current puzzle */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 bg-black/30 backdrop-blur-md text-white overflow-hidden">
              <CardHeader className="border-b border-white/10 bg-black/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Puzzle className="h-5 w-5 text-purple-400" />
                    {game.puzzles[currentPuzzle].title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white"
                            onClick={() => setShowMap(true)}
                          >
                            <Compass className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Carte du laboratoire</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white"
                            onClick={() => setShowInventory(true)}
                          >
                            <Backpack className="h-4 w-4" />
                            {inventory.length > 0 && (
                              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px]">
                                {inventory.length}
                              </span>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Inventaire</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <CardDescription className="text-white/70">{game.puzzles[currentPuzzle].description}</CardDescription>
                {showHint && hints.includes(currentPuzzle) && (
                  <div className="mt-2 flex items-start gap-2 rounded-lg bg-purple-900/30 border border-purple-500/30 p-3 text-sm">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
                    <span>{game.puzzles[currentPuzzle].hint}</span>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Puzzle image */}
                <div className="relative rounded-lg overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src={game.puzzles[currentPuzzle].image || "/placeholder.svg"}
                    alt={game.puzzles[currentPuzzle].title}
                    className="w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                {/* Puzzle interaction */}
                <div className="space-y-4">
                  {game.puzzles[currentPuzzle].type === "code" && (
                    <PuzzleCode
                      solution={game.puzzles[currentPuzzle].solution}
                      onSolve={handlePuzzleSolved}
                      onFail={handlePuzzleFail}
                    />
                  )}

                  {game.puzzles[currentPuzzle].type === "sequence" && (
                    <PuzzleSequence
                      solution={game.puzzles[currentPuzzle].solution}
                      onSolve={handlePuzzleSolved}
                      onFail={handlePuzzleFail}
                    />
                  )}

                  {game.puzzles[currentPuzzle].type === "terminal" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Accédez au terminal de séquençage:</h3>
                      <div className="flex justify-center">
                        <Button
                          className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 border-0 text-white"
                          onClick={() => setShowTerminal(true)}
                        >
                          <TerminalIcon className="mr-2 h-4 w-4" />
                          Ouvrir le terminal
                        </Button>
                      </div>
                    </div>
                  )}

                  {game.puzzles[currentPuzzle].type === "switches" && (
                    <PuzzleSwitches
                      solution={game.puzzles[currentPuzzle].solution}
                      onSolve={handlePuzzleSolved}
                      onFail={handlePuzzleFail}
                    />
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-white/10 bg-black/20 p-4">
                <Button
                  variant="outline"
                  onClick={useHint}
                  disabled={hints.includes(currentPuzzle)}
                  className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  <Lightbulb className="mr-2 h-4 w-4 text-yellow-400" />
                  {hints.includes(currentPuzzle) ? "Indice déjà utilisé" : "Utiliser un indice"}
                </Button>

                <div className="flex gap-2">
                  {currentPuzzle > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPuzzle(currentPuzzle - 1)}
                      className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Énigme précédente
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      {/* Terminal dialog */}
      <Dialog open={showTerminal} onOpenChange={setShowTerminal}>
        <DialogContent className="bg-black text-green-500 border-green-900 font-mono max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-400">
              <TerminalIcon className="h-5 w-5" />
              Terminal de Séquençage ADN
            </DialogTitle>
            <DialogDescription className="text-green-600">
              Utilisez les commandes pour analyser les séquences génétiques
            </DialogDescription>
          </DialogHeader>

          <Terminal onCommand={handleTerminalCommand} terminalHistory={terminalHistory} />
        </DialogContent>
      </Dialog>

      {/* Inventory dialog */}
      <Dialog open={showInventory} onOpenChange={setShowInventory}>
        <DialogContent className="bg-black/80 backdrop-blur-md text-white border-white/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Backpack className="h-5 w-5 text-purple-400" />
              Inventaire
            </DialogTitle>
            <DialogDescription className="text-white/70">Objets collectés durant votre exploration</DialogDescription>
          </DialogHeader>

          <Inventory items={inventory} />
        </DialogContent>
      </Dialog>

      {/* Map dialog */}
      <Dialog open={showMap} onOpenChange={setShowMap}>
        <DialogContent className="bg-black/80 backdrop-blur-md text-white border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-purple-400" />
              Carte du Laboratoire
            </DialogTitle>
            <DialogDescription className="text-white/70">Plan des différentes zones du laboratoire</DialogDescription>
          </DialogHeader>

          <GameMap rooms={game.map} unlockedPuzzles={unlockedPuzzles} currentPuzzle={currentPuzzle} />
        </DialogContent>
      </Dialog>

      {/* Pause dialog */}
      <Dialog open={isPaused} onOpenChange={setIsPaused}>
        <DialogContent className="bg-black/80 backdrop-blur-md text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Jeu en pause</DialogTitle>
            <DialogDescription className="text-white/70">Prenez une pause. Votre temps est arrêté.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h3 className="mb-2 font-medium">Progression actuelle</h3>
            <div className="mb-4 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>
                  Énigme {currentPuzzle + 1} sur {game.puzzles.length}
                </span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2 bg-white/10" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-400" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                <span>{hints.length} indices utilisés</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span>Mode performance réduite</span>
              <Button
                variant="outline"
                size="sm"
                className={cn("border-white/20 text-white", lowPerformanceMode ? "bg-purple-600/50" : "bg-transparent")}
                onClick={() => setLowPerformanceMode(!lowPerformanceMode)}
              >
                {lowPerformanceMode ? "Activé" : "Désactivé"}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>Son</span>
              <Button
                variant="outline"
                size="sm"
                className={cn("border-white/20 text-white", soundEnabled ? "bg-purple-600/50" : "bg-transparent")}
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? "Activé" : "Désactivé"}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 hover:text-white">
              <Link href="/games">
                <LogOut className="mr-2 h-4 w-4" />
                Quitter le jeu
              </Link>
            </Button>
            <Button
              onClick={() => setIsPaused(false)}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 border-0 text-white"
            >
              Continuer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-black/80 backdrop-blur-md text-white border-white/20">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-900/50">
              <Zap className="h-10 w-10 text-purple-400" />
            </div>
            <DialogTitle className="text-2xl">Escape Room Réussie !</DialogTitle>
            <DialogDescription className="text-white/70">
              Vous avez résolu toutes les énigmes et vous êtes échappé du laboratoire !
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2 text-center">
              <div className="text-4xl font-bold font-mono">{formatTime(3600 - timeLeft)}</div>
              <p className="text-sm text-white/70">Temps utilisé pour s'échapper</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                <div className="text-2xl font-bold">{game.puzzles.length}</div>
                <p className="text-xs text-white/70">Énigmes résolues</p>
              </div>
              <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                <div className="text-2xl font-bold">{hints.length}</div>
                <p className="text-xs text-white/70">Indices utilisés</p>
              </div>
              <div className="rounded-lg bg-white/5 border border-white/10 p-4">
                <div className="text-2xl font-bold">{inventory.length}</div>
                <p className="text-xs text-white/70">Objets collectés</p>
              </div>
            </div>

            <div className="rounded-lg bg-purple-900/20 border border-purple-500/30 p-4">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                Récompenses obtenues
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-purple-400" />
                  <span className="text-sm">Badge "Généticien"</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span className="text-sm">+200 XP</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:text-white"
              onClick={() => router.push("/games")}
            >
              Explorer d'autres jeux
            </Button>
            <Button
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 border-0 text-white"
              onClick={() => router.push("/dashboard")}
            >
              Retour au tableau de bord
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Game Over dialog */}
      <Dialog open={showGameOver} onOpenChange={() => {}}>
        <DialogContent className="bg-black/80 backdrop-blur-md text-white border-red-900/50">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-900/50">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <DialogTitle className="text-2xl text-red-500">Temps écoulé</DialogTitle>
            <DialogDescription className="text-white/70">
              Le système de confinement s'est verrouillé. Vous n'avez pas réussi à vous échapper à temps.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2 text-center">
              <div className="text-4xl font-bold font-mono text-red-500">00:00</div>
              <p className="text-sm text-white/70">Temps restant</p>
            </div>

            <div className="rounded-lg bg-red-900/20 border border-red-500/30 p-4">
              <h3 className="font-medium mb-2">Progression</h3>
              <p className="text-sm">
                Vous avez résolu {currentPuzzle} énigmes sur {game.puzzles.length}.
              </p>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:text-white"
              onClick={() => router.push("/games")}
            >
              Quitter
            </Button>
            <Button
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 text-white"
              onClick={() => {
                setTimeLeft(3600)
                setCurrentPuzzle(0)
                setUnlockedPuzzles([0])
                setInventory([])
                setHints([])
                setShowHint(false)
                setShowGameOver(false)
              }}
            >
              Réessayer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ["#9333ea", "#c026d3", "#7c3aed", "#a855f7", "#d946ef"][Math.floor(Math.random() * 5)],
                top: `${Math.random() * -10}%`,
                left: `${Math.random() * 100}%`,
                filter: "blur(0.5px)",
              }}
              animate={{
                y: ["0vh", "100vh"],
                x: [`${Math.random() * 10 - 5}vw`, `${Math.random() * 20 - 10}vw`],
                rotate: [0, Math.random() * 360],
                opacity: [1, 0.8, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                ease: "easeOut",
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Backpack(props) {
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
      <path d="M4 20V10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5" />
      <path d="M8 10h8" />
      <path d="M8 18h8" />
    </svg>
  )
}

function Clock(props) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function BrainCircuit(props) {
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
      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08 2.5 2.5 0 0 0 4.91.05L12 20V4.5Z" />
      <path d="M16 8V5c0-1.1.9-2 2-2" />
      <path d="M12 13h4" />
      <path d="M12 18h6a2 2 0 0 1 2 2v1" />
      <path d="M12 8h8" />
      <path d="M20.5 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
      <path d="M16.5 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
      <path d="M20.5 21a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
      <path d="M18.5 3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
    </svg>
  )
}

