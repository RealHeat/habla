import { useState } from "react";
import { I } from "../icons";
import { AIError, generateReflexiveExercises } from "../ai/gemini";
import { LEVELS } from "../data";
import type { Dialect, LevelId, ReflexiveExercise } from "../types";

type Props = {
  apiKey: string;
  level: LevelId;
  dialect: Dialect;
  onNeedKey: () => void;
};

type Stage = "setup" | "practice" | "done";
type Attempt = { exercise: ReflexiveExercise; given: string; correct: boolean };

const DIACRITIC_RE = /[̀-ͯ]/g;
const PUNCT_RE = /[¿?¡!.,;:]/g;

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITIC_RE, "")
    .replace(PUNCT_RE, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isCorrect(given: string, answer: string): boolean {
  return normalize(given) === normalize(answer);
}

function renderSentence(sentence: string, filled: string | null): React.ReactNode {
  const parts = sentence.split("____");
  return parts.flatMap((part, i) => {
    const nodes: React.ReactNode[] = [<span key={`p${i}`}>{part}</span>];
    if (i < parts.length - 1) {
      nodes.push(
        <span key={`b${i}`} className="reflex-slot">
          {filled || "____"}
        </span>,
      );
    }
    return nodes;
  });
}

export function Reflexive({ apiKey, level, dialect, onNeedKey }: Props) {
  const [stage, setStage] = useState<Stage>("setup");
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(6);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<ReflexiveExercise[]>([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const levelLabel = LEVELS.find((l) => l.id === level)?.code || "ES";

  const onGenerate = async () => {
    if (!apiKey) {
      onNeedKey();
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const xs = await generateReflexiveExercises({
        apiKey,
        prompt,
        level,
        dialect,
        count,
      });
      setExercises(xs);
      setIdx(0);
      setInput("");
      setRevealed(false);
      setAttempts([]);
      setStage("practice");
    } catch (e) {
      setError(e instanceof AIError ? e.message : "Couldn't reach Gemini. Check your network.");
    } finally {
      setGenerating(false);
    }
  };

  const current = exercises[idx];

  const onCheck = () => {
    if (!current || !input.trim()) return;
    const correct = isCorrect(input, current.answer);
    setRevealed(true);
    setAttempts((prev) => [...prev, { exercise: current, given: input, correct }]);
  };

  const onNext = () => {
    if (idx + 1 < exercises.length) {
      setIdx(idx + 1);
      setInput("");
      setRevealed(false);
    } else {
      setStage("done");
    }
  };

  const onAgain = () => {
    setStage("setup");
    setExercises([]);
    setAttempts([]);
    setInput("");
    setRevealed(false);
    setIdx(0);
  };

  if (stage === "setup") {
    return (
      <div className="shell narrow fade-in" data-screen-label="Reflexive verbs">
        <div className="eyebrow">
          <span className="dot" /> Grammar drill
        </div>
        <h2 className="section mt-12">Practice reflexive verbs</h2>
        <p className="lead mt-12">
          Fill in the blank with the correct reflexive pronoun + conjugated verb. Add a topic to
          focus on (morning routines, getting angry, vacations…) or leave it blank and we'll mix
          common verbs at your level.
        </p>

        {!apiKey && (
          <div
            className="card mt-16"
            style={{
              background: "var(--accent-soft-2)",
              borderColor: "color-mix(in oklab, var(--accent) 50%, var(--border))",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <I.Sparkle size={16} stroke="var(--accent)" />
            <div style={{ flex: 1, fontSize: 13.5 }}>
              Add a free Gemini API key in Settings to generate exercises.
            </div>
            <button className="btn primary" onClick={onNeedKey}>
              Open Settings
            </button>
          </div>
        )}

        <div className="prompt-wrap mt-24">
          <textarea
            className="prompt-area"
            placeholder="Optional — e.g. 'morning routine verbs', 'verbs about feelings', 'preterite reflexives'…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="prompt-foot">
            <button className="prompt-pill" onClick={() => setPrompt("")}>
              <I.X size={12} /> Clear
            </button>
            <div className="prompt-count">{prompt.length} chars</div>
          </div>
        </div>

        <div className="row mt-24 gap-16">
          <div className="col" style={{ flex: 1 }}>
            <div className="eyebrow">Number of exercises</div>
            <div className="row gap-8 mt-8">
              {[5, 8, 10, 15, 20].map((n) => (
                <button
                  key={n}
                  className="btn"
                  style={{
                    padding: "8px 14px",
                    background: count === n ? "var(--accent-soft)" : "var(--bg-elev)",
                    borderColor: count === n ? "var(--accent)" : "var(--border)",
                    color: count === n ? "var(--text)" : "var(--text-2)",
                  }}
                  onClick={() => setCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div
            className="card mt-16"
            style={{
              background: "var(--bad-soft)",
              borderColor: "color-mix(in oklab, var(--bad) 50%, var(--border))",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <I.X size={14} stroke="var(--bad)" />
            <div style={{ flex: 1, fontSize: 13.5 }}>{error}</div>
            <button className="btn" onClick={onGenerate}>
              Retry
            </button>
          </div>
        )}

        <div className="row mt-32" style={{ justifyContent: "flex-end" }}>
          <button className="btn primary lg" disabled={generating} onClick={onGenerate}>
            {generating ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: "1.5px solid var(--accent-ink)",
                    borderTopColor: "transparent",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Generating…
              </>
            ) : (
              <>
                <I.Spark size={15} /> Generate exercises
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (stage === "practice" && current) {
    const lastAttempt = revealed ? attempts[attempts.length - 1] : null;
    return (
      <div className="shell fade-in" data-screen-label="Reflexive practice">
        <div className="spread">
          <div className="row gap-12">
            <span className="chip">
              <span className="dot" /> {levelLabel}
            </span>
            <span className="chip">
              <I.Globe size={11} style={{ opacity: 0.6 }} />{" "}
              {dialect === "es" ? "Castellano" : "Latinoamericano"}
            </span>
            <span className="chip">Reflexive verbs</span>
          </div>
          <span className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
            {String(idx + 1).padStart(2, "0")} / {String(exercises.length).padStart(2, "0")}
          </span>
        </div>

        <div className="progress mt-16">
          {exercises.map((_, i) => (
            <i key={i} data-state={i < idx ? "done" : i === idx ? "cur" : "todo"} />
          ))}
        </div>

        <div className="q-card mt-24">
          <div className="q-card-eyebrow">
            <span className="eyebrow">
              <span className="dot" /> Fill in the blank
            </span>
            <span className="muted" style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}>
              Verb: <strong style={{ color: "var(--text)" }}>{current.verb}</strong>
            </span>
          </div>
          <h2 className="q-card-q" style={{ lineHeight: 1.4 }}>
            {renderSentence(current.sentence, revealed ? current.answer : null)}
          </h2>
          {current.en && <div className="q-card-en">{current.en}</div>}
        </div>

        {!revealed && (
          <div className="mt-24">
            <input
              className="reflex-input"
              autoFocus
              placeholder="pronoun + conjugated verb (e.g. me despierto)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  e.preventDefault();
                  onCheck();
                }
              }}
            />
            <div className="row mt-12" style={{ justifyContent: "space-between" }}>
              <button className="btn ghost" onClick={() => setInput("")}>
                Clear
              </button>
              <button className="btn primary" disabled={!input.trim()} onClick={onCheck}>
                <I.Check size={13} /> Check{" "}
                <span className="kbd" style={{ marginLeft: 6 }}>
                  ↵
                </span>
              </button>
            </div>
          </div>
        )}

        {revealed && lastAttempt && (
          <div className="fade-in mt-24">
            <div className="fb-grid">
              <div className="fb-block your">
                <div className="spread">
                  <span className="fb-label">Your answer</span>
                  <span
                    className={`verdict ${lastAttempt.correct ? "ok" : "miss"}`}
                  >
                    {lastAttempt.correct ? "Correct" : "Not quite"}
                  </span>
                </div>
                <div className="fb-body">
                  <span className={lastAttempt.correct ? "keep" : "strike"}>
                    {lastAttempt.given}
                  </span>
                </div>
              </div>
              <div className="fb-block corrected">
                <div className="spread">
                  <span className="fb-label">Answer</span>
                  <span className="verdict ok">{current.verb}</span>
                </div>
                <div className="fb-body">
                  <span className="fix">{current.answer}</span>
                </div>
              </div>
            </div>

            <div className="row mt-24" style={{ justifyContent: "flex-end" }}>
              <button className="btn primary lg" onClick={onNext}>
                {idx + 1 < exercises.length ? (
                  <>
                    Next <I.Arrow size={14} />
                  </>
                ) : (
                  <>
                    See results <I.Arrow size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Done summary
  const correctCount = attempts.filter((a) => a.correct).length;
  const total = attempts.length;
  const pct = total ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="shell narrow fade-in" data-screen-label="Reflexive results">
      <div className="eyebrow">
        <span className="dot" /> Drill complete
      </div>
      <h2 className="section mt-12">
        {correctCount} / {total} correct
      </h2>
      <p className="lead mt-12">
        {pct >= 80
          ? "Nicely done — those reflexives are sticking."
          : pct >= 50
            ? "Solid attempt. Review the misses below and try another round."
            : "These take repetition. Look over the answers and run it again."}
      </p>

      <div className="mt-24" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {attempts.map((a, i) => (
          <div key={i} className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="spread">
              <span className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
                {String(i + 1).padStart(2, "0")} · {a.exercise.verb}
              </span>
              <span className={`verdict ${a.correct ? "ok" : "miss"}`}>
                {a.correct ? "Correct" : "Missed"}
              </span>
            </div>
            <div style={{ fontSize: 15 }}>
              {renderSentence(a.exercise.sentence, a.exercise.answer)}
            </div>
            {!a.correct && (
              <div className="muted" style={{ fontSize: 13 }}>
                You wrote: <span className="strike">{a.given || "—"}</span>
              </div>
            )}
            {a.exercise.en && (
              <div className="muted" style={{ fontSize: 12.5 }}>{a.exercise.en}</div>
            )}
          </div>
        ))}
      </div>

      <div className="row mt-32" style={{ justifyContent: "flex-end" }}>
        <button className="btn primary lg" onClick={onAgain}>
          <I.Spark size={15} /> New drill
        </button>
      </div>
    </div>
  );
}
