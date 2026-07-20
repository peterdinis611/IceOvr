import type { RawGitHubStats, ScoutCard } from "@/lib/types";
import { synthesizeContributionWeeks } from "@/lib/contributions";

export function makeRaw(
  overrides: Partial<RawGitHubStats> & Pick<RawGitHubStats, "login">,
): RawGitHubStats {
  const login = overrides.login;
  const base: RawGitHubStats = {
    login,
    name: overrides.name ?? login,
    avatarUrl: overrides.avatarUrl ?? `https://avatars.githubusercontent.com/${login}`,
    bio: overrides.bio ?? null,
    location: overrides.location ?? null,
    company: overrides.company ?? null,
    createdAt: overrides.createdAt ?? "2018-01-01T00:00:00Z",
    followers: overrides.followers ?? 10,
    following: overrides.following ?? 5,
    publicRepos: overrides.publicRepos ?? 8,
    totalStars: overrides.totalStars ?? 20,
    commitsLastYear: overrides.commitsLastYear ?? 50,
    pullRequests: overrides.pullRequests ?? 5,
    issues: overrides.issues ?? 3,
    reviews: overrides.reviews ?? 4,
    contributionsLifetime: overrides.contributionsLifetime ?? 200,
    languageCount: overrides.languageCount ?? 3,
    topLanguage: overrides.topLanguage ?? "TypeScript",
    countryCode: overrides.countryCode ?? null,
    contributionWeeks:
      overrides.contributionWeeks ??
      synthesizeContributionWeeks(login, overrides.commitsLastYear ?? 50, 4),
  };
  return {
    ...base,
    ...overrides,
    contributionWeeks: overrides.contributionWeeks ?? base.contributionWeeks,
  };
}

export function makeScoutCard(overrides: Partial<ScoutCard> = {}): ScoutCard {
  return {
    username: "tester",
    displayName: "TESTER",
    avatarUrl: "https://example.com/a.png",
    bio: null,
    location: "Bratislava",
    countryCode: "SK",
    topLanguage: "TypeScript",
    ovr: 72,
    position: "C",
    archetype: "Playmaker",
    tier: "silver",
    stats: { spd: 70, sho: 68, hnd: 72, pas: 74, def: 65, str: 60 },
    contributionWeeks: [
      [
        { date: "2026-01-01", count: 1, level: 1 },
        { date: "2026-01-02", count: 2, level: 1 },
        { date: "2026-01-03", count: 0, level: 0 },
        { date: "2026-01-04", count: 3, level: 1 },
        { date: "2026-01-05", count: 1, level: 1 },
        { date: "2026-01-06", count: 1, level: 1 },
        { date: "2026-01-07", count: 4, level: 2 },
      ],
    ],
    raw: {
      followers: 100,
      stars: 50,
      commitsLastYear: 200,
      pullRequests: 30,
      issues: 10,
      reviews: 20,
      contributionsLifetime: 1000,
      accountYears: 5,
      languageCount: 4,
      publicRepos: 12,
    },
    scoutedAt: "2026-07-19T00:00:00.000Z",
    ...overrides,
  };
}
