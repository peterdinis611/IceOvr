import { describe, expect, it } from "vitest";
import { mapGraphQLUser, mapContributionCalendar } from "@/lib/github/mappers";
import type { GraphQLScoutUser } from "@/lib/github/graphql-types";

function makeUser(
  overrides: Partial<GraphQLScoutUser> = {},
): GraphQLScoutUser {
  return {
    login: "gaearon",
    name: "Dan Abramov",
    avatarUrl: "https://example.com/a.png",
    bio: "React",
    location: "London",
    company: null,
    createdAt: "2011-05-25T00:00:00Z",
    followers: { totalCount: 90_000 },
    following: { totalCount: 10 },
    pullRequests: { totalCount: 900 },
    issues: { totalCount: 400 },
    repositories: {
      totalCount: 80,
      nodes: [
        { stargazerCount: 50_000, primaryLanguage: { name: "JavaScript" } },
        { stargazerCount: 10_000, primaryLanguage: { name: "TypeScript" } },
        { stargazerCount: 100, primaryLanguage: { name: "JavaScript" } },
        null,
      ],
    },
    contributionsCollection: {
      totalCommitContributions: 500,
      restrictedContributionsCount: 100,
      contributionCalendar: {
        totalContributions: 1200,
        weeks: [
          {
            contributionDays: [
              { date: "2026-01-01", contributionCount: 0 },
              { date: "2026-01-02", contributionCount: 4 },
            ],
          },
        ],
      },
    },
    ...overrides,
  };
}

describe("mapContributionCalendar", () => {
  it("maps counts to contribution levels", () => {
    const weeks = mapContributionCalendar(
      makeUser().contributionsCollection.contributionCalendar.weeks,
    );
    expect(weeks).toHaveLength(1);
    expect(weeks[0][0]).toMatchObject({ count: 0, level: 0 });
    expect(weeks[0][1]).toMatchObject({ count: 4, level: 2 });
  });
});

describe("mapGraphQLUser", () => {
  it("aggregates stars, languages, and commit totals", () => {
    const raw = mapGraphQLUser(makeUser());
    expect(raw.login).toBe("gaearon");
    expect(raw.totalStars).toBe(60_100);
    expect(raw.topLanguage).toBe("JavaScript");
    expect(raw.languageCount).toBe(2);
    expect(raw.commitsLastYear).toBe(600);
    expect(raw.contributionsLifetime).toBe(1200);
    expect(raw.pullRequests).toBe(900);
    expect(raw.reviews).toBe(Math.round(900 * 0.35));
    expect(raw.publicRepos).toBe(80);
    expect(raw.contributionWeeks[0][1].count).toBe(4);
  });
});
