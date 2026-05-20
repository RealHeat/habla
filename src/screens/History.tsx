import { useMemo, useState } from "react";
import { I } from "../icons";
import { loadSessions } from "../storage";
import type { SessionVerdict, StoredSession } from "../types";

function Sparkline({ verdict, n = 12 }: { verdict: SessionVerdict; n?: number }) {
  const data = useMemo(() => {
    const base = verdict === "good" ? 0.78 : verdict === "mid" ? 0.55 : 0.4;
    return Array.from({ length: n }, () =>
      Math.max(0.1, Math.min(1, base + (Math.random() - 0.5) * 0.4)),
    );
  }, [verdict, n]);
  const color =
    verdict === "good" ? "var(--good)" : verdict === "mid" ? "var(--warn)" : "var(--bad)";
  return (
    <svg
      width="100%"
      height="28"
      viewBox={`0 0 ${n * 6} 28`}
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      {data.map((v, i) => (
        <rect
          key={i}
          x={i * 6}
          y={28 - v * 24}
          width={3}
          height={v * 24}
          rx={1.5}
          fill={color}
          opacity={0.65 + (i / n) * 0.35}
        />
      ))}
    </svg>
  );
}

type Props = {
  onOpen: (s: StoredSession) => void;
  onNew: () => void;
};

const FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "es 1", label: "ES 1" },
  { id: "es 2", label: "ES 2" },
  { id: "es 3", label: "ES 3" },
  { id: "ap", label: "AP" },
];

export function History({ onOpen, onNew }: Props) {
  const [filter, setFilter] = useState("all");
  const sessions = useMemo(() => loadSessions(), []);
  const filtered = sessions.filter(
    (s) => filter === "all" || s.level.toLowerCase().includes(filter),
  );

  return (
    <div className="shell fade-in" data-screen-label="07 History">
      <div className="spread">
        <div>
          <div className="eyebrow">Your sessions</div>
          <h2 className="section mt-12">History</h2>
        </div>
        <button className="btn primary" onClick={onNew}>
          <I.Plus size={14} /> New session
        </button>
      </div>

      <div className="row gap-8 mt-24">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className="btn"
            style={{
              padding: "7px 12px",
              fontSize: 12.5,
              background: filter === f.id ? "var(--accent-soft)" : "transparent",
              borderColor: filter === f.id ? "var(--accent)" : "var(--border)",
              color: filter === f.id ? "var(--text)" : "var(--text-2)",
            }}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {sessions.length === 0 ? (
        <div
          className="card mt-24"
          style={{
            textAlign: "center",
            padding: 48,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
          }}
        >
          <I.Sparkle size={28} stroke="var(--accent)" />
          <div style={{ fontSize: 16, fontWeight: 500 }}>No sessions yet</div>
          <div className="muted" style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 420 }}>
            Finish your first practice session and it'll show up here with a score and a per-question
            recap.
          </div>
          <button className="btn primary mt-12" onClick={onNew}>
            <I.Plus size={13} /> Start a session
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card mt-24" style={{ textAlign: "center", padding: 32 }}>
          <div className="muted" style={{ fontSize: 13 }}>No sessions match this filter.</div>
        </div>
      ) : (
        <div className="history-list mt-24">
          {filtered.map((s) => (
            <div className="history-row" key={s.id} onClick={() => onOpen(s)}>
              <div className="history-date">
                {s.date}
                <br />
                <span style={{ color: "var(--text-4)" }}>{s.time}</span>
              </div>
              <div>
                <div className="history-title">{s.title}</div>
                <div className="history-sub">
                  <span
                    className="chip"
                    style={{ marginRight: 8, padding: "2px 8px", fontSize: 10.5 }}
                  >
                    {s.level}
                  </span>
                  {s.questions} questions · {s.duration}
                </div>
              </div>
              <div className="history-meta">
                <Sparkline verdict={s.verdict} />
              </div>
              <div className={`history-score ${s.verdict}`}>
                {s.score}
                <span style={{ color: "var(--text-4)", fontSize: 11, fontWeight: 400 }}>/100</span>
              </div>
              <div className="history-chev">
                <I.Chev size={14} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
