import { describe, expect, it } from "vitest";
import {
  buildFranchiseRoster,
  franchiseRosterToTeamUrl,
} from "@/lib/franchise";
import { makeScoutCard } from "@tests/fixtures";

describe("buildFranchiseRoster", () => {
  it("assigns centers, defense, goalie, and bench from scored members", () => {
    const members = [
      { login: "admin", avatarUrl: "", role: "admin" as const },
      { login: "passer", avatarUrl: "", role: "member" as const },
      { login: "defender", avatarUrl: "", role: "member" as const },
      { login: "wall", avatarUrl: "", role: "member" as const },
      { login: "winger", avatarUrl: "", role: "member" as const },
      { login: "benchie", avatarUrl: "", role: "member" as const },
    ];
    const cards = [
      makeScoutCard({
        username: "admin",
        ovr: 90,
        stats: { spd: 70, sho: 80, hnd: 70, pas: 88, def: 60, str: 70 },
      }),
      makeScoutCard({
        username: "passer",
        ovr: 80,
        stats: { spd: 72, sho: 70, hnd: 74, pas: 86, def: 55, str: 60 },
      }),
      makeScoutCard({
        username: "defender",
        ovr: 78,
        stats: { spd: 60, sho: 55, hnd: 60, pas: 60, def: 90, str: 80 },
        raw: {
          followers: 10,
          stars: 10,
          commitsLastYear: 100,
          pullRequests: 10,
          issues: 5,
          reviews: 120,
          contributionsLifetime: 500,
          accountYears: 4,
          languageCount: 3,
          publicRepos: 8,
        },
      }),
      makeScoutCard({
        username: "wall",
        ovr: 76,
        stats: { spd: 50, sho: 50, hnd: 50, pas: 50, def: 85, str: 92 },
        raw: {
          followers: 10,
          stars: 10,
          commitsLastYear: 80,
          pullRequests: 5,
          issues: 5,
          reviews: 10,
          contributionsLifetime: 900,
          accountYears: 12,
          languageCount: 2,
          publicRepos: 6,
        },
      }),
      makeScoutCard({
        username: "winger",
        ovr: 74,
        stats: { spd: 90, sho: 85, hnd: 80, pas: 60, def: 50, str: 55 },
      }),
      makeScoutCard({
        username: "benchie",
        ovr: 70,
        stats: { spd: 65, sho: 65, hnd: 65, pas: 65, def: 65, str: 65 },
      }),
    ];

    const roster = buildFranchiseRoster("Acme", members, cards);
    expect(roster.name).toBe("Acme Franchise");
    expect(roster.players.c).toBe("admin");
    expect(roster.captain).toBe("c");
    expect(roster.players.ld ?? roster.players.rd).toBeTruthy();
    expect(roster.players.g).toBeTruthy();
    expect(roster.roster.length).toBe(6);
  });

  it("builds a team share URL", () => {
    const url = franchiseRosterToTeamUrl({
      name: "Acme Franchise",
      players: { c: "admin", lw: "winger" },
      captain: "c",
      roster: [],
    });
    expect(url.startsWith("/team?roster=")).toBe(true);
    expect(decodeURIComponent(url)).toContain("Acme Franchise");
    expect(decodeURIComponent(url)).toContain("admin");
  });
});
