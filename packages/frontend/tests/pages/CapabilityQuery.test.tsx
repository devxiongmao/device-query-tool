import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { CapabilityQueryPage } from "../../src/pages/CapabilityQuery";

expect.extend(toHaveNoViolations);

describe("CapabilityQueryPage Component", () => {
  it("renders the main heading", () => {
    render(<CapabilityQueryPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: /query by capability/i })
    ).toBeInTheDocument();
  });

  it("displays the coming soon message", () => {
    render(<CapabilityQueryPage />);

    expect(
      screen.getByText(/capability query page coming soon/i)
    ).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<CapabilityQueryPage />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
