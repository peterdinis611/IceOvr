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
    recentPullRequests: {
      nodes: [
        {
          title: "Improve performance",
          createdAt: "2026-02-01T00:00:00Z",
          repository: { nameWithOwner: "gaearon/example" },
        },
      ],
    },
    issues: { totalCount: 400 },
    repositories: {
      totalCount: 80,
      nodes: [
        { name: "first", description: "First project", stargazerCount: 50_000, forkCount: 200, url: "https://github.com/gaearon/first", updatedAt: "2026-01-01T00:00:00Z", primaryLanguage: { name: "JavaScript" } },
        { name: "second", description: null, stargazerCount: 10_000, forkCount: 50, url: "https://github.com/gaearon/second", updatedAt: "2026-01-02T00:00:00Z", primaryLanguage: { name: "TypeScript" } },
        { name: "third", description: null, stargazerCount: 100, forkCount: 3, url: "https://github.com/gaearon/third", updatedAt: "2026-01-03T00:00:00Z", primaryLanguage: { name: "JavaScript" } },
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
    expect(raw.languages).toEqual([
      { name: "JavaScript", count: 2 },
      { name: "TypeScript", count: 1 },
    ]);
    expect(raw.repositories?.[0]).toMatchObject({ name: "first", stars: 50_000, forks: 200 });
    expect(raw.recentActivity?.[0]).toMatchObject({ label: "Improve performance", detail: "Pull request · gaearon/example" });
  });
});
