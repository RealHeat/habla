import { useState } from "react";
import { I } from "../icons";
import type { Question } from "../types";

type Props = {
  questions: Question[];
  onChange: (q: Question[]) => void;
  onBack: () => void;
  onStart: () => void;
};

export function QuestionReview({ questions, onChange, onBack, onStart }: Props) {
  const [editing, setEditing] = useState<number | null>(null);

  const setQ = (i: number, patch: Partial<Question>) => {
    onChange(questions.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  };
  const remove = (i: number) => onChange(questions.filter((_, idx) => idx !== i));
  const add = () => {
    onChange([...questions, { es: "", en: "" }]);
    setEditing(questions.length);
  };

  return (
    <div className="shell narrow fade-in" data-screen-label="04 Question Review">
      <div className="spread">
        <div>
          <div className="eyebrow">Step 3 of 3 · Review</div>
          <h2 className="section mt-12">Here's what we'll ask you.</h2>
        </div>
        <span className="chip">
          <span className="dot" /> {questions.length} questions
        </span>
      </div>
      <p className="lead mt-12">
        Edit any question, remove ones you don't want, or add your own. Then start.
      </p>

      <div className="q-list mt-24">
        {questions.map((q, i) => (
          <div className="q-item" key={i}>
            <div className="q-num">{String(i + 1).padStart(2, "0")}</div>
            <div className="q-text-row">
              {editing === i ? (
                <input
                  className="q-edit"
                  autoFocus
                  value={q.es}
                  onChange={(e) => setQ(i, { es: e.target.value })}
                  onBlur={() => setEditing(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setEditing(null);
                  }}
                />
              ) : (
                <div className="q-text">
                  {q.es || <span className="muted">New question…</span>}
                </div>
              )}
              {q.en && <div className="q-text-en">{q.en}</div>}
            </div>
            <div className="q-actions">
              <button onClick={() => setEditing(i)} title="Edit">
                <I.Edit size={14} />
              </button>
              <button onClick={() => remove(i)} title="Remove">
                <I.Trash size={14} />
              </button>
            </div>
          </div>
        ))}
        <button
          className="btn ghost"
          onClick={add}
          style={{ alignSelf: "flex-start", marginTop: 4 }}
        >
          <I.Plus size={14} /> Add a question
        </button>
      </div>

      <div className="row mt-32" style={{ justifyContent: "space-between" }}>
        <button className="btn ghost" onClick={onBack}>
          <I.ArrowL size={14} /> Back
        </button>
        <button className="btn primary lg" onClick={onStart} disabled={questions.length === 0}>
          <I.Play size={14} /> Start practicing
        </button>
      </div>
    </div>
  );
}
