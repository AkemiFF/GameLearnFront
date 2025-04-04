export interface HistoricalCharacter {
  id: string
  name: string
  period: string
  shortDescription: string
  portraitUrl: string
  tags: string[]
  birthYear: number
  deathYear: number | null
  nationality: string
  achievements: string[]
}

export const historicalCharacters: HistoricalCharacter[] = [
  {
    id: "leonardo-da-vinci",
    name: "Léonard de Vinci",
    period: "Renaissance (1452-1519)",
    shortDescription:
      "Artiste, inventeur et scientifique polymathe italien, considéré comme l'archétype de l'homme de la Renaissance.",
    portraitUrl: "/images/historical-characters/leonardo-da-vinci.jpg",
    tags: ["art", "science", "invention"],
    birthYear: 1452,
    deathYear: 1519,
    nationality: "Italien",
    achievements: ["La Joconde", "La Cène", "L'Homme de Vitruve", "Codex Atlanticus"],
  },
  {
    id: "cleopatra",
    name: "Cléopâtre VII",
    period: "Égypte ptolémaïque (69-30 av. J.-C.)",
    shortDescription:
      "Dernière souveraine active de l'Égypte ptolémaïque, célèbre pour ses relations avec Jules César et Marc Antoine.",
    portraitUrl: "/images/historical-characters/cleopatra.jpg",
    tags: ["politique", "Égypte", "antiquité"],
    birthYear: -69,
    deathYear: -30,
    nationality: "Égyptienne",
    achievements: [
      "Restauration de l'économie égyptienne",
      "Alliance avec Rome",
      "Préservation de l'indépendance égyptienne",
    ],
  },
  {
    id: "napoleon-bonaparte",
    name: "Napoléon Bonaparte",
    period: "Révolution française et Empire (1769-1821)",
    shortDescription:
      "Général et empereur français qui a conquis la majeure partie de l'Europe au début du XIXe siècle.",
    portraitUrl: "/images/historical-characters/napoleon.jpg",
    tags: ["guerre", "politique", "France"],
    birthYear: 1769,
    deathYear: 1821,
    nationality: "Français",
    achievements: ["Code civil", "Réformes administratives", "Victoires militaires", "Concordat de 1801"],
  },
  {
    id: "marie-curie",
    name: "Marie Curie",
    period: "Ère moderne (1867-1934)",
    shortDescription:
      "Physicienne et chimiste polonaise naturalisée française, pionnière dans l'étude de la radioactivité.",
    portraitUrl: "/images/historical-characters/marie-curie.jpg",
    tags: ["science", "physique", "chimie"],
    birthYear: 1867,
    deathYear: 1934,
    nationality: "Polonaise/Française",
    achievements: [
      "Découverte du polonium et du radium",
      "Deux prix Nobel (physique et chimie)",
      "Développement de la radiologie mobile",
    ],
  },
  {
    id: "mahatma-gandhi",
    name: "Mahatma Gandhi",
    period: "Ère contemporaine (1869-1948)",
    shortDescription: "Leader politique et spirituel indien qui a mené l'Inde à l'indépendance par la non-violence.",
    portraitUrl: "/images/historical-characters/gandhi.jpg",
    tags: ["politique", "paix", "Inde"],
    birthYear: 1869,
    deathYear: 1948,
    nationality: "Indien",
    achievements: ["Mouvement d'indépendance indien", "Satyagraha (résistance non-violente)", "Marche du sel"],
  },
  {
    id: "joan-of-arc",
    name: "Jeanne d'Arc",
    period: "Moyen Âge (1412-1431)",
    shortDescription: "Héroïne française de la guerre de Cent Ans, canonisée comme sainte patronne de la France.",
    portraitUrl: "/images/historical-characters/joan-of-arc.jpg",
    tags: ["guerre", "religion", "France"],
    birthYear: 1412,
    deathYear: 1431,
    nationality: "Française",
    achievements: ["Siège d'Orléans", "Sacre de Charles VII", "Symbole de la résistance française"],
  },
]

