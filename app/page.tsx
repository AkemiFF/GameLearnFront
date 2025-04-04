"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Brain, Gamepad2, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("student")

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

  const features = [
    {
      icon: <Gamepad2 className="h-10 w-10 text-primary" />,
      title: "Jeux Interactifs",
      description: "Transformez l'apprentissage en expérience ludique avec des mini-jeux générés automatiquement",
    },
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "IA Pédagogique",
      description: "Notre IA analyse vos contenus et crée des activités adaptées à vos objectifs d'apprentissage",
    },
    {
      icon: <Trophy className="h-10 w-10 text-primary" />,
      title: "Système de Progression",
      description: "Badges, XP et certificats pour motiver et suivre la progression des apprenants",
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Apprentissage Collaboratif",
      description: "Modules collaboratifs pour favoriser l'apprentissage en équipe et l'émulation",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32 space-y-12">
          <motion.div
            className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Transformez l'apprentissage en <span className="text-primary">jeu</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              EduPlay Studio convertit vos contenus pédagogiques en expériences ludiques et interactives pour un
              apprentissage engageant et efficace.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Commencer gratuitement <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#demo">Voir la démo</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Connexion</h2>
              <p className="text-muted-foreground">
                Connectez-vous à votre compte pour accéder à vos jeux et suivre votre progression.
              </p>

              <Tabs defaultValue="student" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="student">Apprenant</TabsTrigger>
                  <TabsTrigger value="teacher">Enseignant</TabsTrigger>
                </TabsList>
                <TabsContent value="student" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-student">Email</Label>
                        <Input id="email-student" type="email" placeholder="votre@email.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-student">Mot de passe</Label>
                        <Input id="password-student" type="password" />
                      </div>
                      <Button className="w-full">
                        Se connecter
                        <motion.div
                          animate={activeTab === "student" ? { x: [0, 5, 0] } : {}}
                          transition={{ repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                        >
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </motion.div>
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="teacher" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-teacher">Email</Label>
                        <Input id="email-teacher" type="email" placeholder="enseignant@ecole.fr" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password-teacher">Mot de passe</Label>
                        <Input id="password-teacher" type="password" />
                      </div>
                      <Button className="w-full">
                        Se connecter
                        <motion.div
                          animate={activeTab === "teacher" ? { x: [0, 5, 0] } : {}}
                          transition={{ repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                        >
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </motion.div>
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative aspect-video overflow-hidden rounded-xl border bg-gradient-to-br from-primary/20 to-secondary/20 p-2"
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="text-center space-y-4">
                  <BookOpen className="mx-auto h-16 w-16 text-primary" />
                  <h3 className="text-2xl font-bold">Bienvenue sur EduPlay Studio</h3>
                  <p className="text-muted-foreground">Transformez l'apprentissage en expérience ludique</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <section id="features" className="container py-12 md:py-24 lg:py-32 bg-muted/50">
          <motion.div
            className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Fonctionnalités</h2>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Découvrez comment EduPlay Studio révolutionne l'apprentissage grâce à ses fonctionnalités innovantes.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center space-y-4 rounded-lg border p-6 text-center shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {feature.icon}
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">EduPlay Studio</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} EduPlay Studio. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}

