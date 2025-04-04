interface DialogueResponse {
  keywords: string[]
  text: string
  mood?: "neutral" | "happy" | "thinking" | "surprised"
  fact?: string
}

interface QuizItem {
  question: string
  options: { text: string; isCorrect: boolean }[]
  correctResponse: string
  incorrectResponse: string
}

interface DialogueScenario {
  introduction: string
  responses: DialogueResponse[]
  defaultResponses: string[]
  quizIntroduction: string
  quizzes: QuizItem[]
  conclusion: string
}

const dialogueScenarios: Record<string, DialogueScenario> = {
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
      {
        keywords: ["invention", "machine", "voler", "vol"],
        text: "Les machines volantes sont parmi mes inventions préférées! J'ai étudié le vol des oiseaux pendant des années, remplissant mes carnets de croquis de leurs ailes et mouvements. Mes designs d'ornithoptères étaient basés sur l'idée que l'homme pourrait voler en imitant les oiseaux. Bien sûr, la technologie de l'époque ne permettait pas de les construire efficacement.",
        mood: "thinking",
        fact: "Leonardo a conçu de nombreuses machines volantes, dont un parachute, un hélicoptère primitif et plusieurs ornithoptères, 400 ans avant les premiers vols humains réussis.",
      },
      {
        keywords: ["anatomie", "corps", "humain", "dissection"],
        text: "L'étude de l'anatomie humaine a été cruciale pour mon art et ma science. J'ai réalisé plus de 200 dessins anatomiques basés sur des dissections que j'ai personnellement effectuées. Comprendre la structure des muscles et des os m'a permis de représenter le corps humain avec une précision sans précédent dans mes peintures.",
        mood: "thinking",
        fact: "Leonardo a disséqué plus de 30 cadavres humains, créant des dessins anatomiques d'une précision remarquable qui n'ont été égalés qu'au 19ème siècle.",
      },
      {
        keywords: ["vitruve", "homme", "proportions"],
        text: "L'Homme de Vitruve représente les proportions idéales du corps humain, basées sur les écrits de l'architecte romain Vitruve. J'ai cherché à illustrer comment le corps humain s'inscrit parfaitement dans un cercle et un carré, symboles de l'harmonie cosmique. C'est une fusion de l'art et des mathématiques!",
        mood: "happy",
        fact: "L'Homme de Vitruve illustre les proportions parfaites du corps humain selon les théories de Vitruve: la hauteur d'un homme est égale à l'envergure de ses bras étendus.",
      },
      {
        keywords: ["cène", "dernier repas", "last supper"],
        text: "La Cène représente le moment où Jésus annonce à ses disciples que l'un d'eux le trahira. J'ai utilisé la perspective linéaire pour créer une profondeur saisissante, et j'ai tenté de capturer les émotions variées sur les visages des apôtres. Malheureusement, ma technique expérimentale sur mur sec s'est détériorée rapidement.",
        mood: "thinking",
        fact: "La Cène a été peinte sur un mur sec plutôt qu'en fresque traditionnelle, ce qui a causé sa détérioration rapide. La peinture a subi de nombreuses restaurations au fil des siècles.",
      },
      {
        keywords: ["miroir", "écriture", "inverse"],
        text: "Ah, mon écriture en miroir! C'est une habitude que j'ai développée pour protéger mes idées. J'écrivais de droite à gauche, et mes notes ne peuvent être lues qu'à l'aide d'un miroir. Certains pensent que c'était pour garder mes découvertes secrètes, d'autres que c'était simplement parce que je suis gaucher et cela évitait de tacher l'encre.",
        mood: "happy",
        fact: "Leonardo écrivait en écriture spéculaire (de droite à gauche), qui ne peut être lue facilement qu'avec un miroir. Il a rempli plus de 7,000 pages de notes dans ce style.",
      },
      {
        keywords: ["florence", "médicis", "italie", "renaissance"],
        text: "Florence était le cœur battant de la Renaissance! Sous le patronage des Médicis, les arts et les sciences ont connu un essor extraordinaire. J'ai eu la chance de travailler pour Laurent de Médicis et plus tard pour Ludovic Sforza à Milan. Cette période a vu renaître l'intérêt pour l'Antiquité classique et a encouragé l'innovation dans tous les domaines.",
        mood: "happy",
        fact: "La Renaissance italienne a débuté à Florence au 14ème siècle, largement soutenue par la famille Médicis qui a financé de nombreux artistes et intellectuels, dont Leonardo da Vinci.",
      },
    ],
    defaultResponses: [
      "Voilà une question intéressante. Dans mes carnets, j'ai exploré de nombreux sujets, de l'anatomie à l'hydraulique, toujours guidé par l'observation directe de la nature.",
      "Hmm, je ne suis pas certain de comprendre votre question. Peut-être pourriez-vous me demander quelque chose sur mes peintures, mes inventions ou mes études scientifiques?",
      "La curiosité est la clé de la connaissance! J'ai toujours cherché à comprendre les mécanismes qui régissent notre monde, que ce soit dans l'art ou la science.",
      "Permettez-moi de réfléchir à cela... À la Renaissance, nous avions une approche holistique du savoir, ne séparant pas l'art de la science comme vous le faites aujourd'hui.",
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
      {
        question: "Dans quelle ville italienne ai-je peint 'La Cène'?",
        options: [
          { text: "Florence", isCorrect: false },
          { text: "Rome", isCorrect: false },
          { text: "Milan", isCorrect: true },
          { text: "Venise", isCorrect: false },
        ],
        correctResponse:
          "Bravo! J'ai peint La Cène sur un mur du réfectoire du couvent de Santa Maria delle Grazie à Milan, alors que je travaillais pour Ludovic Sforza, duc de Milan.",
        incorrectResponse:
          "Ce n'est pas correct. J'ai peint La Cène à Milan, dans le réfectoire du couvent de Santa Maria delle Grazie, pendant que j'étais au service de Ludovic Sforza.",
      },
      {
        question: "Outre la peinture, dans quel autre domaine ai-je fait d'importantes contributions?",
        options: [
          { text: "Musique", isCorrect: false },
          { text: "Anatomie", isCorrect: true },
          { text: "Astronomie", isCorrect: false },
          { text: "Philosophie politique", isCorrect: false },
        ],
        correctResponse:
          "Tout à fait! Mes études anatomiques, basées sur la dissection de cadavres humains, ont grandement contribué à la compréhension du corps humain. J'ai réalisé plus de 200 dessins anatomiques d'une précision remarquable.",
        incorrectResponse:
          "Ce n'est pas exact. Bien que j'aie exploré de nombreux domaines, mes contributions à l'anatomie humaine ont été particulièrement significatives. J'ai disséqué de nombreux cadavres et créé des centaines de dessins anatomiques détaillés.",
      },
    ],
    conclusion:
      "Quel plaisir d'avoir pu partager avec vous mes connaissances et mes passions! La Renaissance était une époque extraordinaire où l'art et la science se nourrissaient mutuellement. J'espère vous avoir transmis un peu de l'émerveillement que j'ai ressenti en explorant les mystères de notre monde. Continuez à cultiver votre curiosité et votre créativité, car comme je l'ai toujours cru, 'L'apprentissage ne finit jamais'.",
  },
  cleopatra: {
    introduction:
      "Salutations! Je suis Cléopâtre VII Philopator, dernière souveraine de l'Égypte ptolémaïque. On me connaît pour mon intelligence, mon éducation et mes alliances stratégiques avec Rome. Que souhaitez-vous savoir sur mon règne ou sur l'Égypte ancienne?",
    responses: [
      {
        keywords: ["césar", "jules", "julius", "rome"],
        text: "Ma relation avec Jules César était autant politique que personnelle. Lorsqu'il est arrivé en Égypte en 48 avant votre ère, j'étais en conflit avec mon frère Ptolémée XIII pour le trône. César m'a aidée à reprendre le pouvoir, et nous avons eu un fils, Ptolémée XV, surnommé Césarion. Notre alliance a renforcé la position de l'Égypte face à Rome.",
        mood: "thinking",
        fact: "Cléopâtre a eu un fils avec Jules César, nommé Ptolémée XV César (Césarion), qui a brièvement régné comme dernier pharaon d'Égypte avant d'être exécuté sur ordre d'Octave.",
      },
      {
        keywords: ["antoine", "marc", "mark", "antony"],
        text: "Marc Antoine... Après l'assassinat de César, il est devenu mon plus grand allié et mon amant. Nous avons eu trois enfants ensemble et avons tenté de créer un empire oriental pour rivaliser avec Rome. Notre défaite à la bataille d'Actium face à Octave a scellé notre destin. Plutôt que d'être exhibée comme trophée dans un triomphe romain, j'ai choisi une fin digne d'une reine.",
        mood: "thinking",
        fact: "Cléopâtre et Marc Antoine ont formé une alliance politique et personnelle, ayant trois enfants ensemble. Leur défaite à la bataille d'Actium en 31 av. J.-C. a conduit à leur suicide et à l'annexion de l'Égypte par Rome.",
      },
      {
        keywords: ["langue", "parler", "égyptien", "grec"],
        text: "Contrairement à mes prédécesseurs ptolémaïques qui ne parlaient que le grec, j'ai appris la langue égyptienne. Je maîtrisais également l'éthiopien, l'hébreu, l'arabe, le syriaque, le mède, le parthe, et bien sûr le latin. Cette capacité à communiquer directement avec différents peuples était un atout diplomatique considérable.",
        mood: "happy",
        fact: "Cléopâtre était polyglotte et parlait neuf langues, dont l'égyptien ancien, ce qui était rare pour les souverains ptolémaïques qui étaient d'origine grecque et ne parlaient généralement que le grec.",
      },
      {
        keywords: ["asp", "serpent", "suicide", "mort"],
        text: "Ma mort? Les Romains prétendent que je me suis donné la mort en me faisant mordre par un aspic, un serpent venimeux. La vérité est peut-être moins romanesque, mais j'ai certainement choisi de mourir en reine plutôt que d'être humiliée par Octave dans les rues de Rome. La manière exacte reste un mystère que j'emporte avec moi.",
        mood: "thinking",
        fact: "Bien que la légende raconte que Cléopâtre se serait suicidée en se faisant mordre par un aspic (cobra égyptien), les historiens modernes suggèrent qu'elle aurait pu utiliser un poison, la méthode exacte de sa mort restant incertaine.",
      },
      {
        keywords: ["beauté", "apparence", "séduction"],
        text: "Ma prétendue beauté a été exagérée par les poètes et les dramaturges. Ce n'était pas mon apparence qui séduisait, mais mon esprit, mon éducation et mon charisme. Je parlais neuf langues, j'étais versée en mathématiques, astronomie, philosophie et diplomatie. Mon intelligence et ma présence étaient mes véritables atouts.",
        mood: "happy",
        fact: "Contrairement à sa représentation populaire, les pièces de monnaie contemporaines montrent Cléopâtre avec des traits prononcés et un nez aquilin, suggérant que c'était son intelligence et son charisme, plutôt qu'une beauté exceptionnelle, qui séduisaient.",
      },
      {
        keywords: ["alexandrie", "bibliothèque", "phare"],
        text: "Alexandrie était la joyau de mon royaume! Fondée par Alexandre le Grand, c'était la plus grande métropole du monde méditerranéen. Sa bibliothèque abritait des centaines de milliers de rouleaux de papyrus, et son phare, l'une des sept merveilles du monde, guidait les navires vers notre port. J'ai consacré beaucoup d'efforts à préserver et enrichir ce centre intellectuel.",
        mood: "happy",
        fact: "La Bibliothèque d'Alexandrie, sous le règne de Cléopâtre, contenait entre 400,000 et 700,000 rouleaux de papyrus, constituant la plus grande collection de savoirs du monde antique.",
      },
    ],
    defaultResponses: [
      "Voilà une question intéressante. En tant que pharaonne d'Égypte et descendante des Ptolémées, j'ai toujours cherché à préserver l'indépendance de mon royaume face à l'expansion romaine.",
      "Hmm, cette question mérite réflexion. L'Égypte de mon époque était un carrefour de cultures, mêlant traditions égyptiennes millénaires et influences hellénistiques.",
      "Permettez-moi de vous éclairer sur ce point. Mon règne a été marqué par des alliances stratégiques visant à maintenir l'Égypte comme puissance indépendante dans un monde dominé par Rome.",
      "Je ne suis pas certaine de comprendre votre question. Peut-être pourriez-vous m'interroger sur la politique égyptienne, mes relations avec Rome, ou la culture alexandrine?",
    ],
    quizIntroduction:
      "Vous semblez fasciné par l'Égypte ptolémaïque et mon règne! Permettez-moi de tester vos connaissances avec quelques questions sur cette période fascinante de l'histoire.",
    quizzes: [
      {
        question: "De quelle origine était la dynastie des Ptolémées qui a régné sur l'Égypte?",
        options: [
          { text: "Égyptienne", isCorrect: false },
          { text: "Perse", isCorrect: false },
          { text: "Grecque (Macédonienne)", isCorrect: true },
          { text: "Romaine", isCorrect: false },
        ],
        correctResponse:
          "Excellent! La dynastie des Ptolémées était d'origine grecque macédonienne, fondée par Ptolémée Ier, un général d'Alexandre le Grand. Nous avons maintenu notre culture grecque tout en adoptant certaines traditions égyptiennes pour légitimer notre règne.",
        incorrectResponse:
          "Ce n'est pas exact. La dynastie des Ptolémées, dont je suis issue, était d'origine grecque macédonienne. Mon ancêtre Ptolémée Ier était un général d'Alexandre le Grand qui a pris le contrôle de l'Égypte après sa mort.",
      },
      {
        question: "Quel dirigeant romain est devenu mon allié et amant après la mort de Jules César?",
        options: [
          { text: "Octave (Auguste)", isCorrect: false },
          { text: "Marc Antoine", isCorrect: true },
          { text: "Brutus", isCorrect: false },
          { text: "Pompée", isCorrect: false },
        ],
        correctResponse:
          "Tout à fait! Marc Antoine est devenu mon allié et amant après l'assassinat de César. Ensemble, nous avons tenté de créer un empire oriental pour contrebalancer le pouvoir de Rome, mais nous avons été vaincus par Octave à la bataille d'Actium.",
        incorrectResponse:
          "Non, ce n'est pas correct. Après la mort de César, c'est Marc Antoine qui est devenu mon allié et amant. Octave (plus tard nommé Auguste) était notre adversaire, qui nous a finalement vaincus.",
      },
      {
        question: "Quelle était la capitale de l'Égypte sous mon règne?",
        options: [
          { text: "Le Caire", isCorrect: false },
          { text: "Memphis", isCorrect: false },
          { text: "Thèbes", isCorrect: false },
          { text: "Alexandrie", isCorrect: true },
        ],
        correctResponse:
          "Parfait! Alexandrie était la capitale de l'Égypte ptolémaïque, fondée par Alexandre le Grand. C'était un centre culturel et intellectuel majeur, abritant la célèbre Bibliothèque et le Phare, l'une des sept merveilles du monde antique.",
        incorrectResponse:
          "Ce n'est pas exact. La capitale de l'Égypte sous mon règne était Alexandrie, fondée par Alexandre le Grand. C'était un centre culturel et commercial majeur du monde méditerranéen, et non Le Caire qui n'existait pas encore.",
      },
    ],
    conclusion:
      "Je vous remercie pour cet échange stimulant! Vous avez maintenant un aperçu de mon règne et des défis auxquels l'Égypte faisait face à cette époque charnière. Mon histoire a souvent été déformée par les récits romains et les interprétations ultérieures, me réduisant à une simple séductrice. La vérité est que j'étais avant tout une souveraine déterminée à préserver l'indépendance de mon royaume dans un monde en mutation. J'espère que notre conversation vous a permis de voir au-delà des mythes pour découvrir la femme politique et intellectuelle que j'étais réellement.",
  },
  // Autres personnages historiques...
}

export function getDialogueForCharacter(characterId: string): DialogueScenario {
  return (
    dialogueScenarios[characterId] || {
      introduction: "Bonjour, je suis heureux de pouvoir échanger avec vous sur mon époque et mes réalisations.",
      responses: [],
      defaultResponses: ["Je vous prie de m'excuser, mais je ne suis pas sûr de comprendre votre question."],
      quizIntroduction: "Testons vos connaissances avec quelques questions.",
      quizzes: [],
      conclusion: "Merci pour cette conversation enrichissante!",
    }
  )
}

