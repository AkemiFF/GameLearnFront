"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { countries } from "@/data/countries"
import { useMobile } from "@/hooks/use-mobile"
import { Search } from 'lucide-react'
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

// Importer le composant de carte dynamiquement avec SSR désactivé
const MapComponent = dynamic(
  () => import("./map-component"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full w-full bg-muted/20">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    )
  }
)

interface WorldMap2DProps {
  onCountrySelect: (countryCode: string) => void
  visitedCountries: string[]
  selectedCountry: string | null
}

export default function WorldMap2D({ onCountrySelect, visitedCountries, selectedCountry }: WorldMap2DProps) {
  const isMobile = useMobile()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof countries>([])
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0])
  const [mapZoom, setMapZoom] = useState(2)

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = countries.filter((country) => country.name.toLowerCase().includes(query)).slice(0, 5)

    setSearchResults(results)
  }, [searchQuery])

  // Focus on selected country
  useEffect(() => {
    if (selectedCountry) {
      const coords = getCountryCoordinates(selectedCountry)
      setMapCenter(coords)
      setMapZoom(5)
    }
  }, [selectedCountry])

  // Get coordinates for a country
  const getCountryCoordinates = (countryCode: string): [number, number] => {
    const countryCoordinates: Record<string, [number, number]> = {
      FR: [46.2276, 2.2137],
      US: [37.0902, -95.7129],
      JP: [36.2048, 138.2529],
      BR: [-14.235, -51.9253],
      AU: [-25.2744, 133.7751],
      ZA: [-30.5595, 22.9375],
      DE: [51.1657, 10.4515],
      IT: [41.8719, 12.5674],
      ES: [40.4637, -3.7492],
      GB: [55.3781, -3.436],
      CA: [56.1304, -106.3468],
      CN: [35.8617, 104.1954],
      IN: [20.5937, 78.9629],
      RU: [61.524, 105.3188],
      MX: [23.6345, -102.5528],
      EG: [26.8206, 30.8025],
      AR: [-38.4161, -63.6167],
      NZ: [-40.9006, 174.886],
      NG: [9.082, 8.6753],
      SE: [60.1282, 18.6435],
    }

    return countryCoordinates[countryCode] || [0, 0]
  }

  return (
    <div className="relative w-full h-full">
      {/* Search bar */}
      <div className="absolute top-4 left-4 z-10 w-64">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un pays..."
            className="pl-8 pr-4 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-20">
              {searchResults.map((country) => (
                <div
                  key={country.code}
                  className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer"
                  onClick={() => {
                    const coords = getCountryCoordinates(country.code)
                    setMapCenter(coords)
                    setMapZoom(5)
                    setSearchQuery("")
                    setSearchResults([])
                  }}
                >
                  <div className="w-6 h-4 overflow-hidden rounded">
                    <img
                      src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                      alt={`Drapeau ${country.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm">{country.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button variant="outline" size="icon" onClick={() => setMapZoom((prev) => Math.min(prev + 1, 8))}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
            <line x1="11" x2="11" y1="8" y2="14" />
            <line x1="8" x2="14" y1="11" y2="11" />
          </svg>
        </Button>
        <Button variant="outline" size="icon" onClick={() => setMapZoom((prev) => Math.max(prev - 1, 1))}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
            <line x1="8" x2="14" y1="11" y2="11" />
          </svg>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            setMapCenter([20, 0])
            setMapZoom(2)
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </Button>
      </div>

      {/* Leaflet Map (chargé dynamiquement côté client uniquement) */}
      <MapComponent
        mapCenter={mapCenter}
        mapZoom={mapZoom}
        visitedCountries={visitedCountries}
        selectedCountry={selectedCountry}
        onCountrySelect={onCountrySelect}
        getCountryCoordinates={getCountryCoordinates}
      />

      {/* Fallback for mobile */}
      {isMobile && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
          <div className="text-center p-4">
            <p className="mb-4 text-muted-foreground">Sélectionnez un pays dans la liste ci-dessous:</p>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {countries.map((country) => (
                <div
                  key={country.code}
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${visitedCountries.includes(country.code)
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : "bg-card hover:bg-muted"
                    }`}
                  onClick={() => onCountrySelect(country.code)}
                >
                  <div className="w-6 h-4 overflow-hidden rounded">
                    <img
                      src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                      alt={`Drapeau ${country.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm truncate">{country.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
