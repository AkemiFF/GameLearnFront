import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-amber-600 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Chargement du personnage...</h2>
      <p className="text-muted-foreground">Préparation de l'expérience interactive</p>
    </div>
  )
}

