import { describe, expect, it } from "vitest";
import { githubAvatarUrl, withAvatarSize } from "@/lib/avatar";

describe("avatar helpers", () => {
  it("builds GitHub avatar CDN URLs with s=", () => {
    expect(githubAvatarUrl("gaearon", 64)).toBe(
      "https://avatars.githubusercontent.com/gaearon?s=64",
    );
  });

  it("normalizes size query on avatars.githubusercontent.com", () => {
    expect(
      withAvatarSize("https://avatars.githubusercontent.com/u/1?v=4", 320),
    ).toBe("https://avatars.githubusercontent.com/u/1?v=4&s=320");
  });

  it("leaves non-GitHub hosts unchanged", () => {
    expect(withAvatarSize("https://example.com/a.png", 64)).toBe(
      "https://example.com/a.png",
    );
  });
});
