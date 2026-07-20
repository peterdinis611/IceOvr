import { describe, expect, it } from "vitest";
import {
  buildScoutCard,
  computeOvr,
  computeStats,
  pickPosition,
  pickTier,
} from "@/lib/scoring";
import { makeRaw } from "@tests/fixtures";

describe("pickTier", () => {
  it.each([
    [40, "bronze"],
    [59, "bronze"],
    [60, "silver"],
    [74, "silver"],
    [75, "gold"],
    [84, "gold"],
    [85, "elite"],
    [92, "elite"],
    [93, "legend"],
    [99, "legend"],
  ] as const)("maps OVR %i → %s", (ovr, tier) => {
    expect(pickTier(ovr)).toBe(tier);
  });
});

describe("computeStats", () => {
  it("keeps every attribute inside 40–88", () => {
    const stats = computeStats(
      makeRaw({
        login: "quiet-dev",
        commitsLastYear: 0,
        totalStars: 0,
        pullRequests: 0,
        followers: 0,
        reviews: 0,
        issues: 0,
        contributionsLifetime: 0,
        languageCount: 0,
      }),
    );

    for (const value of Object.values(stats)) {
      expect(value).toBeGreaterThanOrEqual(40);
      expect(value).toBeLessThanOrEqual(88);
    }
  });

  it("raises shooting when stars are high", () => {
    const low = computeStats(makeRaw({ login: "a", totalStars: 5 }));
    const high = computeStats(makeRaw({ login: "b", totalStars: 50_000 }));
    expect(high.sho).toBeGreaterThan(low.sho);
  });

  it("raises skating when commits are high", () => {
    const low = computeStats(makeRaw({ login: "a", commitsLastYear: 10 }));
    const high = computeStats(makeRaw({ login: "b", commitsLastYear: 2000 }));
    expect(high.spd).toBeGreaterThan(low.spd);
  });
});

describe("computeOvr", () => {
  it("stays within 45–99", () => {
    const raw = makeRaw({ login: "mid" });
    const ovr = computeOvr(computeStats(raw), raw);
    expect(ovr).toBeGreaterThanOrEqual(45);
    expect(ovr).toBeLessThanOrEqual(99);
  });

  it("boosts legacy accounts with high influence past the soft 88 cap", () => {
    const raw = makeRaw({
      login: "legend-dev",
      createdAt: "2008-01-01T00:00:00Z",
      followers: 100_000,
      totalStars: 80_000,
      contributionsLifetime: 50_000,
      commitsLastYear: 800,
      pullRequests: 400,
      reviews: 300,
      issues: 200,
      languageCount: 8,
    });
    const ovr = computeOvr(computeStats(raw), raw);
    expect(ovr).toBeGreaterThan(88);
  });
});

describe("pickPosition", () => {
  const stats = {
    spd: 70,
    sho: 80,
    hnd: 65,
    pas: 72,
    def: 60,
    str: 55,
  };

  it("is deterministic for the same seed", () => {
    const a = pickPosition(stats, "torvalds");
    const b = pickPosition(stats, "torvalds");
    expect(a).toEqual(b);
  });

  it("can differ across seeds", () => {
    const seeds = ["alice", "bob", "carol", "dave", "erin", "frank"];
    const positions = new Set(seeds.map((s) => pickPosition(stats, s).position));
    expect(positions.size).toBeGreaterThan(1);
  });

  it("assigns Standing Wall when position lands on G", () => {
    // Find a seed that hashes to G (index 5)
    let found: string | null = null;
    for (let i = 0; i < 500; i++) {
      const seed = `seed-${i}`;
      if (pickPosition(stats, seed).position === "G") {
        found = seed;
        break;
      }
    }
    expect(found).not.toBeNull();
    expect(pickPosition(stats, found!).archetype).toBe("Standing Wall");
  });
});

describe("buildScoutCard", () => {
  it("uppercases display name and keeps username casing from login", () => {
    const card = buildScoutCard(
      makeRaw({ login: "Gaearon", name: "Dan Abramov", location: "London" }),
    );
    expect(card.username).toBe("Gaearon");
    expect(card.displayName).toBe("DAN ABRAMOV");
    expect(card.countryCode).toBe("GB");
  });

  it("falls back displayName to login when name is missing", () => {
    const card = buildScoutCard(makeRaw({ login: "ghost", name: null }));
    expect(card.displayName).toBe("GHOST");
  });

  it("prefers explicit countryCode over location guess", () => {
    const card = buildScoutCard(
      makeRaw({
        login: "sk-dev",
        location: "London, UK",
        countryCode: "SK",
      }),
    );
    expect(card.countryCode).toBe("SK");
  });

  it("returns null country when location is unknown", () => {
    const card = buildScoutCard(
      makeRaw({ login: "nomad", location: "Remote Ocean", countryCode: null }),
    );
    expect(card.countryCode).toBeNull();
  });

  it("guesses Slovakia from Bratislava", () => {
    const card = buildScoutCard(
      makeRaw({ login: "sk", location: "Bratislava, Slovakia" }),
    );
    expect(card.countryCode).toBe("SK");
  });

  it("sets tier from computed OVR bands", () => {
    const card = buildScoutCard(
      makeRaw({
        login: "elite-ish",
        createdAt: "2010-01-01T00:00:00Z",
        followers: 20_000,
        totalStars: 30_000,
        contributionsLifetime: 20_000,
        commitsLastYear: 900,
        pullRequests: 200,
        reviews: 150,
      }),
    );
    expect(["gold", "elite", "legend"]).toContain(card.tier);
    expect(pickTier(card.ovr)).toBe(card.tier);
  });

  it("copies publicRepos into raw stats", () => {
    const card = buildScoutCard(makeRaw({ login: "r", publicRepos: 42 }));
    expect(card.raw.publicRepos).toBe(42);
  });
});
