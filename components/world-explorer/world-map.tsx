"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { countries } from "@/data/countries"
import { useMobile } from "@/hooks/use-mobile"
import { motion } from "framer-motion"
import { Search, ZoomIn, ZoomOut } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface WorldMapProps {
  onCountrySelect: (countryCode: string) => void
  visitedCountries: string[]
  selectedCountry: string | null
}

export function WorldMap({ onCountrySelect, visitedCountries, selectedCountry }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof countries>([])
  const [viewBox, setViewBox] = useState("0 0 1000 500")
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

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

  // Handle zoom
  const handleZoomIn = () => {
    if (zoom < 4) {
      setZoom((prev) => prev + 0.5)
    }
  }

  const handleZoomOut = () => {
    if (zoom > 1) {
      setZoom((prev) => prev - 0.5)
    }
  }

  // Update viewBox when zoom changes
  useEffect(() => {
    if (svgRef.current) {
      const width = 1000 / zoom
      const height = 500 / zoom
      const x = position.x - width / 2
      const y = position.y - height / 2
      setViewBox(`${x} ${y} ${width} ${height}`)
    }
  }, [zoom, position])

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && svgRef.current) {
      const dx = (e.clientX - dragStart.x) / zoom
      const dy = (e.clientY - dragStart.y) / zoom

      setPosition((prev) => ({
        x: prev.x - dx,
        y: prev.y - dy,
      }))

      setDragStart({
        x: e.clientX,
        y: e.clientY,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Reset zoom and position
  const handleReset = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  // Focus on a country
  const focusOnCountry = (countryCode: string) => {
    const country = document.getElementById(`country-${countryCode}`)
    if (country && svgRef.current) {
      const bbox = (country as unknown as SVGGraphicsElement).getBBox()
      const centerX = bbox.x + bbox.width / 2
      const centerY = bbox.y + bbox.height / 2

      setPosition({ x: centerX, y: centerY })
      setZoom(3)
    }
  }

  return (
    <div className="relative w-full h-full" ref={containerRef}>
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
                    focusOnCountry(country.code)
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

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button variant="outline" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </Button>
      </div>

      {/* Country tooltip */}
      {hoveredCountry && (
        <div className="absolute z-10 bg-background border rounded-md shadow-md p-2 text-sm">
          {countries.find((c) => c.code === hoveredCountry)?.name || ""}
        </div>
      )}

      {/* World map SVG */}
      <svg
        ref={svgRef}
        className={`w-full h-full ${isDragging ? "cursor-grabbing" : zoom > 1 ? "cursor-grab" : "cursor-default"}`}
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g>
          {/* Simplified world map paths - this would be replaced with actual country paths */}
          {countries.map((country) => (
            <path
              key={country.code}
              id={`country-${country.code}`}
              d={country.path || "M0 0"}
              fill={
                selectedCountry === country.code
                  ? "rgba(147, 51, 234, 0.7)" // purple-600 with opacity
                  : visitedCountries.includes(country.code)
                    ? "rgba(59, 130, 246, 0.5)" // blue-500 with opacity
                    : "rgba(209, 213, 219, 0.8)" // gray-300 with opacity
              }
              stroke="white"
              strokeWidth="0.5"
              onClick={() => onCountrySelect(country.code)}
              onMouseEnter={() => setHoveredCountry(country.code)}
              onMouseLeave={() => setHoveredCountry(null)}
              className="transition-colors duration-200 hover:fill-primary/60"
            />
          ))}
        </g>
      </svg>

      {/* Fallback for mobile or when paths aren't available */}
      {isMobile && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
          <div className="text-center p-4">
            <p className="mb-4 text-muted-foreground">Sélectionnez un pays dans la liste ci-dessous:</p>
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {countries.map((country) => (
                <motion.div
                  key={country.code}
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${visitedCountries.includes(country.code)
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : "bg-card hover:bg-muted"
                    }`}
                  whileHover={{ scale: 1.02 }}
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
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

