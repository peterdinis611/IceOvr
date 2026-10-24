/** GitHub avatar CDN (direct JPEG/PNG — safe for next/image + ImageResponse). */
export function githubAvatarUrl(username: string, size = 160): string {
  const user = encodeURIComponent(username.replace(/^@/, ""));
  return `https://avatars.githubusercontent.com/${user}?s=${size}`;
}

/** Prefer `s=` on avatars.githubusercontent.com; leave other hosts alone. */
export function withAvatarSize(url: string, size: number): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "avatars.githubusercontent.com") {
      parsed.searchParams.set("s", String(size));
      parsed.searchParams.delete("size");
      return parsed.toString();
    }
  } catch {
    /* fall through */
  }
  return url;
}

function toBase64(buffer: ArrayBuffer): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(buffer).toString("base64");
  }
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

/**
 * Prefetch a raster avatar as a data URL for `next/og` ImageResponse.
 * Satori crashes on missing Content-Type and on SVG — never pass SVG through.
 */
export async function fetchAvatarDataUrl(
  url: string | null | undefined,
  size = 320,
): Promise<string | null> {
  if (!url) return null;
  try {
    const sized = withAvatarSize(url, size);
    const res = await fetch(sized, {
      headers: { Accept: "image/jpeg,image/png,image/webp,*/*" },
    });
    if (!res.ok) return null;
    const contentType = (res.headers.get("content-type") || "")
      .split(";")[0]
      .trim()
      .toLowerCase();
    if (
      !contentType.startsWith("image/") ||
      contentType.includes("svg")
    ) {
      return null;
    }
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 32) return null;
    return `data:${contentType};base64,${toBase64(buf)}`;
  } catch {
    return null;
  }
}
