import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { I } from "../icons";
import { AIError, gradeAnswer } from "../ai/gemini";
import type { Answer, Dialect, Feedback, LevelId, Mode, Question } from "../types";

type SpeechResultAlternative = { transcript: string };
type SpeechResult = {
  isFinal: boolean;
  0: SpeechResultAlternative;
  length: number;
};
type SpeechRecognitionEvent = {
  resultIndex: number;
  results: { length: number } & Record<number, SpeechResult>;
};
type SpeechRecognitionErrorEvent = { error: string; message?: string };
type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
};
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

type ModeToggleProps = { value: Mode; onChange: (m: Mode) => void };

function ModeToggle({ value, onChange }: ModeToggleProps) {
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
      <button
        data-key="voice"
        data-on={value === "voice" ? "1" : "0"}
        onClick={() => onChange("voice")}
      >
        <I.Mic size={13} /> Voice
      </button>
      <button
        data-key="text"
        data-on={value === "text" ? "1" : "0"}
        onClick={() => onChange("text")}
      >
        <I.Keyboard size={13} /> Text
      </button>
    </div>
  );
}

function Waveform({ active, n = 32 }: { active: boolean; n?: number }) {
  const [bars, setBars] = useState<number[]>(() => Array(n).fill(8));

  useEffect(() => {
    if (!active) {
      setBars(Array(n).fill(8));
      return;
    }
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 1;
      setBars(
        Array.from({ length: n }, (_, i) => {
          const base = Math.sin((i + t * 0.18) * 0.42) * 0.5 + 0.5;
          const fast = Math.sin(i * 0.7 + t * 0.5) * 0.3 + 0.5;
          const spike = Math.random() < 0.15 ? Math.random() * 0.4 : 0;
          const v = Math.max(0.08, Math.min(1, base * 0.55 + fast * 0.35 + spike));
          return Math.round(8 + v * 40);
        }),
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, n]);

  return (
    <div className={active ? "waveform" : "waveform idle"}>
      {bars.map((h, i) => (
        <i key={i} style={{ height: h }} />
      ))}
    </div>
  );
}

function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

type VoicePanelProps = {
  onSubmit: (text: string) => void;
  dialect: Dialect;
  onSwitchToText: () => void;
};

function VoicePanel({ onSubmit, dialect, onSwitchToText }: VoicePanelProps) {
  const SR = getSpeechRecognition();
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [permError, setPermError] = useState<string | null>(null);
  const recogRef = useRef<SpeechRecognitionInstance | null>(null);
  const tickRef = useRef<number | null>(null);
  const startRef = useRef(0);

  useEffect(
    () => () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      if (recogRef.current) {
        try {
          recogRef.current.abort();
        } catch {
          /* ignore */
        }
      }
    },
    [],
  );

  if (!SR) {
    return (
      <div className="voice-stage">
        <div
          className="card"
          style={{
            maxWidth: 460,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
          }}
        >
          <I.Mic size={32} stroke="var(--text-3)" />
          <div style={{ fontSize: 15, fontWeight: 500 }}>Voice isn't supported in this browser</div>
          <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
            Live Spanish transcription works in Chrome and Edge on desktop. For Safari / iOS, use
            Text mode for now.
          </div>
          <button className="btn primary" onClick={onSwitchToText}>
            <I.Keyboard size={13} /> Switch to Text
          </button>
        </div>
      </div>
    );
  }

  const start = () => {
    setPermError(null);
    setRecording(true);
    setElapsed(0);
    setTranscript("");
    setInterim("");
    startRef.current = Date.now();
    tickRef.current = window.setInterval(() => setElapsed(Date.now() - startRef.current), 100);

    const r = new SR();
    r.lang = dialect === "es" ? "es-ES" : "es-MX";
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e) => {
      let finalSoFar = "";
      let interimSoFar = "";
      for (let i = 0; i < e.results.length; i++) {
        const res = e.results[i];
        const txt = res[0]?.transcript || "";
        if (res.isFinal) finalSoFar += txt;
        else interimSoFar += txt;
      }
      setTranscript(finalSoFar);
      setInterim(interimSoFar);
    };
    r.onerror = (ev) => {
      const code = ev.error;
      if (code === "not-allowed" || code === "service-not-allowed") {
        setPermError("Microphone access is blocked. Allow it in your browser settings.");
      } else if (code === "no-speech") {
        setPermError("No speech detected. Try again and speak clearly.");
      } else {
        setPermError(`Speech recognition error: ${code}`);
      }
      setRecording(false);
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
    r.onend = () => {
      setRecording(false);
      if (tickRef.current) window.clearInterval(tickRef.current);
    };

    recogRef.current = r;
    try {
      r.start();
    } catch (e) {
      setPermError(e instanceof Error ? e.message : "Could not start the microphone.");
      setRecording(false);
      if (tickRef.current) window.clearInterval(tickRef.current);
    }
  };

  const stop = () => {
    if (recogRef.current) {
      try {
        recogRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    setRecording(false);
    if (tickRef.current) window.clearInterval(tickRef.current);
  };

  const submit = () => {
    stop();
    const finalText = (transcript + " " + interim).trim();
    if (finalText) onSubmit(finalText);
  };

  const live = transcript + (interim ? (transcript ? " " : "") + interim : "");

  return (
    <div className="voice-stage">
      <button
        className="mic-btn"
        data-recording={recording ? "1" : "0"}
        onClick={recording ? stop : start}
        aria-label={recording ? "Stop recording" : "Start recording"}
      >
        {recording ? <I.Stop size={56} sw={2} /> : <I.Mic size={56} sw={1.8} />}
      </button>
      <div className="mic-hint">
        {recording ? "Recording — tap to stop" : elapsed > 0 ? "Paused" : "Tap to speak"}
      </div>
      <div className="mic-timer">{formatTime(elapsed)}</div>
      <Waveform active={recording} />
      {live && (
        <div className="transcript">
          "{live}"{recording && <span className="cursor" />}
        </div>
      )}
      {permError && (
        <div className="muted" style={{ fontSize: 12.5, color: "var(--bad)", maxWidth: 460, textAlign: "center" }}>
          {permError}
        </div>
      )}
      {!recording && elapsed > 0 && (
        <div className="row gap-12 mt-12">
          <button className="btn ghost" onClick={start}>
            <I.Mic size={13} /> Re-record
          </button>
          <button className="btn primary" onClick={submit} disabled={!live.trim()}>
            <I.Send size={13} /> Submit answer
          </button>
        </div>
      )}
    </div>
  );
}

type TextPanelProps = { onSubmit: (text: string) => void };

function TextPanel({ onSubmit }: TextPanelProps) {
  const [val, setVal] = useState("");

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && val.trim()) {
      e.preventDefault();
      onSubmit(val);
    }
  };

  return (
    <div>
      <textarea
        className="answer-text"
        placeholder="Escribe tu respuesta en español…"
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <div className="answer-foot">
        <span className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
          {val.trim().split(/\s+/).filter(Boolean).length} words
        </span>
        <button className="btn ghost" style={{ marginLeft: "auto" }} onClick={() => setVal("")}>
          Clear
        </button>
        <button className="btn primary" disabled={!val.trim()} onClick={() => onSubmit(val)}>
          <I.Send size={13} /> Submit{" "}
          <span className="kbd" style={{ marginLeft: 6 }}>
            ⌘↵
          </span>
        </button>
      </div>
    </div>
  );
}

function GradingCard() {
  return (
    <div
      className="card"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 32,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "1.5px solid var(--accent)",
          borderTopColor: "transparent",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <span style={{ fontSize: 14, color: "var(--text-2)" }}>Grading your answer…</span>
    </div>
  );
}

function GradeErrorCard({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      className="card"
      style={{
        background: "var(--bad-soft)",
        borderColor: "color-mix(in oklab, var(--bad) 50%, var(--border))",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <I.X size={14} stroke="var(--bad)" />
      <div style={{ flex: 1, fontSize: 13.5 }}>{message}</div>
      <button className="btn" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

type FeedbackPanelProps = {
  fb: Feedback;
  qIndex: number;
  total: number;
  onNext: () => void;
  onRetry: () => void;
};

function FeedbackPanel({ fb, qIndex, total, onNext, onRetry }: FeedbackPanelProps) {
  return (
    <div className="fade-in">
      <div className="fb-grid">
        <div className="fb-block your">
          <div className="spread">
            <span className="fb-label">Your answer</span>
            <span
              className="verdict miss"
              style={{ background: "var(--bg-elev-2)", color: "var(--text-3)" }}
            >
              {fb.verdict === "ok" ? "Original" : "As recorded"}
            </span>
          </div>
          <div className="fb-body">
            {fb.strike.map((seg, i) => (
              <span key={i} className={seg.type}>
                {seg.t}
              </span>
            ))}
          </div>
        </div>
        <div className="fb-block corrected">
          <div className="spread">
            <span className="fb-label">Corrected</span>
            <span className={`verdict ${fb.verdict}`}>
              {fb.verdict === "ok" ? "Correct" : fb.verdict === "part" ? "Almost" : "Try again"}
            </span>
          </div>
          <div className="fb-body">
            {fb.corrected.map((seg, i) => (
              <span key={i} className={seg.type}>
                {seg.t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rubric">
        <div className="rubric-cell">
          <div className="rubric-key">Grammar</div>
          <div className="rubric-val">
            {fb.rubric.grammar}
            <span className="of">/5</span>
          </div>
        </div>
        <div className="rubric-cell">
          <div className="rubric-key">Vocabulary</div>
          <div className="rubric-val">
            {fb.rubric.vocab}
            <span className="of">/5</span>
          </div>
        </div>
        <div className="rubric-cell">
          <div className="rubric-key">Fluency</div>
          <div className="rubric-val">
            {fb.rubric.fluency}
            <span className="of">/5</span>
          </div>
        </div>
      </div>

      <div className="fb-tips">
        <h4>
          <I.Sparkle size={13} stroke="var(--accent)" /> Tips
        </h4>
        <ul>
          {fb.tips.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>

      <div className="row mt-24" style={{ justifyContent: "space-between" }}>
        <button className="btn ghost" onClick={onRetry}>
          <I.ArrowL size={13} /> Try again
        </button>
        <button className="btn primary lg" onClick={onNext}>
          {qIndex + 1 < total ? (
            <>
              Next question <I.Arrow size={14} />
            </>
          ) : (
            <>
              See results <I.Arrow size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

type PracticeProps = {
  questions: Question[];
  mode: Mode;
  onModeChange: (m: Mode) => void;
  level: string;
  levelId: LevelId;
  dialect: Dialect;
  apiKey: string;
  onComplete: (answers: Answer[]) => void;
};

type Phase = { kind: "answer" } | { kind: "grading" } | { kind: "error"; msg: string } | { kind: "feedback"; fb: Feedback };

export function Practice({
  questions,
  mode,
  onModeChange,
  onComplete,
  level,
  levelId,
  dialect,
  apiKey,
}: PracticeProps) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>({ kind: "answer" });
  const [answers, setAnswers] = useState<Answer[]>([]);
  const lastAnswerRef = useRef("");

  const q = questions[idx];

  const grade = async (answer: string) => {
    lastAnswerRef.current = answer;
    setPhase({ kind: "grading" });
    try {
      const fb = await gradeAnswer({
        apiKey,
        question: q.es,
        answer,
        level: levelId,
        dialect,
      });
      setAnswers((prev) => [...prev, { q: q.es, a: answer, fb }]);
      setPhase({ kind: "feedback", fb });
    } catch (e) {
      setPhase({
        kind: "error",
        msg: e instanceof AIError ? e.message : "Couldn't reach Gemini. Check your network.",
      });
    }
  };

  const next = () => {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setPhase({ kind: "answer" });
    } else {
      onComplete(answers);
    }
  };
  const retryAnswer = () => setPhase({ kind: "answer" });
  const retryGrade = () => grade(lastAnswerRef.current);

  return (
    <div className="shell fade-in" data-screen-label="05 Practice">
      <div className="spread">
        <div className="row gap-12">
          <span className="chip">
            <span className="dot" /> {level}
          </span>
          <span className="chip">
            <I.Globe size={11} style={{ opacity: 0.6 }} />{" "}
            {dialect === "es" ? "Castellano" : "Latinoamericano"}
          </span>
        </div>
        <div className="row gap-12">
          <span className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
            Q{String(idx + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
          </span>
          <ModeToggle value={mode} onChange={onModeChange} />
        </div>
      </div>

      <div className="progress mt-16">
        {questions.map((_, i) => (
          <i key={i} data-state={i < idx ? "done" : i === idx ? "cur" : "todo"} />
        ))}
      </div>

      <div className="q-card mt-24">
        <div className="q-card-eyebrow">
          <span className="eyebrow">
            <span className="dot" /> Question {idx + 1}
          </span>
          <span className="muted" style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}>
            Reply in Spanish · 1–3 sentences
          </span>
        </div>
        <h2 className="q-card-q">{q.es}</h2>
        {q.en && <div className="q-card-en">{q.en}</div>}
      </div>

      <div className="mt-24">
        {phase.kind === "answer" && mode === "voice" && (
          <VoicePanel onSubmit={grade} dialect={dialect} onSwitchToText={() => onModeChange("text")} />
        )}
        {phase.kind === "answer" && mode === "text" && <TextPanel onSubmit={grade} />}
        {phase.kind === "grading" && <GradingCard />}
        {phase.kind === "error" && <GradeErrorCard message={phase.msg} onRetry={retryGrade} />}
        {phase.kind === "feedback" && (
          <FeedbackPanel
            fb={phase.fb}
            qIndex={idx}
            total={questions.length}
            onNext={next}
            onRetry={retryAnswer}
          />
        )}
      </div>
    </div>
  );
}
