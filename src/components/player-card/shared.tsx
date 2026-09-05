import type { SVGProps } from "react";
import type { PlayerCardStats } from "./types";

export const CARD_STATS = [
  { key: "commits", label: "Commits", max: 1200 },
  { key: "prs", label: "PRs", max: 400 },
  { key: "stars", label: "Stars", max: 5000 },
  { key: "streak", label: "Streak", max: 60 },
  { key: "repos", label: "Repos", max: 80 },
] as const satisfies ReadonlyArray<{
  key: keyof PlayerCardStats;
  label: string;
  max: number;
}>;

export function formatStat(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 10_000) return `${Math.round(value / 1000)}k`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

export function attributeScore(value: number, max: number): number {
  return Math.round(40 + Math.min(1, value / max) * 59);
}

export function GitHubMark({ size, ...props }: { size: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .08 1.53 1.05 1.53 1.05.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.15-4.56-5.1 0-1.13.39-2.05 1.04-2.78-.11-.26-.45-1.31.1-2.73 0 0 .85-.28 2.75 1.06A9.33 9.33 0 0 1 12 6.38c.85 0 1.7.12 2.5.35 1.9-1.34 2.74-1.06 2.74-1.06.55 1.42.2 2.47.1 2.73.65.73 1.04 1.65 1.04 2.78 0 3.96-2.34 4.83-4.57 5.09.36.32.68.93.68 1.88 0 1.36-.01 2.45-.01 2.79 0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}
