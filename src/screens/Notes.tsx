import { useState } from "react";
import { I } from "../icons";
import { AIError, generateStudyGuide } from "../ai/gemini";
import { LEVELS } from "../data";
import type { Dialect, GeneratedStudyGuide, LevelId } from "../types";

type Props = {
  apiKey: string;
  level: LevelId;
  dialect: Dialect;
  onNeedKey: () => void;
};

type Stage = "setup" | "done";

const MIN_CHARS = 40;

export function Notes({ apiKey, level, dialect, onNeedKey }: Props) {
  const [stage, setStage] = useState<Stage>("setup");
  const [notes, setNotes] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guide, setGuide] = useState<GeneratedStudyGuide | null>(null);

  const levelLabel = LEVELS.find((l) => l.id === level)?.code || "ES";

  const onGenerate = async () => {
    if (!apiKey) {
      onNeedKey();
      return;
    }
    if (notes.trim().length < MIN_CHARS) {
      setError(`Paste at least ${MIN_CHARS} characters of material so we have something to work with.`);
      return;
    }
    setGenerating(true);
    setError(null);
    try {
      const g = await generateStudyGuide({ apiKey, notes, level, dialect });
      setGuide(g);
      setStage("done");
    } catch (e) {
      setError(e instanceof AIError ? e.message : "Couldn't reach Gemini. Check your network.");
    } finally {
      setGenerating(false);
    }
  };

  const onAgain = () => {
    setStage("setup");
    setGuide(null);
    setError(null);
  };

  if (stage === "setup") {
    return (
      <div className="shell narrow fade-in" data-screen-label="Notes to guide">
        <div className="eyebrow">
          <span className="dot" /> Notes → Study guide
        </div>
        <h2 className="section mt-12">Turn your notes into a study guide</h2>
        <p className="lead mt-12">
          Paste class notes, a textbook section, a chapter summary, or any Spanish material.
          We'll structure it into a study guide with key grammar, vocabulary, examples, and tips —
          calibrated to your level.
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
              Add a free Gemini API key in Settings to generate study guides.
            </div>
            <button className="btn primary" onClick={onNeedKey}>
              Open Settings
            </button>
          </div>
        )}

        <div className="prompt-wrap mt-24">
          <textarea
            className="prompt-area"
            style={{ minHeight: 260 }}
            placeholder={
              "Paste anything — class notes, a textbook section, vocab lists, a chapter reading.\n\nExample:\nUnit 4 covers the preterite vs. imperfect. Preterite is used for completed actions, imperfect for ongoing/habitual. Trigger words: ayer, anoche, una vez vs. siempre, todos los días, mientras..."
            }
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="prompt-foot">
            <button className="prompt-pill" onClick={() => setNotes("")}>
              <I.X size={12} /> Clear
            </button>
            <div className="prompt-count">{notes.length} chars</div>
          </div>
        </div>

        <div className="row mt-16 gap-12" style={{ alignItems: "center" }}>
          <span className="chip">
            <span className="dot" /> {levelLabel}
          </span>
          <span className="chip">
            <I.Globe size={11} style={{ opacity: 0.6 }} />{" "}
            {dialect === "es" ? "Castellano" : "Latinoamericano"}
          </span>
          <span className="muted" style={{ fontSize: 12 }}>
            Level &amp; dialect come from Settings.
          </span>
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
          <button
            className="btn primary lg"
            disabled={generating || notes.trim().length < MIN_CHARS}
            onClick={onGenerate}
          >
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
                Building guide…
              </>
            ) : (
              <>
                <I.Spark size={15} /> Generate study guide
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (!guide) return null;

  return (
    <div className="shell fade-in" data-screen-label="Generated study guide">
      <div className="spread">
        <div className="row gap-12">
          <span className="chip">
            <span className="dot" /> {levelLabel}
          </span>
          <span className="chip">
            <I.Globe size={11} style={{ opacity: 0.6 }} />{" "}
            {dialect === "es" ? "Castellano" : "Latinoamericano"}
          </span>
          <span className="chip">Generated</span>
        </div>
        <button className="btn" onClick={onAgain}>
          <I.Spark size={13} /> New guide
        </button>
      </div>

      <div className="eyebrow mt-16">Study guide</div>
      <h2 className="section mt-12">{guide.title}</h2>
      <p className="lead mt-12">{guide.overview}</p>

      <div
        className="mt-24"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {guide.sections.map((sec, i) => (
          <div
            key={i}
            className="card"
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <div className="row gap-8" style={{ alignItems: "center" }}>
              <I.Doc size={14} stroke="var(--accent)" />
              <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{sec.title}</h4>
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                color: "var(--text-2)",
                fontSize: 13.5,
                lineHeight: 1.5,
              }}
            >
              {sec.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {guide.vocab.length > 0 && (
        <div className="mt-24">
          <div className="eyebrow">Vocabulary</div>
          <div
            className="mt-12"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 10,
            }}
          >
            {guide.vocab.map((v, i) => (
              <div
                key={i}
                className="card"
                style={{ display: "flex", flexDirection: "column", gap: 2, padding: "12px 14px" }}
              >
                <div style={{ fontSize: 14.5, color: "var(--text)" }}>{v.es}</div>
                <div className="muted" style={{ fontSize: 12.5 }}>{v.en}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {guide.examples.length > 0 && (
        <div className="mt-24">
          <div className="eyebrow">Example sentences</div>
          <div className="mt-12" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {guide.examples.map((ex, i) => (
              <div
                key={i}
                className="card"
                style={{ display: "flex", flexDirection: "column", gap: 4 }}
              >
                <div style={{ fontSize: 15, color: "var(--text)" }}>{ex.es}</div>
                <div className="muted" style={{ fontSize: 12.5 }}>{ex.en}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {guide.tips.length > 0 && (
        <div className="mt-24">
          <div className="eyebrow">Study tips</div>
          <ul
            className="mt-12"
            style={{
              margin: 0,
              paddingLeft: 18,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              color: "var(--text-2)",
              fontSize: 14,
              lineHeight: 1.55,
            }}
          >
            {guide.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="row mt-32" style={{ justifyContent: "flex-end" }}>
        <button className="btn primary lg" onClick={onAgain}>
          <I.Spark size={15} /> New guide
        </button>
      </div>
    </div>
  );
}
