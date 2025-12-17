import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Badge } from "../../../src/components/ui";

expect.extend(toHaveNoViolations);

describe("Badge Component", () => {
  describe("Rendering", () => {
    it("renders with children text", () => {
      render(<Badge>Test Badge</Badge>);

      expect(screen.getByText("Test Badge")).toBeInTheDocument();
    });

    it("renders as a div element", () => {
      const { container } = render(<Badge>Badge</Badge>);

      const badge = container.firstChild;
      expect(badge?.nodeName).toBe("DIV");
    });

    it("applies base classes", () => {
      const { container } = render(<Badge>Badge</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass("inline-flex");
      expect(badge).toHaveClass("items-center");
      expect(badge).toHaveClass("rounded-full");
      expect(badge).toHaveClass("px-2.5");
      expect(badge).toHaveClass("py-0.5");
      expect(badge).toHaveClass("text-xs");
      expect(badge).toHaveClass("font-semibold");
      expect(badge).toHaveClass("transition-colors");
    });
  });

  describe("Variants", () => {
    it("renders default variant when no variant is specified", () => {
      const { container } = render(<Badge>Default</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass("bg-primary-100");
      expect(badge).toHaveClass("text-primary-800");
    });

    it("renders default variant explicitly", () => {
      const { container } = render(<Badge variant="default">Default</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass("bg-primary-100");
      expect(badge).toHaveClass("text-primary-800");
    });

    it("renders secondary variant", () => {
      const { container } = render(
        <Badge variant="secondary">Secondary</Badge>
      );

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass("bg-gray-100");
      expect(badge).toHaveClass("text-gray-800");
    });

    it("renders success variant", () => {
      const { container } = render(<Badge variant="success">Success</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass("bg-green-100");
      expect(badge).toHaveClass("text-green-800");
    });

    it("renders warning variant", () => {
      const { container } = render(<Badge variant="warning">Warning</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass("bg-yellow-100");
      expect(badge).toHaveClass("text-yellow-800");
    });

    it("renders danger variant", () => {
      const { container } = render(<Badge variant="danger">Danger</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass("bg-red-100");
      expect(badge).toHaveClass("text-red-800");
    });

    it("renders outline variant", () => {
      const { container } = render(<Badge variant="outline">Outline</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass("border");
      expect(badge).toHaveClass("border-gray-300");
      expect(badge).toHaveClass("text-gray-700");
    });
  });

  describe("Custom Props", () => {
    it("accepts and applies custom className", () => {
      const { container } = render(
        <Badge className="custom-class">Badge</Badge>
      );

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveClass("custom-class");
      // Should still have base classes
      expect(badge).toHaveClass("inline-flex");
    });

    it("accepts and applies custom data attributes", () => {
      const { container } = render(
        <Badge data-testid="custom-badge" data-value="123">
          Badge
        </Badge>
      );

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveAttribute("data-testid", "custom-badge");
      expect(badge).toHaveAttribute("data-value", "123");
    });

    it("accepts and applies id attribute", () => {
      const { container } = render(<Badge id="unique-badge">Badge</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveAttribute("id", "unique-badge");
    });

    it("accepts and applies role attribute", () => {
      const { container } = render(<Badge role="status">Badge</Badge>);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveAttribute("role", "status");
    });

    it("accepts and applies aria-label attribute", () => {
      const { container } = render(
        <Badge aria-label="Status indicator">Active</Badge>
      );

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveAttribute("aria-label", "Status indicator");
    });

    it("accepts onClick handler", () => {
      const handleClick = vi.fn();
      const { container } = render(<Badge onClick={handleClick}>Badge</Badge>);

      const badge = container.firstChild as HTMLElement;
      badge.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("spreads additional HTML div attributes", () => {
      const { container } = render(
        <Badge title="Tooltip text" tabIndex={0}>
          Badge
        </Badge>
      );

      const badge = container.firstChild as HTMLElement;
      expect(badge).toHaveAttribute("title", "Tooltip text");
      expect(badge).toHaveAttribute("tabIndex", "0");
    });
  });

  describe("Variant and ClassName Combination", () => {
    it("combines variant classes with custom className", () => {
      const { container } = render(
        <Badge variant="success" className="m-4 shadow-lg">
          Success
        </Badge>
      );

      const badge = container.firstChild as HTMLElement;
      // Variant classes
      expect(badge).toHaveClass("bg-green-100");
      expect(badge).toHaveClass("text-green-800");
      // Custom classes
      expect(badge).toHaveClass("m-4");
      expect(badge).toHaveClass("shadow-lg");
      // Base classes
      expect(badge).toHaveClass("inline-flex");
    });
  });

  describe("Content Rendering", () => {
    it("renders with numeric content", () => {
      render(<Badge>42</Badge>);

      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders with complex children", () => {
      render(
        <Badge>
          <span>Status: </span>
          <strong>Active</strong>
        </Badge>
      );

      expect(screen.getByText("Status:", { exact: false })).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("renders empty badge", () => {
      const { container } = render(<Badge />);

      const badge = container.firstChild as HTMLElement;
      expect(badge).toBeInTheDocument();
      expect(badge).toBeEmptyDOMElement();
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations with default variant", async () => {
      const { container } = render(<Badge>Default Badge</Badge>);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations with all variants", async () => {
      const { container } = render(
        <div>
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("can be made accessible with role and aria-label", async () => {
      const { container } = render(
        <Badge role="status" aria-label="User is currently active">
          Active
        </Badge>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Edge Cases", () => {
    it("handles very long text content", () => {
      const longText =
        "This is a very long badge text that might wrap or overflow";
      render(<Badge>{longText}</Badge>);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("handles special characters in content", () => {
      render(<Badge>{"Status: <Active> & Ready!"}</Badge>);

      expect(screen.getByText("Status: <Active> & Ready!")).toBeInTheDocument();
    });

    it("allows className to override base styles", () => {
      const { container } = render(
        <Badge className="text-2xl px-10">Large Badge</Badge>
      );

      const badge = container.firstChild as HTMLElement;
      // Custom classes should be present
      expect(badge).toHaveClass("text-2xl");
      expect(badge).toHaveClass("px-10");
      // Base classes should still be there (cn doesn't remove them)
      expect(badge).toHaveClass("inline-flex");
    });
  });

  describe("Type Safety", () => {
    it("accepts valid variant prop types", () => {
      // This test ensures TypeScript compilation works
      // If these render without errors, the types are correct
      const variants: Array<
        "default" | "secondary" | "success" | "warning" | "danger" | "outline"
      > = ["default", "secondary", "success", "warning", "danger", "outline"];

      const { container } = render(
        <div>
          {variants.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      );

      expect(container.querySelectorAll("div > div")).toHaveLength(7);
    });
  });
});
