"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BrainCircuit,
  Calendar,
  Compass,
  FileText,
  Fingerprint,
  Gamepad2,
  Key,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Plus,
  Puzzle,
  Settings,
  Shield,
  Terminal,
  Trash2,
  Upload,
  Users,
  X,
  Zap,
  Maximize,
  Minimize,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useFullscreen } from "@/hooks/use-fullscreen"

// Import components
import { GameMap } from "@/components/escape-room/game-map"

export default function CreateEscapeRoomPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const editorContainerRef = useRef(null)
  const { isFullscreen, toggleFullscreen } = useFullscreen(editorContainerRef)
  
  const [puzzles, setPuzzles] = useState([
    {
      id: 1,
      title: "Accès au Laboratoire",
      description: "Déchiffrez le code d'accès au laboratoire principal en utilisant la séquence d'ADN.",
      hint: "Les bases azotées de l'ADN peuvent être représentées par les lettres A, T, G et C. Essayez de convertir ces lettres en chiffres selon leur position dans l'alphabet.",
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
  ])
  
  const [items, setItems] = useState([
    {
      id: "carte_accès",
      name: "Carte d'accès",
      description: "Permet d'accéder aux zones sécurisées du laboratoire.",
      icon: "Key",
    },
    { id: "loupe", name: "Loupe", description: "Permet d'examiner les détails des indices.", icon: "Search" },
  ])
  
  const [rooms, setRooms] = useState([
    { id: 0, name: "Entrée", x: 20, y: 20, connections: [1] },
    { id: 1, name: "Laboratoire Principal", x: 50, y: 20, connections: [0, 2] },
    { id: 2, name: "Salle des Microscopes", x: 80, y: 20, connections: [1] },
  ])
  
  const [selectedPuzzle, setSelectedPuzzle] = useState(0)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewMode, setPreviewMode] = useState("light")
  const [difficulty, setDifficulty] = useState(3)
  const [timeLimit, setTimeLimit] = useState(60)
  const [isPublished, setIsPublished] = useState(false)
  const [showMapPreview, setShowMapPreview] = useState(false)

  const fileInputRef = useRef(null)

  const handleAddPuzzle = () => {
    const newId = puzzles.length > 0 ? Math.max(...puzzles.map((p) => p.id)) + 1 : 1
    const newPuzzle = {
      id: newId,
      title: `Nouvelle énigme ${newId}`,
      description: "Description de l'énigme",
      hint: "Indice pour résoudre l'énigme",
      solution: "",
      type: "code",
      image: "/placeholder.svg?height=300&width=500",
    }
    setPuzzles([...puzzles, newPuzzle])
    setSelectedPuzzle(puzzles.length)
  }

  const handleDeletePuzzle = (index) => {
    const newPuzzles = [...puzzles]
    newPuzzles.splice(index, 1)
    setPuzzles(newPuzzles)
    if (selectedPuzzle >= index) {
      setSelectedPuzzle(Math.max(0, selectedPuzzle - 1))
    }
  }

  const handlePuzzleChange = (field, value) => {
    const newPuzzles = [...puzzles]
    newPuzzles[selectedPuzzle] = {
      ...newPuzzles[selectedPuzzle],
      [field]: value,
    }
    setPuzzles(newPuzzles)
  }

  const handleAddItem = () => {
    const newId = `item_${items.length + 1}`
    const newItem = {
      id: newId,
      name: `Nouvel objet ${items.length + 1}`,
      description: "Description de l'objet",
      icon: "Key",
    }
    setItems([...items, newItem])
    setSelectedItem(items.length)
  }

  const handleDeleteItem = (index) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
    if (selectedItem >= index) {
      setSelectedItem(Math.max(0, selectedItem - 1))
    }
  }

  const handleItemChange = (field, value) => {
    if (selectedItem === null) return
    const newItems = [...items]
    newItems[selectedItem] = {
      ...newItems[selectedItem],
      [field]: value,
    }
    setItems(newItems)
  }

  const handleAddRoom = () => {
    const newId = rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 0
    const newRoom = {
      id: newId,
      name: `Nouvelle salle ${newId}`,
      x: 50,
      y: 50,
      connections: [],
    }
    setRooms([...rooms, newRoom])
    setSelectedRoom(rooms.length)
  }

  const handleDeleteRoom = (index) => {
    const newRooms = [...rooms]
    newRooms.splice(index, 1)
    setRooms(newRooms)
    if (selectedRoom >= index) {
      setSelectedRoom(Math.max(0, selectedRoom - 1))
    }
  }

  const handleRoomChange = (field, value) => {
    if (selectedRoom === null) return
    const newRooms = [...rooms]
    newRooms[selectedRoom] = {
      ...newRooms[selectedRoom],
      [field]: value,
    }
    setRooms(newRooms)
  }

  const handleToggleConnection = (roomId) => {
    if (selectedRoom === null) return
    const newRooms = [...rooms]
    const currentRoom = newRooms[selectedRoom]

    if (currentRoom.connections.includes(roomId)) {
      // Remove connection
      currentRoom.connections = currentRoom.connections.filter((id) => id !== roomId)
    } else {
      // Add connection
      currentRoom.connections.push(roomId)
    }

    setRooms(newRooms)
  }

  const handleSave = (publish = false) => {
    // Save logic would go here
    if (publish) {
      setIsPublished(true)
    }
    // Show success notification
    setTimeout(() => {
      router.push("/admin/games")
    }, 1000)
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

  const getIconComponent = (iconName) => {
    const icons = {
      Key: <Key className="h-5 w-5" />,
      Search: <Search className="h-5 w-5" />,
      Shield: <Shield className="h-5 w-5" />,
      Terminal: <Terminal className="h-5 w-5" />,
      Zap: <Zap className="h-5 w-5" />,
      Lightbulb: <Lightbulb className="h-5 w-5" />,
      Compass: <Compass className="h-5 w-5" />,
      Fingerprint: <Fingerprint className="h-5 w-5" />,
    }
    return icons[iconName] || <Key className="h-5 w-5" />
  }

  return (
    <div 
      ref={editorContainerRef}
      className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black text-white"
    >
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-white/10 bg-black/20 p-6 md:flex">
        <div className="flex items-center gap-2 pb-6">
          <BrainCircuit className="h-6 w-6 text-purple-400" />
          <span className="text-xl font-bold">EduPlay Studio</span>
        </div>
        <nav className="flex-1 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2 text-white hover:bg-white/10" asChild>
            <Link href="/admin">
              <LayoutDashboard className="h-5 w-5" />
              Tableau de bord
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-white hover:bg-white/10" asChild>
            <Link href="/admin/content">
              <FileText className="h-5 w-5" />
              Contenus
            </Link>
          </Button>
          <Button variant="secondary" className="w-full justify-start gap-2 bg-purple-900 hover:bg-purple-800" asChild>
            <Link href="/admin/games">
              <Gamepad2 className="h-5 w-5" />
              Jeux
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-white hover:bg-white/10" asChild>
            <Link href="/admin/students">
              <Users className="h-5 w-5" />
              Apprenants
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-white hover:bg-white/10" asChild>
            <Link href="/admin/calendar">
              <Calendar className="h-5 w-5" />
              Calendrier
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-white hover:bg-white/10" asChild>
            <Link href="/admin/settings">
              <Settings className="h-5 w-5" />
              Paramètres
            </Link>
          </Button>
        </nav>
        <div className="border-t border-white/10 pt-6">
          <div className="flex items-center gap-4 pb-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>PD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Prof. Durand</p>
              <p className="text-xs text-white/70">Administrateur</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-white/10 text-white hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="flex h-full">
          {/* Editor panel */}
          <div className="flex-1 overflow-auto p-6">
            <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
              {/* Header */}
              <motion.div variants={itemVariants} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="text-white hover:bg-white/10"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Créer une Escape Room</h1>
                    <p className="text-white/70">Concevez une expérience immersive d'apprentissage</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/10"
                  >
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                  </Button>
                </div>
              </motion.div>

              {/* Tabs */}
              <motion.div variants={itemVariants}>
                <Tabs defaultValue="general" className="space-y-6" onValueChange={setActiveTab}>
                  <TabsList className="bg-black/20 border border-white/10">
                    <TabsTrigger value="general" className="data-[state=active]:bg-purple-900 text-white">
                      Général
                    </TabsTrigger>
                    <TabsTrigger value="puzzles" className="data-[state=active]:bg-purple-900 text-white">
                      Énigmes
                    </TabsTrigger>
                    <TabsTrigger value="items" className="data-[state=active]:bg-purple-900 text-white">
                      Objets
                    </TabsTrigger>
                    <TabsTrigger value="map" className="data-[state=active]:bg-purple-900 text-white">
                      Carte
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="data-[state=active]:bg-purple-900 text-white">
                      Paramètres
                    </TabsTrigger>
                  </TabsList>

                  {/* General tab */}
                  <TabsContent value="general" className="space-y-6">
                    <Card className="border-white/10 bg-black/20 text-white">
                      <CardHeader>
                        <CardTitle>Informations générales</CardTitle>
                        <CardDescription className="text-white/70">
                          Définissez les informations de base de votre Escape Room
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Titre</Label>
                          <Input
                            id="title"
                            placeholder="Ex: Mystères de l'ADN"
                            defaultValue="Escape Room: Mystères de l'ADN"
                            className="bg-black/30 border-white/10 text-white"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Décrivez votre Escape Room..."
                            defaultValue="Vous êtes enfermé dans un laboratoire de génétique et devez résoudre des énigmes basées sur l'ADN pour vous échapper avant que le temps ne s'écoule."
                            className="min-h-[100px] bg-black/30 border-white/10 text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category">Catégorie</Label>
                            <Select defaultValue="biology">
                              <SelectTrigger className="bg-black/30 border-white/10 text-white">
                                <SelectValue placeholder="Sélectionnez une catégorie" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-white/10 text-white">
                                <SelectItem value="biology">Biologie</SelectItem>
                                <SelectItem value="chemistry">Chimie</SelectItem>
                                <SelectItem value="physics">Physique</SelectItem>
                                <SelectItem value="math">Mathématiques</SelectItem>
                                <SelectItem value="history">Histoire</SelectItem>
                                <SelectItem value="literature">Littérature</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="theme">Thème visuel</Label>
                            <Select defaultValue="laboratory">
                              <SelectTrigger className="bg-black/30 border-white/10 text-white">
                                <SelectValue placeholder="Sélectionnez un thème" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-white/10 text-white">
                                <SelectItem value="laboratory">Laboratoire</SelectItem>
                                <SelectItem value="space">Espace</SelectItem>
                                <SelectItem value="ancient">Antiquité</SelectItem>
                                <SelectItem value="future">Futuriste</SelectItem>
                                <SelectItem value="nature">Nature</SelectItem>
                                <SelectItem value="custom">Personnalisé</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Image de couverture</Label>
                          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-white/20 p-6">
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                              <img
                                src="/placeholder.svg?height=300&width=600"
                                alt="Cover preview"
                                className="h-full w-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                              <div className="absolute bottom-0 left-0 p-4">
                                <h3 className="text-lg font-bold text-white">Escape Room: Mystères de l'ADN</h3>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="border-white/10 text-white hover:bg-white/10"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Changer l'image
                              </Button>
                              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-black/20 text-white">
                      <CardHeader>
                        <CardTitle>Objectifs pédagogiques</CardTitle>
                        <CardDescription className="text-white/70">
                          Définissez les compétences et connaissances que les apprenants développeront
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Objectifs principaux</Label>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Ex: Comprendre la structure de l'ADN"
                                defaultValue="Comprendre la structure de l'ADN"
                                className="bg-black/30 border-white/10 text-white"
                              />
                              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Ex: Maîtriser le processus de synthèse protéique"
                                defaultValue="Maîtriser le processus de synthèse protéique"
                                className="bg-black/30 border-white/10 text-white"
                              />
                              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Ex: Identifier les mutations génétiques"
                                defaultValue="Identifier les mutations génétiques"
                                className="bg-black/30 border-white/10 text-white"
                              />
                              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/10">
                              <Plus className="mr-2 h-4 w-4" />
                              Ajouter un objectif
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Niveau scolaire recommandé</Label>
                          <Select defaultValue="lycee">
                            <SelectTrigger className="bg-black/30 border-white/10 text-white">
                              <SelectValue placeholder="Sélectionnez un niveau" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-white/10 text-white">
                              <SelectItem value="primaire">École primaire</SelectItem>
                              <SelectItem value="college">Collège</SelectItem>
                              <SelectItem value="lycee">Lycée</SelectItem>
                              <SelectItem value="superieur">Enseignement supérieur</SelectItem>
                              <SelectItem value="formation">Formation professionnelle</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Puzzles tab */}
                  <TabsContent value="puzzles" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                      <Card className="border-white/10 bg-black/20 text-white h-fit">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>Énigmes</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-white hover:bg-white/10"
                              onClick={handleAddPuzzle}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </CardTitle>
                          <CardDescription className="text-white/70">Créez et organisez les énigmes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {puzzles.map((puzzle, index) => (
                            <div
                              key={puzzle.id}
                              className={cn(
                                "flex items-center justify-between rounded-md p-2 cursor-pointer",
                                selectedPuzzle === index
                                  ? "bg-purple-900/50 border border-purple-500/50"
                                  : "hover:bg-white/5",
                              )}
                              onClick={() => setSelectedPuzzle(index)}
                            >
                              <div className="flex items-center gap-2">
                                <Puzzle className="h-4 w-4 text-purple-400" />
                                <span className="font-medium">{puzzle.title}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-white hover:bg-white/10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeletePuzzle(index)
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}

                          {puzzles.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-6 text-center text-white/50">
                              <Puzzle className="h-10 w-10 mb-2 opacity-50" />
                              <p>Aucune énigme créée</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 border-white/10 text-white hover:bg-white/10"
                                onClick={handleAddPuzzle}
                              >
                                <Plus className="mr-2 h-3 w-3" />
                                Ajouter une énigme
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {puzzles.length > 0 && (
                        <Card className="border-white/10 bg-black/20 text-white">
                          <CardHeader>
                            <CardTitle>Éditer l'énigme</CardTitle>
                            <CardDescription className="text-white/70">
                              Configurez les détails de l'énigme sélectionnée
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="puzzle-title">Titre</Label>
                              <Input
                                id="puzzle-title"
                                value={puzzles[selectedPuzzle].title}
                                onChange={(e) => handlePuzzleChange("title", e.target.value)}
                                className="bg-black/30 border-white/10 text-white"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="puzzle-description">Description</Label>
                              <Textarea
                                id="puzzle-description"
                                value={puzzles[selectedPuzzle].description}
                                onChange={(e) => handlePuzzleChange("description", e.target.value)}
                                className="min-h-[100px] bg-black/30 border-white/10 text-white"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="puzzle-type">Type d'énigme</Label>
                                <Select
                                  value={puzzles[selectedPuzzle].type}
                                  onValueChange={(value) => handlePuzzleChange("type", value)}
                                >
                                  <SelectTrigger className="bg-black/30 border-white/10 text-white">
                                    <SelectValue placeholder="Sélectionnez un type" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-900 border-white/10 text-white">
                                    <SelectItem value="code">Code à déchiffrer</SelectItem>
                                    <SelectItem value="sequence">Séquence à compléter</SelectItem>
                                    <SelectItem value="order">Ordre à rétablir</SelectItem>
                                    <SelectItem value="terminal">Terminal informatique</SelectItem>
                                    <SelectItem value="switches">Interrupteurs</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="puzzle-solution">Solution</Label>
                                <Input
                                  id="puzzle-solution"
                                  value={puzzles[selectedPuzzle].solution}
                                  onChange={(e) => handlePuzzleChange("solution", e.target.value)}
                                  className="bg-black/30 border-white/10 text-white"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="puzzle-hint">Indice</Label>
                              <Textarea
                                id="puzzle-hint"
                                value={puzzles[selectedPuzzle].hint}
                                onChange={(e) => handlePuzzleChange("hint", e.target.value)}
                                className="min-h-[80px] bg-black/30 border-white/10 text-white"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Image de l'énigme</Label>
                              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-white/20 p-4">
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                  <img
                                    src={puzzles[selectedPuzzle].image || "/placeholder.svg"}
                                    alt="Puzzle preview"
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-white/10 text-white hover:bg-white/10"
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Changer l'image
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Objet requis</Label>
                              <Select
                                value={puzzles[selectedPuzzle].requiresItem || ""}
                                onValueChange={(value) => handlePuzzleChange("requiresItem", value)}
                              >
                                <SelectTrigger className="bg-black/30 border-white/10 text-white">
                                  <SelectValue placeholder="Aucun objet requis" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-white/10 text-white">
                                  <SelectItem value="">Aucun objet requis</SelectItem>
                                  {items.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                      {item.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-white/50">
                                Si défini, l'apprenant devra avoir cet objet dans son inventaire pour accéder à cette
                                énigme.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  {/* Items tab */}
                  <TabsContent value="items" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                      <Card className="border-white/10 bg-black/20 text-white h-fit">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>Objets</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-white hover:bg-white/10"
                              onClick={handleAddItem}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </CardTitle>
                          <CardDescription className="text-white/70">Créez des objets à collecter</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {items.map((item, index) => (
                            <div
                              key={item.id}
                              className={cn(
                                "flex items-center justify-between rounded-md p-2 cursor-pointer",
                                selectedItem === index
                                  ? "bg-purple-900/50 border border-purple-500/50"
                                  : "hover:bg-white/5",
                              )}
                              onClick={() => setSelectedItem(index)}
                            >
                              <div className="flex items-center gap-2">
                                {getIconComponent(item.icon)}
                                <span className="font-medium">{item.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-white hover:bg-white/10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteItem(index)
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}

                          {items.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-6 text-center text-white/50">
                              <Key className="h-10 w-10 mb-2 opacity-50" />
                              <p>Aucun objet créé</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 border-white/10 text-white hover:bg-white/10"
                                onClick={handleAddItem}
                              >
                                <Plus className="mr-2 h-3 w-3" />
                                Ajouter un objet
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {items.length > 0 && selectedItem !== null && (
                        <Card className="border-white/10 bg-black/20 text-white">
                          <CardHeader>
                            <CardTitle>Éditer l'objet</CardTitle>
                            <CardDescription className="text-white/70">
                              Configurez les détails de l'objet sélectionné
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="item-name">Nom</Label>
                              <Input
                                id="item-name"
                                value={items[selectedItem].name}
                                onChange={(e) => handleItemChange("name", e.target.value)}
                                className="bg-black/30 border-white/10 text-white"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="item-description">Description</Label>
                              <Textarea
                                id="item-description"
                                value={items[selectedItem].description}
                                onChange={(e) => handleItemChange("description", e.target.value)}
                                className="min-h-[80px] bg-black/30 border-white/10 text-white"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="item-icon">Icône</Label>
                              <Select
                                value={items[selectedItem].icon}
                                onValueChange={(value) => handleItemChange("icon", value)}
                              >
                                <SelectTrigger className="bg-black/30 border-white/10 text-white">
                                  <SelectValue placeholder="Sélectionnez une icône" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-white/10 text-white">
                                  <SelectItem value="Key">Clé</SelectItem>
                                  <SelectItem value="Search">Loupe</SelectItem>
                                  <SelectItem value="Shield">Badge</SelectItem>
                                  <SelectItem value="Terminal">Tablette</SelectItem>
                                  <SelectItem value="Zap">Énergie</SelectItem>
                                  <SelectItem value="Lightbulb">Ampoule</SelectItem>
                                  <SelectItem value="Compass">Boussole</SelectItem>
                                  <SelectItem value="Fingerprint">Empreinte</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="rounded-lg bg-black/30 border border-white/10 p-4">
                              <h3 className="font-medium mb-2">Aperçu de l'objet</h3>
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400">
                                  {getIconComponent(items[selectedItem].icon)}
                                </div>
                                <div>
                                  <h4 className="font-medium">{items[selectedItem].name}</h4>
                                  <p className="text-sm text-white/70">{items[selectedItem].description}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  {/* Map tab */}
                  <TabsContent value="map" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                      <Card className="border-white/10 bg-black/20 text-white h-fit">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>Salles</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-white hover:bg-white/10"
                              onClick={handleAddRoom}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </CardTitle>
                          <CardDescription className="text-white/70">Créez et connectez les salles</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {rooms.map((room, index) => (
                            <div
                              key={room.id}
                              className={cn(
                                "flex items-center justify-between rounded-md p-2 cursor-pointer",
                                selectedRoom === index
                                  ? "bg-purple-900/50 border border-purple-500/50"
                                  : "hover:bg-white/5",
                              )}
                              onClick={() => setSelectedRoom(index)}
                            >
                              <div className="flex items-center gap-2">
                                <Compass className="h-4 w-4 text-purple-400" />
                                <span className="font-medium">{room.name}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-white hover:bg-white/10"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteRoom(index)
                                }}
                                disabled={index === 0} // Can't delete the first room (entrance)
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}

                          {rooms.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-6 text-center text-white/50">
                              <Compass className="h-10 w-10 mb-2 opacity-50" />
                              <p>Aucune salle créée</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 border-white/10 text-white hover:bg-white/10"
                                onClick={handleAddRoom}
                              >
                                <Plus className="mr-2 h-3 w-3" />
                                Ajouter une salle
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="space-y-6">
                        {rooms.length > 0 && selectedRoom !== null && (
                          <Card className="border-white/10 bg-black/20 text-white">
                            <CardHeader>
                              <CardTitle>Éditer la salle</CardTitle>
                              <CardDescription className="text-white/70">
                                Configurez les détails de la salle sélectionnée
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="room-name">Nom</Label>
                                <Input
                                  id="room-name"
                                  value={rooms[selectedRoom].name}
                                  onChange={(e) => handleRoomChange("name", e.target.value)}
                                  className="bg-black/30 border-white/10 text-white"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="room-x">Position X (%)</Label>
                                  <Input
                                    id="room-x"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={rooms[selectedRoom].x}
                                    onChange={(e) => handleRoomChange("x", Number.parseInt(e.target.value))}
                                    className="bg-black/30 border-white/10 text-white"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="room-y">Position Y (%)</Label>
                                  <Input
                                    id="room-y"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={rooms[selectedRoom].y}
                                    onChange={(e) => handleRoomChange("y", Number.parseInt(e.target.value))}
                                    className="bg-black/30 border-white/10 text-white"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Connexions</Label>
                                <div className="space-y-2 rounded-lg border border-white/10 p-4">
                                  <p className="text-sm text-white/70 mb-2">
                                    Sélectionnez les salles connectées à {rooms[selectedRoom].name}:
                                  </p>
                                  {rooms.map((room, index) => {
                                    if (index === selectedRoom) return null
                                    return (
                                      <div key={room.id} className="flex items-center space-x-2">
                                        <Switch
                                          checked={rooms[selectedRoom].connections.includes(room.id)}
                                          onCheckedChange={() => handleToggleConnection(room.id)}
                                        />
                                        <Label>{room.name}</Label>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Énigme associée</Label>
                                <Select
                                  value={selectedRoom !== null ? selectedRoom.toString() : ""}
                                  defaultValue={selectedRoom !== null ? selectedRoom.toString() : "0"}
                                >
                                  <SelectTrigger className="bg-black/30 border-white/10 text-white">
                                    <SelectValue placeholder="Sélectionnez une énigme" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-900 border-white/10 text-white">
                                    <SelectItem value="">Aucune énigme</SelectItem>
                                    {puzzles.map((puzzle, index) => (
                                      <SelectItem key={puzzle.id} value={index.toString()}>
                                        {puzzle.title}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <p className="text-xs text-white/70 mt-1">
                                  L'énigme sera accessible lorsque l'apprenant entrera dans cette salle.
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        <Card className="border-white/10 bg-black/20 text-white">
                          <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                              <CardTitle>Aperçu de la carte</CardTitle>
                              <CardDescription className="text-white/70">
                                Visualisez la disposition des salles et leurs connexions
                              </CardDescription>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/10 text-white hover:bg-white/10"
                              onClick={() => setShowMapPreview(!showMapPreview)}
                            >
                              {showMapPreview ? "Éditer" : "Aperçu"}
                            </Button>
                          </CardHeader>
                          <CardContent>
                            {showMapPreview ? (
                              <GameMap 
                                rooms={rooms}
                                unlockedPuzzles={rooms.map(room => room.id)}
                                currentPuzzle={selectedRoom !== null ? rooms[selectedRoom].id : 0}
                              />
                            ) : (
                              <div className="relative h-[400px] border border-white/10 rounded-lg bg-indigo-950/50 overflow-hidden">
                                {/* Map connections */}
                                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                  {rooms.flatMap((room) =>
                                    room.connections.map((connId) => {
                                      const connRoom = rooms.find((r) => r.id === connId)
                                      return connRoom ? (
                                        <line
                                          key={`${room.id}-${connId}`}
                                          x1={`${room.x}%`}
                                          y1={`${room.y}%`}
                                          x2={`${connRoom.x}%`}
                                          y2={`${connRoom.y}%`}
                                          stroke="#a855f7"
                                          strokeWidth="2"
                                        />
                                      ) : null
                                    }),
                                  )}
                                </svg>

                                {/* Map rooms */}
                                {rooms.map((room, index) => (
                                  <motion.div
                                    key={room.id}
                                    className={cn(
                                      "absolute w-16 h-16 rounded-full flex items-center justify-center -ml-8 -mt-8 text-xs font-medium cursor-pointer",
                                      selectedRoom === index
                                        ? "bg-purple-900 border-2 border-purple-500 text-white"
                                        : "bg-purple-900/50 border border-purple-500/50 text-white",
                                    )}
                                    style={{ left: `${room.x}%`, top: `${room.y}%` }}
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => setSelectedRoom(index)}
                                  >
                                    {room.name}
                                  </motion.div>
                                ))}

                                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-xs">
                                  <p className="text-white/70">Cliquez sur une salle pour la sélectionner</p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Settings tab */}
                  <TabsContent value="settings" className="space-y-6">
                    <Card className="border-white/10 bg-black/20 text-white">
                      <CardHeader>
                        <CardTitle>Paramètres du jeu</CardTitle>
                        <CardDescription className="text-white/70">
                          Configurez les paramètres généraux de l'Escape Room
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label>Difficulté</Label>
                          <div className="space-y-4">
                            <Slider
                              value={[difficulty]}
                              min={1}
                              max={5}
                              step={1}
                              onValueChange={(value) => setDifficulty(value[0])}
                              className="[&>span:first-child]:bg-white/20 [&>span:first-child_span]:bg-purple-500"
                            />
                            <div className="flex justify-between text-xs text-white/70">
                              <span>Facile</span>
                              <span>Intermédiaire</span>
                              <span>Difficile</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Limite de temps (minutes)</Label>
                          <div className="flex items-center gap-4">
                            <Slider
                              value={[timeLimit]}
                              min={15}
                              max={120}
                              step={5}
                              onValueChange={(value) => setTimeLimit(value[0])}
                              className="flex-1 [&>span:first-child]:bg-white/20 [&>span:first-child_span]:bg-purple-500"
                            />
                            <div className="w-16 text-center font-mono font-bold">{timeLimit}</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Options avancées</h3>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="option-hints">Nombre d'indices disponibles</Label>
                              <Select defaultValue="unlimited">
                                <SelectTrigger className="w-[180px] bg-black/30 border-white/10 text-white">
                                  <SelectValue placeholder="Sélectionnez" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-900 border-white/10 text-white">
                                  <SelectItem value="0">Aucun</SelectItem>
                                  <SelectItem value="3">3 indices</SelectItem>
                                  <SelectItem value="5">5 indices</SelectItem>
                                  <SelectItem value="unlimited">Illimité</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <p className="text-xs text-white/70">
                              Définit combien d'indices les apprenants peuvent utiliser pendant le jeu.
                            </p>
                          </div>

                          <div className="space-y-2">
                            \

\

