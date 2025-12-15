import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { DeviceQueryPage } from "../../src/pages/DeviceQuery";

expect.extend(toHaveNoViolations);

describe("DeviceQueryPage Component", () => {
  it("renders the main heading", () => {
    render(<DeviceQueryPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: /query by device/i })
    ).toBeInTheDocument();
  });

  it("displays the coming soon message", () => {
    render(<DeviceQueryPage />);

    expect(
      screen.getByText(/device query page coming soon/i)
    ).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = render(<DeviceQueryPage />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
