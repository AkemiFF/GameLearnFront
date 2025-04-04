"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface HelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStartTutorial: () => void
}

export function HelpDialog({ open, onOpenChange, onStartTutorial }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border">
        <DialogHeader>
          <DialogTitle>Aide - BioSim</DialogTitle>
          <DialogDescription>Guide d'utilisation du laboratoire virtuel</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">Comment utiliser BioSim</h4>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Sélectionnez une expérience dans la liste à gauche</li>
              <li>2. Ajustez les variables selon vos hypothèses</li>
              <li>3. Cliquez sur "Démarrer" pour lancer la simulation</li>
              <li>4. Observez les résultats en temps réel</li>
              <li>5. Analysez les données et tirez des conclusions</li>
              <li>6. Enregistrez vos notes dans l'onglet "Notes"</li>
            </ol>
          </div>

          <div>
            <h4 className="font-medium mb-1">Astuces</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Essayez différentes combinaisons de variables pour voir leur impact</li>
              <li>• Consultez l'onglet "Théorie" pour comprendre les concepts scientifiques</li>
              <li>• Déverrouillez des réalisations en atteignant certains objectifs</li>
              <li>• Utilisez le mode plein écran pour une meilleure immersion</li>
            </ul>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              onOpenChange(false)
              onStartTutorial()
            }}
          >
            Lancer le tutoriel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

