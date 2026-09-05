export const CARD_STYLE_IDS = ["retro", "arena", "brutal"] as const;

export type CardStyleId = (typeof CARD_STYLE_IDS)[number];

export const DEFAULT_CARD_STYLE: CardStyleId = "retro";

export const CARD_STYLE_META: Record<
  CardStyleId,
  { label: string; tagline: string; stock: string }
> = {
  retro: {
    label: "Retro ’96",
    tagline: "Cardboard · diagonal stripes · foil chase",
    stock: "Cardboard",
  },
  arena: {
    label: "Arena Night",
    tagline: "Dark rink · broadcast glow · ice chrome",
    stock: "Ice chrome",
  },
  brutal: {
    label: "Puck Stamp",
    tagline: "Raw cuts · ink stamp · zero fluff",
    stock: "Stamp",
  },
};

export function parseCardStyle(value: string | null | undefined): CardStyleId {
  if (value && (CARD_STYLE_IDS as readonly string[]).includes(value)) {
    return value as CardStyleId;
  }
  return DEFAULT_CARD_STYLE;
}

export const CARD_STYLE_STORAGE_KEY = "iceovr-card-style";
