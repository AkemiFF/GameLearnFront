"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  Trophy,
  Upload,
  Users,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

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

  const students = [
    { id: 1, name: "Jean Dupont", level: 8, progress: 78, lastActive: "Aujourd'hui" },
    { id: 2, name: "Marie Martin", level: 6, progress: 45, lastActive: "Hier" },
    { id: 3, name: "Lucas Bernard", level: 9, progress: 92, lastActive: "Il y a 3 jours" },
    { id: 4, name: "Sophie Petit", level: 7, progress: 63, lastActive: "Aujourd'hui" },
    { id: 5, name: "Thomas Dubois", level: 5, progress: 37, lastActive: "Il y a 1 semaine" },
  ]

  const recentContent = [
    {
      id: 1,
      title: "Système Solaire - Cours Complet",
      type: "PDF",
      status: "Traité",
      games: 3,
      date: "Il y a 2 jours",
    },
    {
      id: 2,
      title: "Introduction à la Biologie Cellulaire",
      type: "Vidéo",
      status: "En traitement",
      games: 1,
      date: "Aujourd'hui",
    },
    {
      id: 3,
      title: "Histoire de France - Révolution",
      type: "PDF",
      status: "Traité",
      games: 2,
      date: "Il y a 1 semaine",
    },
  ]

  const popularGames = [
    { id: 1, title: "Quiz: Système Solaire", plays: 156, rating: 4.8 },
    { id: 2, title: "Escape Room: ADN", plays: 124, rating: 4.7 },
    { id: 3, title: "Association: Capitales", plays: 98, rating: 4.5 },
    { id: 4, title: "Simulateur: Circuits", plays: 87, rating: 4.6 },
  ]

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 md:flex">
        <div className="flex items-center gap-2 pb-6">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">EduPlay Studio</span>
        </div>
        <nav className="flex-1 space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-2" asChild>
            <Link href="/admin">
              <LayoutDashboard className="h-5 w-5" />
              Tableau de bord
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/admin/content">
              <FileText className="h-5 w-5" />
              Contenus
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/admin/games">
              <Gamepad2 className="h-5 w-5" />
              Jeux
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/admin/students">
              <Users className="h-5 w-5" />
              Apprenants
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/admin/analytics">
              <BarChart3 className="h-5 w-5" />
              Analytiques
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/admin/settings">
              <Settings className="h-5 w-5" />
              Paramètres
            </Link>
          </Button>
        </nav>
        <div className="border-t pt-6">
          <div className="flex items-center gap-4 pb-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>PD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Prof. Durand</p>
              <p className="text-xs text-muted-foreground">Administrateur</p>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 md:p-8">
        <motion.div className="space-y-8" initial="hidden" animate="visible" variants={containerVariants}>
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Tableau de bord administrateur</h1>
              <p className="text-muted-foreground">Gérez vos contenus, jeux et suivez la progression des apprenants</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/admin/content/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Importer du contenu
                </Link>
              </Button>
              <Button asChild>
                <Link href="/admin/games/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un jeu
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats cards */}
          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total des jeux</CardTitle>
                <Gamepad2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="mt-2 text-xs text-muted-foreground">+3 ce mois-ci</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Apprenants actifs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="mt-2 text-xs text-muted-foreground">+12 cette semaine</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Parties jouées</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,024</div>
                <p className="mt-2 text-xs text-muted-foreground">+156 cette semaine</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Contenus importés</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="mt-2 text-xs text-muted-foreground">+5 ce mois-ci</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="students">Apprenants</TabsTrigger>
                <TabsTrigger value="content">Contenus récents</TabsTrigger>
                <TabsTrigger value="analytics">Analytiques</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Recent activity */}
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle>Activité récente</CardTitle>
                      <CardDescription>Les dernières actions sur la plateforme</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Upload className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">Nouveau contenu importé</p>
                            <p className="text-xs text-muted-foreground">
                              "Introduction à la Biologie Cellulaire" a été importé
                            </p>
                            <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Gamepad2 className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">Nouveau jeu créé</p>
                            <p className="text-xs text-muted-foreground">
                              "Quiz: Système Solaire" a été créé et publié
                            </p>
                            <p className="text-xs text-muted-foreground">Hier</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">Nouveaux apprenants</p>
                            <p className="text-xs text-muted-foreground">
                              5 nouveaux apprenants ont rejoint la plateforme
                            </p>
                            <p className="text-xs text-muted-foreground">Il y a 3 jours</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full" asChild>
                        <Link href="/admin/activity">Voir toute l'activité</Link>
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Popular games */}
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle>Jeux populaires</CardTitle>
                      <CardDescription>Les jeux les plus joués ce mois-ci</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {popularGames.map((game, index) => (
                          <div key={game.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{game.title}</p>
                                <p className="text-xs text-muted-foreground">{game.plays} parties</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <span className="font-medium">{game.rating}</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-4 w-4 text-yellow-500"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full" asChild>
                        <Link href="/admin/games">Voir tous les jeux</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* Calendar */}
                <Card>
                  <CardHeader>
                    <CardTitle>Calendrier des activités</CardTitle>
                    <CardDescription>Planifiez vos prochaines sessions et suivez les échéances</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Avril 2025</h3>
                        <div className="flex gap-1">
                          <Button variant="outline" size="icon" className="h-7 w-7">
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="h-7 w-7">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium">
                        <div className="text-muted-foreground">Lun</div>
                        <div className="text-muted-foreground">Mar</div>
                        <div className="text-muted-foreground">Mer</div>
                        <div className="text-muted-foreground">Jeu</div>
                        <div className="text-muted-foreground">Ven</div>
                        <div className="text-muted-foreground">Sam</div>
                        <div className="text-muted-foreground">Dim</div>

                        <div className="text-muted-foreground">1</div>
                        <div className="text-muted-foreground">2</div>
                        <div className="rounded-full bg-primary/10 p-2 font-bold text-primary">3</div>
                        <div>4</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>

                        <div>8</div>
                        <div>9</div>
                        <div>10</div>
                        <div className="rounded-full bg-primary/10 p-2 font-bold text-primary">11</div>
                        <div>12</div>
                        <div>13</div>
                        <div>14</div>

                        <div>15</div>
                        <div className="rounded-full bg-primary/10 p-2 font-bold text-primary">16</div>
                        <div>17</div>
                        <div>18</div>
                        <div>19</div>
                        <div>20</div>
                        <div>21</div>

                        <div>22</div>
                        <div>23</div>
                        <div>24</div>
                        <div>25</div>
                        <div className="rounded-full bg-primary/10 p-2 font-bold text-primary">26</div>
                        <div>27</div>
                        <div>28</div>

                        <div>29</div>
                        <div>30</div>
                        <div className="text-muted-foreground">1</div>
                        <div className="text-muted-foreground">2</div>
                        <div className="text-muted-foreground">3</div>
                        <div className="text-muted-foreground">4</div>
                        <div className="text-muted-foreground">5</div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Événements à venir</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 rounded-lg border p-2">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-bold">
                              3<br />
                              Avr
                            </div>
                            <div>
                              <p className="text-sm font-medium">Lancement du nouveau module</p>
                              <p className="text-xs text-muted-foreground">10:00 - 11:30</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 rounded-lg border p-2">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-bold">
                              11
                              <br />
                              Avr
                            </div>
                            <div>
                              <p className="text-sm font-medium">Réunion pédagogique</p>
                              <p className="text-xs text-muted-foreground">14:00 - 15:30</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 rounded-lg border p-2">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-bold">
                              16
                              <br />
                              Avr
                            </div>
                            <div>
                              <p className="text-sm font-medium">Atelier création de jeux</p>
                              <p className="text-xs text-muted-foreground">09:30 - 12:00</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/admin/calendar">
                        <Calendar className="mr-2 h-4 w-4" />
                        Voir le calendrier complet
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="students" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Apprenants actifs</CardTitle>
                    <CardDescription>Suivez la progression et l'activité de vos apprenants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Niveau</TableHead>
                          <TableHead>Progression</TableHead>
                          <TableHead>Dernière activité</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">Niveau {student.level}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex w-full max-w-xs items-center gap-2">
                                <Progress value={student.progress} className="h-2" />
                                <span className="text-xs text-muted-foreground">{student.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{student.lastActive}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                                  <DropdownMenuItem>Voir les statistiques</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Envoyer un message</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/admin/students">Voir tous les apprenants</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Contenus récemment importés</CardTitle>
                    <CardDescription>
                      Gérez vos contenus pédagogiques et suivez leur transformation en jeux
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Titre</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Jeux générés</TableHead>
                          <TableHead>Date d'import</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentContent.map((content) => (
                          <TableRow key={content.id}>
                            <TableCell className="font-medium">{content.title}</TableCell>
                            <TableCell>{content.type}</TableCell>
                            <TableCell>
                              <Badge variant={content.status === "Traité" ? "default" : "outline"}>
                                {content.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{content.games}</TableCell>
                            <TableCell>{content.date}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Supprimer</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href="/admin/content">Voir tous les contenus</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/admin/content/upload">
                        <Upload className="mr-2 h-4 w-4" />
                        Importer du contenu
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Engagement des apprenants</CardTitle>
                      <CardDescription>Nombre de parties jouées au cours des 30 derniers jours</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="flex flex-col items-center gap-2 text-center">
                            <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                            <h3 className="text-lg font-medium">Graphique d'engagement</h3>
                            <p className="text-sm text-muted-foreground">
                              Visualisation des données d'engagement des apprenants
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Répartition par type de jeu</CardTitle>
                      <CardDescription>Popularité des différents types de jeux</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="flex flex-col items-center gap-2 text-center">
                            <PieChart className="h-16 w-16 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">
                              Visualisation de la répartition des types de jeux
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Temps moyen par jeu</CardTitle>
                      <CardDescription>Durée moyenne des sessions de jeu</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="flex flex-col items-center gap-2 text-center">
                            <Clock className="h-16 w-16 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">
                              Visualisation du temps moyen passé sur chaque type de jeu
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/analytics">Voir toutes les analytiques</Link>
                </Button>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

function ChevronLeft(props) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRight(props) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function MoreHorizontal(props) {
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}

function PieChart(props) {
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
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}

