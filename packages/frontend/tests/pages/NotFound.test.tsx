import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import { NotFoundPage } from "../../src/pages/NotFound";

// Extend Vitest's expect with jest-axe matchers specifically for this file
// (or ensure it's done globally in your setup file)
expect.extend(toHaveNoViolations);

describe("NotFoundPage Component", () => {
  // Helper function to render with Router context
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  it("renders the 404 heading and correct content", () => {
    renderWithRouter(<NotFoundPage />);

    // Check for the main heading
    expect(
      screen.getByRole("heading", { level: 1, name: /404/i })
    ).toBeInTheDocument();

    // Check for the "Page not found" text specifically requested
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });

  it("renders a link to navigate home", () => {
    renderWithRouter(<NotFoundPage />);

    const homeLink = screen.getByRole("link", { name: /go home/i });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("should have no accessibility violations", async () => {
    const { container } = renderWithRouter(<NotFoundPage />);

    // axe scans the rendered HTML for a11y issues
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
