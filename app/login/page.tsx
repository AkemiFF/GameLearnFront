"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { MathBackground } from "@/components/math-background"
import { userAuth } from "@/lib/auth"
import { apiClient } from "@/lib/api-client"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""; // Define BASE_URL
  const [formData, setFormData] = useState({ username: "", password: "" }); // Define formData and setFormData

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Store the tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        router.push("/games");
      } else {
        console.error("Login failed:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    } finally {
      setIsLoading(false);
    }
  };


  /*   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
  
      try {
        const response = await apiClient.post(`${BASE_URL}/api/auth/login/`, formData);
        if (response.status === 200) {
          const res = response.data;
          userAuth.save(res);
          console.log(res);
          router.push("/games");
        } else {
          console.error("Login failed:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred during login:", error);
      } finally {
        setIsLoading(false);
      }
    }; */

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-muted/50">
      <Header showAuthButtons={false} />

      {/* Arrière-plan mathématique */}
      <MathBackground />

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
                <CardTitle className="text-center text-2xl">Connexion</CardTitle>
                <CardDescription className="text-center">
                  Entrez vos identifiants pour accéder à votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        type="username"
                        placeholder="jean"
                        className="pl-9"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                        Mot de passe oublié?
                      </Link>
                    </div>
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
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm">
                      Se souvenir de moi
                    </Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                      />
                    ) : null}
                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                  </Button>
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
                  Vous n'avez pas de compte?{" "}
                  <motion.span
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className="inline-block"
                  >
                    <Link href="/register" className="text-primary hover:underline">
                      S'inscrire <ArrowRight className="inline h-3 w-3" />
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

