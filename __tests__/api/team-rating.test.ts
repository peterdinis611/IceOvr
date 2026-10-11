import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeScoutCard } from "@tests/fixtures";

const { scoutPlayer, loadCollaborationSignals } = vi.hoisted(() => ({
  scoutPlayer: vi.fn(),
  loadCollaborationSignals: vi.fn(async () => []),
}));

vi.mock("@/lib/scout", () => ({ scoutPlayer }));
vi.mock("@/lib/github/collaboration", () => ({ loadCollaborationSignals }));

import { GET } from "@/app/api/team-rating/route";

describe("GET /api/team-rating", () => {
  beforeEach(() => {
    scoutPlayer.mockReset();
    loadCollaborationSignals.mockReset();
    loadCollaborationSignals.mockResolvedValue([]);
  });

  it("calculates team OVR, chemistry, and compatible player links", async () => {
    scoutPlayer.mockImplementation(async (username: string) => {
      if (username === "alice") {
        return makeScoutCard({
          username: "alice",
          ovr: 82,
          topLanguage: "TypeScript",
          countryCode: "SK",
        });
      }
      return makeScoutCard({
        username: "bob",
        ovr: 74,
        topLanguage: "TypeScript",
        countryCode: "SK",
      });
    });

    const response = await GET(new Request("https://iceovr.test/api/team-rating?players=alice,bob"));
    const body = await response.json();

    expect(body).toMatchObject({
      ratings: { alice: 82, bob: 74 },
      teamOvr: 78,
      chemistry: 57,
      scouted: 2,
      requested: 2,
    });
    expect(body.connections).toEqual([
      { players: ["alice", "bob"], score: 12, reasons: ["TypeScript", "SK"] },
    ]);
  });

  it("boosts chemistry and connections with shared-repo signals", async () => {
    scoutPlayer.mockImplementation(async (username: string) =>
      makeScoutCard({
        username,
        ovr: 80,
        topLanguage: "Go",
        countryCode: "CA",
      }),
    );
    loadCollaborationSignals.mockResolvedValue([
      {
        players: ["alice", "bob"],
        sharedRepos: ["acme/core"],
        score: 12,
        reasons: ["shared:acme/core"],
      },
    ] as Awaited<ReturnType<typeof loadCollaborationSignals>>);

    const response = await GET(
      new Request("https://iceovr.test/api/team-rating?players=alice,bob"),
    );
    const body = await response.json();
    expect(body.chemistry).toBeGreaterThan(57);
    expect(body.connections[0].reasons).toContain("shared:acme/core");
    expect(body.connections[0].score).toBeGreaterThan(12);
  });


  it("deduplicates usernames and omits failed scouts", async () => {
    scoutPlayer.mockImplementation(async (username: string) => {
      if (username === "missing") throw new Error("Not found");
      return makeScoutCard({ username, ovr: 70, topLanguage: "Go", countryCode: "CA" });
    });

    const response = await GET(
      new Request("https://iceovr.test/api/team-rating?players=alice,alice,missing"),
    );
    const body = await response.json();

    expect(scoutPlayer).toHaveBeenCalledTimes(2);
    expect(body).toMatchObject({
      ratings: { alice: 70 },
      teamOvr: 70,
      chemistry: 55,
      scouted: 1,
      requested: 2,
      connections: [],
    });
  });
});
