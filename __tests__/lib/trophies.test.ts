import { describe, expect, it } from "vitest";
import { makeScoutCard } from "@tests/fixtures";
import { getGitHubTrophies } from "@/lib/trophies";

describe("getGitHubTrophies", () => {
  it("unlocks trophies from GitHub profile signals", () => {
    const card = makeScoutCard({
      raw: {
        ...makeScoutCard().raw,
        stars: 2_500,
        commitsLastYear: 400,
        pullRequests: 150,
        followers: 2_000,
        accountYears: 8,
      },
    });

    const trophies = getGitHubTrophies(card);

    expect(trophies.map((trophy) => trophy.id)).toEqual([
      "impact",
      "shipper",
      "collaborator",
      "community",
    ]);
  });

  it("shows a starter trophy when no thresholds are met", () => {
    const card = makeScoutCard({
      raw: {
        ...makeScoutCard().raw,
        stars: 0,
        commitsLastYear: 0,
        pullRequests: 0,
        followers: 0,
        accountYears: 0,
      },
      contributionWeeks: [
        Array.from({ length: 7 }, (_, index) => ({
          date: `2026-01-0${index + 1}`,
          count: 0,
          level: 0 as const,
        })),
      ],
    });

    expect(getGitHubTrophies(card)).toEqual([
      expect.objectContaining({ id: "rising", title: "Rising Cup" }),
    ]);
  });
});
