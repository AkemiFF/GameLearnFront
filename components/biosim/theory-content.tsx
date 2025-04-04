"use client"

import { BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TheoryContentProps {
  experimentId: string
}

export function TheoryContent({ experimentId }: TheoryContentProps) {
  if (experimentId !== "photosynthesis") {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Contenu en développement</h3>
        <p className="text-muted-foreground max-w-xs">
          Le contenu théorique pour cette expérience sera disponible prochainement.
        </p>
      </div>
    )
  }

  return (
    <Card className="border-border bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Théorie scientifique
        </CardTitle>
        <CardDescription>Comprendre les concepts derrière l'expérience</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">La photosynthèse</h3>
          <p>
            La photosynthèse est le processus par lequel les plantes, les algues et certaines bactéries convertissent
            l'énergie lumineuse en énergie chimique. Ce processus est essentiel à la vie sur Terre car il produit de
            l'oxygène et sert de base à la chaîne alimentaire.
          </p>

          <div className="rounded-lg border border-border bg-card/80 p-4">
            <h4 className="font-medium mb-2">Équation simplifiée</h4>
            <div className="font-mono text-center p-2 bg-muted rounded-md">
              6 CO₂ + 6 H₂O + lumière → C₆H₁₂O₆ + 6 O₂
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Dioxyde de carbone + Eau + Énergie lumineuse → Glucose + Oxygène
            </p>
          </div>

          <h4 className="text-md font-medium mt-4">Facteurs influençant la photosynthèse</h4>

          <div className="space-y-3">
            <div>
              <h5 className="font-medium">Intensité lumineuse</h5>
              <p className="text-sm text-muted-foreground">
                La lumière fournit l'énergie nécessaire pour convertir le CO₂ et l'eau en glucose. Une intensité plus
                élevée augmente généralement le taux de photosynthèse jusqu'à un certain point de saturation.
              </p>
            </div>

            <div>
              <h5 className="font-medium">Concentration en CO₂</h5>
              <p className="text-sm text-muted-foreground">
                Le dioxyde de carbone est un réactif clé. Sa disponibilité peut limiter le taux de photosynthèse,
                surtout dans des environnements fermés.
              </p>
            </div>

            <div>
              <h5 className="font-medium">Disponibilité en eau</h5>
              <p className="text-sm text-muted-foreground">
                L'eau est nécessaire comme réactif et pour maintenir la turgescence des cellules. Le stress hydrique
                réduit significativement la photosynthèse.
              </p>
            </div>

            <div>
              <h5 className="font-medium">Température</h5>
              <p className="text-sm text-muted-foreground">
                Les enzymes impliquées dans la photosynthèse fonctionnent de manière optimale à des températures
                spécifiques, généralement entre 20°C et 30°C pour la plupart des plantes.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card/80 p-4">
          <h4 className="font-medium mb-2">Applications pratiques</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Agriculture : optimisation des conditions de croissance des plantes</li>
            <li>• Environnement : compréhension du cycle du carbone et de l'oxygène</li>
            <li>• Biotechnologie : développement de cultures plus efficaces</li>
            <li>• Écologie : étude des écosystèmes et de leur productivité</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

