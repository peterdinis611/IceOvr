import type { Tier } from "@/lib/types";

export type ScoutSnapshot = {
  username: string;
  stars: number;
  commits: number;
  ovr: number;
  tier: Tier;
  at: string;
};

const DB_PREFIX = "iceovr-scout-history:";
const STORE_NAME = "scout-history";
const VERSION = 1;
const PACK_SEEN_KEY = "iceovr-pack-seen";

function openDatabase(username: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      `${DB_PREFIX}${username.toLowerCase()}`,
      VERSION,
    );
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME, { keyPath: "username" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getScoutSnapshot(
  username: string,
): Promise<ScoutSnapshot | null> {
  const database = await openDatabase(username);
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction
      .objectStore(STORE_NAME)
      .get(username.toLowerCase());
    request.onsuccess = () => {
      const raw = request.result as Partial<ScoutSnapshot> | undefined;
      if (!raw) {
        resolve(null);
        return;
      }
      resolve({
        username: String(raw.username),
        stars: Number(raw.stars ?? 0),
        commits: Number(raw.commits ?? 0),
        ovr: Number(raw.ovr ?? 0),
        tier: (raw.tier as Tier | undefined) ?? tierFromOvr(Number(raw.ovr ?? 0)),
        at: String(raw.at ?? ""),
      });
    };
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

export async function saveScoutSnapshot(
  snapshot: ScoutSnapshot,
): Promise<void> {
  const database = await openDatabase(snapshot.username);
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put({
      ...snapshot,
      username: snapshot.username.toLowerCase(),
    });
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error);
  });
}

export type PackRevealKind = "callup" | "uptier" | "foil";

export type PackRevealEvent = {
  kind: PackRevealKind;
  fromTier: Tier;
  toTier: Tier;
  fromOvr: number;
  toOvr: number;
};

const TIER_RANK: Record<Tier, number> = {
  bronze: 0,
  silver: 1,
  gold: 2,
  elite: 3,
  legend: 4,
};

export function detectPackReveal(
  previous: ScoutSnapshot | null,
  next: Pick<ScoutSnapshot, "ovr" | "tier">,
): PackRevealEvent | null {
  if (!previous) return null;
  if (TIER_RANK[next.tier] <= TIER_RANK[previous.tier]) return null;
  if (next.ovr < previous.ovr) return null;

  if (previous.tier === "bronze" && next.tier === "silver") {
    return {
      kind: "callup",
      fromTier: previous.tier,
      toTier: next.tier,
      fromOvr: previous.ovr,
      toOvr: next.ovr,
    };
  }
  if (next.tier === "elite" || next.tier === "legend") {
    return {
      kind: "foil",
      fromTier: previous.tier,
      toTier: next.tier,
      fromOvr: previous.ovr,
      toOvr: next.ovr,
    };
  }
  return {
    kind: "uptier",
    fromTier: previous.tier,
    toTier: next.tier,
    fromOvr: previous.ovr,
    toOvr: next.ovr,
  };
}

function packSeenStorageKey(username: string, at: string, toTier: Tier) {
  return `${username.toLowerCase()}|${at}|${toTier}`;
}

export function hasSeenPackReveal(
  username: string,
  at: string,
  toTier: Tier,
): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = window.localStorage.getItem(PACK_SEEN_KEY);
    const seen = raw ? (JSON.parse(raw) as string[]) : [];
    return seen.includes(packSeenStorageKey(username, at, toTier));
  } catch {
    return false;
  }
}

export function markPackRevealSeen(
  username: string,
  at: string,
  toTier: Tier,
): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(PACK_SEEN_KEY);
    const seen = raw ? (JSON.parse(raw) as string[]) : [];
    const key = packSeenStorageKey(username, at, toTier);
    if (seen.includes(key)) return;
    window.localStorage.setItem(
      PACK_SEEN_KEY,
      JSON.stringify([key, ...seen].slice(0, 40)),
    );
  } catch {
    // ignore
  }
}

function tierFromOvr(ovr: number): Tier {
  if (ovr >= 93) return "legend";
  if (ovr >= 85) return "elite";
  if (ovr >= 75) return "gold";
  if (ovr >= 60) return "silver";
  return "bronze";
}
