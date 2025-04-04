"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, ChevronRight, Clock, FileText, Gamepad2, MessageSquare, Star, Trophy } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"

export default function Dashboard() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(78), 500)
    return () => clearTimeout(timer)
  }, [])

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

  const recentGames = [
    {
      id: 1,
      title: "Quiz Avancé: Système Solaire",
      type: "Quiz",
      icon: <FileText className="h-8 w-8 text-primary" />,
      progress: 100,
      score: "18/20",
      date: "Aujourd'hui",
    },
    {
      id: 2,
      title: "Escape Room: Mystères de l'ADN",
      type: "Escape Room",
      icon: <Gamepad2 className="h-8 w-8 text-primary" />,
      progress: 65,
      score: "En cours",
      date: "Hier",
    },
    {
      id: 3,
      title: "Association: Capitales du Monde",
      type: "Association",
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      progress: 100,
      score: "42/50",
      date: "Il y a 3 jours",
    },
  ]

  const badges = [
    { name: "Premier Quiz", icon: <Star className="h-6 w-6" />, date: "Il y a 2 semaines" },
    { name: "Expert en Biologie", icon: <Award className="h-6 w-6" />, date: "Il y a 1 semaine" },
    { name: "Explorateur Curieux", icon: <Trophy className="h-6 w-6" />, date: "Aujourd'hui" },
  ]

  const recommendedGames = [
    {
      id: 1,
      title: "Simulateur de Circuit Électrique",
      type: "Simulateur",
      difficulty: "Intermédiaire",
      duration: "15 min",
      thumbnail: "/placeholder.svg?height=100&width=180",
    },
    {
      id: 2,
      title: "Quiz: Histoire de France",
      type: "Quiz",
      difficulty: "Facile",
      duration: "10 min",
      thumbnail: "/placeholder.svg?height=100&width=180",
    },
    {
      id: 3,
      title: "Escape Room: Énigmes Mathématiques",
      type: "Escape Room",
      difficulty: "Difficile",
      duration: "30 min",
      thumbnail: "/placeholder.svg?height=100&width=180",
    },
  ]

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <Sidebar activePage="dashboard" />

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 md:p-8">
        <motion.div className="space-y-8" initial="hidden" animate="visible" variants={containerVariants}>
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Bonjour, Jean 👋</h1>
              <p className="text-muted-foreground">Voici votre résumé d'apprentissage</p>
            </div>
            <Button asChild>
              <Link href="/games/quick-play">
                Quick Play
                <Gamepad2 className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats cards */}
          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Niveau actuel</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Niveau 8</div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Progression</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {1200 - Math.floor(progress * 12)} XP jusqu'au niveau 9
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Jeux complétés</CardTitle>
                <Gamepad2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="mt-2 text-xs text-muted-foreground">+3 cette semaine</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Badges gagnés</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="mt-2 text-xs text-muted-foreground">+1 aujourd'hui</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="recent" className="space-y-4">
              <TabsList>
                <TabsTrigger value="recent">Activité récente</TabsTrigger>
                <TabsTrigger value="recommended">Recommandés</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {recentGames.map((game, index) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <Card className="overflow-hidden">
                          <CardHeader className="p-4">
                            <div className="flex items-start justify-between">
                              {game.icon}
                              <Badge variant={game.progress === 100 ? "default" : "outline"}>
                                {game.progress === 100 ? "Terminé" : `${game.progress}%`}
                              </Badge>
                            </div>
                            <CardTitle className="line-clamp-1 text-base">{game.title}</CardTitle>
                            <CardDescription>{game.type}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-primary" />
                                <span>{game.score}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{game.date}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button variant="ghost" size="sm" className="w-full" asChild>
                              <Link href={`/games/${game.id}`}>
                                {game.progress === 100 ? "Rejouer" : "Continuer"}
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="flex justify-center">
                  <Button variant="outline" asChild>
                    <Link href="/history">Voir tout l'historique</Link>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="recommended" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recommendedGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <Card>
                        <CardHeader className="p-0">
                          <div className="relative h-[100px] w-full overflow-hidden">
                            <img
                              src={game.thumbnail || "/placeholder.svg"}
                              alt={game.title}
                              className="h-full w-full object-cover"
                            />
                            <Badge className="absolute right-2 top-2">{game.type}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <CardTitle className="line-clamp-1 text-base">{game.title}</CardTitle>
                          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Trophy className="h-3 w-3" />
                              <span>{game.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{game.duration}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button size="sm" className="w-full" asChild>
                            <Link href={`/games/${game.id}`}>Jouer maintenant</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="badges" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  {badges.map((badge, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, rotateY: 90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    >
                      <Card className="overflow-hidden">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                            <div className="text-primary">{badge.icon}</div>
                          </div>
                          <CardTitle className="text-center text-base">{badge.name}</CardTitle>
                          <CardDescription className="text-center text-xs text-muted-foreground">
                            Obtenu {badge.date}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <Button variant="outline" asChild>
                    <Link href="/badges">Voir tous les badges</Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Learning path */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Votre parcours d'apprentissage</CardTitle>
                <CardDescription>Suivez votre progression et découvrez les prochaines étapes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground">
                      <Check className="h-5 w-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium">Introduction à la biologie cellulaire</h3>
                      <p className="text-xs text-muted-foreground">Complété le 15 mars</p>
                    </div>
                    <Badge>100%</Badge>
                  </div>

                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground">
                      <Check className="h-5 w-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium">Structure de l'ADN</h3>
                      <p className="text-xs text-muted-foreground">Complété le 22 mars</p>
                    </div>
                    <Badge>100%</Badge>
                  </div>

                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-primary/20 text-primary">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium">Réplication et transcription</h3>
                      <p className="text-xs text-muted-foreground">En cours - 65% complété</p>
                      <Progress value={65} className="mt-2 h-2" />
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/modules/3">Continuer</Link>
                    </Button>
                  </div>

                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-muted bg-muted/50 text-muted-foreground">
                      <span className="text-sm font-bold">4</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium">Synthèse des protéines</h3>
                      <p className="text-xs text-muted-foreground">Verrouillé - Complétez le module précédent</p>
                    </div>
                    <Button size="sm" variant="outline" disabled>
                      Verrouillé
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
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

