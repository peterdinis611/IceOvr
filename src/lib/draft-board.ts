import { getSeasonForm, type SeasonForm } from "@/lib/season";
import { scoutPlayer } from "@/lib/scout";
import type { ScoutCard } from "@/lib/types";
import { getCountry } from "@/lib/countries";
import { getLanguageMeta } from "@/lib/languages";

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

export const MAX_DRAFT_BOARD_PLAYERS = 24;

export type DraftBoardRow = {
  card: ScoutCard;
  form: SeasonForm;
};

export type DraftBoardSort = "ovr" | "streak" | "stars";

export type DraftCup =
  | { kind: "country"; code: string }
  | { kind: "lang"; language: string }
  | null;

export function cleanDraftUsername(value: string): string {
  return value.replace(/^@/, "").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 39);
}

/** Merge seed + URL players + optional extras (recent scouts), deduped, capped. */
export function mergeDraftUsernames(
  extras: readonly string[] = [],
  seed: readonly string[] = DRAFT_BOARD_SEED,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of [...extras, ...seed]) {
    const clean = cleanDraftUsername(raw);
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
    if (out.length >= MAX_DRAFT_BOARD_PLAYERS) break;
  }
  return out;
}

export function parsePlayersParam(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return mergeDraftUsernames(
    raw.split(/[,\s]+/).map((part) => part.trim()),
    [],
  );
}

export function parseCupParam(raw: string | null | undefined): DraftCup {
  if (!raw) return null;
  const country = raw.match(/^country:([A-Za-z]{2})$/i);
  if (country) return { kind: "country", code: country[1].toUpperCase() };
  const lang = raw.match(/^lang:(.+)$/i);
  if (lang) {
    const language = lang[1].trim();
    return language ? { kind: "lang", language } : null;
  }
  return null;
}

export function serializeCup(cup: DraftCup): string | null {
  if (!cup) return null;
  return cup.kind === "country"
    ? `country:${cup.code}`
    : `lang:${cup.language}`;
}

export function cupTitle(cup: DraftCup): string | null {
  if (!cup) return null;
  if (cup.kind === "country") {
    const meta = getCountry(cup.code);
    return `${meta?.flag ?? ""} ${meta?.name ?? cup.code} Cup`.trim();
  }
  const meta = getLanguageMeta(cup.language);
  return `${meta?.name ?? cup.language} Division`;
}

export function filterDraftBoardByCup(
  rows: DraftBoardRow[],
  cup: DraftCup,
): DraftBoardRow[] {
  if (!cup) return rows;
  if (cup.kind === "country") {
    return rows.filter(
      (row) => row.card.countryCode?.toUpperCase() === cup.code,
    );
  }
  return rows.filter(
    (row) =>
      row.card.topLanguage?.toLowerCase() === cup.language.toLowerCase(),
  );
}

export function listCupOptions(rows: DraftBoardRow[]): {
  countries: Array<{ code: string; label: string; count: number }>;
  languages: Array<{ language: string; label: string; count: number }>;
} {
  const countries = new Map<string, number>();
  const languages = new Map<string, number>();
  for (const row of rows) {
    if (row.card.countryCode) {
      const code = row.card.countryCode.toUpperCase();
      countries.set(code, (countries.get(code) ?? 0) + 1);
    }
    if (row.card.topLanguage) {
      languages.set(
        row.card.topLanguage,
        (languages.get(row.card.topLanguage) ?? 0) + 1,
      );
    }
  }
  return {
    countries: [...countries.entries()]
      .map(([code, count]) => {
        const meta = getCountry(code);
        return {
          code,
          label: `${meta?.flag ?? ""} ${meta?.name ?? code}`.trim(),
          count,
        };
      })
      .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code)),
    languages: [...languages.entries()]
      .map(([language, count]) => ({
        language,
        label: getLanguageMeta(language)?.name ?? language,
        count,
      }))
      .sort((a, b) => b.count - a.count || a.language.localeCompare(b.language)),
  };
}

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

export function buildBoardSharePath(
  usernames: readonly string[],
  cup: DraftCup = null,
): string {
  const params = new URLSearchParams();
  if (usernames.length > 0) {
    params.set("players", usernames.join(","));
  }
  const cupValue = serializeCup(cup);
  if (cupValue) params.set("cup", cupValue);
  const query = params.toString();
  return query ? `/board?${query}` : "/board";
}
