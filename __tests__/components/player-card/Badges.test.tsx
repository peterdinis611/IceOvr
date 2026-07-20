import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FlagBadge, LanguageBadge } from "@/components/Badges";

describe("FlagBadge", () => {
  it("renders nothing for unknown / missing country", () => {
    const { container: a } = render(<FlagBadge code={null} />);
    const { container: b } = render(<FlagBadge code="UN" />);
    expect(a).toBeEmptyDOMElement();
    expect(b).toBeEmptyDOMElement();
  });

  it("renders flag image for a known country", () => {
    render(<FlagBadge code="SK" />);
    expect(screen.getByAltText("Slovakia")).toBeInTheDocument();
    expect(screen.getByText("SK")).toBeInTheDocument();
  });
});

describe("LanguageBadge", () => {
  it("renders nothing without a language", () => {
    const { container } = render(<LanguageBadge language={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders short label for a known language", () => {
    render(<LanguageBadge language="TypeScript" />);
    expect(screen.getByText("TS")).toBeInTheDocument();
  });
});
