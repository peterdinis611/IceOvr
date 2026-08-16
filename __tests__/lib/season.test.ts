import { describe, expect, it } from "vitest";
import { getMilestone, getSeasonForm } from "@/lib/season";
import { makeScoutCard } from "@tests/fixtures";

describe("getSeasonForm", () => {
  it("compares the newest thirty days against the preceding period", () => {
    const weeks = Array.from({ length: 9 }, (_, week) =>
      Array.from({ length: 7 }, (_, day) => ({
        date: `2026-0${Math.min(9, week + 1)}-${String(day + 1).padStart(2, "0")}`,
        count: week < 4 ? 1 : 4,
        level: 1 as const,
      })),
    );
    const form = getSeasonForm(weeks);
    expect(form.current).toBeGreaterThan(form.previous);
    expect(form.direction).toBe("rising");
  });
});

describe("getMilestone", () => {
  it("returns the nearest locked Cup milestone", () => {
    const card = makeScoutCard({
      raw: { ...makeScoutCard().raw, stars: 900, commitsLastYear: 20 },
    });
    expect(getMilestone(card)).toMatchObject({
      title: "Impact Cup is within reach",
      detail: "100 more needed to unlock it",
      progress: 90,
    });
  });
});
