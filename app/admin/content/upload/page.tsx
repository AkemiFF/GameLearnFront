"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  FileText,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Settings,
  Upload,
  Users,
  X,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ContentUploadPage() {
  const router = useRouter()
  const [uploadStep, setUploadStep] = useState(1)
  const [uploadType, setUploadType] = useState("file")
  const [fileUploaded, setFileUploaded] = useState(false)
  const [fileName, setFileName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
      setFileUploaded(true)
    }
  }

  const handleNextStep = () => {
    if (uploadStep < 3) {
      setUploadStep(uploadStep + 1)

      if (uploadStep === 2) {
        setIsProcessing(true)
        // Simulate processing
        setTimeout(() => {
          setIsProcessing(false)
          setIsComplete(true)
        }, 3000)
      }
    }
  }

  const handlePrevStep = () => {
    if (uploadStep > 1) {
      setUploadStep(uploadStep - 1)
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
          <Button variant="secondary" className="w-full justify-start gap-2" asChild>
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
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Importer du contenu</h1>
              <p className="text-muted-foreground">Ajoutez du contenu pédagogique pour générer des jeux interactifs</p>
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div variants={itemVariants} className="mx-auto max-w-3xl">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      uploadStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {uploadStep > 1 ? <Check className="h-4 w-4" /> : "1"}
                  </div>
                  <span className={uploadStep >= 1 ? "font-medium" : "text-muted-foreground"}>
                    Sélection du contenu
                  </span>
                </div>
                <div className="h-0.5 w-10 bg-muted md:w-20"></div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      uploadStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {uploadStep > 2 ? <Check className="h-4 w-4" /> : "2"}
                  </div>
                  <span className={uploadStep >= 2 ? "font-medium" : "text-muted-foreground"}>Configuration</span>
                </div>
                <div className="h-0.5 w-10 bg-muted md:w-20"></div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      uploadStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {uploadStep > 3 ? <Check className="h-4 w-4" /> : "3"}
                  </div>
                  <span className={uploadStep >= 3 ? "font-medium" : "text-muted-foreground"}>Traitement</span>
                </div>
              </div>
            </div>

            {/* Step 1: Content Selection */}
            {uploadStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Sélectionnez votre contenu</CardTitle>
                  <CardDescription>
                    Choisissez le type de contenu pédagogique que vous souhaitez importer
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="file" onValueChange={setUploadType}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="file">Fichier</TabsTrigger>
                      <TabsTrigger value="url">URL</TabsTrigger>
                      <TabsTrigger value="text">Texte</TabsTrigger>
                    </TabsList>

                    <TabsContent value="file" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="file-type">Type de fichier</Label>
                        <Select defaultValue="pdf">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">Document PDF</SelectItem>
                            <SelectItem value="ppt">Présentation PowerPoint</SelectItem>
                            <SelectItem value="doc">Document Word</SelectItem>
                            <SelectItem value="video">Vidéo</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Fichier</Label>
                        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8">
                          {!fileUploaded ? (
                            <>
                              <div className="rounded-full bg-primary/10 p-3">
                                <Upload className="h-6 w-6 text-primary" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium">
                                  Glissez-déposez votre fichier ici ou cliquez pour parcourir
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Formats supportés: PDF, PPTX, DOCX, MP4, MP3 (max. 50MB)
                                </p>
                              </div>
                              <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                              <Button variant="outline" onClick={() => document.getElementById("file-upload").click()}>
                                Parcourir
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className="rounded-full bg-green-100 p-3">
                                <Check className="h-6 w-6 text-green-600" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium">Fichier prêt à être importé</p>
                                <p className="text-xs text-primary">{fileName}</p>
                              </div>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setFileUploaded(false)
                                  setFileName("")
                                }}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Supprimer
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="url" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="content-url">URL du contenu</Label>
                        <Input id="content-url" placeholder="https://exemple.com/cours-biologie.pdf" />
                        <p className="text-xs text-muted-foreground">
                          Entrez l'URL d'un contenu en ligne (PDF, vidéo YouTube, etc.)
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="text" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="content-title">Titre du contenu</Label>
                        <Input id="content-title" placeholder="Introduction à la biologie cellulaire" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content-text">Contenu</Label>
                        <Textarea
                          id="content-text"
                          placeholder="Entrez votre contenu pédagogique ici..."
                          className="min-h-[200px]"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => router.back()}>
                    Annuler
                  </Button>
                  <Button onClick={handleNextStep} disabled={uploadType === "file" && !fileUploaded}>
                    Continuer
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Step 2: Configuration */}
            {uploadStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Configuration des jeux</CardTitle>
                  <CardDescription>Paramétrez les types de jeux à générer à partir de votre contenu</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="content-title">Titre du contenu</Label>
                    <Input id="content-title" defaultValue={fileName || "Introduction à la biologie cellulaire"} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content-category">Catégorie</Label>
                    <Select defaultValue="science">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="science">Sciences</SelectItem>
                        <SelectItem value="math">Mathématiques</SelectItem>
                        <SelectItem value="history">Histoire</SelectItem>
                        <SelectItem value="language">Langues</SelectItem>
                        <SelectItem value="art">Arts</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Niveau de difficulté</Label>
                    <RadioGroup defaultValue="medium">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="easy" id="difficulty-easy" />
                        <Label htmlFor="difficulty-easy">Facile</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="difficulty-medium" />
                        <Label htmlFor="difficulty-medium">Intermédiaire</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hard" id="difficulty-hard" />
                        <Label htmlFor="difficulty-hard">Difficile</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Types de jeux à générer</Label>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="flex items-start space-x-2">
                        <input type="checkbox" id="game-quiz" className="mt-1" defaultChecked />
                        <div>
                          <Label htmlFor="game-quiz" className="font-medium">
                            Quiz interactif
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Questions à choix multiples générées automatiquement
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <input type="checkbox" id="game-association" className="mt-1" defaultChecked />
                        <div>
                          <Label htmlFor="game-association" className="font-medium">
                            Jeu d'association
                          </Label>
                          <p className="text-xs text-muted-foreground">Associer des concepts et définitions</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <input type="checkbox" id="game-escape" className="mt-1" />
                        <div>
                          <Label htmlFor="game-escape" className="font-medium">
                            Escape Room
                          </Label>
                          <p className="text-xs text-muted-foreground">Énigmes et défis basés sur le contenu</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <input type="checkbox" id="game-simulation" className="mt-1" />
                        <div>
                          <Label htmlFor="game-simulation" className="font-medium">
                            Simulateur
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Simulation interactive (nécessite une validation manuelle)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content-notes">Notes additionnelles</Label>
                    <Textarea
                      id="content-notes"
                      placeholder="Informations supplémentaires pour la génération des jeux..."
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Retour
                  </Button>
                  <Button onClick={handleNextStep}>Générer les jeux</Button>
                </CardFooter>
              </Card>
            )}

            {/* Step 3: Processing */}
            {uploadStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Traitement du contenu</CardTitle>
                  <CardDescription>Notre IA analyse votre contenu et génère des jeux interactifs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                      <h3 className="text-lg font-medium">Traitement en cours...</h3>
                      <p className="text-center text-sm text-muted-foreground">
                        Notre IA analyse votre contenu et génère des jeux interactifs.
                        <br />
                        Cela peut prendre quelques minutes.
                      </p>

                      <div className="mt-8 w-full space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Analyse du contenu</span>
                            <span>100%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div className="h-full w-full rounded-full bg-primary"></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Extraction des concepts clés</span>
                            <span>75%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div className="h-full w-3/4 rounded-full bg-primary"></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Génération des jeux</span>
                            <span>30%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <div className="h-full w-1/3 rounded-full bg-primary"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium">Traitement terminé !</h3>
                      <p className="text-center text-sm text-muted-foreground">
                        Vos jeux ont été générés avec succès et sont prêts à être utilisés.
                      </p>

                      <div className="mt-8 w-full space-y-4">
                        <div className="rounded-lg border p-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-2">
                              <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">Quiz interactif</h4>
                              <p className="text-xs text-muted-foreground">15 questions générées</p>
                            </div>
                            <Badge>Prêt</Badge>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-2">
                              <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">Jeu d'association</h4>
                              <p className="text-xs text-muted-foreground">12 paires générées</p>
                            </div>
                            <Badge>Prêt</Badge>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-2">
                              <Gamepad2 className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium">Escape Room</h4>
                              <p className="text-xs text-muted-foreground">Nécessite une validation manuelle</p>
                            </div>
                            <Badge variant="outline">En attente</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep} disabled={isProcessing}>
                    Retour
                  </Button>
                  <Button onClick={() => router.push("/admin/games")} disabled={isProcessing}>
                    {isComplete ? "Voir les jeux générés" : "Terminer"}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
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

