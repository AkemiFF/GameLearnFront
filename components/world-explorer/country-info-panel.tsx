"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { countries } from "@/data/countries"

interface CountryInfoPanelProps {
  countryCode: string | null
  isVisited: boolean
}

interface CountryDetail {
  name: string
  capital: string
  population: number
  area: number
  languages: string[]
  currencies: string[]
  continent: string
  flag: string
  description: string
  landmarks: string[]
}

export function CountryInfoPanel({ countryCode, isVisited }: CountryInfoPanelProps) {
  const [countryDetails, setCountryDetails] = useState<CountryDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!countryCode) {
      setCountryDetails(null)
      return
    }

    setLoading(true)

    // Simuler un appel API pour obtenir des détails supplémentaires sur le pays
    // Dans une application réelle, vous feriez un appel à une API comme restcountries.com
    setTimeout(() => {
      const country = countries.find((c) => c.code === countryCode)

      if (country) {
        setCountryDetails({
          name: country.name,
          capital: country.capital,
          population: country.population,
          area: Math.floor(Math.random() * 1000000) + 10000, // Simulé
          languages: country.language.split(", "),
          currencies: [country.currency],
          continent: country.continent,
          flag: `https://flagcdn.com/w320/${country.code.toLowerCase()}.png`,
          description: `${country.name} est un pays situé en ${country.continent}. Sa capitale est ${country.capital} et sa langue officielle est ${country.language}.`,
          landmarks: [`Capitale: ${country.capital}`, `Monument célèbre`, `Site naturel`, `Attraction touristique`],
        })
      }

      setLoading(false)
    }, 500)
  }, [countryCode])

  if (!countryCode || !countryDetails) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Informations sur le pays</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">Sélectionnez un pays sur la carte pour voir ses informations</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Chargement...</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="w-12 h-8 overflow-hidden rounded border">
          <img
            src={countryDetails.flag || "/placeholder.svg"}
            alt={`Drapeau ${countryDetails.name}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <CardTitle>{countryDetails.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{countryDetails.continent}</p>
        </div>
      </CardHeader>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="landmarks">Points d'intérêt</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="p-4">
          <div className="space-y-4">
            <p>{countryDetails.description}</p>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">Capitale</p>
                <p className="text-sm">{countryDetails.capital}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Langues</p>
                <p className="text-sm">{countryDetails.languages.join(", ")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Monnaie</p>
                <p className="text-sm">{countryDetails.currencies.join(", ")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Continent</p>
                <p className="text-sm">{countryDetails.continent}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold">{countryDetails.population.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Population</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold">{countryDetails.area.toLocaleString()} km²</div>
                <div className="text-sm text-muted-foreground">Superficie</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold">{Math.round(countryDetails.population / countryDetails.area)}</div>
                <div className="text-sm text-muted-foreground">Densité (hab/km²)</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className="text-2xl font-bold">{isVisited ? "Oui" : "Non"}</div>
                <div className="text-sm text-muted-foreground">Visité</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="landmarks" className="p-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Points d'intérêt à découvrir :</p>
            <ul className="space-y-2">
              {countryDetails.landmarks.map((landmark, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>{landmark}</span>
                </li>
              ))}
            </ul>

            {!isVisited && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm">Complétez le quiz pour débloquer plus d'informations sur ce pays !</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

