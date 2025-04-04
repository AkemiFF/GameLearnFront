"use client"

import { BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { HistoricalCharacter } from "@/data/historical-characters"

interface FactCardProps {
  fact: string
  character: HistoricalCharacter
}

export function FactCard({ fact, character }: FactCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 bg-amber-100/50 dark:bg-amber-900/20 border-b flex items-center gap-2">
          <div className="h-8 w-8 rounded-full overflow-hidden">
            <img
              src={character.portraitUrl || "/placeholder.svg?height=50&width=50"}
              alt={character.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{character.name}</p>
            <p className="text-xs text-muted-foreground">{character.period}</p>
          </div>
        </div>

        <div className="p-4">
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
              <BookOpen className="h-4 w-4" />
            </div>
            <p className="text-sm">{fact}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

