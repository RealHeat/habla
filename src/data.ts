import type { Feedback, Level, LevelId, Question, Session, Suggestion } from "./types";

export type GuideSection = {
  title: string;
  items: string[];
};

export type LevelGuide = {
  level: LevelId;
  summary: string;
  sections: GuideSection[];
  examples: { es: string; en: string }[];
};

export const LEVEL_GUIDES: LevelGuide[] = [
  {
    level: "s1",
    summary:
      "First-year Spanish. The goal is to introduce yourself, describe people and things around you, and talk about what's happening right now.",
    sections: [
      {
        title: "Core grammar",
        items: [
          "Subject pronouns (yo, tú, él/ella, nosotros, vosotros/ustedes, ellos)",
          "Present indicative of regular -ar, -er, -ir verbs",
          "ser vs. estar (basics: identity & traits vs. location & feelings)",
          "tener and tener expressions (tener hambre, sed, sueño, frío, calor)",
          "Definite & indefinite articles (el/la/los/las, un/una/unos/unas)",
          "Gender and number agreement of adjectives",
          "Basic question words (qué, quién, dónde, cuándo, cómo, por qué)",
          "Numbers 0–100, days, months, telling time",
          "Common irregular verbs: ir, ver, hacer, dar, ir + a + infinitive (near future)",
        ],
      },
      {
        title: "Vocabulary themes",
        items: [
          "Greetings & introductions",
          "Family members and descriptions",
          "School: subjects, supplies, schedule",
          "Foods, drinks, ordering at a restaurant",
          "Clothing and colors",
          "Weather and seasons",
        ],
      },
      {
        title: "What to practice",
        items: [
          "Saying your age, where you're from, what you study",
          "Describing what you and others look and feel like",
          "Talking about what you do every day in the present",
          "Using ir + a + infinitive to talk about plans",
        ],
      },
    ],
    examples: [
      { es: "Me llamo Ana y soy de México.", en: "My name is Ana and I'm from Mexico." },
      { es: "Tengo dieciséis años y estudio en la secundaria.", en: "I'm sixteen and I study in high school." },
      { es: "Voy a comer con mi familia esta noche.", en: "I'm going to eat with my family tonight." },
    ],
  },
  {
    level: "s2",
    summary:
      "Second-year Spanish. You start narrating in the past, talking about routines, and describing how things used to be.",
    sections: [
      {
        title: "Core grammar",
        items: [
          "Stem-changing verbs (e→ie, o→ue, e→i)",
          "Reflexive verbs and pronouns (levantarse, ducharse, vestirse)",
          "Preterite tense (regular + key irregulars: ir/ser, hacer, tener, estar, decir)",
          "Imperfect tense (regular + ir, ser, ver)",
          "Preterite vs. imperfect — completed actions vs. ongoing / habitual / background",
          "Direct and indirect object pronouns (me, te, lo/la, le, nos, los/las, les)",
          "gustar-style verbs (encantar, interesar, molestar, faltar)",
          "Comparatives and superlatives (más/menos… que, el más… de)",
          "Affirmative tú commands (basic)",
        ],
      },
      {
        title: "Vocabulary themes",
        items: [
          "Daily routines and chores",
          "House, rooms, furniture",
          "City: places, directions, transportation",
          "Sports, hobbies, free time",
          "Travel and vacations",
          "Health and the body",
        ],
      },
      {
        title: "What to practice",
        items: [
          "Telling a story about something that happened (preterite)",
          "Describing what life used to be like (imperfect)",
          "Talking about your routine using reflexive verbs",
          "Expressing opinions with me gusta / me encanta + noun or infinitive",
        ],
      },
    ],
    examples: [
      { es: "Ayer me levanté tarde y perdí el autobús.", en: "Yesterday I got up late and missed the bus." },
      { es: "Cuando era niño, jugaba al fútbol todos los días.", en: "When I was a kid, I used to play soccer every day." },
      { es: "A mi hermana le encanta la música pop.", en: "My sister loves pop music." },
    ],
  },
  {
    level: "s3",
    summary:
      "Third-year Spanish. You move beyond facts into opinion, emotion, and uncertainty — the gateway to the subjunctive.",
    sections: [
      {
        title: "Core grammar",
        items: [
          "Present subjunctive — formation and triggers (WEIRDO: wishes, emotion, impersonal, recommendations, doubt, ojalá)",
          "Subjunctive after que with verbs of influence (querer que, recomendar que)",
          "Future tense (regular + irregular stems: tendr-, podr-, sabr-, har-, dir-, querr-)",
          "Conditional tense (regular + same irregular stems)",
          "Present perfect (he comido, has visto) and past participles as adjectives",
          "Por vs. para",
          "Relative pronouns (que, quien, lo que, cuyo)",
          "Affirmative & negative commands (tú, usted, ustedes, nosotros)",
          "Double object pronouns (se lo, se la)",
        ],
      },
      {
        title: "Vocabulary themes",
        items: [
          "Environment and current issues",
          "Technology and social media",
          "Work, professions, future plans",
          "Relationships and emotions",
          "Cultural practices and holidays in the Spanish-speaking world",
        ],
      },
      {
        title: "What to practice",
        items: [
          "Giving recommendations and advice (recomiendo que… + subjunctive)",
          "Expressing doubt or hope (dudo que…, ojalá que…)",
          "Talking about what you would do in a situation (conditional)",
          "Narrating with mixed preterite, imperfect, and present perfect",
        ],
      },
    ],
    examples: [
      { es: "Es importante que estudies todos los días.", en: "It's important that you study every day." },
      { es: "Si tuviera tiempo, viajaría a Argentina.", en: "If I had time, I would travel to Argentina." },
      { es: "He visto esa película tres veces.", en: "I've seen that movie three times." },
    ],
  },
  {
    level: "s4",
    summary:
      "Fourth-year Spanish. You handle longer narration, hypotheticals, and cultural topics with more nuance.",
    sections: [
      {
        title: "Core grammar",
        items: [
          "Imperfect subjunctive (hablara/hablase, fuera, tuviera) and triggers",
          "Si clauses: Si + imperfect subjunctive, + conditional (Si tuviera, iría)",
          "Pluperfect (había hablado) and pluperfect subjunctive (hubiera hablado)",
          "Conditional perfect (habría hablado) for hypothetical past",
          "Passive voice with ser + past participle, and passive se",
          "Subjunctive in adjective clauses (Busco a alguien que sepa…)",
          "Subjunctive in adverbial clauses (cuando, hasta que, en cuanto, antes de que)",
          "More nuanced uses of por / para and ser / estar",
        ],
      },
      {
        title: "Vocabulary themes",
        items: [
          "Identity: ethnicity, nationality, heritage",
          "Immigration and migration stories",
          "Art, music, literature of the Spanish-speaking world",
          "Politics and civic engagement (introductory)",
          "Global issues: climate, inequality, education",
        ],
      },
      {
        title: "What to practice",
        items: [
          "Telling longer stories that switch between past tenses smoothly",
          "Talking about what would have happened (Si hubiera… habría…)",
          "Expressing nuanced opinions on cultural topics",
          "Reading short literary texts and articles and discussing them",
        ],
      },
    ],
    examples: [
      { es: "Si hubiera estudiado más, habría sacado mejor nota.", en: "If I had studied more, I would have gotten a better grade." },
      { es: "Busco un libro que trate de la inmigración.", en: "I'm looking for a book that deals with immigration." },
      { es: "Cuando llegues, llámame.", en: "When you arrive, call me." },
    ],
  },
  {
    level: "ap",
    summary:
      "AP Spanish Language and Culture. Focus is on the six AP themes, formal writing, persuasive speaking, and cultural comparison.",
    sections: [
      {
        title: "The six AP themes",
        items: [
          "Las identidades personales y públicas",
          "Las familias y las comunidades",
          "La belleza y la estética",
          "La ciencia y la tecnología",
          "La vida contemporánea",
          "Los desafíos mundiales",
        ],
      },
      {
        title: "Grammar — full review with confident control",
        items: [
          "All indicative tenses (present, preterite, imperfect, future, conditional, present perfect, pluperfect)",
          "All subjunctive tenses and their triggers — fluent use, not just recognition",
          "Si clauses across all three time frames",
          "Reported speech (Dijo que iba…)",
          "Connectors for formal writing: sin embargo, por lo tanto, además, en cuanto a, a pesar de que",
        ],
      },
      {
        title: "Exam tasks to drill",
        items: [
          "Email reply — formal register, address the prompt, ask a follow-up question",
          "Persuasive essay — synthesize an article, audio source, and chart; cite all three; take a clear stance",
          "Conversation — respond appropriately in 20 seconds with a complete thought",
          "Cultural comparison — 2-minute oral presentation comparing your community with a Spanish-speaking one",
        ],
      },
      {
        title: "What to practice",
        items: [
          "Formal vs. informal register switching",
          "Citing sources in writing (según la fuente uno…, el gráfico muestra…)",
          "Defending a position with evidence and counterargument",
          "Pronunciation, pacing, and self-correction in spoken responses",
        ],
      },
    ],
    examples: [
      {
        es: "Según la fuente número uno, la mayoría de los jóvenes considera que las redes sociales han transformado la comunicación.",
        en: "According to source one, most young people consider that social media has transformed communication.",
      },
      {
        es: "A pesar de que existen ventajas, es fundamental que reconozcamos los desafíos.",
        en: "Although there are advantages, it's essential that we recognize the challenges.",
      },
      {
        es: "En mi comunidad, a diferencia de la cultura mexicana, no celebramos el Día de los Muertos de la misma manera.",
        en: "In my community, unlike Mexican culture, we don't celebrate the Day of the Dead the same way.",
      },
    ],
  },
  {
    level: "ib",
    summary:
      "IB Spanish B / Heritage. Advanced register, idiomatic speech, and analysis of authentic texts across cultural contexts.",
    sections: [
      {
        title: "Core skills",
        items: [
          "Advanced subjunctive (sequence of tenses, subjunctive after impersonal expressions, indefinite/negative antecedents)",
          "Distinguishing close synonyms (saber vs. conocer, pedir vs. preguntar, llevar vs. traer, quedar vs. quedarse)",
          "Idiomatic expressions and refranes",
          "Voseo, leísmo, and major dialectal differences (Caribbean, Rioplatense, Andean, Castilian)",
          "Register: coloquial, neutro, formal, académico",
        ],
      },
      {
        title: "IB themes",
        items: [
          "Identidades",
          "Experiencias",
          "Ingenio humano",
          "Organización social",
          "Compartiendo el planeta",
        ],
      },
      {
        title: "Text types to produce",
        items: [
          "Blog post / diario personal",
          "Carta formal e informal",
          "Artículo de opinión",
          "Discurso / presentación oral",
          "Entrevista, reseña, folleto",
        ],
      },
      {
        title: "What to practice",
        items: [
          "Analyzing tone, audience, and purpose of authentic texts",
          "Matching text type conventions (greeting, register, structure)",
          "Comparing cultural perspectives across the Spanish-speaking world",
          "Spontaneous interaction in the individual oral",
        ],
      },
    ],
    examples: [
      {
        es: "No hay mal que por bien no venga — siempre hay algo que aprender de las dificultades.",
        en: "Every cloud has a silver lining — there's always something to learn from hardship.",
      },
      {
        es: "El autor sostiene que la migración no es un problema, sino una oportunidad para enriquecer la sociedad.",
        en: "The author argues that migration isn't a problem but an opportunity to enrich society.",
      },
      {
        es: "Che, ¿vos sabés a qué hora arranca la reunión?",
        en: "Hey, do you know what time the meeting starts? (Rioplatense)",
      },
    ],
  },
];

export const LEVELS: Level[] = [
  { id: "s1", code: "ES 1", name: "Spanish 1", desc: "Present tense, greetings, basic vocab.", progress: 0.9 },
  { id: "s2", code: "ES 2", name: "Spanish 2", desc: "Preterite, imperfect, daily routines.", progress: 0.6 },
  { id: "s3", code: "ES 3", name: "Spanish 3", desc: "Subjunctive intro, opinions, narration.", progress: 0.2 },
  { id: "s4", code: "ES 4", name: "Spanish 4", desc: "Complex narration, cultural topics.", progress: 0 },
  { id: "ap", code: "AP", name: "AP Spanish", desc: "Persuasive essays, cultural comparison.", progress: 0 },
  { id: "ib", code: "IB", name: "IB / Heritage", desc: "Advanced register, idiomatic speech.", progress: 0 },
];

export const SUGGESTIONS: Suggestion[] = [
  { icon: "Coffee", label: "Order at a café in Madrid", prompt: "Practice ordering breakfast at a café in Madrid. Ask about the menu, modify an order, and pay." },
  { icon: "School", label: "Talk about your school day", prompt: "Describe your typical school day: classes, teachers, what you like and don't like." },
  { icon: "Family", label: "Introduce your family", prompt: "Introduce three family members. Describe their personality and what they do for work." },
  { icon: "Globe", label: "Plan a weekend trip", prompt: "Plan a weekend trip to Mexico City with a friend. Discuss transport, lodging, and activities." },
];

export const SAMPLE_QUESTIONS: Question[] = [
  { es: "¿Qué te gusta hacer los fines de semana?", en: "What do you like to do on weekends?" },
  { es: "Describe a tu mejor amigo. ¿Cómo es?", en: "Describe your best friend. What are they like?" },
  { es: "¿Adónde fuiste de vacaciones el verano pasado?", en: "Where did you go on vacation last summer?" },
  { es: "Si pudieras viajar a cualquier país hispanohablante, ¿adónde irías y por qué?", en: "If you could travel to any Spanish-speaking country, where would you go and why?" },
  { es: "¿Cuál es tu materia favorita en la escuela y por qué te gusta?", en: "What is your favorite school subject and why do you like it?" },
  { es: "Cuéntame sobre una comida tradicional de tu familia.", en: "Tell me about a traditional meal in your family." },
];

export const DEMO_FEEDBACK: Feedback[] = [
  {
    your: "Me gusta jugar futbol y mirar peliculas con mis amigos.",
    corrected: [
      { type: "keep", t: "Me gusta jugar " },
      { type: "fix", t: "al fútbol" },
      { type: "keep", t: " y " },
      { type: "fix", t: "ver" },
      { type: "keep", t: " películas con mis amigos." },
    ],
    strike: [
      { type: "keep", t: "Me gusta jugar " },
      { type: "strike", t: "futbol" },
      { type: "keep", t: " y " },
      { type: "strike", t: "mirar" },
      { type: "keep", t: " peliculas con mis amigos." },
    ],
    tips: [
      'Use "jugar al" before sports — "jugar al fútbol," "jugar al tenis."',
      '"Ver películas" is the standard verb for watching movies. "Mirar" works for staring at something.',
      "Don't forget accent marks: fútbol, películas.",
    ],
    rubric: { grammar: 3, vocab: 4, fluency: 4 },
    verdict: "part",
  },
  {
    your: "Mi mejor amigo se llama Diego. Es muy divertido y alto.",
    corrected: [{ type: "keep", t: "Mi mejor amigo se llama Diego. Es muy divertido y alto." }],
    strike: [{ type: "keep", t: "Mi mejor amigo se llama Diego. Es muy divertido y alto." }],
    tips: [
      "Nicely done — clean and natural.",
      'Try adding one more detail: "…y siempre me hace reír."',
    ],
    rubric: { grammar: 5, vocab: 4, fluency: 5 },
    verdict: "ok",
  },
];

export const SESSIONS: Session[] = [
  { id: "ses_8a", date: "May 18, 2026", time: "4:12 PM", title: "Café en Madrid", level: "ES 3", questions: 8, score: 86, verdict: "good", duration: "11 min" },
  { id: "ses_7b", date: "May 16, 2026", time: "8:40 PM", title: "Mi rutina diaria", level: "ES 2", questions: 6, score: 92, verdict: "good", duration: "7 min" },
  { id: "ses_6c", date: "May 14, 2026", time: "5:55 PM", title: "AP — Identidad cultural", level: "AP", questions: 10, score: 71, verdict: "mid", duration: "18 min" },
  { id: "ses_5d", date: "May 12, 2026", time: "7:02 PM", title: "Familia y descripciones", level: "ES 2", questions: 6, score: 88, verdict: "good", duration: "9 min" },
  { id: "ses_4e", date: "May 09, 2026", time: "3:18 PM", title: "Subjuntivo — opiniones", level: "ES 3", questions: 7, score: 64, verdict: "mid", duration: "14 min" },
  { id: "ses_3f", date: "May 07, 2026", time: "9:24 PM", title: "Pretérito vs imperfecto", level: "ES 3", questions: 8, score: 58, verdict: "bad", duration: "16 min" },
];

export const FAKE_TRANSCRIPTS = [
  "Me gusta jugar futbol y mirar peliculas con mis amigos los fines de semana...",
  "Mi mejor amigo se llama Diego. Es muy divertido y alto...",
  "El verano pasado fui a Costa Rica con mi familia, lo pasamos increible...",
];
