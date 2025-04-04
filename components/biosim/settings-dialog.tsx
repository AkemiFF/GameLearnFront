"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  highQuality: boolean
  onHighQualityChange: (value: boolean) => void
  soundEnabled: boolean
  onSoundEnabledChange: (value: boolean) => void
  onRestartTutorial: () => void
  onResetProgress: () => void
}

export function SettingsDialog({
  open,
  onOpenChange,
  highQuality,
  onHighQualityChange,
  soundEnabled,
  onSoundEnabledChange,
  onRestartTutorial,
  onResetProgress,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border">
        <DialogHeader>
          <DialogTitle>Paramètres</DialogTitle>
          <DialogDescription>Personnalisez votre expérience</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="setting-quality">Haute qualité graphique</Label>
            <Switch id="setting-quality" checked={highQuality} onCheckedChange={onHighQualityChange} />
          </div>
          <p className="text-xs text-muted-foreground">
            Désactivez cette option si vous rencontrez des problèmes de performance.
          </p>

          <div className="flex items-center justify-between">
            <Label htmlFor="setting-sound">Sons et effets sonores</Label>
            <Switch id="setting-sound" checked={soundEnabled} onCheckedChange={onSoundEnabledChange} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="setting-tutorial">Afficher le tutoriel</Label>
            <Button variant="outline" size="sm" className="h-8" onClick={onRestartTutorial}>
              Relancer
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <Label>Réinitialiser les progrès</Label>
            <Button variant="destructive" size="sm" className="h-8" onClick={onResetProgress}>
              Réinitialiser
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button className="w-full" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

