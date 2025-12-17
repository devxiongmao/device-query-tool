import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { Layout } from "../../../src/components/layout/Layout";

expect.extend(toHaveNoViolations);

// Mock child component for Outlet testing
const MockPage = ({ title }: { title: string }) => <div>{title}</div>;

// Helper function to render Layout with routing
const renderWithRouter = (initialRoute = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MockPage title="Home Page" />} />
          <Route path="device" element={<MockPage title="Device Page" />} />
          <Route
            path="capability"
            element={<MockPage title="Capability Page" />}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe("Layout Component", () => {
  beforeEach(() => {
    // Mock environment variable
    vi.stubEnv("VITE_APP_VERSION", "1.0.0");
  });

  describe("Header", () => {
    it("renders the logo with icon", () => {
      renderWithRouter();

      const logo = screen.getByRole("link", { name: /device capabilities/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("href", "/");
    });

    it("renders the app title and subtitle", () => {
      renderWithRouter();

      expect(screen.getByText("Device Capabilities")).toBeInTheDocument();
      expect(screen.getByText("Query Tool")).toBeInTheDocument();
    });

    it("renders all navigation links", () => {
      renderWithRouter();

      expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /by device/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /by capability/i })
      ).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("highlights the home link when on home page", () => {
      renderWithRouter("/");

      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).toHaveClass("bg-primary-100", "text-primary-700");
    });

    it("highlights the device link when on device page", () => {
      renderWithRouter("/device");

      const deviceLink = screen.getByRole("link", { name: /by device/i });
      expect(deviceLink).toHaveClass("bg-primary-100", "text-primary-700");
    });

    it("highlights the capability link when on capability page", () => {
      renderWithRouter("/capability");

      const capabilityLink = screen.getByRole("link", {
        name: /by capability/i,
      });
      expect(capabilityLink).toHaveClass("bg-primary-100", "text-primary-700");
    });

    it("navigates to device page when device link is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter("/");

      const deviceLink = screen.getByRole("link", { name: /by device/i });
      await user.click(deviceLink);

      expect(screen.getByText("Device Page")).toBeInTheDocument();
    });

    it("navigates to capability page when capability link is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter("/");

      const capabilityLink = screen.getByRole("link", {
        name: /by capability/i,
      });
      await user.click(capabilityLink);

      expect(screen.getByText("Capability Page")).toBeInTheDocument();
    });

    it("navigates back to home when home link is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter("/device");

      const homeLink = screen.getByRole("link", { name: /home/i });
      await user.click(homeLink);

      expect(screen.getByText("Home Page")).toBeInTheDocument();
    });

    it("navigates to home when logo is clicked", async () => {
      const user = userEvent.setup();
      renderWithRouter("/device");

      const logo = screen.getByRole("link", { name: /device capabilities/i });
      await user.click(logo);

      expect(screen.getByText("Home Page")).toBeInTheDocument();
    });
  });

  describe("Main Content", () => {
    it("renders the Outlet for child routes", () => {
      renderWithRouter("/");

      expect(screen.getByText("Home Page")).toBeInTheDocument();
    });

    it("renders different content for different routes - home page", () => {
      renderWithRouter("/");

      expect(screen.getByText("Home Page")).toBeInTheDocument();
    });

    it("renders different content for different routes - device page", () => {
      renderWithRouter("/device");

      expect(screen.getByText("Device Page")).toBeInTheDocument();
    });

    it("renders different content for different routes - capability page", () => {
      renderWithRouter("/capability");

      expect(screen.getByText("Capability Page")).toBeInTheDocument();
    });
  });

  describe("Footer", () => {
    it("renders the copyright text", () => {
      renderWithRouter();

      expect(
        screen.getByText(
          /© 2025 device capabilities\. built with react \+ graphql \+ typescript\./i
        )
      ).toBeInTheDocument();
    });

    it("renders the version badge", () => {
      renderWithRouter();

      expect(screen.getByText("v1.0.0")).toBeInTheDocument();
    });

    it("renders the GraphQL Playground link", () => {
      renderWithRouter();

      const graphqlLink = screen.getByRole("link", {
        name: /graphql playground/i,
      });
      expect(graphqlLink).toBeInTheDocument();
      expect(graphqlLink).toHaveAttribute(
        "href",
        "http://localhost:3000/graphql"
      );
      expect(graphqlLink).toHaveAttribute("target", "_blank");
      expect(graphqlLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("displays default version when env variable is not set", () => {
      vi.unstubAllEnvs();
      renderWithRouter();

      expect(screen.getByText("v1.0.0")).toBeInTheDocument();
    });
  });

  describe("Layout Structure", () => {
    it("applies correct layout classes for flex container", () => {
      const { container } = renderWithRouter();

      const layoutDiv = container.firstChild;
      expect(layoutDiv).toHaveClass(
        "min-h-screen",
        "flex",
        "flex-col",
        "bg-gray-50"
      );
    });

    it("renders header as sticky element", () => {
      renderWithRouter();

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("sticky", "top-0", "z-50");
    });

    it("renders main content area", () => {
      renderWithRouter();

      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass("flex-1");
    });

    it("renders footer at the bottom", () => {
      renderWithRouter();

      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass("mt-auto");
    });
  });

  describe("Responsive Behavior", () => {
    it("hides navigation text on mobile (sm:inline class)", () => {
      renderWithRouter();

      const homeLink = screen.getByRole("link", { name: /home/i });
      const homeSpan = homeLink.querySelector("span");

      expect(homeSpan).toHaveClass("hidden", "sm:inline");
    });

    it("hides app subtitle on mobile (hidden sm:block class)", () => {
      renderWithRouter();

      const subtitle = screen.getByText("Query Tool");
      const subtitleParent = subtitle.parentElement;

      expect(subtitleParent).toHaveClass("hidden", "sm:block");
    });
  });

  describe("Navigation Link States", () => {
    it("applies inactive styles to non-active links", () => {
      renderWithRouter("/");

      const deviceLink = screen.getByRole("link", { name: /by device/i });
      expect(deviceLink).toHaveClass("text-gray-600");
      expect(deviceLink).not.toHaveClass("bg-primary-100");
    });

    it("only one navigation link is active at a time", () => {
      renderWithRouter("/device");

      const homeLink = screen.getByRole("link", { name: /home/i });
      const deviceLink = screen.getByRole("link", { name: /by device/i });
      const capabilityLink = screen.getByRole("link", {
        name: /by capability/i,
      });

      expect(homeLink).not.toHaveClass("bg-primary-100");
      expect(deviceLink).toHaveClass("bg-primary-100");
      expect(capabilityLink).not.toHaveClass("bg-primary-100");
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = renderWithRouter();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("uses semantic HTML elements", () => {
      renderWithRouter();

      expect(screen.getByRole("banner")).toBeInTheDocument(); // header
      expect(screen.getByRole("navigation")).toBeInTheDocument(); // nav
      expect(screen.getByRole("main")).toBeInTheDocument(); // main
      expect(screen.getByRole("contentinfo")).toBeInTheDocument(); // footer
    });

    it("external link has proper security attributes", () => {
      renderWithRouter();

      const graphqlLink = screen.getByRole("link", {
        name: /graphql playground/i,
      });
      expect(graphqlLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
