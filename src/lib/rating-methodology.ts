import type { ScoutCard } from "@/lib/types";

export type RatingIngredient = {
  key: "spd" | "sho" | "hnd" | "pas" | "def" | "str";
  short: string;
  name: string;
  weight: number;
  sources: string;
  detail: (card: ScoutCard) => string;
};

/** Shared methodology copy — kept in one place for UI + tests. */
export const RATING_INGREDIENTS: RatingIngredient[] = [
  {
    key: "spd",
    short: "SPD",
    name: "Skating",
    weight: 0.16,
    sources: "Commits (last year)",
    detail: (c) => `${c.raw.commitsLastYear.toLocaleString()} commits → cadence on ice`,
  },
  {
    key: "sho",
    short: "SHO",
    name: "Shooting",
    weight: 0.18,
    sources: "Stars on owned repos",
    detail: (c) => `${c.raw.stars.toLocaleString()} stars → shot power / impact`,
  },
  {
    key: "hnd",
    short: "HND",
    name: "Hands",
    weight: 0.14,
    sources: "Languages + commit rhythm",
    detail: (c) =>
      `${c.raw.languageCount} languages · ${c.raw.commitsLastYear.toLocaleString()} commits → stickhandling`,
  },
  {
    key: "pas",
    short: "PAS",
    name: "Passing",
    weight: 0.18,
    sources: "Pull requests + followers",
    detail: (c) =>
      `${c.raw.pullRequests.toLocaleString()} PRs · ${c.raw.followers.toLocaleString()} followers → playmaking`,
  },
  {
    key: "def",
    short: "DEF",
    name: "Defense",
    weight: 0.16,
    sources: "Reviews + issues",
    detail: (c) =>
      `${c.raw.reviews.toLocaleString()} reviews · ${c.raw.issues.toLocaleString()} issues → blue-line work`,
  },
  {
    key: "str",
    short: "STR",
    name: "Strength",
    weight: 0.18,
    sources: "Lifetime contributions + tenure",
    detail: (c) =>
      `${c.raw.contributionsLifetime.toLocaleString()} contribs · ${c.raw.accountYears} yrs → board battles`,
  },
];

export const TIER_BANDS = [
  { tier: "Bronze", range: "40–59", note: "Prospect" },
  { tier: "Silver", range: "60–74", note: "Call-up" },
  { tier: "Gold", range: "75–84", note: "Starter" },
  { tier: "Elite", range: "85–92", note: "All-Star" },
  { tier: "Legend", range: "93–99", note: "Hall of Fame" },
] as const;

/** Generic one-liners for the landing “how it works” dialog (no player data). */
export const GUIDE_BLURBS: Record<RatingIngredient["key"], string> = {
  spd: "More commits last year → higher skating / pace",
  sho: "Stars on your repos → shot power and impact",
  hnd: "Language mix + commit rhythm → stickhandling",
  pas: "PRs and followers → playmaking / distribution",
  def: "Reviews and issues → defensive awareness",
  str: "Lifetime contributions + account age → strength",
};

export function describeOvrFormula(card?: ScoutCard | null): string {
  if (!card) {
    return "Weighted mix of the six attributes (soft-capped near 88). Long careers with huge influence can unlock a legacy boost toward 99.";
  }
  const softCap = card.ovr <= 88;
  if (softCap) {
    return "Weighted mix of the six attributes (soft-capped near 88 for most profiles).";
  }
  return "Weighted attributes plus a legacy boost (8+ years and high influence can push past 88 toward 99).";
}
