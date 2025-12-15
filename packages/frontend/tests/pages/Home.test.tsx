import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { axe, toHaveNoViolations } from "jest-axe";
import { HomePage } from "../../src/pages/Home";

expect.extend(toHaveNoViolations);

describe("HomePage Component", () => {
  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
  };

  describe("Header Section", () => {
    it("renders the main heading", () => {
      renderWithRouter(<HomePage />);

      expect(
        screen.getByRole("heading", {
          level: 1,
          name: /device capabilities query tool/i,
        })
      ).toBeInTheDocument();
    });

    it("renders the introductory description", () => {
      renderWithRouter(<HomePage />);

      expect(
        screen.getByText(/query smartphone and device capabilities/i)
      ).toBeInTheDocument();
    });
  });

  describe("Navigation Cards", () => {
    it("renders the Query by Device card with correct link", () => {
      renderWithRouter(<HomePage />);

      const deviceLink = screen.getByRole("link", {
        name: /query by device/i,
      });

      expect(deviceLink).toBeInTheDocument();
      expect(deviceLink).toHaveAttribute("href", "/device");
    });

    it("renders the Query by Device card description", () => {
      renderWithRouter(<HomePage />);

      expect(
        screen.getByText(
          /search for a specific device and see all its global capabilities/i
        )
      ).toBeInTheDocument();
    });

    it("renders the Query by Capability card with correct link", () => {
      renderWithRouter(<HomePage />);

      const capabilityLink = screen.getByRole("link", {
        name: /query by capability/i,
      });

      expect(capabilityLink).toBeInTheDocument();
      expect(capabilityLink).toHaveAttribute("href", "/capability");
    });

    it("renders the Query by Capability card description", () => {
      renderWithRouter(<HomePage />);

      expect(
        screen.getByText(/search for devices that support a specific band/i)
      ).toBeInTheDocument();
    });
  });

  describe("Features Section", () => {
    it("renders the Features heading", () => {
      renderWithRouter(<HomePage />);

      expect(
        screen.getByRole("heading", { level: 3, name: /features/i })
      ).toBeInTheDocument();
    });

    it("renders the Advanced Search feature", () => {
      renderWithRouter(<HomePage />);

      expect(
        screen.getByRole("heading", { level: 4, name: /advanced search/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/filter by vendor, model, technology/i)
      ).toBeInTheDocument();
    });

    it("renders the Provider Support feature", () => {
      renderWithRouter(<HomePage />);

      expect(
        screen.getByRole("heading", { level: 4, name: /provider support/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/see capabilities for telus, rogers, bell/i)
      ).toBeInTheDocument();
    });

    it("renders the Real-time Data feature", () => {
      renderWithRouter(<HomePage />);

      expect(
        screen.getByRole("heading", { level: 4, name: /real-time data/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/graphql-powered instant results/i)
      ).toBeInTheDocument();
    });
  });

  describe("Visual Elements", () => {
    it("renders all SVG icons", () => {
      const { container } = renderWithRouter(<HomePage />);

      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThan(0);
    });

    it("applies hover styles to navigation cards", () => {
      renderWithRouter(<HomePage />);

      const deviceLink = screen.getByRole("link", {
        name: /query by device/i,
      });

      expect(deviceLink).toHaveClass("hover:shadow-md", "group");
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = renderWithRouter(<HomePage />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("all interactive elements are properly linked", () => {
      renderWithRouter(<HomePage />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(2);

      links.forEach((link) => {
        expect(link).toHaveAttribute("href");
      });
    });
  });
});
