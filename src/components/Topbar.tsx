import { Fragment } from "react";
import type { Route } from "../types";

const LABELS: Record<Route, string[]> = {
  home: ["Habla", "Home"],
  level: ["Habla", "New session", "Level"],
  prompt: ["Habla", "New session", "Topic"],
  review: ["Habla", "New session", "Review questions"],
  practice: ["Habla", "Session", "Practicing"],
  summary: ["Habla", "Session", "Results"],
  history: ["Habla", "History"],
  settings: ["Habla", "Settings"],
  reflexive: ["Habla", "Reflexive verbs"],
  vocab: ["Habla", "Vocabulary"],
  guide: ["Habla", "Study guide"],
};

export function Topbar({ route }: { route: Route }) {
  const path = LABELS[route] || ["Habla"];
  return (
    <div className="topbar">
      <div className="crumbs">
        {path.map((p, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            <span className={i === path.length - 1 ? "cur" : ""}>{p}</span>
          </Fragment>
        ))}
      </div>
      <div className="topbar-spacer" />
      <span className="muted" style={{ fontFamily: "var(--font-mono)", fontSize: 11.5 }}>
        Press <span className="kbd">/</span> to start a new session
      </span>
    </div>
  );
}
