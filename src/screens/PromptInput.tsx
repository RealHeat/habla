import { useState } from "react";
import { I } from "../icons";
import { SUGGESTIONS } from "../data";
import { AIError, generateQuestions } from "../ai/gemini";
import type { Dialect, LevelId, Question } from "../types";

type Props = {
  initial: string;
  apiKey: string;
  level: LevelId;
  dialect: Dialect;
  onBack: () => void;
  onGenerate: (result: { prompt: string; questions: Question[] }) => void;
  onNeedKey: () => void;
};

export function PromptInput({
  initial,
  apiKey,
  level,
  dialect,
  onBack,
  onGenerate,
  onNeedKey,
}: Props) {
  const [text, setText] = useState(initial || "");
  const [count, setCount] = useState(6);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGo = async () => {
    if (!text.trim()) return;
    if (!apiKey) {
      onNeedKey();
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const questions = await generateQuestions({
        apiKey,
        prompt: text,
        level,
        dialect,
        count,
      });
      onGenerate({ prompt: text, questions });
    } catch (e) {
      setError(e instanceof AIError ? e.message : "Couldn't reach Gemini. Check your network.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="shell narrow fade-in" data-screen-label="03 Prompt">
      <div className="eyebrow">Step 2 of 3 · Topic</div>
      <h2 className="section mt-12">What do you want to talk about?</h2>
      <p className="lead mt-12">
        Paste a list of questions, or describe a topic. We'll generate {count} questions tuned to
        your level.
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
            Add a free Gemini API key in Settings to start generating questions.
          </div>
          <button className="btn primary" onClick={onNeedKey}>
            Open Settings
          </button>
        </div>
      )}

      <div className="prompt-wrap mt-24">
        <textarea
          className="prompt-area"
          placeholder="e.g. Describe a memorable trip you took with your family — where you went, what you did, what surprised you, what you'd do differently…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="prompt-foot">
          <button className="prompt-pill" onClick={() => setText(SUGGESTIONS[0].prompt)}>
            <I.Sparkle size={12} /> Example
          </button>
          <button className="prompt-pill" onClick={() => setText("")}>
            <I.X size={12} /> Clear
          </button>
          <div className="prompt-count">{text.length} chars</div>
        </div>
      </div>

      <div className="row mt-24 gap-16">
        <div className="col" style={{ flex: 1 }}>
          <div className="eyebrow">Number of questions</div>
          <div className="row gap-8 mt-8">
            {[4, 6, 8, 10, 12].map((n) => (
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
          <div style={{ flex: 1, fontSize: 13.5, color: "var(--text)" }}>{error}</div>
          <button className="btn" onClick={onGo}>
            Retry
          </button>
        </div>
      )}

      <div className="row mt-32" style={{ justifyContent: "space-between" }}>
        <button className="btn ghost" onClick={onBack}>
          <I.ArrowL size={14} /> Back
        </button>
        <button className="btn primary lg" disabled={!text.trim() || generating} onClick={onGo}>
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
              Generating questions…
            </>
          ) : (
            <>
              <I.Spark size={15} /> Generate questions
            </>
          )}
        </button>
      </div>
    </div>
  );
}
