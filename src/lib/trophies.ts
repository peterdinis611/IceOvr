import type { ScoutCard } from "./types";

export type GitHubTrophy = {
  id: string;
  title: string;
  detail: string;
  accent: "cyan" | "gold" | "violet" | "green" | "red" | "orange" | "silver";
};

export function getGitHubTrophies(card: ScoutCard): GitHubTrophy[] {
  const trophies: GitHubTrophy[] = [];
  const streak = currentStreak(card);

  if (card.raw.stars >= 1_000) {
    trophies.push({
      id: "impact",
      title: "Impact Cup",
      detail: `${card.raw.stars.toLocaleString()} repository stars`,
      accent: "gold",
    });
  }
  if (card.raw.commitsLastYear >= 250) {
    trophies.push({
      id: "shipper",
      title: "Shipper Cup",
      detail: `${card.raw.commitsLastYear.toLocaleString()} commits this year`,
      accent: "cyan",
    });
  }
  if (card.raw.pullRequests >= 100) {
    trophies.push({
      id: "collaborator",
      title: "Collaboration Cup",
      detail: `${card.raw.pullRequests.toLocaleString()} pull requests`,
      accent: "violet",
    });
  }
  if (card.raw.followers >= 1_000) {
    trophies.push({
      id: "community",
      title: "Community Cup",
      detail: `${card.raw.followers.toLocaleString()} followers`,
      accent: "green",
    });
  }
  if (card.raw.accountYears >= 5) {
    trophies.push({
      id: "veteran",
      title: "Builder Cup",
      detail: `${card.raw.accountYears} years on GitHub`,
      accent: "red",
    });
  }
  if (streak >= 14) {
    trophies.push({
      id: "streak",
      title: "Streak Cup",
      detail: `${streak}-day contribution streak`,
      accent: "orange",
    });
  }

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

function currentStreak(card: ScoutCard): number {
  let streak = 0;
  const days = card.contributionWeeks.flat();
  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].count === 0) break;
    streak += 1;
  }
  return streak;
}
