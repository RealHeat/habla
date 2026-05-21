import { useState } from "react";
import { I } from "../icons";
import { LEVELS, LEVEL_GUIDES } from "../data";
import type { LevelId } from "../types";

type Props = {
  initialLevel: LevelId;
};

export function Guide({ initialLevel }: Props) {
  const [active, setActive] = useState<LevelId>(initialLevel);

  const guide = LEVEL_GUIDES.find((g) => g.level === active) || LEVEL_GUIDES[0];
  const meta = LEVELS.find((l) => l.id === guide.level)!;

  return (
    <div className="shell fade-in" data-screen-label="Study guide">
      <div className="eyebrow">
        <span className="dot" /> Reference
      </div>
      <h2 className="section mt-12">Study guide</h2>
      <p className="lead mt-12">
        A snapshot of what each Spanish level covers — grammar, vocabulary themes, and what to focus
        on. Pick a level to dive in.
      </p>

      <div className="row mt-24 gap-8" style={{ flexWrap: "wrap" }}>
        {LEVELS.map((lv) => {
          const on = active === lv.id;
          return (
            <button
              key={lv.id}
              className="btn"
              style={{
                padding: "8px 14px",
                background: on ? "var(--accent-soft)" : "var(--bg-elev)",
                borderColor: on ? "var(--accent)" : "var(--border)",
                color: on ? "var(--text)" : "var(--text-2)",
              }}
              onClick={() => setActive(lv.id)}
            >
              {lv.code}
            </button>
          );
        })}
      </div>

      <div className="card mt-24" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="spread">
          <div>
            <div className="eyebrow">{meta.code}</div>
            <h3 style={{ margin: "6px 0 0", fontSize: 22, fontWeight: 600 }}>{meta.name}</h3>
          </div>
          <span className="chip">
            <I.School size={11} style={{ opacity: 0.6 }} /> {meta.code}
          </span>
        </div>
        <p style={{ margin: 0, color: "var(--text-2)", fontSize: 14.5, lineHeight: 1.55 }}>
          {guide.summary}
        </p>
      </div>

      <div
        className="mt-24"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {guide.sections.map((sec, i) => (
          <div key={i} className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
    </div>
  );
}
