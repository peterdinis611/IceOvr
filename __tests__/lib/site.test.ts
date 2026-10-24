import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveSiteUrl } from "@/lib/site";

describe("resolveSiteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses NEXT_PUBLIC_SITE_URL when valid", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://iceovr.app/");
    expect(resolveSiteUrl()).toBe("https://iceovr.app");
  });

  it("treats empty SITE_URL as unset and falls back to VERCEL_URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "   ");
    vi.stubEnv("VERCEL_URL", "iceovr.vercel.app");
    expect(resolveSiteUrl()).toBe("https://iceovr.vercel.app");
  });

  it("falls back to localhost when nothing is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_URL", "");
    expect(resolveSiteUrl()).toBe("http://localhost:3000");
  });
});
