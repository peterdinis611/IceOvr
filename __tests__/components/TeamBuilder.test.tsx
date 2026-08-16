import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { playPuckShot } = vi.hoisted(() => ({
  playPuckShot: vi.fn(),
}));

vi.mock("@/components/ArenaAudioProvider", () => ({
  useArenaAudio: () => ({ playPuckShot }),
}));

import { TeamBuilder } from "@/components/TeamBuilder";

const teamRating = {
  ratings: { octocat: 78 },
  teamOvr: 78,
  chemistry: 55,
  scouted: 1,
  requested: 1,
  connections: [],
};

describe("TeamBuilder", () => {
  beforeEach(() => {
    window.localStorage.clear();
    playPuckShot.mockReset();
    vi.stubGlobal(
      "fetch",
      vi.fn((input: string | URL | Request) => {
        const url = String(input);
        const body = url.includes("github-search") ? { users: [] } : teamRating;
        return Promise.resolve(new Response(JSON.stringify(body)));
      }),
    );
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it("names a team and assigns a GitHub username to the selected slot", async () => {
    const user = userEvent.setup();
    render(<TeamBuilder />);

    await user.clear(screen.getByLabelText("Team name"));
    await user.type(screen.getByLabelText("Team name"), "Slovak Pucks");
    await user.type(screen.getByPlaceholderText("@torvalds"), "octocat");
    await user.click(screen.getByRole("button", { name: "ADD TO ROSTER" }));

    expect((await screen.findAllByText("@octocat")).length).toBeGreaterThan(0);
    expect(await screen.findByText("78 OVR")).toBeInTheDocument();
    expect(playPuckShot).toHaveBeenCalled();
    expect(JSON.parse(window.localStorage.getItem("iceovr-team-v1") ?? "{}")).toMatchObject({
      name: "Slovak Pucks",
      players: { c: "octocat" },
    });
  });

  it("copies a share link that recreates the named roster", async () => {
    const user = userEvent.setup();
    render(<TeamBuilder />);

    await user.type(screen.getByPlaceholderText("@torvalds"), "octocat");
    await user.click(screen.getByRole("button", { name: "ADD TO ROSTER" }));
    await user.click(screen.getByRole("button", { name: "COPY SHARE LINK" }));

    expect(await screen.findByRole("button", { name: "LINK COPIED!" })).toBeInTheDocument();
  });
});
