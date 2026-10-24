/**
 * Resolve the public site origin for OG tags, embeds, and sitemap.
 * Empty / invalid NEXT_PUBLIC_SITE_URL is treated as unset.
 */
export function resolveSiteUrl(fallback = "http://localhost:3000"): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercel =
    process.env.VERCEL_URL?.trim() &&
    `https://${process.env.VERCEL_URL.trim().replace(/^https?:\/\//, "")}`;

  for (const candidate of [configured, vercel, fallback]) {
    if (!candidate) continue;
    try {
      const url = new URL(candidate);
      if (url.protocol !== "http:" && url.protocol !== "https:") continue;
      return url.origin;
    } catch {
      /* try next */
    }
  }

  return fallback;
}
