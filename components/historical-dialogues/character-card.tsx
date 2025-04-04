"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { HistoricalCharacter } from "@/data/historical-characters"

interface HistoricalCharacterCardProps {
  character: HistoricalCharacter
  isCompleted: boolean
  onSelect: () => void
}

export function HistoricalCharacterCard({ character, isCompleted, onSelect }: HistoricalCharacterCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={`overflow-hidden transition-colors ${isCompleted ? "border-amber-200 dark:border-amber-800" : ""}`}
      >
        <div className="aspect-[3/2] relative overflow-hidden">
          <img
            src={character.portraitUrl || "/placeholder.svg?height=300&width=400"}
            alt={character.name}
            className="object-cover w-full h-full transition-transform duration-500 ease-in-out"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {isCompleted && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-amber-500 hover:bg-amber-500/90">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Complété
              </Badge>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white">{character.name}</h3>
            <p className="text-sm text-white/80">{character.period}</p>
          </div>
        </div>

        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{character.shortDescription}</p>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {character.tags.map((tag, index) => (
              <span key={index} className="mr-2">
                #{tag}
              </span>
            ))}
          </div>

          <Button size="sm" onClick={onSelect}>
            Dialoguer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

