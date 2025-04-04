"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { countries } from "@/data/countries"

interface EnhancedStatsProps {
  visitedCountries: string[]
  score: number
  totalQuestions: number
}

export function EnhancedStats({ visitedCountries, score, totalQuestions }: EnhancedStatsProps) {
  // Calculer les statistiques par continent
  const continentStats = useMemo(() => {
    const stats = [
      {
        name: "Europe",
        total: countries.filter((c) => c.continent === "Europe").length,
        color: "bg-blue-500",
      },
      {
        name: "Asie",
        total: countries.filter((c) => c.continent === "Asia").length,
        color: "bg-red-500",
      },
      {
        name: "Afrique",
        total: countries.filter((c) => c.continent === "Africa").length,
        color: "bg-green-500",
      },
      {
        name: "Amérique du Nord",
        total: countries.filter((c) => c.continent === "North America").length,
        color: "bg-amber-500",
      },
      {
        name: "Amérique du Sud",
        total: countries.filter((c) => c.continent === "South America").length,
        color: "bg-purple-500",
      },
      {
        name: "Océanie",
        total: countries.filter((c) => c.continent === "Oceania").length,
        color: "bg-pink-500",
      },
    ]

    return stats.map((continent) => {
      const visited = visitedCountries.filter((code) => {
        const country = countries.find((c) => c.code === code)
        return country?.continent === continent.name
      }).length

      const percentage = Math.round((visited / continent.total) * 100) || 0

      return {
        ...continent,
        visited,
        percentage,
      }
    })
  }, [visitedCountries])

  // Calculer les statistiques globales
  const globalStats = useMemo(() => {
    const totalCountries = countries.length
    const visitedCount = visitedCountries.length
    const progressPercentage = Math.round((visitedCount / totalCountries) * 100)
    const successRate = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

    return {
      totalCountries,
      visitedCount,
      progressPercentage,
      successRate,
    }
  }, [visitedCountries, score, totalQuestions])

  // Calculer le niveau de l'explorateur
  const explorerLevel = useMemo(() => {
    const percentage = globalStats.progressPercentage

    if (percentage < 10) return { level: "Novice", color: "text-gray-500" }
    if (percentage < 25) return { level: "Apprenti", color: "text-blue-500" }
    if (percentage < 50) return { level: "Voyageur", color: "text-green-500" }
    if (percentage < 75) return { level: "Explorateur", color: "text-amber-500" }
    if (percentage < 90) return { level: "Maître", color: "text-purple-500" }
    return { level: "Légende", color: "text-red-500" }
  }, [globalStats.progressPercentage])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Progression globale</CardTitle>
          <CardDescription>
            Niveau: <span className={explorerLevel.color}>{explorerLevel.level}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border p-4 text-center">
              <div className="text-2xl font-bold">{globalStats.visitedCount}</div>
              <div className="text-sm text-muted-foreground">Pays visités</div>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="text-2xl font-bold">{globalStats.totalCountries}</div>
              <div className="text-sm text-muted-foreground">Total des pays</div>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="text-2xl font-bold">{score}</div>
              <div className="text-sm text-muted-foreground">Points gagnés</div>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="text-2xl font-bold">{globalStats.successRate}%</div>
              <div className="text-sm text-muted-foreground">Taux de réussite</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progression totale</span>
              <span>{globalStats.progressPercentage}%</span>
            </div>
            <Progress value={globalStats.progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Continents explorés</CardTitle>
          <CardDescription>Votre progression par continent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {continentStats.map((continent) => (
              <div key={continent.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{continent.name}</span>
                  <span>
                    {continent.visited}/{continent.total} ({continent.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${continent.color}`} style={{ width: `${continent.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

