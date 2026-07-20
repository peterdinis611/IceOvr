/** Shared cache TTLs for IceOVR scout pipeline. */

/** How long a scouted card stays fresh (seconds). */
export const SCOUT_REVALIDATE_SECONDS = 60 * 60; // 1 hour

/** Same window in ms — for in-memory / Apollo TTL checks. */
export const SCOUT_TTL_MS = SCOUT_REVALIDATE_SECONDS * 1000;

/** CDN / browser hint for PNG embeds. */
export const PNG_CACHE_CONTROL =
  `public, s-maxage=${SCOUT_REVALIDATE_SECONDS}, stale-while-revalidate=86400`;

/** Max entries in process-local scout L1 cache. */
export const SCOUT_MEMORY_MAX_ENTRIES = 500;

export function scoutCacheTag(username: string): string {
  return `scout:${username.toLowerCase()}`;
}

export function scoutCacheKey(username: string): string {
  return username.trim().toLowerCase();
}
