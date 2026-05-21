import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { I } from "../icons";
import { AIError, generateVocabExercises } from "../ai/gemini";
import { LEVELS } from "../data";
import type { Dialect, LevelId, VocabExercise, VocabFormat } from "../types";

type Props = {
  apiKey: string;
  level: LevelId;
  dialect: Dialect;
  onNeedKey: () => void;
};

type Stage = "setup" | "practice" | "done";
type Attempt = {
  item: VocabExercise;
  given: string;
  correct: boolean;
  format: VocabFormat;
};

const DIACRITIC_RE = /[̀-ͯ]/g;
const PUNCT_RE = /[¿?¡!.,;:"]/g;

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
  const g = normalize(given);
  if (!g) return false;
  // Allow comma- or slash-separated alternatives in the answer.
  const candidates = answer
    .split(/[,/]/)
    .map((s) => normalize(s.replace(/\b(to|a|an|the)\b/g, "")))
    .filter(Boolean);
  const guess = g.replace(/\b(to|a|an|the)\b/g, "").trim();
  return candidates.some((c) => c === guess);
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const out = arr.slice();
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

type FormatToggleProps = { value: VocabFormat; onChange: (f: VocabFormat) => void };

function FormatToggle({ value, onChange }: FormatToggleProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<{ left: number; width: number }>({ left: 3, width: 0 });

  useLayoutEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const btn = t.querySelector<HTMLButtonElement>(`button[data-key="${value}"]`);
    if (!btn) return;
    const r = t.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setDims({ left: br.left - r.left, width: br.width });
  }, [value]);

  return (
    <div className="mode-toggle" ref={trackRef}>
      <div className="mt-thumb" style={{ left: dims.left, width: dims.width }} />
      <button data-key="mc" data-on={value === "mc" ? "1" : "0"} onClick={() => onChange("mc")}>
        <I.Check size={13} /> Multiple choice
      </button>
      <button
        data-key="free"
        data-on={value === "free" ? "1" : "0"}
        onClick={() => onChange("free")}
      >
        <I.Keyboard size={13} /> Free response
      </button>
    </div>
  );
}

export function Vocab({ apiKey, level, dialect, onNeedKey }: Props) {
  const [stage, setStage] = useState<Stage>("setup");
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(8);
  const [format, setFormat] = useState<VocabFormat>("mc");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<VocabExercise[]>([]);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const levelLabel = LEVELS.find((l) => l.id === level)?.code || "ES";
  const current = items[idx];

  // Stable shuffle of MC options per question (re-shuffles only when idx/item changes).
  const options = useMemo(() => {
    if (!current) return [];
    const all = [current.translation, ...current.distractors];
    return shuffle(all, idx + 1);
  }, [current, idx]);

  const onGenerate = async () => {
    if (!apiKey) {
      onNeedKey();
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const xs = await generateVocabExercises({
        apiKey,
        prompt,
        level,
        dialect,
        count,
      });
      setItems(xs);
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

  const submitMC = (choice: string) => {
    if (!current || revealed) return;
    const correct = isCorrect(choice, current.translation);
    setRevealed(true);
    setAttempts((prev) => [...prev, { item: current, given: choice, correct, format: "mc" }]);
  };

  const submitFree = () => {
    if (!current || !input.trim()) return;
    const correct = isCorrect(input, current.translation);
    setRevealed(true);
    setAttempts((prev) => [...prev, { item: current, given: input, correct, format: "free" }]);
  };

  const onNext = () => {
    if (idx + 1 < items.length) {
      setIdx(idx + 1);
      setInput("");
      setRevealed(false);
    } else {
      setStage("done");
    }
  };

  const onAgain = () => {
    setStage("setup");
    setItems([]);
    setAttempts([]);
    setInput("");
    setRevealed(false);
    setIdx(0);
  };

  if (stage === "setup") {
    return (
      <div className="shell narrow fade-in" data-screen-label="Vocabulary">
        <div className="eyebrow">
          <span className="dot" /> Vocabulary drill
        </div>
        <h2 className="section mt-12">Build a vocabulary list</h2>
        <p className="lead mt-12">
          Give a topic, theme, or paste a list of Spanish words you want to learn. We'll generate
          a vocabulary set you can quiz yourself on — pick multiple choice or free response, and
          flip between them anytime.
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
              Add a free Gemini API key in Settings to generate vocabulary.
            </div>
            <button className="btn primary" onClick={onNeedKey}>
              Open Settings
            </button>
          </div>
        )}

        <div className="prompt-wrap mt-24">
          <textarea
            className="prompt-area"
            placeholder="Optional — e.g. 'kitchen vocabulary', 'words about emotions', or paste a list: 'cocina, fregadero, nevera, horno...'"
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

        <div className="row mt-24 gap-16" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
          <div className="col" style={{ flex: 1, minWidth: 260 }}>
            <div className="eyebrow">Number of words</div>
            <div className="row gap-8 mt-8">
              {[6, 8, 10, 15, 20].map((n) => (
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
          <div className="col" style={{ minWidth: 260 }}>
            <div className="eyebrow">Answer format</div>
            <div className="mt-8">
              <FormatToggle value={format} onChange={setFormat} />
            </div>
            <div className="muted mt-8" style={{ fontSize: 12.5 }}>
              {format === "mc"
                ? "Pick the correct English meaning from four options."
                : "Type the English meaning. We accept minor spelling and accent slips."}
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
                <I.Spark size={15} /> Generate vocabulary
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
      <div className="shell fade-in" data-screen-label="Vocab practice">
        <div className="spread">
          <div className="row gap-12">
            <span className="chip">
              <span className="dot" /> {levelLabel}
            </span>
            <span className="chip">
              <I.Globe size={11} style={{ opacity: 0.6 }} />{" "}
              {dialect === "es" ? "Castellano" : "Latinoamericano"}
            </span>
            <span className="chip">Vocabulary</span>
          </div>
          <div className="row gap-12" style={{ alignItems: "center" }}>
            <FormatToggle
              value={format}
              onChange={(f) => {
                if (revealed) return;
                setFormat(f);
                setInput("");
              }}
            />
            <span className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
              {String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="progress mt-16">
          {items.map((_, i) => (
            <i key={i} data-state={i < idx ? "done" : i === idx ? "cur" : "todo"} />
          ))}
        </div>

        <div className="q-card mt-24">
          <div className="q-card-eyebrow">
            <span className="eyebrow">
              <span className="dot" /> What does this mean?
            </span>
            {current.partOfSpeech && (
              <span className="muted" style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}>
                {current.partOfSpeech}
              </span>
            )}
          </div>
          <h2 className="q-card-q" style={{ lineHeight: 1.3 }}>
            {current.term}
          </h2>
          {revealed && current.example && (
            <div className="q-card-en" style={{ marginTop: 10 }}>
              <em>{current.example}</em>
              {current.exampleEn && (
                <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>
                  {current.exampleEn}
                </div>
              )}
            </div>
          )}
        </div>

        {!revealed && format === "mc" && (
          <div
            className="mt-24"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {options.map((opt) => (
              <button
                key={opt}
                className="btn"
                style={{
                  justifyContent: "flex-start",
                  padding: "14px 18px",
                  fontSize: 15,
                  textAlign: "left",
                  background: "var(--bg-elev)",
                }}
                onClick={() => submitMC(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {!revealed && format === "free" && (
          <div className="mt-24">
            <input
              className="reflex-input"
              autoFocus
              placeholder="English meaning…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  e.preventDefault();
                  submitFree();
                }
              }}
            />
            <div className="row mt-12" style={{ justifyContent: "space-between" }}>
              <button className="btn ghost" onClick={() => setInput("")}>
                Clear
              </button>
              <button className="btn primary" disabled={!input.trim()} onClick={submitFree}>
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
                  <span className={`verdict ${lastAttempt.correct ? "ok" : "miss"}`}>
                    {lastAttempt.correct ? "Correct" : "Not quite"}
                  </span>
                </div>
                <div className="fb-body">
                  <span className={lastAttempt.correct ? "keep" : "strike"}>
                    {lastAttempt.given || "—"}
                  </span>
                </div>
              </div>
              <div className="fb-block corrected">
                <div className="spread">
                  <span className="fb-label">Translation</span>
                  <span className="verdict ok">{current.term}</span>
                </div>
                <div className="fb-body">
                  <span className="fix">{current.translation}</span>
                </div>
              </div>
            </div>

            <div className="row mt-24" style={{ justifyContent: "flex-end" }}>
              <button className="btn primary lg" onClick={onNext}>
                {idx + 1 < items.length ? (
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

  const correctCount = attempts.filter((a) => a.correct).length;
  const total = attempts.length;
  const pct = total ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="shell narrow fade-in" data-screen-label="Vocab results">
      <div className="eyebrow">
        <span className="dot" /> Drill complete
      </div>
      <h2 className="section mt-12">
        {correctCount} / {total} correct
      </h2>
      <p className="lead mt-12">
        {pct >= 80
          ? "Strong recall — these words are sticking."
          : pct >= 50
            ? "Decent run. Review the misses and try another round to lock them in."
            : "These need more reps. Look over the answers and run it again."}
      </p>

      <div className="mt-24" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {attempts.map((a, i) => (
          <div
            key={i}
            className="card"
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <div className="spread">
              <span className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
                {String(i + 1).padStart(2, "0")} · {a.item.term}
                {a.item.partOfSpeech ? ` · ${a.item.partOfSpeech}` : ""}
              </span>
              <span className={`verdict ${a.correct ? "ok" : "miss"}`}>
                {a.correct ? "Correct" : "Missed"}
              </span>
            </div>
            <div style={{ fontSize: 15 }}>
              <span className="keep">{a.item.translation}</span>
            </div>
            {!a.correct && (
              <div className="muted" style={{ fontSize: 13 }}>
                You answered: <span className="strike">{a.given || "—"}</span>
              </div>
            )}
            {a.item.example && (
              <div className="muted" style={{ fontSize: 12.5 }}>
                <em>{a.item.example}</em>
                {a.item.exampleEn && <> — {a.item.exampleEn}</>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="row mt-32" style={{ justifyContent: "flex-end" }}>
        <button className="btn primary lg" onClick={onAgain}>
          <I.Spark size={15} /> New list
        </button>
      </div>
    </div>
  );
}
