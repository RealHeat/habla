import type { Settings, StoredSession } from "./types";

const SETTINGS_KEY = "habla.settings.v1";
const SESSIONS_KEY = "habla.sessions.v1";

const DEFAULT_SETTINGS: Settings = {
  apiKey: "",
  dialect: "la",
  level: "s3",
  mode: "voice",
  userName: "Maya R.",
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: Settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadSessions(): StoredSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSession(session: StoredSession) {
  const all = loadSessions();
  all.unshift(session);
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(all.slice(0, 200)));
  } catch {
    /* ignore */
  }
}

export function clearAll() {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(SESSIONS_KEY);
  } catch {
    /* ignore */
  }
}
