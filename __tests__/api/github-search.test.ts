import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/github-search/route";

describe("GET /api/github-search", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("does not call GitHub for a query shorter than two characters", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(new Request("https://iceovr.test/api/github-search?q=a"));

    expect(fetchMock).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual({ users: [] });
  });

  it("returns a compact list of matching GitHub users", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          items: [
            {
              login: "torvalds",
              avatar_url: "https://avatars.githubusercontent.com/u/1024025",
              html_url: "https://github.com/torvalds",
            },
          ],
        }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(new Request("https://iceovr.test/api/github-search?q=tor"));

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("q=tor+in:login"),
      expect.objectContaining({ headers: expect.any(Object) }),
    );
    await expect(response.json()).resolves.toEqual({
      users: [
        {
          login: "torvalds",
          avatarUrl: "https://avatars.githubusercontent.com/u/1024025",
          url: "https://github.com/torvalds",
        },
      ],
    });
  });
});
