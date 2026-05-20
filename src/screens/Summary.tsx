import { useEffect, useState } from "react";
import { I } from "../icons";
import type { Answer } from "../types";

function ScoreRing({ value, size = 220, sw = 14 }: { value: number; size?: number; sw?: number }) {
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  const grade =
    value >= 90 ? "A" : value >= 80 ? "B" : value >= 70 ? "C" : value >= 60 ? "D" : "F";
  const color =
    value >= 80 ? "var(--good)" : value >= 65 ? "var(--accent)" : "var(--bad)";
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--bg-elev-2)"
          strokeWidth={sw}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.3,.7,.4,1)" }}
        />
      </svg>
      <div className="score-ring-val">
        <div className="score-ring-num">{value}</div>
        <div className="score-ring-grade">Grade {grade}</div>
      </div>
    </div>
  );
}

type Props = {
  answers: Answer[];
  level: string;
  onRestart: () => void;
  onHistory: () => void;
};

export function Summary({ answers, level, onRestart, onHistory }: Props) {
  const total = answers.length;
  const sum = answers.reduce(
    (acc, a) => {
      acc.grammar += a.fb.rubric.grammar;
      acc.vocab += a.fb.rubric.vocab;
      acc.fluency += a.fb.rubric.fluency;
      return acc;
    },
    { grammar: 0, vocab: 0, fluency: 0 },
  );

  const max = total * 5;
  const overall = max
    ? Math.round(((sum.grammar + sum.vocab + sum.fluency) / (max * 3)) * 100)
    : 0;
  const correct = answers.filter((a) => a.fb.verdict === "ok").length;
  const almost = answers.filter((a) => a.fb.verdict === "part").length;
  const missed = answers.filter((a) => a.fb.verdict === "miss").length;

  const [shown, setShown] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const dur = 800;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(overall * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [overall]);

  return (
    <div className="shell fade-in" data-screen-label="06 Summary">
      <div className="eyebrow">
        <span className="dot" /> Session complete
      </div>
      <h2 className="section mt-12">Nice work. Here's how it went.</h2>

      <div className="score-hero mt-24">
        <ScoreRing value={shown} />
        <div className="score-meta">
          <div className="score-headline">
            {overall >= 85
              ? "You're sounding confident — keep stretching the vocab."
              : overall >= 70
                ? "Solid foundation. A few grammar gaps to tighten up."
                : "Lots of practice ahead — let's keep going."}
          </div>
          <div className="score-stats">
            <div>
              <div className="stat-key">Correct</div>
              <div className="stat-val good">{correct}</div>
            </div>
            <div>
              <div className="stat-key">Almost</div>
              <div className="stat-val" style={{ color: "var(--warn)" }}>
                {almost}
              </div>
            </div>
            <div>
              <div className="stat-key">Missed</div>
              <div className="stat-val bad">{missed}</div>
            </div>
            <div>
              <div className="stat-key">Level</div>
              <div className="stat-val">{level}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rubric mt-24">
        <div className="rubric-cell">
          <div className="rubric-key">Grammar</div>
          <div className="rubric-val">
            {sum.grammar}
            <span className="of">/{max}</span>
          </div>
        </div>
        <div className="rubric-cell">
          <div className="rubric-key">Vocabulary</div>
          <div className="rubric-val">
            {sum.vocab}
            <span className="of">/{max}</span>
          </div>
        </div>
        <div className="rubric-cell">
          <div className="rubric-key">Fluency</div>
          <div className="rubric-val">
            {sum.fluency}
            <span className="of">/{max}</span>
          </div>
        </div>
      </div>

      <h3 className="sub mt-32">Per-question breakdown</h3>
      <div className="summary-list">
        {answers.map((a, i) => (
          <div className="summary-row" key={i}>
            <div
              className="q-num"
              style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div className="q-text" style={{ fontSize: 14.5 }}>
                {a.q}
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                {a.fb.tips[0]}
              </div>
            </div>
            <div className={`verdict ${a.fb.verdict}`}>
              {a.fb.verdict === "ok"
                ? "Correct"
                : a.fb.verdict === "part"
                  ? "Almost"
                  : "Try again"}
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-32 gap-12" style={{ justifyContent: "flex-end" }}>
        <button className="btn ghost" onClick={onHistory}>
          <I.History size={14} /> View history
        </button>
        <button className="btn" onClick={onRestart}>
          Start another session
        </button>
        <button className="btn primary" onClick={onRestart}>
          <I.Bolt size={14} /> Practice mistakes only
        </button>
      </div>
    </div>
  );
}
