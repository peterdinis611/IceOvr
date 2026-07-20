import type { ScoutCard } from "@/lib/types";
import type { PlayerCardProps } from "./types";
import { tierFromRating } from "./tierStyles";
import { languageIconUrl } from "@/lib/languages";
import type { ContributionWeek } from "@/lib/contributions";

const FRONTEND = new Set([
  "JavaScript",
  "TypeScript",
  "HTML",
  "CSS",
  "Vue",
  "Svelte",
  "Dart",
]);
const BACKEND = new Set([
  "Go",
  "Rust",
  "Python",
  "Java",
  "C#",
  "PHP",
  "Ruby",
  "C",
  "C++",
  "Kotlin",
  "Scala",
  "Elixir",
]);
const DEVOPS = new Set(["Shell", "Dockerfile", "HCL", "PowerShell", "Makefile"]);
const DATA = new Set(["R", "Jupyter Notebook", "SQL", "MATLAB"]);
const MOBILE = new Set(["Swift", "Objective-C", "Kotlin"]);

/** Map language → role label for the card position badge. */
export function deriveRole(language: string | null | undefined): string {
  if (!language) return "Full Stack";
  if (FRONTEND.has(language)) return "Frontend";
  if (BACKEND.has(language)) return "Backend";
  if (DEVOPS.has(language)) return "DevOps";
  if (DATA.has(language)) return "Data";
  if (MOBILE.has(language)) return "Mobile";
  if (language === "Assembly") return "Systems";
  return "Full Stack";
}

export function computeStreak(weeks: ContributionWeek[]): number {
  const days = weeks.flat();
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) streak += 1;
    else break;
  }
  return streak;
}

/** Adapt IceOVR scout payload → PlayerCard props. */
export function scoutToPlayerCardProps(
  card: ScoutCard,
  size: "sm" | "lg" = "lg",
): PlayerCardProps {
  const rating = card.ovr;
  return {
    username: card.username,
    avatarUrl: card.avatarUrl,
    displayName: card.displayName,
    rating,
    position: deriveRole(card.topLanguage),
    tier: tierFromRating(rating),
    stats: {
      commits: card.raw.commitsLastYear,
      prs: card.raw.pullRequests,
      stars: card.raw.stars,
      streak: computeStreak(card.contributionWeeks),
      repos: Math.max(1, card.raw.publicRepos),
    },
    teamLabel: card.topLanguage,
    teamIconUrl: languageIconUrl(card.topLanguage),
    size,
  };
}
