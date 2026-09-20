import { getSeasonForm, type SeasonForm } from "@/lib/season";
import { scoutPlayer } from "@/lib/scout";
import type { ScoutCard } from "@/lib/types";

/** Curated open-ice seed list — kept small for GitHub rate limits + cache reuse. */
export const DRAFT_BOARD_SEED = [
  "torvalds",
  "gaearon",
  "sindresorhus",
  "tj",
  "yyx990803",
  "kentcdodds",
  "swyx",
  "t3dotgg",
  "ThePrimeagen",
  "mxstbr",
] as const;

export type DraftBoardRow = {
  card: ScoutCard;
  form: SeasonForm;
};

export type DraftBoardSort = "ovr" | "streak" | "stars";

export async function loadDraftBoard(
  usernames: readonly string[] = DRAFT_BOARD_SEED,
): Promise<DraftBoardRow[]> {
  const settled = await Promise.allSettled(
    usernames.map((username) => scoutPlayer(username)),
  );

  return settled.flatMap((result) => {
    if (result.status !== "fulfilled") return [];
    const card = result.value;
    return [{ card, form: getSeasonForm(card.contributionWeeks) }];
  });
}

export function sortDraftBoard(
  rows: DraftBoardRow[],
  sort: DraftBoardSort,
): DraftBoardRow[] {
  return [...rows].sort((a, b) => {
    if (sort === "streak") {
      if (b.form.streak !== a.form.streak) return b.form.streak - a.form.streak;
      return b.card.ovr - a.card.ovr;
    }
    if (sort === "stars") {
      if (b.card.raw.stars !== a.card.raw.stars) {
        return b.card.raw.stars - a.card.raw.stars;
      }
      return b.card.ovr - a.card.ovr;
    }
    if (b.card.ovr !== a.card.ovr) return b.card.ovr - a.card.ovr;
    return b.card.raw.stars - a.card.raw.stars;
  });
}

/** Rising form preferred; otherwise highest delta / current / OVR. */
export function pickPlayerOfTheWeek(rows: DraftBoardRow[]): DraftBoardRow | null {
  if (rows.length === 0) return null;
  const rising = rows.filter((row) => row.form.direction === "rising");
  const pool = rising.length > 0 ? rising : rows;
  return [...pool].sort((a, b) => {
    if (b.form.delta !== a.form.delta) return b.form.delta - a.form.delta;
    if (b.form.current !== a.form.current) return b.form.current - a.form.current;
    return b.card.ovr - a.card.ovr;
  })[0];
}
