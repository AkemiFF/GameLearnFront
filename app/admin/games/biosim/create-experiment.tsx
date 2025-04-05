"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Beaker, Plus, Trash2, Save, ArrowLeft, Lightbulb, Thermometer, Droplets, Leaf } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Types for our experiment data
interface Variable {
  id?: number
  name: string
  display_name: string
  description: string
  min_value: number
  max_value: number
  default_value: number
  unit: string
  color: string
  icon: string
  order: number
}

interface ExpectedResult {
  id?: number
  name: string
  description: string
  conditions: VariableCondition[]
  outcome: string
  feedback: string
}

interface VariableCondition {
  variable_id: number
  min_value: number
  max_value: number
}

interface Experiment {
  id?: string
  title: string
  description: string
  difficulty: string
  duration: string
  icon: string
  image: string
  theory_content: string
}

// Ajouter l'interface TempCondition et l'état tempCondition après les autres interfaces et avant le composant principal

interface TempCondition {
  variable_id?: number
  variable_name: string
  min_value: number
  max_value: number
  unit: string
}

// Mock API functions - replace with actual API calls
const apiAdmin = {
  post: async (url: string, data: any) => {
    console.log(`POST to ${url}`, data)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { data: { ...data, id: Math.floor(Math.random() * 1000).toString() } }
  },
  put: async (url: string, data: any) => {
    console.log(`PUT to ${url}`, data)
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { data }
  },
  get: async (url: string) => {
    console.log(`GET from ${url}`)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock data for variables
    if (url.includes("/variables")) {
      return {
        data: [
          {
            id: 1,
            name: "Glucose de la plante",
            display_name: "Glucose produit",
            description: "Production de glucose de la plante pendant l'experience",
            min_value: 1.0,
            max_value: 100.0,
            default_value: 5.0,
            unit: "10",
            color: "Rouge",
            icon: "plante experience",
            order: 0,
          },
          {
            id: 2,
            name: "Lumiere",
            display_name: "Lumière",
            description: "La quantité de lumière donnée à la plante",
            min_value: 1.0,
            max_value: 100.0,
            default_value: 50.0,
            unit: "lux",
            color: "Jaune",
            icon: "Soleil",
            order: 0,
          },
        ],
      }
    }

    return { data: [] }
  },
}

// Icons mapping for variable types
const getVariableIcon = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    Soleil: <Lightbulb className="h-5 w-5" />,
    termomètre: <Thermometer className="h-5 w-5" />,
    Eau: <Droplets className="h-5 w-5" />,
    Tige: <Leaf className="h-5 w-5" />,
    "plante experience": <Beaker className="h-5 w-5" />,
  }

  return icons[iconName] || <Beaker className="h-5 w-5" />
}

export default function CreateBioSimExperiment() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("experiment")
  const [isLoading, setIsLoading] = useState(false)

  // State for experiment data
  const [experiment, setExperiment] = useState<Experiment>({
    title: "",
    description: "",
    difficulty: "beginner",
    duration: "30",
    icon: "science",
    image: "",
    theory_content: "",
  })

  // State for variables
  const [variables, setVariables] = useState<Variable[]>([])
  const [newVariable, setNewVariable] = useState<Variable>({
    name: "",
    display_name: "",
    description: "",
    min_value: 0,
    max_value: 100,
    default_value: 50,
    unit: "",
    color: "#3B82F6",
    icon: "Beaker",
    order: 0,
  })

  // State for expected results
  const [expectedResults, setExpectedResults] = useState<ExpectedResult[]>([])
  const [newResult, setNewResult] = useState<ExpectedResult>({
    name: "",
    description: "",
    conditions: [],
    outcome: "",
    feedback: "",
  })

  // State for temporary condition
  const [tempCondition, setTempCondition] = useState<{
    variable_id: number | undefined
    variable_name: string
    min_value: number
    max_value: number
    unit: string
  }>({
    variable_id: undefined,
    variable_name: "",
    min_value: 0,
    max_value: 0,
    unit: "",
  })

  // Load existing variables for reference
  useEffect(() => {
    const loadVariables = async () => {
      try {
        const response = await apiAdmin.get("/api/biosim/variables/")
        // We don't set these to the variables state as they're just for reference
      } catch (error) {
        console.error("Error loading variables:", error)
      }
    }

    loadVariables()
  }, [])

  // Handle experiment form changes
  const handleExperimentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setExperiment((prev) => ({ ...prev, [name]: value }))
  }

  // Handle experiment select changes
  const handleExperimentSelectChange = (name: string, value: string) => {
    setExperiment((prev) => ({ ...prev, [name]: value }))
  }

  // Handle variable form changes
  const handleVariableChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewVariable((prev) => ({ ...prev, [name]: value }))
  }

  // Handle variable number input changes
  const handleVariableNumberChange = (name: string, value: number) => {
    setNewVariable((prev) => ({ ...prev, [name]: value }))
  }

  // Handle variable select changes
  const handleVariableSelectChange = (name: string, value: string) => {
    setNewVariable((prev) => ({ ...prev, [name]: value }))
  }

  // Add a new variable
  const addVariable = () => {
    if (!newVariable.name || !newVariable.display_name) {
      toast({
        title: "Champs requis",
        description: "Le nom et le nom d'affichage sont requis pour ajouter une variable.",
        variant: "destructive",
      })
      return
    }

    setVariables((prev) => [...prev, { ...newVariable, order: prev.length }])
    setNewVariable({
      name: "",
      display_name: "",
      description: "",
      min_value: 0,
      max_value: 100,
      default_value: 50,
      unit: "",
      color: "#3B82F6",
      icon: "Beaker",
      order: 0,
    })
  }

  // Remove a variable
  const removeVariable = (index: number) => {
    setVariables((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle result form changes
  const handleResultChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewResult((prev) => ({ ...prev, [name]: value }))
  }

  // Add a condition to the new result
  const addCondition = (variableId: number, minValue: number, maxValue: number) => {
    setNewResult((prev) => ({
      ...prev,
      conditions: [...prev.conditions, { variable_id: variableId, min_value: minValue, max_value: maxValue }],
    }))
  }

  // Remove a condition from the new result
  const removeCondition = (index: number) => {
    setNewResult((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }))
  }

  // Add a new expected result
  const addExpectedResult = () => {
    if (!newResult.name || !newResult.outcome || newResult.conditions.length === 0) {
      toast({
        title: "Champs requis",
        description: "Le nom, le résultat et au moins une condition sont requis.",
        variant: "destructive",
      })
      return
    }

    setExpectedResults((prev) => [...prev, newResult])
    setNewResult({
      name: "",
      description: "",
      conditions: [],
      outcome: "",
      feedback: "",
    })
  }

  // Remove an expected result
  const removeExpectedResult = (index: number) => {
    setExpectedResults((prev) => prev.filter((_, i) => i !== index))
  }

  // Save the entire experiment
  const saveExperiment = async () => {
    if (!experiment.title || !experiment.description) {
      toast({
        title: "Champs requis",
        description: "Le titre et la description de l'expérience sont requis.",
        variant: "destructive",
      })
      return
    }

    if (variables.length === 0) {
      toast({
        title: "Variables requises",
        description: "Vous devez ajouter au moins une variable à l'expérience.",
        variant: "destructive",
      })
      return
    }

    if (expectedResults.length === 0) {
      toast({
        title: "Résultats attendus requis",
        description: "Vous devez définir au moins un résultat attendu.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create the experiment
      const experimentResponse = await apiAdmin.post("/api/biosim/experiments/", experiment)
      const createdExperiment = experimentResponse.data

      // Add variables to the experiment
      const createdVariables = []
      for (const variable of variables) {
        const variableData = { ...variable, experiment_id: createdExperiment.id }
        const variableResponse = await apiAdmin.post("/api/biosim/variables/", variableData)
        createdVariables.push(variableResponse.data)
      }

      // Add expected results
      for (const result of expectedResults) {
        // Map the conditions to use the created variable IDs
        const mappedConditions = result.conditions.map((condition) => {
          const variableIndex = variables.findIndex((v) => v.id === condition.variable_id)
          return {
            ...condition,
            variable_id: createdVariables[variableIndex].id,
          }
        })

        const resultData = {
          ...result,
          experiment_id: createdExperiment.id,
          conditions: mappedConditions,
        }

        await apiAdmin.post("/api/biosim/expected-results/", resultData)
      }

      toast({
        title: "Expérience créée",
        description: "L'expérience a été créée avec succès.",
      })

      // Navigate back to the experiments list
      router.push("/admin/games/biosim")
    } catch (error) {
      console.error("Error saving experiment:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'expérience.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/games/biosim")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Créer une nouvelle expérience BioSim</h1>
        </div>
        <Button onClick={saveExperiment} disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer l'expérience"}
          <Save className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="experiment">Expérience</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="results">Résultats attendus</TabsTrigger>
        </TabsList>

        {/* Experiment Tab */}
        <TabsContent value="experiment">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l&apos;expérience</CardTitle>
              <CardDescription>Définissez les détails de base de votre expérience BioSim.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    name="title"
                    value={experiment.title}
                    onChange={handleExperimentChange}
                    placeholder="Photosynthèse des plantes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icône</Label>
                  <Select
                    value={experiment.icon}
                    onValueChange={(value) => handleExperimentSelectChange("icon", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une icône" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="plante">Plante</SelectItem>
                      <SelectItem value="chemistry">Chimie</SelectItem>
                      <SelectItem value="biology">Biologie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={experiment.description}
                  onChange={handleExperimentChange}
                  placeholder="Décrivez brièvement cette expérience..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulté</Label>
                  <Select
                    value={experiment.difficulty}
                    onValueChange={(value) => handleExperimentSelectChange("difficulty", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une difficulté" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Débutant</SelectItem>
                      <SelectItem value="intermediate">Intermédiaire</SelectItem>
                      <SelectItem value="advanced">Avancé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée (minutes)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={experiment.duration}
                    onChange={handleExperimentChange}
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL de l&apos;image</Label>
                <Input
                  id="image"
                  name="image"
                  value={experiment.image}
                  onChange={handleExperimentChange}
                  placeholder="http://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theory_content">Contenu théorique (Markdown)</Label>
                <Textarea
                  id="theory_content"
                  name="theory_content"
                  value={experiment.theory_content}
                  onChange={handleExperimentChange}
                  placeholder="# Introduction à la photosynthèse..."
                  rows={10}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/admin/games/biosim")}>
                Annuler
              </Button>
              <Button onClick={() => setActiveTab("variables")}>Continuer vers les variables</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Variables Tab */}
        <TabsContent value="variables">
          <Card>
            <CardHeader>
              <CardTitle>Variables de l&apos;expérience</CardTitle>
              <CardDescription>
                Définissez les variables que les utilisateurs pourront manipuler dans cette expérience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* List of added variables */}
              {variables.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Variables ajoutées</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Affichage</TableHead>
                        <TableHead>Plage</TableHead>
                        <TableHead>Unité</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variables.map((variable, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{variable.name}</TableCell>
                          <TableCell className="flex items-center gap-2">
                            {getVariableIcon(variable.icon)}
                            {variable.display_name}
                          </TableCell>
                          <TableCell>
                            {variable.min_value} - {variable.max_value} (défaut: {variable.default_value})
                          </TableCell>
                          <TableCell>{variable.unit}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => removeVariable(index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Add new variable form */}
              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="text-lg font-medium">Ajouter une nouvelle variable</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom (identifiant)</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newVariable.name}
                      onChange={handleVariableChange}
                      placeholder="temperature"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Nom d&apos;affichage</Label>
                    <Input
                      id="display_name"
                      name="display_name"
                      value={newVariable.display_name}
                      onChange={handleVariableChange}
                      placeholder="Température"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newVariable.description}
                    onChange={handleVariableChange}
                    placeholder="Décrivez cette variable..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_value">Valeur minimale</Label>
                    <Input
                      id="min_value"
                      name="min_value"
                      type="number"
                      value={newVariable.min_value}
                      onChange={(e) => handleVariableNumberChange("min_value", Number.parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_value">Valeur maximale</Label>
                    <Input
                      id="max_value"
                      name="max_value"
                      type="number"
                      value={newVariable.max_value}
                      onChange={(e) => handleVariableNumberChange("max_value", Number.parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default_value">Valeur par défaut</Label>
                    <Input
                      id="default_value"
                      name="default_value"
                      type="number"
                      value={newVariable.default_value}
                      onChange={(e) => handleVariableNumberChange("default_value", Number.parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unité</Label>
                    <Input
                      id="unit"
                      name="unit"
                      value={newVariable.unit}
                      onChange={handleVariableChange}
                      placeholder="°C"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Couleur</Label>
                    <Input
                      id="color"
                      name="color"
                      value={newVariable.color}
                      onChange={handleVariableChange}
                      placeholder="Rouge"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icône</Label>
                    <Select
                      value={newVariable.icon}
                      onValueChange={(value) => handleVariableSelectChange("icon", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une icône" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Soleil">Soleil</SelectItem>
                        <SelectItem value="termomètre">Thermomètre</SelectItem>
                        <SelectItem value="Eau">Eau</SelectItem>
                        <SelectItem value="Tige">Tige</SelectItem>
                        <SelectItem value="plante experience">Plante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={addVariable} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter cette variable
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("experiment")}>
                Retour aux informations
              </Button>
              <Button onClick={() => setActiveTab("results")} disabled={variables.length === 0}>
                {variables.length === 0 ? "Ajoutez au moins une variable" : "Continuer vers les résultats attendus"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Expected Results Tab */}
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Résultats attendus</CardTitle>
              <CardDescription>
                Définissez les résultats attendus en fonction des combinaisons de variables.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* List of added expected results */}
              {expectedResults.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Résultats définis</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Conditions</TableHead>
                        <TableHead>Résultat</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expectedResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{result.name}</TableCell>
                          <TableCell>
                            <ul className="list-disc list-inside">
                              {result.conditions.map((condition, condIndex) => {
                                const variable =
                                  variables.find((v) => v.id === condition.variable_id) ||
                                  variables[condition.variable_id]
                                return (
                                  <li key={condIndex}>
                                    {variable?.display_name}: {condition.min_value} - {condition.max_value}{" "}
                                    {variable?.unit}
                                  </li>
                                )
                              })}
                            </ul>
                          </TableCell>
                          <TableCell>{result.outcome}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => removeExpectedResult(index)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Add new expected result form */}
              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="text-lg font-medium">Ajouter un nouveau résultat attendu</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="result_name">Nom du résultat</Label>
                    <Input
                      id="result_name"
                      name="name"
                      value={newResult.name}
                      onChange={handleResultChange}
                      placeholder="Croissance optimale"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="result_description">Description</Label>
                    <Input
                      id="result_description"
                      name="description"
                      value={newResult.description}
                      onChange={handleResultChange}
                      placeholder="La plante pousse de manière optimale"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Conditions (combinaisons de variables)</Label>
                  <div className="border rounded-md p-4 space-y-4">
                    {newResult.conditions.map((condition, index) => {
                      const variable =
                        variables.find((v) => v.id === condition.variable_id) || variables[condition.variable_id]
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <span>
                            {variable?.display_name}: {condition.min_value} - {condition.max_value} {variable?.unit}
                          </span>
                          <Button variant="ghost" size="icon" onClick={() => removeCondition(index)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )
                    })}

                    {/* Add condition form */}
                    <div className="space-y-4 border p-3 rounded-md">
                      <h4 className="font-medium">Ajouter une condition</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label>Variable</Label>
                          <Select
                            onValueChange={(value) => {
                              const selectedVariableId = Number.parseInt(value)
                              const selectedVariable =
                                variables.find((v) => v.id === selectedVariableId) || variables[selectedVariableId]
                              if (selectedVariable) {
                                // Mettre à jour l'état temporaire pour la nouvelle condition
                                setTempCondition({
                                  variable_id: selectedVariableId,
                                  variable_name: selectedVariable.display_name,
                                  min_value: selectedVariable.min_value,
                                  max_value: selectedVariable.max_value,
                                  unit: selectedVariable.unit,
                                })
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une variable" />
                            </SelectTrigger>
                            <SelectContent>
                              {variables.map((variable, index) => (
                                <SelectItem key={index} value={variable.id?.toString() || index.toString()}>
                                  {variable.display_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {tempCondition.variable_id !== undefined && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Valeur minimale</Label>
                                <Input
                                  type="number"
                                  value={tempCondition.min_value}
                                  onChange={(e) =>
                                    setTempCondition((prev) => ({
                                      ...prev,
                                      min_value: Number.parseFloat(e.target.value),
                                    }))
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Valeur maximale</Label>
                                <Input
                                  type="number"
                                  value={tempCondition.max_value}
                                  onChange={(e) =>
                                    setTempCondition((prev) => ({
                                      ...prev,
                                      max_value: Number.parseFloat(e.target.value),
                                    }))
                                  }
                                />
                              </div>
                            </div>
                            <Button
                              onClick={() => {
                                if (tempCondition.variable_id !== undefined) {
                                  addCondition(
                                    tempCondition.variable_id,
                                    tempCondition.min_value,
                                    tempCondition.max_value,
                                  )
                                  // Réinitialiser la condition temporaire
                                  setTempCondition({
                                    variable_id: undefined,
                                    variable_name: "",
                                    min_value: 0,
                                    max_value: 0,
                                    unit: "",
                                  })
                                }
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Ajouter cette condition
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outcome">Résultat</Label>
                  <Textarea
                    id="outcome"
                    name="outcome"
                    value={newResult.outcome}
                    onChange={handleResultChange}
                    placeholder="Décrivez le résultat attendu..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Feedback pour l&apos;utilisateur</Label>
                  <Textarea
                    id="feedback"
                    name="feedback"
                    value={newResult.feedback}
                    onChange={handleResultChange}
                    placeholder="Feedback à afficher à l'utilisateur..."
                    rows={2}
                  />
                </div>

                <Button onClick={addExpectedResult} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter ce résultat attendu
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("variables")}>
                Retour aux variables
              </Button>
              <Button onClick={saveExperiment} disabled={isLoading || expectedResults.length === 0}>
                {isLoading
                  ? "Enregistrement..."
                  : expectedResults.length === 0
                    ? "Ajoutez au moins un résultat"
                    : "Enregistrer l'expérience"}
                <Save className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation dialog for cancellation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="mt-4">
            Annuler la création
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir annuler ?</AlertDialogTitle>
            <AlertDialogDescription>Toutes les modifications non enregistrées seront perdues.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuer l&apos;édition</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/admin/games/biosim")}>Oui, annuler</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

