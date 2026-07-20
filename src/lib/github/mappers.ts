import type { ContributionWeek } from "@/lib/contributions";
import { contributionLevel, synthesizeContributionWeeks } from "@/lib/contributions";
import type { RawGitHubStats } from "@/lib/types";
import type { GraphQLScoutUser } from "./graphql-types";

export function mapContributionCalendar(
  weeks: GraphQLScoutUser["contributionsCollection"]["contributionCalendar"]["weeks"],
): ContributionWeek[] {
  return weeks.map((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: contributionLevel(day.contributionCount),
    })),
  );
}

export function mapGraphQLUser(user: GraphQLScoutUser): RawGitHubStats {
  const nodes = user.repositories.nodes.filter(Boolean) as Array<{
    stargazerCount: number;
    primaryLanguage: { name: string } | null;
  }>;
  const totalStars = nodes.reduce((s, n) => s + n.stargazerCount, 0);
  const languages = new Set(
    nodes.map((n) => n.primaryLanguage?.name).filter(Boolean) as string[],
  );
  const langCounts = new Map<string, number>();
  for (const n of nodes) {
    const name = n.primaryLanguage?.name;
    if (!name) continue;
    langCounts.set(name, (langCounts.get(name) ?? 0) + 1);
  }
  const topLanguage =
    [...langCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const commitsLastYear =
    user.contributionsCollection.totalCommitContributions +
    user.contributionsCollection.restrictedContributionsCount;

  const weeks = mapContributionCalendar(
    user.contributionsCollection.contributionCalendar.weeks,
  );

  return {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    location: user.location,
    company: user.company,
    createdAt: user.createdAt,
    followers: user.followers.totalCount,
    following: user.following.totalCount,
    publicRepos: user.repositories.totalCount,
    totalStars,
    commitsLastYear,
    pullRequests: user.pullRequests.totalCount,
    issues: user.issues.totalCount,
    reviews: Math.round(user.pullRequests.totalCount * 0.35),
    contributionsLifetime:
      user.contributionsCollection.contributionCalendar.totalContributions,
    languageCount: languages.size || 1,
    topLanguage,
    countryCode: null,
    contributionWeeks: weeks.length
      ? weeks
      : synthesizeContributionWeeks(user.login, commitsLastYear),
  };
}
