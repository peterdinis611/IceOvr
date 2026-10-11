import { describe, expect, it } from "vitest";
import { scoreSharedRepos } from "@/lib/github/collaboration";

describe("scoreSharedRepos", () => {
  it("returns null when there is no overlap", () => {
    expect(
      scoreSharedRepos("alice", "bob", ["acme/one"], ["other/two"]),
    ).toBeNull();
  });

  it("scores shared repos with capped reasons", () => {
    const signal = scoreSharedRepos(
      "alice",
      "bob",
      ["Acme/One", "Acme/Two", "Acme/Three", "Acme/Four"],
      ["acme/one", "acme/two", "acme/three", "acme/four"],
    );
    expect(signal).not.toBeNull();
    expect(signal?.score).toBe(24);
    expect(signal?.reasons).toHaveLength(3);
    expect(signal?.reasons[0]).toMatch(/^shared:/);
  });
});
