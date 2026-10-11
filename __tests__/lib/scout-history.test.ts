import { describe, expect, it } from "vitest";
import { detectPackReveal } from "@/lib/client/scout-history";

describe("detectPackReveal", () => {
  it("returns null without a previous snapshot", () => {
    expect(detectPackReveal(null, { ovr: 70, tier: "silver" })).toBeNull();
  });

  it("detects call-up from bronze to silver", () => {
    const event = detectPackReveal(
      {
        username: "a",
        stars: 1,
        commits: 1,
        ovr: 55,
        tier: "bronze",
        at: "2026-01-01",
      },
      { ovr: 62, tier: "silver" },
    );
    expect(event?.kind).toBe("callup");
  });

  it("detects foil unlock", () => {
    const event = detectPackReveal(
      {
        username: "a",
        stars: 1,
        commits: 1,
        ovr: 80,
        tier: "gold",
        at: "2026-01-01",
      },
      { ovr: 86, tier: "elite" },
    );
    expect(event?.kind).toBe("foil");
  });

  it("ignores downgrades", () => {
    expect(
      detectPackReveal(
        {
          username: "a",
          stars: 1,
          commits: 1,
          ovr: 90,
          tier: "elite",
          at: "2026-01-01",
        },
        { ovr: 70, tier: "silver" },
      ),
    ).toBeNull();
  });
});
