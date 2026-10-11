import { SCOUT_REVALIDATE_SECONDS } from "@/lib/cache";
import { unstable_cache } from "next/cache";

const REST = "https://api.github.com";
const MAX_REPOS_PER_USER = 20;
const MAX_SHARED_SCORE = 24;
const SHARED_REPO_POINTS = 12;

export type CollaborationSignal = {
  players: [string, string];
  sharedRepos: string[];
  score: number;
  reasons: string[];
};

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "IceOVR-Scout",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

async function fetchContributedReposUncached(
  login: string,
): Promise<string[]> {
  const headers = githubHeaders();
  const repos = new Set<string>();

  try {
    const eventsRes = await fetch(
      `${REST}/users/${encodeURIComponent(login)}/events/public?per_page=100`,
      {
        headers,
        next: { revalidate: SCOUT_REVALIDATE_SECONDS },
      },
    );
    if (eventsRes.ok) {
      const events = (await eventsRes.json()) as Array<{
        repo?: { name?: string };
      }>;
      for (const event of events) {
        if (event.repo?.name) repos.add(event.repo.name.toLowerCase());
        if (repos.size >= MAX_REPOS_PER_USER) break;
      }
    }
  } catch {
    // degrade
  }

  if (repos.size < 5) {
    try {
      const reposRes = await fetch(
        `${REST}/users/${encodeURIComponent(login)}/repos?per_page=30&sort=updated`,
        {
          headers,
          next: { revalidate: SCOUT_REVALIDATE_SECONDS },
        },
      );
      if (reposRes.ok) {
        const body = (await reposRes.json()) as Array<{
          full_name?: string;
          fork?: boolean;
        }>;
        for (const repo of body) {
          if (repo.fork || !repo.full_name) continue;
          repos.add(repo.full_name.toLowerCase());
          if (repos.size >= MAX_REPOS_PER_USER) break;
        }
      }
    } catch {
      // degrade
    }
  }

  return [...repos].slice(0, MAX_REPOS_PER_USER);
}

export async function fetchContributedRepos(login: string): Promise<string[]> {
  const key = login.toLowerCase();
  return unstable_cache(
    () => fetchContributedReposUncached(key),
    ["iceovr-collab-repos", key],
    { revalidate: SCOUT_REVALIDATE_SECONDS },
  )();
}

export function scoreSharedRepos(
  left: string,
  right: string,
  leftRepos: readonly string[],
  rightRepos: readonly string[],
): CollaborationSignal | null {
  const rightSet = new Set(rightRepos.map((repo) => repo.toLowerCase()));
  const shared = leftRepos
    .map((repo) => repo.toLowerCase())
    .filter((repo) => rightSet.has(repo));
  if (shared.length === 0) return null;
  const unique = [...new Set(shared)].slice(0, 3);
  const score = Math.min(MAX_SHARED_SCORE, unique.length * SHARED_REPO_POINTS);
  return {
    players: [left, right],
    sharedRepos: unique,
    score,
    reasons: unique.map((repo) => `shared:${repo}`),
  };
}

/** Load collaboration signals for all unique pairs among usernames. */
export async function loadCollaborationSignals(
  usernames: readonly string[],
): Promise<CollaborationSignal[]> {
  const unique = [
    ...new Set(
      usernames
        .map((name) => name.replace(/^@/, "").toLowerCase())
        .filter(Boolean),
    ),
  ].slice(0, 16);

  if (unique.length < 2) return [];

  const repoLists = await Promise.all(
    unique.map(async (login) => {
      try {
        return await fetchContributedRepos(login);
      } catch {
        return [] as string[];
      }
    }),
  );

  const byLogin = new Map(
    unique.map((login, index) => [login, repoLists[index]]),
  );
  const signals: CollaborationSignal[] = [];

  for (let i = 0; i < unique.length; i += 1) {
    for (let j = i + 1; j < unique.length; j += 1) {
      const left = unique[i];
      const right = unique[j];
      const signal = scoreSharedRepos(
        left,
        right,
        byLogin.get(left) ?? [],
        byLogin.get(right) ?? [],
      );
      if (signal) signals.push(signal);
    }
  }

  return signals.sort((a, b) => b.score - a.score);
}
