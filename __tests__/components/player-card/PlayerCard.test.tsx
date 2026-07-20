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

    expect(screen.getByLabelText(/LINUS TORVALDS IceOVR card/i)).toBeInTheDocument();
    expect(screen.getByText("LINUS TORVALDS")).toBeInTheDocument();
    expect(screen.getByText("@torvalds")).toBeInTheDocument();
    expect(screen.getByText("88")).toBeInTheDocument();
    expect(screen.getByText("ELITE")).toBeInTheDocument();
    expect(screen.getByText("Commits")).toBeInTheDocument();
    expect(screen.getByText("PRs")).toBeInTheDocument();
    expect(screen.getByText("Stars")).toBeInTheDocument();
    expect(screen.getByText("Streak")).toBeInTheDocument();
    expect(screen.getByText("Repos")).toBeInTheDocument();
    expect(screen.getByText("180k")).toBeInTheDocument();
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

  it("applies legend holographic frame styling", () => {
    const { container } = render(<PlayerCard {...baseProps({ tier: "legend", rating: 95 })} />);
    expect(screen.getByText("LEGEND")).toBeInTheDocument();
    expect(container.querySelector('[aria-label*="legend"]')).toBeTruthy();
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
