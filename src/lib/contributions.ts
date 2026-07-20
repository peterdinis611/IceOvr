export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

/** Flattened last ~52 weeks of daily contributions (GitHub calendar order). */
export type ContributionWeek = ContributionDay[];

/** Map GitHub contributionCount → 0–4 intensity level. */
export function contributionLevel(count: number): ContributionDay["level"] {
  if (count <= 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

/** Deterministic faux heatmap when GraphQL calendar isn't available. */
export function synthesizeContributionWeeks(
  seed: string,
  totalApprox: number,
  weeks = 52,
): ContributionWeek[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = () => {
    h = (h * 1664525 + 1013904223) >>> 0;
    return h / 0xffffffff;
  };

  const avg = Math.max(0.2, totalApprox / (weeks * 7));
  const result: ContributionWeek[] = [];
  const start = new Date();
  start.setDate(start.getDate() - weeks * 7);

  for (let w = 0; w < weeks; w++) {
    const week: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const noise = rand();
      const count =
        noise > 0.55
          ? Math.round(avg * (0.4 + noise * 3))
          : noise > 0.35
            ? Math.round(avg * noise)
            : 0;
      week.push({
        date: date.toISOString().slice(0, 10),
        count,
        level: contributionLevel(count),
      });
    }
    result.push(week);
  }
  return result;
}
