import type { AIResponseType } from "@/types/historical-dialogues"

/**
 * Analyse une réponse de texte pour extraire un format JSON potentiel
 * Utilisé pour extraire les informations de mood et message des réponses
 */
export function parseAIResponse(text: string): {
  parsedResponse: AIResponseType | null
  plainText: string
} {
  try {
    // Vérifier si le texte commence par une structure JSON
    if (text.trim().startsWith("{") && text.includes('"mood"') && text.includes('"message"')) {
      const jsonEndIndex = text.indexOf("}") + 1
      const jsonPart = text.substring(0, jsonEndIndex)
      const remainingText = text.substring(jsonEndIndex).trim()

      const parsedJson = JSON.parse(jsonPart) as AIResponseType

      // Retourner le JSON analysé et le texte restant (s'il y en a)
      return {
        parsedResponse: parsedJson,
        plainText: parsedJson.message + (remainingText ? " " + remainingText : ""),
      }
    }
  } catch (error) {
    console.error("Error parsing response:", error)
  }

  // Si ce n'est pas du JSON ou si l'analyse a échoué, retourner le texte original
  return { parsedResponse: null, plainText: text }
}

/**
 * Extrait le message à afficher à partir du contenu JSON
 */
export function getDisplayMessage(content: string): string {
  try {
    const parsed = JSON.parse(content) as AIResponseType
    return parsed.message
  } catch (e) {
    // Si l'analyse échoue, retourner le contenu original
    return content
  }
}

/**
 * Génère une réponse formatée en JSON avec une humeur
 */
export function createResponseJson(
  message: string,
  mood: "neutral" | "happy" | "thinking" | "surprised" = "neutral",
): string {
  const responseJson = {
    mood,
    message,
  }

  return JSON.stringify(responseJson)
}

/**
 * Trouve une réponse appropriée en fonction des mots-clés dans l'entrée utilisateur
 */
export function findMatchingResponse(
  input: string,
  responses: Array<{
    keywords: string[]
    text: string
    mood?: "neutral" | "happy" | "thinking" | "surprised"
    fact?: string
  }>,
  defaultResponses: string[],
): {
  responseText: string
  mood: "neutral" | "happy" | "thinking" | "surprised"
  fact: string | null
} {
  const lowerCaseInput = input.toLowerCase()

  // Rechercher une réponse correspondante
  const matchingResponse = responses.find((r) => r.keywords.some((keyword) => lowerCaseInput.includes(keyword)))

  if (matchingResponse) {
    return {
      responseText: matchingResponse.text,
      mood: matchingResponse.mood || "neutral",
      fact: matchingResponse.fact || null,
    }
  } else {
    // Réponse par défaut si aucun mot-clé ne correspond
    return {
      responseText: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      mood: "neutral",
      fact: null,
    }
  }
}

