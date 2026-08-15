import type { ScoutCard } from "./types";

export type GitHubTrophy = {
  id: string;
  title: string;
  detail: string;
  accent: "cyan" | "gold" | "violet" | "green" | "red" | "orange" | "silver";
};

export type GitHubCupProgress = GitHubTrophy & {
  unlocked: boolean;
  current: number;
  target: number;
};

export function getGitHubTrophies(card: ScoutCard): GitHubTrophy[] {
  const trophies = getGitHubCupProgress(card)
    .filter((cup) => cup.unlocked)
    .map(({ unlocked: _unlocked, current: _current, target: _target, ...cup }) => cup);
  return trophies.length
    ? trophies.slice(0, 4)
    : [
        {
          id: "rising",
          title: "Rising Cup",
          detail: "Keep building to unlock more trophies",
          accent: "silver",
        },
      ];
}

export function getGitHubCupProgress(card: ScoutCard): GitHubCupProgress[] {
  const streak = currentStreak(card);
  const cups: Array<GitHubTrophy & { current: number; target: number }> = [
    {
      id: "impact",
      title: "Impact Cup",
      detail: "Repository stars earned",
      accent: "gold",
      current: card.raw.stars,
      target: 1_000,
    },
    {
      id: "shipper",
      title: "Shipper Cup",
      detail: "Commits made this year",
      accent: "cyan",
      current: card.raw.commitsLastYear,
      target: 250,
    },
    {
      id: "collaborator",
      title: "Collaboration Cup",
      detail: "Pull requests opened",
      accent: "violet",
      current: card.raw.pullRequests,
      target: 100,
    },
    {
      id: "community",
      title: "Community Cup",
      detail: "Followers reached",
      accent: "green",
      current: card.raw.followers,
      target: 1_000,
    },
    {
      id: "veteran",
      title: "Builder Cup",
      detail: "Years on GitHub",
      accent: "red",
      current: card.raw.accountYears,
      target: 5,
    },
    {
      id: "streak",
      title: "Streak Cup",
      detail: "Consecutive contribution days",
      accent: "orange",
      current: streak,
      target: 14,
    },
  ];
  return cups.map((cup) => ({ ...cup, unlocked: cup.current >= cup.target }));
}

function currentStreak(card: ScoutCard): number {
  let streak = 0;
  const days = card.contributionWeeks.flat();
  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].count === 0) break;
    streak += 1;
  }
  return streak;
}
