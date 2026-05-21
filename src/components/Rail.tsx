import { Fragment } from "react";
import { I } from "../icons";
import { LEVELS } from "../data";
import type { IconKey, LevelId, Route } from "../types";

type RailRoute = {
  id: Route;
  label: string;
  icon: IconKey;
  section: "Practice" | "Library" | "Account";
  flow?: number;
  sub?: boolean;
};

const ROUTES: RailRoute[] = [
  { id: "home", label: "Home", icon: "Home", section: "Practice" },
  { id: "level", label: "Level", icon: "Level", section: "Practice", flow: 1 },
  { id: "prompt", label: "New session", icon: "Spark", section: "Practice", flow: 2 },
  { id: "review", label: "Review", icon: "Doc", section: "Practice", flow: 3, sub: true },
  { id: "practice", label: "Practice", icon: "Play", section: "Practice", flow: 4, sub: true },
  { id: "summary", label: "Results", icon: "Star", section: "Practice", flow: 5, sub: true },
  { id: "reflexive", label: "Reflexive verbs", icon: "Bolt", section: "Practice" },
  { id: "guide", label: "Study guide", icon: "School", section: "Library" },
  { id: "history", label: "History", icon: "History", section: "Library" },
  { id: "settings", label: "Settings", icon: "Settings", section: "Account" },
];

type Props = {
  route: Route;
  setRoute: (r: Route) => void;
  flow: Route[];
  level: LevelId;
  userName: string;
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Rail({ route, setRoute, flow, level, userName }: Props) {
  const grouped = ROUTES.reduce<Record<string, RailRoute[]>>((acc, r) => {
    (acc[r.section] = acc[r.section] || []).push(r);
    return acc;
  }, {});

  const lvObj = LEVELS.find((l) => l.id === level) || LEVELS[0];

  return (
    <aside className="rail">
      <div className="rail-brand">
        <div className="rail-brand-mark">Ha</div>
        <div>
          <div className="rail-brand-name">Habla</div>
          <div className="rail-brand-sub">español · practice</div>
        </div>
      </div>

      {Object.entries(grouped).map(([sec, items]) => (
        <Fragment key={sec}>
          <div className="rail-section">{sec}</div>
          {items
            .filter((r) => !r.sub || flow.includes(r.id))
            .map((r) => {
              const Icon = I[r.icon];
              const active = r.id === route;
              const disabled = !!r.sub && !flow.includes(r.id) && r.id !== route;
              return (
                <div
                  key={r.id}
                  className="rail-item"
                  data-active={active ? "1" : "0"}
                  data-disabled={disabled ? "1" : "0"}
                  onClick={() => !disabled && setRoute(r.id)}
                >
                  <Icon size={14} />
                  <span>{r.label}</span>
                  {r.flow && <span className="num">{String(r.flow).padStart(2, "0")}</span>}
                </div>
              );
            })}
        </Fragment>
      ))}

      <div className="rail-foot">
        <div className="rail-streak">
          <I.Flame size={20} stroke="var(--accent)" />
          <div>
            <div className="rail-streak-num">7</div>
            <div className="rail-streak-lbl">day streak</div>
          </div>
        </div>
        <div className="rail-user" onClick={() => setRoute("settings")}>
          <div className="rail-avatar">{initialsOf(userName)}</div>
          <div>
            <div className="rail-user-name">{userName}</div>
            <div className="rail-user-meta">{lvObj.code} · 1,240 XP</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
