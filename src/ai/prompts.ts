import { LEVELS } from "../data";
import type { Dialect, LevelId } from "../types";

function levelName(id: LevelId) {
  return LEVELS.find((l) => l.id === id)?.name || "Spanish 3";
}

function dialectName(d: Dialect) {
  return d === "es" ? "European (Castellano)" : "Latin American";
}

export function generateQuestionsPrompt({
  prompt,
  level,
  dialect,
  count,
}: {
  prompt: string;
  level: LevelId;
  dialect: Dialect;
  count: number;
}): string {
  return [
    `You are a Spanish teacher generating conversation practice questions for a US high school student at the ${levelName(level)} level.`,
    `Use ${dialectName(dialect)} Spanish. Produce EXACTLY ${count} questions.`,
    `Calibrate complexity, tense, and vocabulary to the level. Vary the questions — different angles and verb tenses.`,
    `Each question must have an "es" field (Spanish) and an "en" field (English translation).`,
    ``,
    `Topic or list from the student:`,
    `"""`,
    prompt,
    `"""`,
  ].join("\n");
}

export function generateReflexivePrompt({
  prompt,
  level,
  dialect,
  count,
}: {
  prompt: string;
  level: LevelId;
  dialect: Dialect;
  count: number;
}): string {
  const topicLine = prompt.trim()
    ? `Focus the exercises on this topic / set of verbs: """${prompt}"""`
    : `No topic provided — pick a varied mix of the most common reflexive verbs for this level (e.g. despertarse, levantarse, ducharse, vestirse, lavarse, cepillarse, peinarse, sentarse, acostarse, dormirse, divertirse, enojarse, sentirse, ponerse, irse, quitarse).`;

  return [
    `You are a Spanish teacher generating REFLEXIVE-VERB fill-in-the-blank exercises for a US high school student at the ${levelName(level)} level.`,
    `Use ${dialectName(dialect)} Spanish. Produce EXACTLY ${count} exercises. Vary the subject pronouns (yo, tú, él/ella, nosotros, vosotros/ustedes, ellos) — don't always use "yo".`,
    `Calibrate tense to the level: ES 1 = present indicative only. ES 2 = present + preterite + imperfect. ES 3+ = also include the subjunctive, commands, or compound tenses where natural.`,
    ``,
    topicLine,
    ``,
    `Each exercise must have:`,
    `- "sentence": a Spanish sentence with a blank written as exactly four underscores: "____" — the blank stands in for the conjugated reflexive verb PLUS its reflexive pronoun (e.g. "me lavo", "se durmió"). Only one blank per sentence.`,
    `- "verb": the infinitive form including -se (e.g. "despertarse", "lavarse").`,
    `- "answer": the exact string that fills the blank — pronoun + conjugated verb, lowercase, no surrounding punctuation. E.g. "me despierto", "se durmieron", "nos vestimos".`,
    `- "en": a short English translation of the FULL completed sentence.`,
    ``,
    `Make sure "sentence" with the blank replaced by "answer" reads as natural, grammatical Spanish. Don't put the pronoun outside the blank.`,
  ].join("\n");
}

export function generateVocabPrompt({
  prompt,
  level,
  dialect,
  count,
}: {
  prompt: string;
  level: LevelId;
  dialect: Dialect;
  count: number;
}): string {
  const topicLine = prompt.trim()
    ? `Build the vocabulary list around this topic / theme / list: """${prompt}"""`
    : `No topic provided — pick a varied mix of useful, level-appropriate vocabulary (nouns, verbs, adjectives, and a few common expressions).`;

  return [
    `You are a Spanish teacher generating a VOCABULARY list for a US high school student at the ${levelName(level)} level.`,
    `Use ${dialectName(dialect)} Spanish. Produce EXACTLY ${count} vocabulary items.`,
    `Calibrate difficulty to the level. Avoid trivially obvious cognates (e.g. "animal" → "animal") unless absolutely necessary.`,
    `If the student provides a list of specific words, use those words verbatim as the "term" values.`,
    ``,
    topicLine,
    ``,
    `Each item must have:`,
    `- "term": the Spanish word or short phrase being taught (lowercase unless it's a proper noun). Include any reflexive -se or article if it clarifies gender (e.g. "el agua", "ducharse").`,
    `- "translation": a concise English translation. If multiple meanings exist, give the most common one for this level.`,
    `- "partOfSpeech": one of "noun", "verb", "adjective", "adverb", "expression", "preposition", "conjunction".`,
    `- "example": a short Spanish sentence (6–14 words) that uses the term naturally.`,
    `- "exampleEn": the English translation of that example sentence.`,
    `- "distractors": EXACTLY 3 plausible-but-WRONG English translations for multiple-choice. They must be different from each other and from the correct translation. Pick distractors that are the same part of speech and roughly the same difficulty — close enough to make the student think, not random unrelated words.`,
    ``,
    `Make sure every "term" is unique within the list.`,
  ].join("\n");
}

export function generateStudyGuidePrompt({
  notes,
  level,
  dialect,
}: {
  notes: string;
  level: LevelId;
  dialect: Dialect;
}): string {
  return [
    `You are a Spanish teacher turning a student's raw material into a structured study guide.`,
    `The student is at the ${levelName(level)} level and uses ${dialectName(dialect)} Spanish.`,
    `Calibrate explanations to their level — define unfamiliar grammar terms, but don't over-explain basics they already know.`,
    ``,
    `Read the material below and produce a study guide in JSON with these fields:`,
    `- "title": a short, descriptive title for this study guide (4–8 words).`,
    `- "overview": 2–4 sentences summarizing what this material covers and what the student should walk away knowing.`,
    `- "sections": 3–6 thematic sections. Each section has a "title" (e.g. "Key grammar", "Verb conjugations", "Cultural context", "Common mistakes") and an "items" array of 3–8 concise bullet points. Prefer concrete rules and patterns over abstract description.`,
    `- "vocab": 6–14 important vocabulary items from the material. Each is {"es": "...", "en": "..."}. Use the form that appears in the material (lowercase unless proper noun).`,
    `- "examples": 3–6 example Spanish sentences that illustrate the most important grammar or vocabulary from the material. Each is {"es": "...", "en": "..."}.`,
    `- "tips": 2–5 short study tips or memory aids ("notice that…", "watch out for…", "remember the trigger…").`,
    ``,
    `Rules:`,
    `- Base every section, vocab item, example, and tip on the material the student provided. Do NOT invent unrelated content.`,
    `- If the material is in English (e.g. textbook notes), translate Spanish examples and vocab to use ${dialectName(dialect)} forms.`,
    `- If the material is sparse or off-topic, still produce a usable guide focused on what is there; mention in the overview that the source was brief.`,
    `- Keep bullets tight. No filler like "this is important" — just the rule, pattern, or fact.`,
    ``,
    `Material:`,
    `"""`,
    notes,
    `"""`,
  ].join("\n");
}

export function gradeAnswerPrompt({
  question,
  answer,
  level,
  dialect,
}: {
  question: string;
  answer: string;
  level: LevelId;
  dialect: Dialect;
}): string {
  return [
    `You are a kind, precise Spanish teacher grading a ${levelName(level)} student's answer.`,
    `The student is using ${dialectName(dialect)} Spanish. Be calibrated to their level — don't over-penalize for advanced grammar they haven't learned.`,
    ``,
    `Identify grammatical mistakes (accents, conjugations, prepositions, gender agreement), word-choice issues, and naturalness.`,
    ``,
    `Return JSON matching this schema. Omit no fields.`,
    `- "your": the student's original answer, unchanged.`,
    `- "strike": the student's answer split into segments. Mark wrong tokens with type "strike", untouched runs with type "keep". Do NOT use "fix" in this array.`,
    `- "corrected": the corrected sentence split into segments. Use "fix" for the replacement tokens that fix mistakes, "keep" for everything else. Do NOT use "strike" in this array.`,
    `- Both "strike" and "corrected" must reconstruct readable sentences when you concatenate their "t" fields in order. Keep whitespace inside the segments.`,
    `- "tips": 1–4 short, specific suggestions. Mention concrete rules (e.g. "Use 'jugar al' before sports").`,
    `- "rubric.grammar", "rubric.vocab", "rubric.fluency": integers 0–5.`,
    `- "verdict": "ok" if essentially correct, "part" if minor errors, "miss" if meaning is wrong or the answer is empty/irrelevant.`,
    ``,
    `If the answer is already correct, "strike" and "corrected" can both be a single keep segment.`,
    ``,
    `Question (Spanish): ${question}`,
    `Student's answer: ${answer || "(empty)"}`,
  ].join("\n");
}
