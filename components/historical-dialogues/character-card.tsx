"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, CheckCircle2, MapPin } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

// Define the type for the character based on your API response
interface HistoricalCharacter {
  id: string
  name: string
  period: string
  short_description: string | null
  portrait_url: string | null
  birth_year: number | null
  death_year: number | null
  nationality: string
  tags: { name: string }[]
  achievements: { description: string }[]
}


interface HistoricalCharacterCardProps {
  character: HistoricalCharacter
  isCompleted: boolean
  onSelect: () => void
}

export function HistoricalCharacterCard({ character, isCompleted, onSelect }: HistoricalCharacterCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Generate image path based on character id
  const imagePath = `/images/characters/${character.id}.jpg`

  // Fallback image if character-specific image doesn't exist
  const fallbackImage = `/images/character-placeholder.jpg`

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card
        className={`overflow-hidden h-full flex flex-col ${isCompleted
          ? "border-amber-300 dark:border-amber-700 shadow-[0_0_0_1px_rgba(251,191,36,0.3)]"
          : "hover:shadow-md"
          }`}
      >
        <div className="aspect-[3/2] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 ease-out"
            style={{
              backgroundImage: `url(${character.portrait_url || imagePath})`,
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          >
            <Image
              src={character.portrait_url || imagePath}
              alt={character.name}
              width={400}
              height={300}
              className="object-cover w-full h-full opacity-0"
              onError={(e) => {
                // If the character-specific image fails, use the fallback
                const target = e.target as HTMLImageElement
                target.onerror = null
                const parent = target.parentElement as HTMLElement
                if (parent) {
                  parent.style.backgroundImage = `url(${fallbackImage})`
                }
              }}
            />
          </div>

          {isCompleted && (
            <div className="absolute top-3 right-3 z-20">
              <Badge className="bg-amber-500 hover:bg-amber-500/90 text-white border-none px-2 py-1">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Complété
              </Badge>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <h3 className="text-xl font-bold text-white leading-tight">{character.name}</h3>
            <p className="text-sm text-white/90 flex items-center mt-1">
              <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-80" />
              {character.period}
            </p>
          </div>
        </div>

        <CardContent className="p-4 flex-grow">
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            {character.nationality}
          </div>

          <p className="text-sm text-foreground/90 line-clamp-3 mb-3">{character.short_description}</p>

          <div className="flex flex-wrap gap-1.5 mt-auto">
            {character.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0 h-5">
                {tag.name}
              </Badge>
            ))}
            {character.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                +{character.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 border-t border-border/40 mt-auto">
          <Button onClick={onSelect} className="w-full" variant={isCompleted ? "outline" : "default"} size="sm">
            {isCompleted ? "Revisiter" : "Dialoguer"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

