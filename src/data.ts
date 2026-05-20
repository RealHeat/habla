import type { Feedback, Level, Question, Session, Suggestion } from "./types";

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
