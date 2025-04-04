import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-amber-600 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Chargement...</h2>
      <p className="text-muted-foreground">Préparation des dialogues historiques</p>
    </div>
  )
}

