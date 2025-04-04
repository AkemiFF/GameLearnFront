import { NextResponse } from "next/server"

// Données GeoJSON simplifiées pour les frontières des pays
// Dans une application réelle, vous utiliseriez un fichier GeoJSON complet
const simplifiedGeoJSON = {
  type: "FeatureCollection",
  features: [
    // Exemple pour la France
    {
      type: "Feature",
      properties: {
        ISO_A2: "FR",
        NAME: "France",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [2.2137, 46.2276],
            [2.5, 46.5],
            [2.8, 46.3],
            [2.6, 46.0],
            [2.2137, 46.2276],
          ],
        ],
      },
    },
    // Ajoutez d'autres pays selon vos besoins
  ],
}

export async function GET() {
  try {
    return NextResponse.json(simplifiedGeoJSON)
  } catch (error) {
    console.error("Error serving country boundaries:", error)
    return NextResponse.json({ error: "Failed to load country boundaries" }, { status: 500 })
  }
}

