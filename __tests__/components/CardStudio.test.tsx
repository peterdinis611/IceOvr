import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CardStudio } from "@/components/CardStudio";
import { makeScoutCard } from "@tests/fixtures";

vi.mock("@/components/ArenaAudioProvider", () => ({
  useArenaAudio: () => ({ playPuckShot: vi.fn() }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@/components/PlayerCard", () => ({
  PlayerCard: () => <div>Player card preview</div>,
}));

vi.mock("@/components/ScoutReport", () => ({
  ScoutReport: () => <div>Scouting dossier content</div>,
}));

vi.mock("@/components/ReportInsights", () => ({
  ActivityReport: () => <div>Activity report content</div>,
}));

describe("CardStudio profile tabs", () => {
  it("switches between overview, scouting report, and activity", async () => {
    const user = userEvent.setup();
    render(<CardStudio card={makeScoutCard()} />);

    expect(screen.getByRole("tab", { name: /Overview/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("PLAYER OVERVIEW")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Scouting report/i }));
    expect(
      await screen.findByText("Scouting dossier content"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Activity/i }));
    expect(
      await screen.findByText("Activity report content"),
    ).toBeInTheDocument();
  });
});
