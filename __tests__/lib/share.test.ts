import { describe, expect, it } from "vitest";
import { buildCardSharePayload } from "@/lib/share";
import {
  encodeCustomTheme,
  parseCustomTheme,
  sanitizeCustomTheme,
} from "@/components/player-card/customTheme";

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
    expect(share.linkedInUrl).toContain("linkedin.com/sharing");
    expect(share.linkedInUrl).toContain(encodeURIComponent(share.pageUrl));
  });

  it("falls back to default style for unknown values", () => {
    const share = buildCardSharePayload(card, "vaporwave", "https://iceovr.app/");
    expect(share.style).toBe("retro");
    expect(share.publicPng).toContain("style=retro");
  });

  it("encodes custom theme into share URLs", () => {
    const theme = sanitizeCustomTheme({
      accent: "#34d399",
      secondary: "#e11d2e",
      ink: "light",
      photo: "circle",
      stock: "MYCARD",
    });
    const share = buildCardSharePayload(card, "custom", "https://iceovr.app", theme);
    expect(share.style).toBe("custom");
    expect(share.edition).toContain("MYCARD");
    expect(share.publicPng).toContain("style=custom");
    expect(share.publicPng).toContain("theme=");
    expect(share.pageUrl).toContain("theme=");
  });
});

describe("custom theme codec", () => {
  it("round-trips compact theme encoding", () => {
    const theme = sanitizeCustomTheme({
      accent: "#e11d2e",
      secondary: "#7dd3fc",
      ink: "dark",
      photo: "stamp",
      stock: "STUDIO",
    });
    const encoded = encodeCustomTheme(theme);
    expect(parseCustomTheme(encoded)).toEqual(theme);
  });
});
