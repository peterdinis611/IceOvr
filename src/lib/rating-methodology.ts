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
    short: "ACT",
    name: "Activity",
    weight: 0.16,
    sources: "Commits (last year)",
    detail: (c) => `${c.raw.commitsLastYear.toLocaleString()} commits → shipping cadence`,
  },
  {
    key: "sho",
    short: "IMP",
    name: "Impact",
    weight: 0.18,
    sources: "Stars on owned repos",
    detail: (c) => `${c.raw.stars.toLocaleString()} stars → open-source impact`,
  },
  {
    key: "hnd",
    short: "CRF",
    name: "Craft",
    weight: 0.14,
    sources: "Languages + commit rhythm",
    detail: (c) =>
      `${c.raw.languageCount} languages · ${c.raw.commitsLastYear.toLocaleString()} commits → engineering breadth`,
  },
  {
    key: "pas",
    short: "COL",
    name: "Collaboration",
    weight: 0.18,
    sources: "Pull requests + followers",
    detail: (c) =>
      `${c.raw.pullRequests.toLocaleString()} PRs · ${c.raw.followers.toLocaleString()} followers → collaboration reach`,
  },
  {
    key: "def",
    short: "REL",
    name: "Reliability",
    weight: 0.16,
    sources: "Reviews + issues",
    detail: (c) =>
      `${c.raw.reviews.toLocaleString()} reviews · ${c.raw.issues.toLocaleString()} issues → reliability signals`,
  },
  {
    key: "str",
    short: "CON",
    name: "Consistency",
    weight: 0.18,
    sources: "Lifetime contributions + tenure",
    detail: (c) =>
      `${c.raw.contributionsLifetime.toLocaleString()} contributions · ${c.raw.accountYears} yrs → sustained work`,
  },
];

export const TIER_BANDS = [
  { tier: "Bronze", range: "40–59", note: "Growing" },
  { tier: "Silver", range: "60–74", note: "Established" },
  { tier: "Gold", range: "75–84", note: "Standout" },
  { tier: "Elite", range: "85–92", note: "Expert" },
  { tier: "Legend", range: "93–99", note: "Legacy" },
] as const;

/** Generic one-liners for the landing “how it works” dialog (no player data). */
export const GUIDE_BLURBS: Record<RatingIngredient["key"], string> = {
  spd: "More commits last year → higher activity",
  sho: "Stars on your repos → more open-source impact",
  hnd: "Language mix + commit rhythm → stronger engineering craft",
  pas: "PRs and followers → broader collaboration",
  def: "Reviews and issues → stronger reliability signals",
  str: "Lifetime contributions + account age → proven consistency",
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
