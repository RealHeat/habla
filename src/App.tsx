import { useEffect, useMemo, useRef, useState } from "react";
import { Rail } from "./components/Rail";
import { Topbar } from "./components/Topbar";
import { Landing } from "./screens/Landing";
import { LevelSelect } from "./screens/LevelSelect";
import { PromptInput } from "./screens/PromptInput";
import { QuestionReview } from "./screens/QuestionReview";
import { Practice } from "./screens/Practice";
import { Summary } from "./screens/Summary";
import { History } from "./screens/History";
import { Settings } from "./screens/Settings";
import { Reflexive } from "./screens/Reflexive";
import { Guide } from "./screens/Guide";
import { LEVELS, SAMPLE_QUESTIONS } from "./data";
import { loadSettings, saveSession, saveSettings } from "./storage";
import type { Answer, Question, Route, Settings as SettingsT, StoredSession } from "./types";

function makeSessionTitle(prompt: string): string {
  const trimmed = prompt.trim().replace(/\s+/g, " ");
  if (!trimmed) return "Untitled session";
  return trimmed.length > 48 ? trimmed.slice(0, 45).trimEnd() + "…" : trimmed;
}

function formatDuration(ms: number): string {
  const minutes = Math.max(1, Math.round(ms / 60000));
  return `${minutes} min`;
}

function formatDateParts(d: Date): { date: string; time: string } {
  const date = d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return { date, time };
}

export default function App() {
  const [settings, setSettings] = useState<SettingsT>(() => loadSettings());
  const [route, setRoute] = useState<Route>("home");
  const [prompt, setPrompt] = useState("");
  const [questions, setQuestions] = useState<Question[]>(SAMPLE_QUESTIONS);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [flowVisited, setFlowVisited] = useState<Route[]>(["home"]);
  const [historyTick, setHistoryTick] = useState(0);
  const sessionStartRef = useRef<number>(0);
  const lastPromptRef = useRef<string>("");

  // Persist settings whenever they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSettings = (next: SettingsT) => setSettings(next);

  const go = (r: Route) => {
    setRoute(r);
    setFlowVisited((v) => (v.includes(r) ? v : [...v, r]));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (e.key === "/" && tag !== "TEXTAREA" && tag !== "INPUT") {
        e.preventDefault();
        go("prompt");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const lvObj = useMemo(
    () => LEVELS.find((l) => l.id === settings.level) || LEVELS[0],
    [settings.level],
  );
  const levelLabel = lvObj.code;

  const handlePracticeComplete = (finalAnswers: Answer[]) => {
    setAnswers(finalAnswers);
    if (finalAnswers.length > 0) {
      const sum = finalAnswers.reduce(
        (acc, a) => {
          acc.grammar += a.fb.rubric.grammar;
          acc.vocab += a.fb.rubric.vocab;
          acc.fluency += a.fb.rubric.fluency;
          return acc;
        },
        { grammar: 0, vocab: 0, fluency: 0 },
      );
      const max = finalAnswers.length * 5;
      const score = Math.round(((sum.grammar + sum.vocab + sum.fluency) / (max * 3)) * 100);
      const verdict = score >= 80 ? "good" : score >= 65 ? "mid" : "bad";
      const now = new Date();
      const { date, time } = formatDateParts(now);
      const stored: StoredSession = {
        id: `ses_${now.getTime().toString(36)}`,
        date,
        time,
        title: makeSessionTitle(lastPromptRef.current || prompt),
        level: levelLabel,
        questions: finalAnswers.length,
        score,
        verdict,
        duration: formatDuration(Date.now() - sessionStartRef.current),
        promptText: lastPromptRef.current || prompt,
        answers: finalAnswers,
      };
      saveSession(stored);
      setHistoryTick((n) => n + 1);
    }
    go("summary");
  };

  let screen = null;
  if (route === "home") {
    screen = (
      <Landing
        level={levelLabel}
        dialect={settings.dialect}
        onStart={(p) => {
          if (typeof p === "string") setPrompt(p);
          go("level");
        }}
      />
    );
  } else if (route === "level") {
    screen = (
      <LevelSelect
        value={settings.level}
        onChange={(level) => setSettings({ ...settings, level })}
        onContinue={() => go("prompt")}
      />
    );
  } else if (route === "prompt") {
    screen = (
      <PromptInput
        initial={prompt}
        apiKey={settings.apiKey}
        level={settings.level}
        dialect={settings.dialect}
        onBack={() => go("level")}
        onNeedKey={() => go("settings")}
        onGenerate={({ prompt: p, questions: qs }) => {
          setPrompt(p);
          lastPromptRef.current = p;
          setQuestions(qs);
          go("review");
        }}
      />
    );
  } else if (route === "review") {
    screen = (
      <QuestionReview
        questions={questions}
        onChange={setQuestions}
        onBack={() => go("prompt")}
        onStart={() => {
          setAnswers([]);
          sessionStartRef.current = Date.now();
          go("practice");
        }}
      />
    );
  } else if (route === "practice") {
    screen = (
      <Practice
        questions={questions}
        mode={settings.mode}
        onModeChange={(mode) => setSettings({ ...settings, mode })}
        level={levelLabel}
        levelId={settings.level}
        dialect={settings.dialect}
        apiKey={settings.apiKey}
        onComplete={handlePracticeComplete}
      />
    );
  } else if (route === "summary") {
    screen = (
      <Summary
        answers={answers}
        level={levelLabel}
        onRestart={() => go("prompt")}
        onHistory={() => go("history")}
      />
    );
  } else if (route === "history") {
    screen = (
      <History
        key={historyTick}
        onOpen={() => go("summary")}
        onNew={() => go("prompt")}
      />
    );
  } else if (route === "settings") {
    screen = <Settings settings={settings} onChange={updateSettings} />;
  } else if (route === "reflexive") {
    screen = (
      <Reflexive
        apiKey={settings.apiKey}
        level={settings.level}
        dialect={settings.dialect}
        onNeedKey={() => go("settings")}
      />
    );
  } else if (route === "guide") {
    screen = <Guide initialLevel={settings.level} />;
  }

  return (
    <div className="app">
      <Rail
        route={route}
        setRoute={go}
        flow={flowVisited}
        level={settings.level}
        userName={settings.userName}
      />
      <main className="canvas">
        <Topbar route={route} />
        {screen}
      </main>
    </div>
  );
}
