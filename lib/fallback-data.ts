/**
 * Données de secours pour les dialogues historiques
 * Utilisées lorsque l'API n'est pas disponible
 */

import type { HistoricalCharacter, DialogueScenario } from "@/types/historical-dialogues"

// Personnages historiques de secours
export const fallbackCharacters: HistoricalCharacter[] = [
  {
    id: "leonardo-da-vinci",
    name: "Léonard de Vinci",
    period: "Renaissance (1452-1519)",
    short_description:
      "Artiste, inventeur et scientifique polymathe italien, considéré comme l'archétype de l'homme de la Renaissance.",
    portrait_url: "/images/historical-characters/leonardo-da-vinci.jpg",
    tags: [{ name: "art" }, { name: "science" }, { name: "invention" }],
    birth_year: 1452,
    death_year: 1519,
    nationality: "Italien",
    achievements: [
      { description: "La Joconde" },
      { description: "La Cène" },
      { description: "L'Homme de Vitruve" },
      { description: "Codex Atlanticus" },
    ],
  },
  {
    id: "cleopatra",
    name: "Cléopâtre VII",
    period: "Égypte ptolémaïque (69-30 av. J.-C.)",
    short_description:
      "Dernière souveraine active de l'Égypte ptolémaïque, célèbre pour ses relations avec Jules César et Marc Antoine.",
    portrait_url: "/images/historical-characters/cleopatra.jpg",
    tags: [{ name: "politique" }, { name: "Égypte" }, { name: "antiquité" }],
    birth_year: -69,
    death_year: -30,
    nationality: "Égyptienne",
    achievements: [
      { description: "Restauration de l'économie égyptienne" },
      { description: "Alliance avec Rome" },
      { description: "Préservation de l'indépendance égyptienne" },
    ],
  },
  {
    id: "napoleon-bonaparte",
    name: "Napoléon Bonaparte",
    period: "Révolution française et Empire (1769-1821)",
    short_description:
      "Général et empereur français qui a conquis la majeure partie de l'Europe au début du XIXe siècle.",
    portrait_url: "/images/historical-characters/napoleon.jpg",
    tags: [{ name: "guerre" }, { name: "politique" }, { name: "France" }],
    birth_year: 1769,
    death_year: 1821,
    nationality: "Français",
    achievements: [
      { description: "Code civil" },
      { description: "Réformes administratives" },
      { description: "Victoires militaires" },
      { description: "Concordat de 1801" },
    ],
  },
  // Autres personnages...
]

// Scénarios de dialogue de secours
export const fallbackScenarios: Record<string, DialogueScenario> = {
  "leonardo-da-vinci": {
    introduction:
      "Buongiorno! Je suis Leonardo da Vinci, artiste, inventeur et homme de science. Je suis ravi de partager avec vous mes connaissances sur l'art, la science et la période fascinante de la Renaissance. Que souhaitez-vous savoir?",
    responses: [
      {
        keywords: ["joconde", "mona lisa", "monalise", "portrait"],
        text: "Ah, La Gioconda! Ce portrait de Lisa Gherardini est l'une de mes œuvres les plus chères. J'ai travaillé sur cette peinture pendant des années, perfectionnant la technique du sfumato pour créer ces transitions douces entre les couleurs. Son sourire énigmatique continue de fasciner, n'est-ce pas?",
        mood: "happy",
        fact: "La Joconde a été peinte entre 1503 et 1506, mais Leonardo a continué à y travailler jusqu'à sa mort en 1519.",
      },
      // Autres réponses...
    ],
    defaultResponses: [
      "Voilà une question intéressante. Dans mes carnets, j'ai exploré de nombreux sujets, de l'anatomie à l'hydraulique, toujours guidé par l'observation directe de la nature.",
      // Autres réponses par défaut...
    ],
    quizIntroduction:
      "Vous semblez avoir un vif intérêt pour mon époque et mon travail! Permettez-moi de tester vos connaissances avec quelques questions sur la Renaissance et mes contributions.",
    quizzes: [
      {
        question:
          "Quelle technique picturale ai-je perfectionnée, caractérisée par des transitions douces entre les couleurs?",
        options: [
          { text: "Sfumato", isCorrect: true },
          { text: "Chiaroscuro", isCorrect: false },
          { text: "Trompe-l'œil", isCorrect: false },
          { text: "Pointillisme", isCorrect: false },
        ],
        correctResponse:
          "Excellent! Le sfumato, qui signifie 'évanoui comme la fumée' en italien, est une technique que j'ai perfectionnée pour créer des transitions douces entre les couleurs, sans lignes de contour visibles. C'est particulièrement visible dans le visage de La Joconde.",
        incorrectResponse:
          "Pas tout à fait. J'ai perfectionné le sfumato, une technique qui crée des transitions douces entre les couleurs, comme si elles s'évanouissaient comme la fumée. Le chiaroscuro concerne plutôt les contrastes marqués entre lumière et ombre.",
      },
      // Autres questions...
    ],
    conclusion:
      "Quel plaisir d'avoir pu partager avec vous mes connaissances et mes passions! La Renaissance était une époque extraordinaire où l'art et la science se nourrissaient mutuellement. J'espère vous avoir transmis un peu de l'émerveillement que j'ai ressenti en explorant les mystères de notre monde. Continuez à cultiver votre curiosité et votre créativité, car comme je l'ai toujours cru, 'L'apprentissage ne finit jamais'.",
  },
  // Autres scénarios...
}

/**
 * Récupère un personnage historique par son ID depuis les données de secours
 */
export function getFallbackCharacter(id: string): HistoricalCharacter | undefined {
  return fallbackCharacters.find((character) => character.id === id)
}

/**
 * Récupère un scénario de dialogue par l'ID du personnage depuis les données de secours
 */
export function getFallbackScenario(characterId: string): DialogueScenario | undefined {
  return fallbackScenarios[characterId]
}

