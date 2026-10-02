const RECENT_KEY = "iceovr-recent-scouts";
const MAX_RECENT = 8;

export type RecentScout = {
  username: string;
  at: string;
};

export function readRecentScouts(): RecentScout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentScout[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => typeof item?.username === "string")
      .slice(0, MAX_RECENT);
  } catch {
    return [];
  }
}

export function pushRecentScout(username: string) {
  if (typeof window === "undefined") return;
  const clean = username.trim().replace(/^@/, "").toLowerCase();
  if (!clean) return;
  try {
    const next = [
      { username: clean, at: new Date().toISOString() },
      ...readRecentScouts().filter((item) => item.username !== clean),
    ].slice(0, MAX_RECENT);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}
