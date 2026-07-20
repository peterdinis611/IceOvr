import { describe, expect, it } from "vitest";
import { tierFromRating, TIER_VISUAL } from "@/components/player-card/tierStyles";
import {
  computeStreak,
  deriveRole,
  scoutToPlayerCardProps,
} from "@/components/player-card/fromScout";
import { makeScoutCard } from "@tests/fixtures";
import type { ContributionWeek } from "@/lib/contributions";

describe("tierFromRating", () => {
  it.each([
    [-5, "bronze"],
    [0, "bronze"],
    [59.4, "bronze"],
    [59.6, "silver"],
    [74.4, "silver"],
    [75, "gold"],
    [84.4, "gold"],
    [85, "elite"],
    [92.4, "elite"],
    [93, "legend"],
    [120, "legend"],
  ] as const)("rating %s → %s", (rating, tier) => {
    expect(tierFromRating(rating)).toBe(tier);
  });

  it("defines visual tokens for every tier", () => {
    for (const tier of ["bronze", "silver", "gold", "elite", "legend"] as const) {
      expect(TIER_VISUAL[tier].label).toBeTruthy();
      expect(TIER_VISUAL[tier].frame).toContain("gradient");
      expect(TIER_VISUAL[tier].accent).toMatch(/^#/);
    }
  });
});

describe("deriveRole", () => {
  it.each([
    [null, "Full Stack"],
    [undefined, "Full Stack"],
    ["TypeScript", "Frontend"],
    ["JavaScript", "Frontend"],
    ["Rust", "Backend"],
    ["Go", "Backend"],
    ["Python", "Backend"],
    ["Shell", "DevOps"],
    ["Dockerfile", "DevOps"],
    ["Swift", "Mobile"],
    ["SQL", "Data"],
    ["Assembly", "Systems"],
    ["Haskell", "Full Stack"],
  ] as const)("%s → %s", (lang, role) => {
    expect(deriveRole(lang)).toBe(role);
  });
});

describe("computeStreak", () => {
  it("counts consecutive active days from the end", () => {
    const weeks: ContributionWeek[] = [
      [
        { date: "2026-01-01", count: 1, level: 1 },
        { date: "2026-01-02", count: 0, level: 0 },
        { date: "2026-01-03", count: 2, level: 1 },
        { date: "2026-01-04", count: 3, level: 1 },
        { date: "2026-01-05", count: 1, level: 1 },
        { date: "2026-01-06", count: 4, level: 2 },
        { date: "2026-01-07", count: 2, level: 1 },
      ],
    ];
    expect(computeStreak(weeks)).toBe(5);
  });

  it("returns 0 when the latest day is empty", () => {
    const weeks: ContributionWeek[] = [
      [
        { date: "2026-01-01", count: 5, level: 2 },
        { date: "2026-01-02", count: 5, level: 2 },
        { date: "2026-01-03", count: 5, level: 2 },
        { date: "2026-01-04", count: 5, level: 2 },
        { date: "2026-01-05", count: 5, level: 2 },
        { date: "2026-01-06", count: 5, level: 2 },
        { date: "2026-01-07", count: 0, level: 0 },
      ],
    ];
    expect(computeStreak(weeks)).toBe(0);
  });
});

describe("scoutToPlayerCardProps", () => {
  it("maps scout payload into card props", () => {
    const card = makeScoutCard({
      username: "gaearon",
      displayName: "DAN ABRAMOV",
      ovr: 88,
      topLanguage: "JavaScript",
      raw: {
        followers: 1,
        stars: 9000,
        commitsLastYear: 400,
        pullRequests: 120,
        issues: 10,
        reviews: 50,
        contributionsLifetime: 5000,
        accountYears: 10,
        languageCount: 6,
        publicRepos: 80,
      },
      contributionWeeks: [
        Array.from({ length: 7 }, (_, i) => ({
          date: `2026-02-0${i + 1}`,
          count: i === 6 ? 0 : 2,
          level: (i === 6 ? 0 : 1) as 0 | 1,
        })),
      ],
    });

    const props = scoutToPlayerCardProps(card, "sm");
    expect(props.username).toBe("gaearon");
    expect(props.rating).toBe(88);
    expect(props.tier).toBe("elite");
    expect(props.position).toBe("Frontend");
    expect(props.size).toBe("sm");
    expect(props.stats.commits).toBe(400);
    expect(props.stats.prs).toBe(120);
    expect(props.stats.stars).toBe(9000);
    expect(props.stats.repos).toBe(80);
    expect(props.stats.streak).toBe(0);
    expect(props.teamLabel).toBe("JavaScript");
    expect(props.teamIconUrl).toContain("javascript");
  });

  it("clamps repos to at least 1", () => {
    const card = makeScoutCard({
      raw: {
        ...makeScoutCard().raw,
        publicRepos: 0,
      },
    });
    expect(scoutToPlayerCardProps(card).stats.repos).toBe(1);
  });
});
