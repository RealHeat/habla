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
