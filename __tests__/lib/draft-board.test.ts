import { describe, expect, it } from "vitest";
import {
  pickPlayerOfTheWeek,
  sortDraftBoard,
  type DraftBoardRow,
} from "@/lib/draft-board";
import { makeScoutCard } from "@tests/fixtures";
import type { SeasonForm } from "@/lib/season";

function form(overrides: Partial<SeasonForm>): SeasonForm {
  return {
    current: 40,
    previous: 30,
    delta: 10,
    direction: "rising",
    streak: 5,
    ...overrides,
  };
}

function row(
  username: string,
  ovr: number,
  stars: number,
  season: Partial<SeasonForm>,
): DraftBoardRow {
  return {
    card: makeScoutCard({
      username,
      displayName: username.toUpperCase(),
      ovr,
      raw: {
        followers: 10,
        stars,
        commitsLastYear: 100,
        pullRequests: 10,
        issues: 2,
        reviews: 5,
        contributionsLifetime: 500,
        accountYears: 4,
        languageCount: 3,
        publicRepos: 8,
      },
    }),
    form: form(season),
  };
}

describe("draft board ranking", () => {
  const rows = [
    row("a", 80, 100, { streak: 3, delta: 5, direction: "steady" }),
    row("b", 90, 40, { streak: 12, delta: 2, direction: "rising" }),
    row("c", 70, 500, { streak: 1, delta: 40, direction: "rising" }),
  ];

  it("sorts by ovr, streak, and stars", () => {
    expect(sortDraftBoard(rows, "ovr").map((r) => r.card.username)).toEqual([
      "b",
      "a",
      "c",
    ]);
    expect(sortDraftBoard(rows, "streak").map((r) => r.card.username)).toEqual([
      "b",
      "a",
      "c",
    ]);
    expect(sortDraftBoard(rows, "stars").map((r) => r.card.username)).toEqual([
      "c",
      "a",
      "b",
    ]);
  });

  it("picks rising player of the week by delta", () => {
    const potw = pickPlayerOfTheWeek(rows);
    expect(potw?.card.username).toBe("c");
  });

  it("falls back when nobody is rising", () => {
    const steady = [
      row("x", 99, 10, { delta: 1, direction: "steady" }),
      row("y", 60, 10, { delta: 20, direction: "falling" }),
    ];
    expect(pickPlayerOfTheWeek(steady)?.card.username).toBe("y");
  });
});
