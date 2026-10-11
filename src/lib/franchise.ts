import type { ScoutCard } from "@/lib/types";
import type { OrgMember } from "@/lib/github/org";

export type FranchiseSlotKey =
  | "lw"
  | "c"
  | "rw"
  | "ld"
  | "rd"
  | "g"
  | "lw2"
  | "c2"
  | "rw2"
  | "ld2"
  | "rd2"
  | "g2"
  | "b1"
  | "b2"
  | "b3"
  | "b4";

export type FranchiseAssignment = {
  name: string;
  players: Partial<Record<FranchiseSlotKey, string>>;
  captain?: FranchiseSlotKey;
  alternate?: FranchiseSlotKey;
  roster: Array<{
    username: string;
    slot: FranchiseSlotKey;
    ovr: number;
    role: "admin" | "member";
  }>;
};

const SLOT_ORDER: FranchiseSlotKey[] = [
  "c",
  "lw",
  "rw",
  "ld",
  "rd",
  "g",
  "c2",
  "lw2",
  "rw2",
  "ld2",
  "rd2",
  "g2",
  "b1",
  "b2",
  "b3",
  "b4",
];

type ScoredMember = {
  card: ScoutCard;
  role: "admin" | "member";
  centerScore: number;
  wingScore: number;
  defenseScore: number;
  goalieScore: number;
};

/** Assign org members into IceOVR lineup slots from scout cards + org roles. */
export function buildFranchiseRoster(
  orgName: string,
  members: OrgMember[],
  cards: ScoutCard[],
  maxPlayers = 16,
): FranchiseAssignment {
  const byLogin = new Map(
    cards.map((card) => [card.username.toLowerCase(), card]),
  );
  const scored: ScoredMember[] = members
    .map((member) => {
      const card = byLogin.get(member.login.toLowerCase());
      if (!card) return null;
      const adminBoost = member.role === "admin" ? 12 : 0;
      return {
        card,
        role: member.role,
        centerScore:
          card.stats.pas * 0.45 +
          card.stats.sho * 0.25 +
          card.ovr * 0.3 +
          adminBoost,
        wingScore: card.stats.spd * 0.4 + card.stats.hnd * 0.35 + card.stats.sho * 0.25,
        defenseScore:
          card.stats.def * 0.5 +
          card.stats.str * 0.25 +
          card.raw.reviews * 0.05,
        goalieScore:
          card.stats.str * 0.4 +
          card.stats.def * 0.35 +
          card.raw.accountYears * 2,
      };
    })
    .filter((item): item is ScoredMember => Boolean(item))
    .sort((a, b) => b.card.ovr - a.card.ovr)
    .slice(0, maxPlayers);

  const remaining = [...scored];
  const players: Partial<Record<FranchiseSlotKey, string>> = {};
  const roster: FranchiseAssignment["roster"] = [];

  function take(
    slot: FranchiseSlotKey,
    scoreOf: (member: ScoredMember) => number,
  ) {
    if (remaining.length === 0) return;
    remaining.sort((a, b) => scoreOf(b) - scoreOf(a));
    const pick = remaining.shift();
    if (!pick) return;
    players[slot] = pick.card.username;
    roster.push({
      username: pick.card.username,
      slot,
      ovr: pick.card.ovr,
      role: pick.role,
    });
  }

  take("c", (m) => m.centerScore);
  take("lw", (m) => m.wingScore);
  take("rw", (m) => m.wingScore);
  take("ld", (m) => m.defenseScore);
  take("rd", (m) => m.defenseScore);
  take("g", (m) => m.goalieScore);
  take("c2", (m) => m.centerScore);
  take("lw2", (m) => m.wingScore);
  take("rw2", (m) => m.wingScore);
  take("ld2", (m) => m.defenseScore);
  take("rd2", (m) => m.defenseScore);
  take("g2", (m) => m.goalieScore);

  for (const bench of ["b1", "b2", "b3", "b4"] as const) {
    take(bench, (m) => m.card.ovr);
  }

  // Fill any gaps in slot order with leftovers (should already be empty).
  for (const slot of SLOT_ORDER) {
    if (players[slot] || remaining.length === 0) continue;
    take(slot, (m) => m.card.ovr);
  }

  const captain = players.c ? ("c" as const) : undefined;
  const alternate = players.c2
    ? ("c2" as const)
    : players.lw
      ? ("lw" as const)
      : undefined;

  return {
    name: `${orgName} Franchise`.slice(0, 42),
    players,
    captain,
    alternate,
    roster,
  };
}

export function franchiseRosterToTeamUrl(
  assignment: FranchiseAssignment,
  origin = "",
): string {
  const roster = {
    name: assignment.name,
    players: assignment.players,
    captain: assignment.captain,
    alternate: assignment.alternate,
  };
  return `${origin}/team?roster=${encodeURIComponent(JSON.stringify(roster))}`;
}
