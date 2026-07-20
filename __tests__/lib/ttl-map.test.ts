import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { TtlMap } from "@/lib/cache/ttl-map";

describe("TtlMap", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns values within TTL and drops them after expiry", () => {
    const map = new TtlMap<string>(1000);
    map.set("a", "alpha");
    expect(map.get("a")).toBe("alpha");

    vi.advanceTimersByTime(999);
    expect(map.get("a")).toBe("alpha");

    vi.advanceTimersByTime(2);
    expect(map.get("a")).toBeUndefined();
    expect(map.has("a")).toBe(false);
  });

  it("evicts oldest entries when over max size", () => {
    const map = new TtlMap<number>(60_000, 2);
    map.set("one", 1);
    map.set("two", 2);
    map.set("three", 3);

    expect(map.size).toBe(2);
    expect(map.get("one")).toBeUndefined();
    expect(map.get("two")).toBe(2);
    expect(map.get("three")).toBe(3);
  });
});
