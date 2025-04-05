"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, BookOpen, Calendar, FileText, Gamepad2, LayoutDashboard, LogOut, Plus, Settings, Users, Beaker, Edit, Trash2, Eye } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

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
    is_featured?: boolean
}

export default function BioSimAdminPage() {
    const router = useRouter()
    const [experiments, setExperiments] = useState<Experiment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [experimentToDelete, setExperimentToDelete] = useState<string | null>(null)

    // Fetch experiments from API
    useEffect(() => {
        const fetchExperiments = async () => {
            try {
                setLoading(true)
                const response = await fetch(`http://localhost:8000/api/biosim/experiments/`)
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`)
                }
                const data = await response.json()
                setExperiments(data)
            } catch (error) {
                console.error("Error fetching experiments:", error)
                setError("Impossible de charger les expériences. Veuillez réessayer plus tard.")
            } finally {
                setLoading(false)
            }
        }

        fetchExperiments()
    }, [])

    // Filter experiments based on search query
    const filteredExperiments = experiments.filter(
        (experiment) =>
            experiment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            experiment.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Handle delete experiment
    const handleDeleteExperiment = async () => {
        if (!experimentToDelete) return

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/biosim/experiments/${experimentToDelete}/`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            // Remove experiment from state
            setExperiments(experiments.filter((exp) => exp.id !== experimentToDelete))
            setShowDeleteDialog(false)
            setExperimentToDelete(null)
        } catch (error) {
            console.error("Error deleting experiment:", error)
            setError("Impossible de supprimer l'expérience. Veuillez réessayer plus tard.")
        }
    }

    // Format difficulty for display
    const formatDifficulty = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case "beginner":
                return "Débutant"
            case "intermediate":
                return "Intermédiaire"
            case "advanced":
                return "Avancé"
            default:
                return difficulty
        }
    }

    // Get badge color based on difficulty
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case "beginner":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            case "intermediate":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            case "advanced":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            default:
                return ""
        }
    }

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
        <div className="flex min-h-screen bg-muted/30">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-background p-6 md:flex">
                <div className="flex items-center gap-2 pb-6">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">EduPlay Studio</span>
                </div>
                <nav className="flex-1 space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-2" asChild>
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
                    <Button variant="secondary" className="w-full justify-start gap-2" asChild>
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
                        <Link href="/admin/calendar">
                            <Calendar className="h-5 w-5" />
                            Calendrier
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
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Gestion des expériences BioSim</h1>
                                <p className="text-muted-foreground">
                                    Créez et gérez les expériences du laboratoire virtuel BioSim
                                </p>
                            </div>
                        </div>
                        <Button asChild>
                            <Link href="/admin/games/biosim/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Créer une expérience
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Search and filters */}
                    <motion.div variants={itemVariants} className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Input
                                type="search"
                                placeholder="Rechercher des expériences..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Experiments list */}
                    <motion.div variants={itemVariants}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Expériences BioSim</CardTitle>
                                <CardDescription>
                                    Liste de toutes les expériences disponibles dans le laboratoire virtuel
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                    </div>
                                ) : error ? (
                                    <div className="rounded-lg bg-red-100 p-4 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                        {error}
                                    </div>
                                ) : filteredExperiments.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <Beaker className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-medium mb-2">Aucune expérience trouvée</h3>
                                        <p className="text-muted-foreground max-w-xs">
                                            {searchQuery
                                                ? "Aucune expérience ne correspond à votre recherche."
                                                : "Commencez par créer une nouvelle expérience."}
                                        </p>
                                        <Button className="mt-4" asChild>
                                            <Link href="/admin/games/biosim/create">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Créer une expérience
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Titre</TableHead>
                                                    <TableHead>Difficulté</TableHead>
                                                    <TableHead>Durée</TableHead>
                                                    <TableHead>Mis en avant</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredExperiments.map((experiment) => (
                                                    <TableRow key={experiment.id}>
                                                        <TableCell className="font-medium">{experiment.title}</TableCell>
                                                        <TableCell>
                                                            <Badge className={getDifficultyColor(experiment.difficulty)}>
                                                                {formatDifficulty(experiment.difficulty)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>{experiment.duration} min</TableCell>
                                                        <TableCell>
                                                            {experiment.is_featured ? (
                                                                <Badge variant="default">Oui</Badge>
                                                            ) : (
                                                                <Badge variant="outline">Non</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="h-4 w-4"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                                            />
                                                                        </svg>
                                                                        <span className="sr-only">Menu</span>
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={`/admin/games/biosim/edit/${experiment.id}`}>
                                                                            <Edit className="mr-2 h-4 w-4" />
                                                                            Modifier
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={`/games/biosim?experiment=${experiment.id}`} target="_blank">
                                                                            <Eye className="mr-2 h-4 w-4" />
                                                                            Prévisualiser
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        className="text-red-600 dark:text-red-400"
                                                                        onClick={() => {
                                                                            setExperimentToDelete(experiment.id)
                                                                            setShowDeleteDialog(true)
                                                                        }}
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Supprimer
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </main>

            {/* Delete confirmation dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette expérience ? Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Annuler
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteExperiment}>
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
