import type { ScoutCard } from "@/lib/types";

export const PLAYOFF_SIZE = 8;

export type PlayoffMatch = {
  id: string;
  round: "qf" | "sf" | "final";
  left: string | null;
  right: string | null;
  winner: string | null;
  leftOvr: number | null;
  rightOvr: number | null;
};

export type PlayoffBracket = {
  players: string[];
  matches: PlayoffMatch[];
  champion: string | null;
};

export function cleanPlayoffUsername(value: string): string | null {
  const username = value.trim().replace(/^@/, "");
  return /^[a-zA-Z0-9-]{1,39}$/.test(username) ? username : null;
}

export function parsePlayoffPlayers(
  searchParams: Record<string, string | string[] | undefined>,
): string[] {
  const fromList =
    typeof searchParams.players === "string"
      ? searchParams.players.split(/[,\s]+/)
      : [];
  const numbered = Array.from({ length: PLAYOFF_SIZE }, (_, index) => {
    const key = `p${index + 1}`;
    const value = searchParams[key];
    return typeof value === "string" ? value : "";
  });
  const raw = [...fromList, ...numbered];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of raw) {
    const clean = cleanPlayoffUsername(item);
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clean);
    if (out.length >= PLAYOFF_SIZE) break;
  }
  return out;
}

export function buildPlayoffPath(players: readonly string[]): string {
  const padded = [...players]
    .slice(0, PLAYOFF_SIZE)
    .concat(Array(PLAYOFF_SIZE).fill(""))
    .slice(0, PLAYOFF_SIZE);
  const params = new URLSearchParams();
  padded.forEach((player, index) => {
    if (player) params.set(`p${index + 1}`, player);
  });
  const query = params.toString();
  return query ? `/playoffs?${query}` : "/playoffs";
}

/** Deterministic single-elim: higher OVR advances; ties break by username. */
export function resolveBracket(
  seeds: readonly string[],
  cards: ScoutCard[],
): PlayoffBracket {
  const players = [...seeds]
    .map((name) => cleanPlayoffUsername(name))
    .filter((name): name is string => Boolean(name))
    .slice(0, PLAYOFF_SIZE);

  const ovrByLogin = new Map(
    cards.map((card) => [card.username.toLowerCase(), card.ovr]),
  );

  function ovrOf(login: string | null): number | null {
    if (!login) return null;
    return ovrByLogin.get(login.toLowerCase()) ?? null;
  }

  function pickWinner(left: string | null, right: string | null): string | null {
    if (left && !right) return left;
    if (right && !left) return right;
    if (!left || !right) return null;
    const leftOvr = ovrOf(left) ?? 0;
    const rightOvr = ovrOf(right) ?? 0;
    if (leftOvr === rightOvr) {
      return left.toLowerCase() < right.toLowerCase() ? left : right;
    }
    return leftOvr > rightOvr ? left : right;
  }

  const qfPairs: Array<[string | null, string | null]> = [
    [players[0] ?? null, players[7] ?? null],
    [players[3] ?? null, players[4] ?? null],
    [players[1] ?? null, players[6] ?? null],
    [players[2] ?? null, players[5] ?? null],
  ];

  const qf: PlayoffMatch[] = qfPairs.map(([left, right], index) => ({
    id: `qf-${index + 1}`,
    round: "qf",
    left,
    right,
    winner: pickWinner(left, right),
    leftOvr: ovrOf(left),
    rightOvr: ovrOf(right),
  }));

  const sfPairs: Array<[string | null, string | null]> = [
    [qf[0].winner, qf[1].winner],
    [qf[2].winner, qf[3].winner],
  ];

  const sf: PlayoffMatch[] = sfPairs.map(([left, right], index) => ({
    id: `sf-${index + 1}`,
    round: "sf",
    left,
    right,
    winner: pickWinner(left, right),
    leftOvr: ovrOf(left),
    rightOvr: ovrOf(right),
  }));

  const finalMatch: PlayoffMatch = {
    id: "final",
    round: "final",
    left: sf[0].winner,
    right: sf[1].winner,
    winner: pickWinner(sf[0].winner, sf[1].winner),
    leftOvr: ovrOf(sf[0].winner),
    rightOvr: ovrOf(sf[1].winner),
  };

  return {
    players,
    matches: [...qf, ...sf, finalMatch],
    champion: finalMatch.winner,
  };
}
