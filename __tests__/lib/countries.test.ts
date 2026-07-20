import { describe, expect, it } from "vitest";
import { flagImageUrl, getCountry, hasKnownCountry } from "@/lib/countries";

describe("getCountry / hasKnownCountry", () => {
  it("returns null for missing, UN, and XX", () => {
    expect(getCountry(null)).toBeNull();
    expect(getCountry(undefined)).toBeNull();
    expect(getCountry("UN")).toBeNull();
    expect(getCountry("xx")).toBeNull();
    expect(hasKnownCountry("UN")).toBe(false);
  });

  it("resolves known ISO codes case-insensitively", () => {
    expect(getCountry("sk")).toMatchObject({ code: "SK", name: "Slovakia" });
    expect(hasKnownCountry("CA")).toBe(true);
  });

  it("still returns a fallback object for unknown but real-looking codes", () => {
    expect(getCountry("ZZ")).toMatchObject({ code: "ZZ" });
    expect(hasKnownCountry("ZZ")).toBe(true);
  });
});

describe("flagImageUrl", () => {
  it("builds flagcdn URLs for valid codes", () => {
    expect(flagImageUrl("SK", 80)).toBe("https://flagcdn.com/w80/sk.png");
  });

  it("returns null for unknown / blank codes", () => {
    expect(flagImageUrl("UN")).toBeNull();
    expect(flagImageUrl("xx")).toBeNull();
    expect(flagImageUrl("")).toBeNull();
  });
});
