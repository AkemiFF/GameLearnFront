"use client"
import Image from "next/image"
import type { HistoricalCharacter } from "@/data/historical-characters"

interface CharacterIllustrationProps {
  character: HistoricalCharacter
  mood: "neutral" | "happy" | "thinking" | "surprised"
  message?: string
  isTyping?: boolean
}

export function CharacterIllustration({ character, mood, message, isTyping }: CharacterIllustrationProps) {
  // Get the appropriate image based on the character and mood
  const getCharacterImage = () => {
    // In a real implementation, you would have different images for each character and mood
    // For now, we'll use placeholder paths that follow a convention
    return `/images/historical-characters/${character.id}-${mood}.png`
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-6 h-full">
      {/* Character illustration */}
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/30 to-amber-200/30 dark:from-amber-900/20 dark:to-amber-800/20 rounded-full blur-xl"></div>
        <Image
          src={getCharacterImage() || "/placeholder.svg"}
          alt={`${character.name} - ${mood}`}
          width={300}
          height={300}
          className="object-contain z-10 relative drop-shadow-lg"
          // Fallback to character portrait if the mood-specific image doesn't exist
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = `/images/historical-characters/${character.id}.jpg`
          }}
        />

        {/* Character name tag */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-100 dark:bg-amber-900 px-4 py-1 rounded-full text-sm font-medium shadow-md z-20">
          {character.name}
        </div>
      </div>

      {/* Speech bubble */}
      {message && (
        <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg max-w-md max-h-[300px] border border-amber-200 dark:border-amber-800">
          {/* Speech bubble pointer */}
          <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-r-[15px] border-t-transparent border-b-transparent border-r-white dark:border-r-slate-800"></div>

          {/* Message content with overflow */}
          <div className="text-lg overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
            {isTyping ? (
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            ) : (
              <p>{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

