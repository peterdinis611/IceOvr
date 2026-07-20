import { synthesizeContributionWeeks } from "@/lib/contributions";
import type { RawGitHubStats } from "@/lib/types";
import { SCOUT_REVALIDATE_SECONDS } from "@/lib/cache";

const REST = "https://api.github.com";
const nextCache = { revalidate: SCOUT_REVALIDATE_SECONDS, tags: ["github-rest"] as string[] };

/** Public REST fallback when `GITHUB_TOKEN` is missing (no contribution calendar). */
export async function fetchGitHubProfileViaRest(
  login: string,
): Promise<RawGitHubStats> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "IceOVR-Scout",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const [userRes, reposRes] = await Promise.all([
    fetch(`${REST}/users/${encodeURIComponent(login)}`, {
      headers,
      next: nextCache,
    }),
    fetch(
      `${REST}/users/${encodeURIComponent(login)}/repos?per_page=100&sort=updated`,
      { headers, next: nextCache },
    ),
  ]);

  if (userRes.status === 404) {
    throw new Error(`Player "${login}" not found in the league.`);
  }
  if (!userRes.ok) {
    throw new Error(`GitHub API error: ${userRes.status}`);
  }

  const user = (await userRes.json()) as {
    login: string;
    name: string | null;
    avatar_url: string;
    bio: string | null;
    location: string | null;
    company: string | null;
    created_at: string;
    followers: number;
    following: number;
    public_repos: number;
  };

  const repos = reposRes.ok
    ? ((await reposRes.json()) as Array<{
        stargazers_count: number;
        language: string | null;
        fork: boolean;
      }>)
    : [];

  const owned = repos.filter((r) => !r.fork);
  const totalStars = owned.reduce((s, r) => s + r.stargazers_count, 0);
  const languages = new Set(
    owned.map((r) => r.language).filter(Boolean) as string[],
  );
  const langCounts = new Map<string, number>();
  for (const r of owned) {
    if (!r.language) continue;
    langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1);
  }
  const topLanguage =
    [...langCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  let commitsLastYear = Math.min(
    800,
    Math.round(user.public_repos * 12 + user.followers * 0.5),
  );
  try {
    const eventsRes = await fetch(
      `${REST}/users/${encodeURIComponent(login)}/events/public?per_page=100`,
      { headers, next: nextCache },
    );
    if (eventsRes.ok) {
      const events = (await eventsRes.json()) as Array<{
        type: string;
        created_at: string;
      }>;
      const yearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
      const pushes = events.filter(
        (e) =>
          e.type === "PushEvent" && new Date(e.created_at).getTime() > yearAgo,
      ).length;
      commitsLastYear = Math.max(commitsLastYear, pushes * 8);
    }
  } catch {
    // keep estimate
  }

  const contributionsLifetime = Math.round(
    totalStars * 3 + user.public_repos * 40 + user.followers * 2,
  );

  return {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    location: user.location,
    company: user.company,
    createdAt: user.created_at,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos,
    totalStars,
    commitsLastYear,
    pullRequests: Math.round(user.public_repos * 1.4),
    issues: Math.round(user.public_repos * 0.8),
    reviews: Math.round(user.followers * 0.3 + user.public_repos * 0.5),
    contributionsLifetime,
    languageCount: languages.size || 1,
    topLanguage,
    countryCode: null,
    contributionWeeks: synthesizeContributionWeeks(user.login, commitsLastYear),
  };
}
