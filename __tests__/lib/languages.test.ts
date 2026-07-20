import { describe, expect, it } from "vitest";
import { getLanguageMeta, languageIconUrl } from "@/lib/languages";

describe("languages", () => {
  it("resolves TypeScript meta and icon", () => {
    expect(getLanguageMeta("TypeScript")).toMatchObject({
      short: "TS",
      name: "TypeScript",
    });
    expect(languageIconUrl("TypeScript")).toContain("typescript");
  });

  it("returns a fallback meta (no icon) for unknown languages", () => {
    const meta = getLanguageMeta("Brainfuck");
    expect(meta).toMatchObject({ name: "Brainfuck", short: "BRA" });
    expect(meta?.icon).toBe("");
    expect(languageIconUrl("Brainfuck")).toBeNull();
    expect(languageIconUrl(null)).toBeNull();
  });
});
