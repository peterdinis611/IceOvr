import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlayerCard } from "@/components/player-card/PlayerCard";
import type { PlayerCardProps } from "@/components/player-card/types";

function baseProps(overrides: Partial<PlayerCardProps> = {}): PlayerCardProps {
  return {
    username: "torvalds",
    avatarUrl: "https://avatars.githubusercontent.com/u/1024025?v=4",
    displayName: "LINUS TORVALDS",
    rating: 88,
    position: "Backend",
    tier: "elite",
    stats: {
      commits: 800,
      prs: 40,
      stars: 180000,
      streak: 12,
      repos: 8,
    },
    teamLabel: "C",
    ...overrides,
  };
}

describe("PlayerCard", () => {
  it("renders identity, rating, tier and core stats", () => {
    render(<PlayerCard {...baseProps()} />);

    expect(screen.getByLabelText(/LINUS TORVALDS IceOVR card, 88 overall/i)).toBeInTheDocument();
    expect(screen.getAllByText("LINUS TORVALDS").length).toBeGreaterThan(0);
    expect(screen.getAllByText("@torvalds").length).toBeGreaterThan(0);
    expect(screen.getByText("ELITE")).toBeInTheDocument();
    for (const label of ["Commits", "PRs", "Stars", "Streak", "Repos"]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByText("180k").length).toBeGreaterThan(0);
  });

  it("shows language team mark when icon URL is provided", () => {
    render(
      <PlayerCard
        {...baseProps({
          teamLabel: "Rust",
          teamIconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
        })}
      />,
    );
    expect(screen.getByAltText("Rust")).toBeInTheDocument();
  });

  it("applies legend foil stock styling on retro edition", () => {
    const { container } = render(
      <PlayerCard {...baseProps({ tier: "legend", rating: 95, style: "retro" })} />,
    );
    expect(screen.getByText("LEGEND")).toBeInTheDocument();
    expect(screen.getByText("FOIL")).toBeInTheDocument();
    expect(container.querySelector('[aria-label*="legend"]')).toBeTruthy();
  });

  it("marks lower tiers as matte cardboard on retro edition", () => {
    render(<PlayerCard {...baseProps({ tier: "gold", rating: 78, style: "retro" })} />);
    expect(screen.getByText("MATTE")).toBeInTheDocument();
  });

  it("switches to arena night edition", () => {
    render(<PlayerCard {...baseProps({ style: "arena" })} />);
    expect(screen.getByText("ARENA")).toBeInTheDocument();
    expect(screen.getByLabelText(/arena style/i)).toBeInTheDocument();
  });

  it("switches to puck stamp edition", () => {
    render(<PlayerCard {...baseProps({ style: "brutal" })} />);
    expect(screen.getByText("PUCK STAMP")).toBeInTheDocument();
    expect(screen.getByText("RAW")).toBeInTheDocument();
  });

  it("responds to mouse tilt without crashing", async () => {
    const user = userEvent.setup();
    const { container } = render(<PlayerCard {...baseProps()} />);
    const card = container.querySelector("article");
    expect(card).toBeTruthy();
    await user.hover(card!);
    expect(card).toBeInTheDocument();
  });
});
