"use client"

import type React from "react"

import { Header } from "@/components/header"
import { MathBackground } from "@/components/math-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BASE_URL } from "@/lib/host"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Eye, EyeOff, Lock, Mail, School, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
  const router = useRouter()
  const [formStep, setFormStep] = useState(0)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userType, setUserType] = useState("student")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères")
      return false
    }
    if (password !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleNextStep = () => {
    if (formStep === 0) {
      if (validatePassword()) {
        setFormStep(1)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/accounts/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username: firstName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Une erreur est survenue lors de l'inscription")
      }

      setIsLoading(false)
      router.push("/login")
    } catch (error: any) {
      setIsLoading(false)
      alert(error.message)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-muted/50">
      <Header showAuthButtons={false} />

      {/* Arrière-plan mathématique */}
      <MathBackground variant="complex" />

      <main className="container relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-muted/30 bg-background/80 backdrop-blur-md">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.2,
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
                  >
                    <BookOpen className="h-6 w-6 text-primary" />
                  </motion.div>
                </div>
                <CardTitle className="text-center text-2xl">Inscription</CardTitle>
                <CardDescription className="text-center">
                  Créez votre compte pour commencer votre parcours d'apprentissage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Étape 1: Informations de compte */}
                  <motion.div
                    initial={{ opacity: 0, x: formStep === 0 ? 20 : -20 }}
                    animate={{ opacity: formStep === 0 ? 1 : 0, x: formStep === 0 ? 0 : -20 }}
                    transition={{ duration: 0.3 }}
                    className={formStep === 0 ? "block" : "hidden"}
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="votre@email.com"
                            className="pl-9"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="pl-9 pr-9"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            className="pl-9"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                        {passwordError && <p className="text-xs text-destructive">{passwordError}</p>}
                      </div>
                    </div>
                  </motion.div>

                  {/* Étape 2: Informations personnelles */}
                  <motion.div
                    initial={{ opacity: 0, x: formStep === 1 ? 20 : -20 }}
                    animate={{ opacity: formStep === 1 ? 1 : 0, x: formStep === 1 ? 0 : 20 }}
                    transition={{ duration: 0.3 }}
                    className={formStep === 1 ? "block" : "hidden"}
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Jean"
                            className="pl-9"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Dupont"
                            className="pl-9"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userType">Type d'utilisateur</Label>
                        <div className="relative">
                          <School className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                          <Select value={userType} onValueChange={setUserType}>
                            <SelectTrigger className="pl-9">
                              <SelectValue placeholder="Sélectionnez votre profil" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Étudiant</SelectItem>
                              <SelectItem value="teacher">Enseignant</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" required />
                        <Label htmlFor="terms" className="text-sm">
                          J'accepte les{" "}
                          <Link href="/terms" className="text-primary hover:underline">
                            conditions d'utilisation
                          </Link>{" "}
                          et la{" "}
                          <Link href="/privacy" className="text-primary hover:underline">
                            politique de confidentialité
                          </Link>
                        </Label>
                      </div>
                    </div>
                  </motion.div>

                  {/* Boutons de navigation */}
                  <div className="flex justify-between">
                    {formStep === 1 && (
                      <Button type="button" variant="outline" onClick={() => setFormStep(0)}>
                        Retour
                      </Button>
                    )}

                    {formStep === 0 ? (
                      <Button type="button" className="ml-auto" onClick={handleNextStep}>
                        Suivant
                      </Button>
                    ) : (
                      <Button type="submit" className="ml-auto" disabled={isLoading}>
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                          />
                        ) : null}
                        {isLoading ? "Inscription en cours..." : "S'inscrire"}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="relative flex items-center justify-center w-full">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative bg-background px-4 text-sm text-muted-foreground">ou</div>
                </div>
                <div className="grid gap-2">
                  <Button variant="outline" className="w-full">
                    Continuer avec Google
                  </Button>
                  <Button variant="outline" className="w-full">
                    Continuer avec Microsoft
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Vous avez déjà un compte?{" "}
                  <motion.span
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className="inline-block"
                  >
                    <Link href="/login" className="text-primary hover:underline">
                      Se connecter <ArrowRight className="inline h-3 w-3" />
                    </Link>
                  </motion.span>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

