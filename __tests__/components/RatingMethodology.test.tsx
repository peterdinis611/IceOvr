import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  RATING_INGREDIENTS,
  TIER_BANDS,
  describeOvrFormula,
} from "@/lib/rating-methodology";
import {
  HowItWorksButton,
  RatingMethodologyButton,
} from "@/components/RatingMethodology";
import { makeScoutCard } from "@tests/fixtures";

describe("rating-methodology data", () => {
  it("covers all six attributes with weights summing to 100%", () => {
    expect(RATING_INGREDIENTS).toHaveLength(6);
    const sum = RATING_INGREDIENTS.reduce((acc, row) => acc + row.weight, 0);
    expect(sum).toBeCloseTo(1, 5);
  });

  it("lists five rarity bands", () => {
    expect(TIER_BANDS.map((b) => b.tier)).toEqual([
      "Bronze",
      "Silver",
      "Gold",
      "Elite",
      "Legend",
    ]);
  });

  it("mentions legacy boost for high OVR", () => {
    const low = describeOvrFormula(makeScoutCard({ ovr: 70 }));
    const high = describeOvrFormula(makeScoutCard({ ovr: 91 }));
    const guide = describeOvrFormula(null);
    expect(low).toMatch(/soft-capped/i);
    expect(high).toMatch(/legacy/i);
    expect(guide).toMatch(/legacy boost/i);
  });
});

describe("RatingMethodologyDialog", () => {
  it("opens as a dialog with methodology content", async () => {
    const user = userEvent.setup();
    render(
      <RatingMethodologyButton
        card={makeScoutCard({
          ovr: 58,
          tier: "bronze",
          raw: {
            ...makeScoutCard().raw,
            commitsLastYear: 752,
            stars: 0,
            pullRequests: 25,
          },
        })}
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /How rating works/i }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/How this rating is built/i)).toBeInTheDocument();
    expect(screen.getByText(/Commits \(last year\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/752 commits/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/OVR weight/i)).toHaveLength(6);
  });

  it("closes via the close button", async () => {
    const user = userEvent.setup();
    render(<RatingMethodologyButton card={makeScoutCard()} />);

    await user.click(screen.getByRole("button", { name: /How rating works/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^Close$/i }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("opens a generic guide dialog without player data", async () => {
    const user = userEvent.setup();
    render(<HowItWorksButton />);

    await user.click(screen.getByRole("button", { name: /How it works/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/How IceOVR works/i)).toBeInTheDocument();
    expect(screen.getByText(/More commits last year/i)).toBeInTheDocument();
  });
});
