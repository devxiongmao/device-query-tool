import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Layout } from "../../../src/components/layout/Layout";

expect.extend(toHaveNoViolations);

describe("Layout Component", () => {
  const renderWithRouter = (initialRoute = "/") => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div>Home Content</div>} />
            <Route path="device" element={<div>Device Content</div>} />
            <Route path="capability" element={<div>Capability Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  describe("Header Section", () => {
    it("renders the logo with correct link", () => {
      renderWithRouter();

      const logoLink = screen.getByRole("link", {
        name: /device capabilities/i,
      });
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("renders the DC icon in the logo", () => {
      renderWithRouter();

      expect(screen.getByText("DC")).toBeInTheDocument();
    });

    it("renders all navigation links", () => {
      renderWithRouter();

      expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Query by Device" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Query by Capability" })
      ).toBeInTheDocument();
    });
  });

  describe("Navigation Active States", () => {
    it("marks Home as active when on home route", () => {
      renderWithRouter("/");

      const homeLink = screen.getByRole("link", { name: "Home" });
      expect(homeLink).toHaveClass("bg-primary-100", "text-primary-700");
    });

    it("marks Query by Device as active when on device route", () => {
      renderWithRouter("/device");

      const deviceLink = screen.getByRole("link", { name: "Query by Device" });
      expect(deviceLink).toHaveClass("bg-primary-100", "text-primary-700");
    });

    it("marks Query by Capability as active when on capability route", () => {
      renderWithRouter("/capability");

      const capabilityLink = screen.getByRole("link", {
        name: "Query by Capability",
      });
      expect(capabilityLink).toHaveClass("bg-primary-100", "text-primary-700");
    });

    it("applies inactive styles to non-active links", () => {
      renderWithRouter("/device");

      const homeLink = screen.getByRole("link", { name: "Home" });
      expect(homeLink).toHaveClass("text-gray-600");
      expect(homeLink).not.toHaveClass("bg-primary-100");
    });
  });

  describe("Content Outlet", () => {
    it("renders child route content in the main section", () => {
      renderWithRouter("/");

      expect(screen.getByText("Home Content")).toBeInTheDocument();
    });

    it("renders device route content when navigating to device", () => {
      renderWithRouter("/device");

      expect(screen.getByText("Device Content")).toBeInTheDocument();
    });

    it("renders capability route content when navigating to capability", () => {
      renderWithRouter("/capability");

      expect(screen.getByText("Capability Content")).toBeInTheDocument();
    });
  });

  describe("Footer Section", () => {
    it("renders the copyright text", () => {
      renderWithRouter();

      expect(
        screen.getByText(/© 2025 device capabilities/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/built with react \+ graphql/i)
      ).toBeInTheDocument();
    });

    it("renders version information", () => {
      renderWithRouter();

      expect(screen.getByText(/version/i)).toBeInTheDocument();
    });

    it("displays default version when env var is not set", () => {
      renderWithRouter();

      expect(screen.getByText(/version 1\.0\.0/i)).toBeInTheDocument();
    });
  });

  describe("Layout Structure", () => {
    it("has proper semantic HTML structure", () => {
      const { container } = renderWithRouter();

      expect(container.querySelector("header")).toBeInTheDocument();
      expect(container.querySelector("main")).toBeInTheDocument();
      expect(container.querySelector("footer")).toBeInTheDocument();
      expect(container.querySelector("nav")).toBeInTheDocument();
    });

    it("applies sticky header styles", () => {
      const { container } = renderWithRouter();

      const header = container.querySelector("header");
      expect(header).toHaveClass("sticky", "top-0");
    });

    it("applies flex-1 to main for proper layout", () => {
      const { container } = renderWithRouter();

      const main = container.querySelector("main");
      expect(main).toHaveClass("flex-1");
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = renderWithRouter();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has proper navigation landmark", () => {
      renderWithRouter();

      const nav = screen.getByRole("navigation");
      expect(nav).toBeInTheDocument();
    });

    it("all navigation links have proper href attributes", () => {
      renderWithRouter();

      const homeLink = screen.getByRole("link", { name: "Home" });
      const deviceLink = screen.getByRole("link", { name: "Query by Device" });
      const capabilityLink = screen.getByRole("link", {
        name: "Query by Capability",
      });

      expect(homeLink).toHaveAttribute("href", "/");
      expect(deviceLink).toHaveAttribute("href", "/device");
      expect(capabilityLink).toHaveAttribute("href", "/capability");
    });
  });
});
