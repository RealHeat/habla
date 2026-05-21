import {
  generateQuestionsPrompt,
  generateReflexivePrompt,
  generateStudyGuidePrompt,
  generateVocabPrompt,
  gradeAnswerPrompt,
} from "./prompts";
import type {
  Dialect,
  Feedback,
  GeneratedStudyGuide,
  LevelId,
  Question,
  ReflexiveExercise,
  VocabExercise,
} from "../types";

// Gemini 1.5 models were removed from v1beta in early 2026, so this chain
// targets the currently-supported families. Order: cheapest/fastest first.
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-2.5-pro",
];
const ENDPOINT_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export class AIError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "AIError";
    this.status = status;
  }
}

function explain429(rawMessage: string): string {
  // Detect the "free-tier limit: 0" pattern — region/model-restricted free tier.
  if (/limit:\s*0/i.test(rawMessage) && /free[_-]?tier/i.test(rawMessage)) {
    return (
      "All free-tier-eligible Gemini models returned 'limit: 0' for your project. " +
      "This usually means your region no longer covers free tier for Flash models. " +
      "Options: enable billing on your AI Studio project (you'll need a payment method) " +
      "or proxy the calls from a server in a supported region. " +
      "Details: https://ai.dev/rate-limit"
    );
  }
  return rawMessage;
}

type GeminiResponse = {
  candidates?: {
    content?: { parts?: { text?: string }[] };
    finishReason?: string;
  }[];
  error?: { message?: string };
};

const QUESTIONS_SCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          es: { type: "string" },
          en: { type: "string" },
        },
        required: ["es", "en"],
      },
    },
  },
  required: ["questions"],
};

const REFLEXIVE_SCHEMA = {
  type: "object",
  properties: {
    exercises: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sentence: { type: "string" },
          verb: { type: "string" },
          answer: { type: "string" },
          en: { type: "string" },
        },
        required: ["sentence", "verb", "answer", "en"],
      },
    },
  },
  required: ["exercises"],
};

const VOCAB_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          term: { type: "string" },
          translation: { type: "string" },
          partOfSpeech: { type: "string" },
          example: { type: "string" },
          exampleEn: { type: "string" },
          distractors: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["term", "translation", "distractors"],
      },
    },
  },
  required: ["items"],
};

const ES_EN_SCHEMA = {
  type: "object",
  properties: {
    es: { type: "string" },
    en: { type: "string" },
  },
  required: ["es", "en"],
};

const STUDY_GUIDE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    overview: { type: "string" },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          items: { type: "array", items: { type: "string" } },
        },
        required: ["title", "items"],
      },
    },
    vocab: { type: "array", items: ES_EN_SCHEMA },
    examples: { type: "array", items: ES_EN_SCHEMA },
    tips: { type: "array", items: { type: "string" } },
  },
  required: ["title", "overview", "sections", "vocab", "examples", "tips"],
};

const SEGMENT_SCHEMA = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["keep", "strike", "fix"] },
    t: { type: "string" },
  },
  required: ["type", "t"],
};

const FEEDBACK_SCHEMA = {
  type: "object",
  properties: {
    your: { type: "string" },
    strike: { type: "array", items: SEGMENT_SCHEMA },
    corrected: { type: "array", items: SEGMENT_SCHEMA },
    tips: { type: "array", items: { type: "string" } },
    rubric: {
      type: "object",
      properties: {
        grammar: { type: "integer" },
        vocab: { type: "integer" },
        fluency: { type: "integer" },
      },
      required: ["grammar", "vocab", "fluency"],
    },
    verdict: { type: "string", enum: ["ok", "part", "miss"] },
  },
  required: ["your", "strike", "corrected", "tips", "rubric", "verdict"],
};

async function tryModel<T>({
  model,
  apiKey,
  prompt,
  schema,
}: {
  model: string;
  apiKey: string;
  prompt: string;
  schema: object;
}): Promise<T> {
  const res = await fetch(
    `${ENDPOINT_BASE}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.7,
        },
      }),
    },
  );

  const data = (await res.json()) as GeminiResponse;

  if (!res.ok) {
    throw new AIError(data.error?.message || `Gemini error (${res.status})`, res.status);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new AIError("Gemini returned an empty response.");
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new AIError("Gemini returned malformed JSON.");
  }
}

async function callGemini<T>(args: {
  apiKey: string;
  prompt: string;
  schema: object;
}): Promise<T> {
  if (!args.apiKey) {
    throw new AIError("Missing Gemini API key. Add one in Settings.");
  }

  let lastError: AIError | null = null;
  for (const model of MODELS) {
    try {
      return await tryModel<T>({ model, ...args });
    } catch (e) {
      if (e instanceof AIError && (e.status === 429 || e.status === 404)) {
        lastError = e;
        continue; // model unavailable or quota exhausted — try next
      }
      throw e; // schema, network, auth, etc. — don't cascade
    }
  }

  throw new AIError(
    explain429(lastError?.message || "All Gemini models returned a quota error."),
    429,
  );
}

export async function generateQuestions(args: {
  apiKey: string;
  prompt: string;
  level: LevelId;
  dialect: Dialect;
  count: number;
}): Promise<Question[]> {
  const payload = await callGemini<{ questions: Question[] }>({
    apiKey: args.apiKey,
    prompt: generateQuestionsPrompt(args),
    schema: QUESTIONS_SCHEMA,
  });

  const qs = (payload.questions || []).filter((q) => q && q.es);
  if (qs.length === 0) {
    throw new AIError("Gemini didn't return any questions. Try a different topic.");
  }
  return qs.slice(0, args.count);
}

export async function generateReflexiveExercises(args: {
  apiKey: string;
  prompt: string;
  level: LevelId;
  dialect: Dialect;
  count: number;
}): Promise<ReflexiveExercise[]> {
  const payload = await callGemini<{ exercises: ReflexiveExercise[] }>({
    apiKey: args.apiKey,
    prompt: generateReflexivePrompt(args),
    schema: REFLEXIVE_SCHEMA,
  });

  const xs = (payload.exercises || []).filter(
    (x) => x && x.sentence && x.answer && x.verb && x.sentence.includes("____"),
  );
  if (xs.length === 0) {
    throw new AIError("Gemini didn't return any exercises. Try again or pick a different topic.");
  }
  return xs.slice(0, args.count);
}

export async function generateVocabExercises(args: {
  apiKey: string;
  prompt: string;
  level: LevelId;
  dialect: Dialect;
  count: number;
}): Promise<VocabExercise[]> {
  const payload = await callGemini<{ items: VocabExercise[] }>({
    apiKey: args.apiKey,
    prompt: generateVocabPrompt(args),
    schema: VOCAB_SCHEMA,
  });

  const items = (payload.items || [])
    .filter((x) => x && x.term && x.translation && Array.isArray(x.distractors))
    .map((x) => ({
      ...x,
      distractors: x.distractors.filter((d) => d && d !== x.translation).slice(0, 3),
    }))
    .filter((x) => x.distractors.length >= 3);

  if (items.length === 0) {
    throw new AIError("Gemini didn't return any vocabulary. Try again or pick a different topic.");
  }
  return items.slice(0, args.count);
}

export async function generateStudyGuide(args: {
  apiKey: string;
  notes: string;
  level: LevelId;
  dialect: Dialect;
}): Promise<GeneratedStudyGuide> {
  const guide = await callGemini<GeneratedStudyGuide>({
    apiKey: args.apiKey,
    prompt: generateStudyGuidePrompt(args),
    schema: STUDY_GUIDE_SCHEMA,
  });

  const sections = (guide.sections || [])
    .filter((s) => s && s.title && Array.isArray(s.items) && s.items.length > 0)
    .map((s) => ({ title: s.title, items: s.items.filter(Boolean) }));

  if (!guide.overview || sections.length === 0) {
    throw new AIError("Gemini didn't return a usable study guide. Try adding more detail.");
  }

  return {
    title: guide.title || "Study guide",
    overview: guide.overview,
    sections,
    vocab: (guide.vocab || []).filter((v) => v && v.es && v.en),
    examples: (guide.examples || []).filter((e) => e && e.es && e.en),
    tips: (guide.tips || []).filter(Boolean),
  };
}

export async function gradeAnswer(args: {
  apiKey: string;
  question: string;
  answer: string;
  level: LevelId;
  dialect: Dialect;
}): Promise<Feedback> {
  const fb = await callGemini<Feedback>({
    apiKey: args.apiKey,
    prompt: gradeAnswerPrompt(args),
    schema: FEEDBACK_SCHEMA,
  });

  // Ensure shape sanity in case the model omits something.
  return {
    your: fb.your || args.answer,
    strike: Array.isArray(fb.strike) && fb.strike.length > 0 ? fb.strike : [{ type: "keep", t: args.answer }],
    corrected:
      Array.isArray(fb.corrected) && fb.corrected.length > 0
        ? fb.corrected
        : [{ type: "keep", t: args.answer }],
    tips: Array.isArray(fb.tips) ? fb.tips.slice(0, 4) : [],
    rubric: {
      grammar: clamp05(fb.rubric?.grammar),
      vocab: clamp05(fb.rubric?.vocab),
      fluency: clamp05(fb.rubric?.fluency),
    },
    verdict: fb.verdict === "ok" || fb.verdict === "miss" ? fb.verdict : "part",
  };
}

function clamp05(n: unknown): number {
  const v = typeof n === "number" ? n : 0;
  return Math.max(0, Math.min(5, Math.round(v)));
}
