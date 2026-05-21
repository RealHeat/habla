export type LevelId = "s1" | "s2" | "s3" | "s4" | "ap" | "ib";
export type Dialect = "la" | "es";
export type Mode = "voice" | "text";
export type Verdict = "ok" | "part" | "miss";
export type SessionVerdict = "good" | "mid" | "bad";

export type Route =
  | "home"
  | "level"
  | "prompt"
  | "review"
  | "practice"
  | "summary"
  | "history"
  | "settings"
  | "reflexive"
  | "vocab"
  | "notes"
  | "guide";

export type ReflexiveExercise = {
  sentence: string;
  verb: string;
  answer: string;
  en?: string;
};

export type VocabFormat = "mc" | "free";

export type StudyGuideSection = {
  title: string;
  items: string[];
};

export type GeneratedStudyGuide = {
  title: string;
  overview: string;
  sections: StudyGuideSection[];
  vocab: { es: string; en: string }[];
  examples: { es: string; en: string }[];
  tips: string[];
};

export type VocabExercise = {
  term: string;
  translation: string;
  partOfSpeech?: string;
  example?: string;
  exampleEn?: string;
  distractors: string[];
};

export type Settings = {
  apiKey: string;
  dialect: Dialect;
  level: LevelId;
  mode: Mode;
  userName: string;
};

export type StoredSession = Session & {
  promptText: string;
  answers: Answer[];
};

export type Level = {
  id: LevelId;
  code: string;
  name: string;
  desc: string;
  progress: number;
};

export type Suggestion = {
  icon: IconKey;
  label: string;
  prompt: string;
};

export type Question = { es: string; en?: string };

export type Segment = { type: "keep" | "strike" | "fix"; t: string };

export type Feedback = {
  your: string;
  corrected: Segment[];
  strike: Segment[];
  tips: string[];
  rubric: { grammar: number; vocab: number; fluency: number };
  verdict: Verdict;
};

export type Answer = { q: string; a: string; fb: Feedback };

export type Session = {
  id: string;
  date: string;
  time: string;
  title: string;
  level: string;
  questions: number;
  score: number;
  verdict: SessionVerdict;
  duration: string;
};

export type IconKey =
  | "Home"
  | "Spark"
  | "Level"
  | "Play"
  | "Check"
  | "X"
  | "Trash"
  | "Edit"
  | "Plus"
  | "Mic"
  | "Keyboard"
  | "Send"
  | "Arrow"
  | "ArrowL"
  | "History"
  | "Doc"
  | "Coffee"
  | "Globe"
  | "Family"
  | "School"
  | "Pause"
  | "Stop"
  | "Chev"
  | "Sparkle"
  | "Bolt"
  | "Flame"
  | "Settings"
  | "Star";
