import {
  CARD_STYLE_META,
  DEFAULT_CARD_STYLE,
  parseCardStyle,
  type CardStyleId,
} from "@/components/player-card/cardStyles";
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
): CardSharePayload {
  const style = parseCardStyle(styleInput ?? DEFAULT_CARD_STYLE);
  const edition = CARD_STYLE_META[style].label;
  const base = site.replace(/\/$/, "");
  const user = encodeURIComponent(card.username);
  const publicPng = `${base}/${user}.png?style=${style}`;
  const pageUrl = `${base}/u/${user}?style=${style}`;
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
