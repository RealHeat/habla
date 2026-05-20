import { useState } from "react";
import { I } from "../icons";
import { clearAll } from "../storage";
import type { Dialect, Settings as SettingsT } from "../types";

type Props = {
  settings: SettingsT;
  onChange: (next: SettingsT) => void;
};

export function Settings({ settings, onChange }: Props) {
  const [key, setKey] = useState(settings.apiKey);
  const [reveal, setReveal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [nameDraft, setNameDraft] = useState(settings.userName);

  const save = () => {
    onChange({ ...settings, apiKey: key.trim() });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  const commitName = () => {
    const next = nameDraft.trim() || "You";
    if (next !== settings.userName) onChange({ ...settings, userName: next });
    setNameDraft(next);
  };

  const setDialect = (d: Dialect) => onChange({ ...settings, dialect: d });

  const reset = () => {
    if (!confirm("Clear API key and all saved sessions? This can't be undone.")) return;
    clearAll();
    onChange({
      apiKey: "",
      dialect: "la",
      level: "s3",
      mode: "voice",
      userName: "Maya R.",
    });
    setKey("");
    setNameDraft("Maya R.");
  };

  return (
    <div className="shell narrow fade-in" data-screen-label="Settings">
      <div className="eyebrow">
        <span className="dot" /> Account
      </div>
      <h2 className="section mt-12">Settings</h2>
      <p className="lead mt-12">
        Habla uses Google Gemini for question generation and grading. Add your free Gemini API key
        — it's stored in this browser only.
      </p>

      <div className="card mt-24" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Your name
          </div>
          <input
            value={nameDraft}
            placeholder="What should we call you?"
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: 14,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-sm)",
              color: "var(--text)",
              outline: 0,
            }}
          />
          <div className="muted mt-12" style={{ fontSize: 12.5 }}>
            Shown in the sidebar. Updates instantly.
          </div>
        </div>
      </div>

      <div className="card mt-16" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Gemini API key
          </div>
          <div className="row gap-8">
            <input
              type={reveal ? "text" : "password"}
              value={key}
              placeholder="AIza…"
              onChange={(e) => setKey(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 14px",
                fontSize: 14,
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-sm)",
                color: "var(--text)",
                fontFamily: "var(--font-mono)",
                outline: 0,
              }}
            />
            <button className="btn" onClick={() => setReveal((r) => !r)}>
              {reveal ? "Hide" : "Show"}
            </button>
            <button className="btn primary" onClick={save} disabled={key.trim() === settings.apiKey}>
              {saved ? (
                <>
                  <I.Check size={13} /> Saved
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
          <div className="muted mt-12" style={{ fontSize: 12.5, lineHeight: 1.5 }}>
            Get a free key at{" "}
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--accent)" }}
            >
              aistudio.google.com/app/apikey
            </a>
            . The free tier covers personal practice comfortably.
          </div>
        </div>
      </div>

      <div className="card mt-16" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="eyebrow">Dialect</div>
        <div className="row gap-8">
          {(
            [
              { id: "la" as const, label: "Latinoamericano" },
              { id: "es" as const, label: "Castellano (España)" },
            ]
          ).map((d) => (
            <button
              key={d.id}
              className="btn"
              style={{
                padding: "8px 14px",
                background: settings.dialect === d.id ? "var(--accent-soft)" : "var(--bg-elev)",
                borderColor: settings.dialect === d.id ? "var(--accent)" : "var(--border)",
                color: settings.dialect === d.id ? "var(--text)" : "var(--text-2)",
              }}
              onClick={() => setDialect(d.id)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="row mt-32" style={{ justifyContent: "flex-end" }}>
        <button className="btn ghost" onClick={reset} style={{ color: "var(--bad)" }}>
          <I.Trash size={13} /> Reset all data
        </button>
      </div>
    </div>
  );
}
