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
        name: string;
        description: string | null;
        stargazers_count: number;
        forks_count: number;
        language: string | null;
        fork: boolean;
        html_url: string;
        updated_at: string;
        pushed_at: string | null;
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
  const languageBreakdown = [...langCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
  const repositories = owned
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3)
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      url: repo.html_url,
      updatedAt: repo.pushed_at ?? repo.updated_at,
    }));

  let commitsLastYear = Math.min(
    800,
    Math.round(user.public_repos * 12 + user.followers * 0.5),
  );
  let recentActivity = repositories.map((repo) => ({
    label: `Updated ${repo.name}`,
    detail: repo.language ? `${repo.language} repository` : "Repository update",
    occurredAt: repo.updatedAt,
  }));
  try {
    const eventsRes = await fetch(
      `${REST}/users/${encodeURIComponent(login)}/events/public?per_page=100`,
      { headers, next: nextCache },
    );
    if (eventsRes.ok) {
      const events = (await eventsRes.json()) as Array<{
        type: string;
        created_at: string;
        repo: { name: string };
        payload: { action?: string; commits?: Array<unknown> };
      }>;
      const yearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
      const pushes = events.filter(
        (e) =>
          e.type === "PushEvent" && new Date(e.created_at).getTime() > yearAgo,
      ).length;
      commitsLastYear = Math.max(commitsLastYear, pushes * 8);
      recentActivity = events.slice(0, 3).map((event) => ({
        label: eventLabel(event),
        detail: event.repo.name,
        occurredAt: event.created_at,
      }));
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
    languages: languageBreakdown,
    repositories,
    recentActivity,
  };
}

function eventLabel(event: { type: string; payload: { action?: string; commits?: Array<unknown> } }): string {
  if (event.type === "PushEvent") return `${event.payload.commits?.length ?? 1} commit${(event.payload.commits?.length ?? 1) === 1 ? "" : "s"} pushed`;
  if (event.type === "PullRequestEvent") return `Pull request ${event.payload.action ?? "updated"}`;
  if (event.type === "ReleaseEvent") return "Release published";
  if (event.type === "IssuesEvent") return `Issue ${event.payload.action ?? "updated"}`;
  return event.type.replace(/Event$/, "").replace(/([A-Z])/g, " $1").trim();
}
