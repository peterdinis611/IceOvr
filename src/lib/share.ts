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
  pageUrl: string;
  markdown: string;
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
  const publicPng = `${base}/${user}.png?style=${style}${themeQuery}`;
  const pageUrl = `${base}/u/${user}?style=${style}${themeQuery}`;
  const text = `${card.displayName} — ${card.ovr} OVR · ${edition} on IceOVR`;
  const markdown = `[![IceOVR · ${edition}](${publicPng})](${pageUrl})`;

  return {
    style,
    edition,
    publicPng,
    pageUrl,
    markdown,
    text,
    twitterUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`,
    linkedInUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
  };
}

export function themeFromSearchParam(value: string | null | undefined) {
  return value ? parseCustomTheme(value) : null;
}
