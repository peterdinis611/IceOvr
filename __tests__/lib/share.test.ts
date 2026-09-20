import { describe, expect, it } from "vitest";
import { buildCardSharePayload } from "@/lib/share";

describe("buildCardSharePayload", () => {
  const card = { username: "gaearon", displayName: "DAN", ovr: 91 };

  it("builds style-aware OG, page, markdown, and social URLs", () => {
    const share = buildCardSharePayload(card, "brutal", "https://iceovr.app");

    expect(share.style).toBe("brutal");
    expect(share.edition).toBe("Puck Stamp");
    expect(share.publicPng).toBe("https://iceovr.app/gaearon.png?style=brutal");
    expect(share.pageUrl).toBe("https://iceovr.app/u/gaearon?style=brutal");
    expect(share.markdown).toContain("gaearon.png?style=brutal");
    expect(share.markdown).toContain("/u/gaearon?style=brutal");
    expect(share.twitterUrl).toContain("twitter.com/intent/tweet");
    expect(share.twitterUrl).toContain(encodeURIComponent(share.pageUrl));
    expect(share.linkedInUrl).toContain("linkedin.com/sharing/share-offsite");
    expect(share.linkedInUrl).toContain(encodeURIComponent(share.pageUrl));
  });

  it("falls back to default style for unknown values", () => {
    const share = buildCardSharePayload(card, "neon", "https://iceovr.app/");
    expect(share.style).toBe("retro");
    expect(share.publicPng).toContain("style=retro");
  });
});
