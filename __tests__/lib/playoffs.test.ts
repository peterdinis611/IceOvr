import { describe, expect, it } from "vitest";
import {
  buildPlayoffPath,
  parsePlayoffPlayers,
  resolveBracket,
} from "@/lib/playoffs";
import { makeScoutCard } from "@tests/fixtures";

describe("playoffs", () => {
  it("parses p1..p8 and players query", () => {
    expect(
      parsePlayoffPlayers({
        p1: "alice",
        p2: "@bob",
        players: "carol,dave",
      }),
    ).toEqual(["carol", "dave", "alice", "bob"]);
  });

  it("resolves single-elim winners by higher OVR", () => {
    const seeds = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
    ];
    const cards = seeds.map((username, index) =>
      makeScoutCard({ username, ovr: 60 + index }),
    );
    const bracket = resolveBracket(seeds, cards);
    expect(bracket.matches).toHaveLength(7);
    expect(bracket.champion).toBe("h");
    const final = bracket.matches.find((match) => match.round === "final");
    expect(final?.winner).toBe("h");
  });

  it("builds shareable playoff paths", () => {
    expect(buildPlayoffPath(["alice", "bob"])).toBe(
      "/playoffs?p1=alice&p2=bob",
    );
  });
});
