import { unstable_cache } from "next/cache";
import { buildScoutCard } from "./scoring";
import { fetchGitHubProfile } from "./github";
import type { ScoutCard } from "./types";
import {
  SCOUT_MEMORY_MAX_ENTRIES,
  SCOUT_REVALIDATE_SECONDS,
  SCOUT_TTL_MS,
  TtlMap,
  scoutCacheKey,
  scoutCacheTag,
} from "./cache";

/** L1 — process memory (shared by page + PNG route in the same instance). */
const memory = new TtlMap<ScoutCard>(SCOUT_TTL_MS, SCOUT_MEMORY_MAX_ENTRIES);

async function loadScoutCard(username: string): Promise<ScoutCard> {
  const raw = await fetchGitHubProfile(username);
  return buildScoutCard(raw);
}

/**
 * Scout a player with layered caching:
 * 1. In-memory TTL (L1)
 * 2. Next.js Data Cache via `unstable_cache` (L2, cross-request)
 * 3. Apollo + fetch `revalidate` (L3 / network)
 */
export async function scoutPlayer(username: string): Promise<ScoutCard> {
  const key = scoutCacheKey(username);

  const hot = memory.get(key);
  if (hot) return hot;

  const cached = await unstable_cache(
    () => loadScoutCard(key),
    ["scout-player", key],
    {
      revalidate: SCOUT_REVALIDATE_SECONDS,
      tags: [scoutCacheTag(key), "scout"],
    },
  )();

  memory.set(key, cached);
  return cached;
}

/** Drop L1 entry (e.g. after forced refresh). Next Data Cache needs `revalidateTag`. */
export function invalidateScoutMemory(username: string): void {
  memory.delete(scoutCacheKey(username));
}
