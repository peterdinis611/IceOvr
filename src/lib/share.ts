import {
  CARD_STYLE_META,
  DEFAULT_CARD_STYLE,
  parseCardStyle,
  type CardStyleId,
} from "@/components/player-card/cardStyles";
import {
  encodeCustomTheme,
  parseCustomTheme,
  type CustomCardTheme,
} from "@/components/player-card/customTheme";
import type { ScoutCard } from "@/lib/types";

export type CardSharePayload = {
  style: CardStyleId;
  edition: string;
  publicPng: string;
  publicFormPng: string;
  pageUrl: string;
  markdown: string;
  formMarkdown: string;
  text: string;
  twitterUrl: string;
  linkedInUrl: string;
};

export function buildCardSharePayload(
  card: Pick<ScoutCard, "username" | "displayName" | "ovr">,
  styleInput: string | null | undefined,
  site: string,
  customTheme?: CustomCardTheme | null,
): CardSharePayload {
  const style = parseCardStyle(styleInput ?? DEFAULT_CARD_STYLE);
  const edition =
    style === "custom" && customTheme?.stock
      ? `Custom · ${customTheme.stock}`
      : CARD_STYLE_META[style].label;
  const base = site.replace(/\/$/, "");
  const user = encodeURIComponent(card.username);
  const themeQuery =
    style === "custom" && customTheme
      ? `&theme=${encodeURIComponent(encodeCustomTheme(customTheme))}`
      : "";
  const publicPng = `${base}/card/${user}.png?style=${style}${themeQuery}`;
  const publicFormPng = `${base}/form/${user}.png`;
  const pageUrl = `${base}/u/${user}?style=${style}${themeQuery}`;
  const text = `${card.displayName} — ${card.ovr} OVR · ${edition} on IceOVR`;
  const tweetText = `${text}\n\n${publicPng}`;
  const markdown = `[![IceOVR · ${edition}](${publicPng})](${pageUrl})`;
  const formMarkdown = `[![IceOVR · Live Season Form](${publicFormPng})](${pageUrl})`;

  return {
    style,
    edition,
    publicPng,
    publicFormPng,
    pageUrl,
    markdown,
    formMarkdown,
    text,
    // Intent compose UIs — they open a draft; the user still hits Post.
    // Card art comes from OG crawl of pageUrl (needs public HTTPS SITE_URL).
    twitterUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(pageUrl)}`,
    linkedInUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
  };
}

/** True when the browser can share a PNG file via the system share sheet. */
export function canNativeShareCard(): boolean {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    return false;
  }
  if (typeof navigator.canShare !== "function") return true;
  try {
    return navigator.canShare({
      files: [new File([new Uint8Array([0x89, 0x50])], "card.png", { type: "image/png" })],
    });
  } catch {
    return false;
  }
}

export function themeFromSearchParam(value: string | null | undefined) {
  return value ? parseCustomTheme(value) : null;
}
