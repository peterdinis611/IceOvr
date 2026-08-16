import type { ContributionWeek } from "./contributions";
import type { ScoutCard } from "./types";
import { getGitHubCupProgress } from "./trophies";

export type SeasonForm = {
  current: number;
  previous: number;
  delta: number;
  direction: "rising" | "steady" | "falling";
  streak: number;
};

export function getSeasonForm(weeks: ContributionWeek[]): SeasonForm {
  const days = weeks.flat();
  const recent = days.slice(-60);
  const previous = recent.slice(0, 30).reduce((sum, day) => sum + day.count, 0);
  const current = recent.slice(-30).reduce((sum, day) => sum + day.count, 0);
  const delta = current - previous;
  const baseline = Math.max(8, Math.round(previous * 0.12));
  return {
    current,
    previous,
    delta,
    direction:
      delta > baseline ? "rising" : delta < -baseline ? "falling" : "steady",
    streak: currentStreak(days),
  };
}

export function getMilestone(
  card: ScoutCard,
): { title: string; detail: string; progress: number } | null {
  const next = getGitHubCupProgress(card)
    .filter((cup) => !cup.unlocked)
    .sort((a, b) => b.current / b.target - a.current / a.target)[0];
  if (!next) return null;
  const remaining = Math.max(0, next.target - next.current);
  return {
    title: `${next.title} is within reach`,
    detail: `${remaining.toLocaleString()} more needed to unlock it`,
    progress: Math.min(100, Math.round((next.current / next.target) * 100)),
  };
}

function currentStreak(days: ContributionWeek): number {
  let streak = 0;
  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].count === 0) break;
    streak += 1;
  }
  return streak;
}
