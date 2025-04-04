"use client"
import { ArrowLeft, BrainCircuit, Clock, Home, Volume2, VolumeX, Maximize, Minimize } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GameHeaderProps {
  title: string
  timeLeft: number
  formatTime: (seconds: number) => string
  onPause: () => void
  onToggleSound: () => void
  soundEnabled: boolean
  onToggleFullscreen: () => void
  isFullscreen: boolean
  onBack: () => void
}

export function GameHeader({
  title,
  timeLeft,
  formatTime,
  onPause,
  onToggleSound,
  soundEnabled,
  onToggleFullscreen,
  isFullscreen,
  onBack,
}: GameHeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-purple-400" />
            <span className="text-lg font-semibold text-white">{title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full border border-white/10",
              timeLeft < 300 ? "bg-red-900/50 animate-pulse" : "bg-black/30",
            )}
          >
            <Clock className={cn("h-4 w-4", timeLeft < 300 ? "text-red-400" : "text-white")} />
            <span className={cn("font-mono font-bold", timeLeft < 300 ? "text-red-400" : "text-white")}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggleSound} className="text-white hover:bg-white/10">
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleFullscreen} className="text-white hover:bg-white/10">
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onPause} className="text-white hover:bg-white/10">
            <Pause className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
            <Link href="/dashboard">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

function Pause(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  )
}

