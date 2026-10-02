export const CARD_STYLE_IDS = [
  "retro",
  "arena",
  "brutal",
  "frost",
  "neon",
  "custom",
] as const;

export type CardStyleId = (typeof CARD_STYLE_IDS)[number];

export const DEFAULT_CARD_STYLE: CardStyleId = "retro";

export const CARD_STYLE_META: Record<
  CardStyleId,
  { label: string; tagline: string; stock: string; swatch: string }
> = {
  retro: {
    label: "Retro ’96",
    tagline: "Cardboard · diagonal stripes · foil chase",
    stock: "Cardboard",
    swatch: "linear-gradient(135deg, #e11d2e 0%, #f5ead4 45%, #0e7490 100%)",
  },
  arena: {
    label: "Arena Night",
    tagline: "Dark rink · broadcast glow · ice chrome",
    stock: "Ice chrome",
    swatch: "linear-gradient(135deg, #061018 0%, #38bdf8 50%, #e11d2e 100%)",
  },
  brutal: {
    label: "Puck Stamp",
    tagline: "Raw cuts · ink stamp · zero fluff",
    stock: "Stamp",
    swatch: "linear-gradient(135deg, #0a0908 0%, #e11d2e 55%, #f8fafc 100%)",
  },
  frost: {
    label: "Ice Glass",
    tagline: "Frosted crystal · soft light · winter steel",
    stock: "Crystal",
    swatch: "linear-gradient(135deg, #e0f2fe 0%, #7dd3fc 45%, #ffffff 100%)",
  },
  neon: {
    label: "Neon Rink",
    tagline: "Black ice · arcade glow · scan lines",
    stock: "Neon",
    swatch: "linear-gradient(135deg, #020617 0%, #22d3ee 50%, #e11d2e 100%)",
  },
  custom: {
    label: "Custom Studio",
    tagline: "Your accent · layout · stock mark",
    stock: "Studio",
    swatch: "linear-gradient(135deg, #e11d2e 0%, #7dd3fc 50%, #f59e0b 100%)",
  },
};

export function parseCardStyle(value: string | null | undefined): CardStyleId {
  if (value && (CARD_STYLE_IDS as readonly string[]).includes(value)) {
    return value as CardStyleId;
  }
  return DEFAULT_CARD_STYLE;
}

export const CARD_STYLE_STORAGE_KEY = "iceovr-card-style";
