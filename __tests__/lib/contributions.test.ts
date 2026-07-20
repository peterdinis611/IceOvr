import { describe, expect, it } from "vitest";
import {
  contributionLevel,
  synthesizeContributionWeeks,
} from "@/lib/contributions";

describe("contributionLevel", () => {
  it.each([
    [0, 0],
    [1, 1],
    [3, 1],
    [4, 2],
    [6, 2],
    [7, 3],
    [9, 3],
    [10, 4],
    [99, 4],
  ] as const)("maps count %i → level %i", (count, level) => {
    expect(contributionLevel(count)).toBe(level);
  });
});

describe("synthesizeContributionWeeks", () => {
  it("returns the requested number of weeks with 7 days each", () => {
    const weeks = synthesizeContributionWeeks("seed", 100, 8);
    expect(weeks).toHaveLength(8);
    for (const week of weeks) {
      expect(week).toHaveLength(7);
      for (const day of week) {
        expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(day.level).toBe(contributionLevel(day.count));
      }
    }
  });

  it("is deterministic for the same seed", () => {
    const a = synthesizeContributionWeeks("alice", 500, 4);
    const b = synthesizeContributionWeeks("alice", 500, 4);
    expect(a).toEqual(b);
  });
});
