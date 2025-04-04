"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Clock, Filter, Gamepad2, Search, Trophy } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sidebar } from "@/components/sidebar"

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState("")

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

  const gameTypes = [
    { id: "quiz", name: "Quiz", icon: <FileText className="h-4 w-4" /> },
    { id: "escape", name: "Escape Room", icon: <Gamepad2 className="h-4 w-4" /> },
    { id: "association", name: "Association", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "simulator", name: "Simulateur", icon: <Trophy className="h-4 w-4" /> },
  ]

  const games = [
    {
      id: 1,
      title: "Quiz Avancé: Système Solaire",
      type: "Quiz",
      category: "Sciences",
      difficulty: "Intermédiaire",
      duration: "15 min",
      thumbnail: "/placeholder.svg?height=150&width=250",
      popular: true,
    },
    {
      id: 2,
      title: "Escape Room: Mystères de l'ADN",
      type: "Escape Room",
      category: "Biologie",
      difficulty: "Difficile",
      duration: "30 min",
      thumbnail: "/placeholder.svg?height=150&width=250",
      new: true,
    },
    {
      id: 3,
      title: "Association: Capitales du Monde",
      type: "Association",
      category: "Géographie",
      difficulty: "Facile",
      duration: "10 min",
      thumbnail: "/placeholder.svg?height=150&width=250",
    },
    {
      id: 4,
      title: "Simulateur de Circuit Électrique",
      type: "Simulateur",
      category: "Physique",
      difficulty: "Intermédiaire",
      duration: "20 min",
      thumbnail: "/placeholder.svg?height=150&width=250",
      popular: true,
    },
    {
      id: 5,
      title: "Quiz: Histoire de France",
      type: "Quiz",
      category: "Histoire",
      difficulty: "Facile",
      duration: "12 min",
      thumbnail: "/placeholder.svg?height=150&width=250",
    },
    {
      id: 6,
      title: "Escape Room: Énigmes Mathématiques",
      type: "Escape Room",
      category: "Mathématiques",
      difficulty: "Difficile",
      duration: "25 min",
      thumbnail: "/placeholder.svg?height=150&width=250",
      new: true,
    },
  ]

  const filteredGames = games.filter(
    (game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <Sidebar activePage="games" />

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 md:p-8">
        <motion.div className="space-y-8" initial="hidden" animate="visible" variants={containerVariants}>
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Bibliothèque de Jeux</h1>
              <p className="text-muted-foreground">Découvrez et jouez à des jeux éducatifs interactifs</p>
            </div>
            <Button asChild>
              <Link href="/games/quick-play">
                Quick Play
                <Gamepad2 className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Search and filters */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher des jeux..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="sciences">Sciences</SelectItem>
                  <SelectItem value="maths">Mathématiques</SelectItem>
                  <SelectItem value="histoire">Histoire</SelectItem>
                  <SelectItem value="geo">Géographie</SelectItem>
                  <SelectItem value="langues">Langues</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Difficulté" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les difficultés</SelectItem>
                  <SelectItem value="easy">Facile</SelectItem>
                  <SelectItem value="medium">Intermédiaire</SelectItem>
                  <SelectItem value="hard">Difficile</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Game types */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-full">
              Tous les types
            </Button>
            {gameTypes.map((type) => (
              <Button key={type.id} variant="outline" className="rounded-full gap-2">
                {type.icon}
                {type.name}
              </Button>
            ))}
          </motion.div>

          {/* Games grid */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">Tous les jeux</TabsTrigger>
                <TabsTrigger value="popular">Populaires</TabsTrigger>
                <TabsTrigger value="new">Nouveautés</TabsTrigger>
                <TabsTrigger value="recommended">Recommandés</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <Card className="overflow-hidden">
                        <div className="relative">
                          <img
                            src={game.thumbnail || "/placeholder.svg"}
                            alt={game.title}
                            className="h-[150px] w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-4">
                            <Badge className="mb-2">{game.type}</Badge>
                            <h3 className="text-lg font-bold text-white">{game.title}</h3>
                          </div>
                          {game.new && (
                            <Badge className="absolute right-2 top-2 bg-green-500 hover:bg-green-600">Nouveau</Badge>
                          )}
                          {game.popular && (
                            <Badge className="absolute right-2 top-2 bg-orange-500 hover:bg-orange-600">
                              Populaire
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span>{game.category}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4 text-muted-foreground" />
                              <span>{game.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{game.duration}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button className="w-full" asChild>
                            <Link href={`/games/${game.id}`}>Jouer maintenant</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="popular" className="space-y-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredGames
                    .filter((game) => game.popular)
                    .map((game, index) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <Card className="overflow-hidden">
                          <div className="relative">
                            <img
                              src={game.thumbnail || "/placeholder.svg"}
                              alt={game.title}
                              className="h-[150px] w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-4">
                              <Badge className="mb-2">{game.type}</Badge>
                              <h3 className="text-lg font-bold text-white">{game.title}</h3>
                            </div>
                            <Badge className="absolute right-2 top-2 bg-orange-500 hover:bg-orange-600">
                              Populaire
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span>{game.category}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Trophy className="h-4 w-4 text-muted-foreground" />
                                <span>{game.difficulty}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{game.duration}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button className="w-full" asChild>
                              <Link href={`/games/${game.id}`}>Jouer maintenant</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="new" className="space-y-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredGames
                    .filter((game) => game.new)
                    .map((game, index) => (
                      <motion.div
                        key={game.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <Card className="overflow-hidden">
                          <div className="relative">
                            <img
                              src={game.thumbnail || "/placeholder.svg"}
                              alt={game.title}
                              className="h-[150px] w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-4">
                              <Badge className="mb-2">{game.type}</Badge>
                              <h3 className="text-lg font-bold text-white">{game.title}</h3>
                            </div>
                            <Badge className="absolute right-2 top-2 bg-green-500 hover:bg-green-600">Nouveau</Badge>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span>{game.category}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Trophy className="h-4 w-4 text-muted-foreground" />
                                <span>{game.difficulty}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{game.duration}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <Button className="w-full" asChild>
                              <Link href={`/games/${game.id}`}>Jouer maintenant</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="recommended" className="space-y-4">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredGames.slice(0, 3).map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <Card className="overflow-hidden">
                        <div className="relative">
                          <img
                            src={game.thumbnail || "/placeholder.svg"}
                            alt={game.title}
                            className="h-[150px] w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-4">
                            <Badge className="mb-2">{game.type}</Badge>
                            <h3 className="text-lg font-bold text-white">{game.title}</h3>
                          </div>
                          <Badge className="absolute right-2 top-2 bg-purple-500 hover:bg-purple-600">Recommandé</Badge>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span>{game.category}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy className="h-4 w-4 text-muted-foreground" />
                              <span>{game.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{game.duration}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button className="w-full" asChild>
                            <Link href={`/games/${game.id}`}>Jouer maintenant</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

function FileText(props) {
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
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}

function MessageSquare(props) {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

