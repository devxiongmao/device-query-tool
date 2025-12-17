import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";

import { createRef } from "react";
import { Button } from "../../../src/components/ui";

expect.extend(toHaveNoViolations);

describe("Button Component", () => {
  describe("Rendering", () => {
    it("renders with children text", () => {
      render(<Button>Click me</Button>);

      expect(
        screen.getByRole("button", { name: "Click me" })
      ).toBeInTheDocument();
    });

    it("renders as a button element", () => {
      render(<Button>Button</Button>);

      const button = screen.getByRole("button");
      expect(button.nodeName).toBe("BUTTON");
    });

    it("applies base classes", () => {
      render(<Button>Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("inline-flex");
      expect(button).toHaveClass("items-center");
      expect(button).toHaveClass("justify-center");
      expect(button).toHaveClass("rounded-lg");
      expect(button).toHaveClass("font-medium");
      expect(button).toHaveClass("transition-colors");
      expect(button).toHaveClass("focus-visible:outline-none");
      expect(button).toHaveClass("focus-visible:ring-2");
      expect(button).toHaveClass("focus-visible:ring-offset-2");
      expect(button).toHaveClass("disabled:pointer-events-none");
      expect(button).toHaveClass("disabled:opacity-50");
    });
  });

  describe("Variants", () => {
    it("renders primary variant by default", () => {
      render(<Button>Primary</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary-600");
      expect(button).toHaveClass("text-white");
      expect(button).toHaveClass("hover:bg-primary-700");
      expect(button).toHaveClass("active:bg-primary-800");
      expect(button).toHaveClass("focus-visible:ring-primary-500");
    });

    it("renders primary variant explicitly", () => {
      render(<Button variant="primary">Primary</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary-600");
      expect(button).toHaveClass("text-white");
    });

    it("renders secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-gray-200");
      expect(button).toHaveClass("text-gray-900");
      expect(button).toHaveClass("hover:bg-gray-300");
      expect(button).toHaveClass("active:bg-gray-400");
      expect(button).toHaveClass("focus-visible:ring-gray-500");
    });

    it("renders outline variant", () => {
      render(<Button variant="outline">Outline</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("border-2");
      expect(button).toHaveClass("border-gray-300");
      expect(button).toHaveClass("bg-transparent");
      expect(button).toHaveClass("hover:bg-gray-50");
      expect(button).toHaveClass("active:bg-gray-100");
    });

    it("renders ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("hover:bg-gray-100");
      expect(button).toHaveClass("active:bg-gray-200");
      expect(button).toHaveClass("focus-visible:ring-gray-500");
    });

    it("renders danger variant", () => {
      render(<Button variant="danger">Danger</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-red-600");
      expect(button).toHaveClass("text-white");
      expect(button).toHaveClass("hover:bg-red-700");
      expect(button).toHaveClass("active:bg-red-800");
      expect(button).toHaveClass("focus-visible:ring-red-500");
    });
  });

  describe("Sizes", () => {
    it("renders medium size by default", () => {
      render(<Button>Medium</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10");
      expect(button).toHaveClass("px-4");
      expect(button).toHaveClass("text-base");
    });

    it("renders small size", () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-8");
      expect(button).toHaveClass("px-3");
      expect(button).toHaveClass("text-sm");
    });

    it("renders medium size explicitly", () => {
      render(<Button size="md">Medium</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10");
      expect(button).toHaveClass("px-4");
      expect(button).toHaveClass("text-base");
    });

    it("renders large size", () => {
      render(<Button size="lg">Large</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-12");
      expect(button).toHaveClass("px-6");
      expect(button).toHaveClass("text-lg");
    });

    it("renders icon size", () => {
      render(
        <Button size="icon" aria-label="Icon button">
          Icon
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10");
      expect(button).toHaveClass("w-10");
    });
  });

  describe("Variant and Size Combinations", () => {
    it("combines variant and size classes", () => {
      render(
        <Button variant="danger" size="lg">
          Large Danger
        </Button>
      );

      const button = screen.getByRole("button");
      // Variant classes
      expect(button).toHaveClass("bg-red-600");
      expect(button).toHaveClass("text-white");
      // Size classes
      expect(button).toHaveClass("h-12");
      expect(button).toHaveClass("px-6");
      expect(button).toHaveClass("text-lg");
    });

    it("combines all variants with icon size", () => {
      const variants: Array<
        "primary" | "secondary" | "outline" | "ghost" | "danger"
      > = ["primary", "secondary", "outline", "ghost", "danger"];

      const { container } = render(
        <div>
          {variants.map((variant) => (
            <Button
              key={variant}
              variant={variant}
              size="icon"
              aria-label={variant}
            >
              {variant}
            </Button>
          ))}
        </div>
      );

      const buttons = container.querySelectorAll("button");
      expect(buttons).toHaveLength(5);
      buttons.forEach((button) => {
        expect(button).toHaveClass("h-10");
        expect(button).toHaveClass("w-10");
      });
    });
  });

  describe("Custom Props", () => {
    it("accepts and applies custom className", () => {
      render(<Button className="custom-class">Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
      // Should still have base classes
      expect(button).toHaveClass("inline-flex");
    });

    it("accepts and applies type attribute", () => {
      render(<Button type="submit">Submit</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("accepts and applies disabled attribute", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("accepts and applies aria-label", () => {
      render(<Button aria-label="Close dialog">X</Button>);

      const button = screen.getByRole("button", { name: "Close dialog" });
      expect(button).toBeInTheDocument();
    });

    it("accepts and applies data attributes", () => {
      render(
        <Button data-testid="custom-button" data-value="123">
          Button
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-testid", "custom-button");
      expect(button).toHaveAttribute("data-value", "123");
    });

    it("accepts and applies id attribute", () => {
      render(<Button id="unique-button">Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("id", "unique-button");
    });

    it("accepts and applies name attribute", () => {
      render(<Button name="submit-button">Submit</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("name", "submit-button");
    });
  });

  describe("Event Handlers", () => {
    it("handles onClick events", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not trigger onClick when disabled", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("handles onFocus events", async () => {
      const handleFocus = vi.fn();
      const user = userEvent.setup();

      render(<Button onFocus={handleFocus}>Focus me</Button>);

      await user.tab();

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it("handles onBlur events", async () => {
      const handleBlur = vi.fn();
      const user = userEvent.setup();

      render(<Button onBlur={handleBlur}>Blur me</Button>);

      await user.tab(); // Focus
      await user.tab(); // Blur

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("handles onMouseEnter and onMouseLeave events", async () => {
      const handleMouseEnter = vi.fn();
      const handleMouseLeave = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          Hover me
        </Button>
      );

      const button = screen.getByRole("button");
      await user.hover(button);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);

      await user.unhover(button);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to button element", () => {
      const ref = createRef<HTMLButtonElement>();

      render(<Button ref={ref}>Button</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.textContent).toBe("Button");
    });

    it("allows ref to access button methods", () => {
      const ref = createRef<HTMLButtonElement>();

      render(<Button ref={ref}>Button</Button>);

      expect(ref.current?.focus).toBeDefined();
      expect(ref.current?.click).toBeDefined();
    });
  });

  describe("Content Rendering", () => {
    it("renders with text content", () => {
      render(<Button>Click me</Button>);

      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("renders with icon and text", () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );

      expect(screen.getByText("Icon")).toBeInTheDocument();
      expect(screen.getByText("Text")).toBeInTheDocument();
    });

    it("renders with only icon", () => {
      render(
        <Button size="icon" aria-label="Search">
          <svg data-testid="search-icon" />
        </Button>
      );

      expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    });

    it("renders with numeric content", () => {
      render(<Button>42</Button>);

      expect(screen.getByText("42")).toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("applies disabled styles", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("disabled:pointer-events-none");
      expect(button).toHaveClass("disabled:opacity-50");
    });

    it("prevents click events when disabled", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("cannot be focused when disabled", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button");
      button.focus();

      expect(button).not.toHaveFocus();
    });
  });

  describe("Form Integration", () => {
    it("works as submit button in a form", () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit</Button>
        </form>
      );

      const button = screen.getByRole("button", { name: "Submit" });
      button.click();

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it("works as reset button in a form", () => {
      render(
        <form>
          <input defaultValue="test" />
          <Button type="reset">Reset</Button>
        </form>
      );

      const button = screen.getByRole("button", { name: "Reset" });
      expect(button).toHaveAttribute("type", "reset");
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations with default props", async () => {
      const { container } = render(<Button>Click me</Button>);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations with all variants", async () => {
      const { container } = render(
        <div>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations when disabled", async () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("icon button with aria-label has no violations", async () => {
      const { container } = render(
        <Button size="icon" aria-label="Close">
          X
        </Button>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("is keyboard accessible", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Keyboard accessible</Button>);

      await user.tab();
      const button = screen.getByRole("button");
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);

      await user.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe("Edge Cases", () => {
    it("handles very long text content", () => {
      const longText =
        "This is a very long button text that might wrap or overflow";
      render(<Button>{longText}</Button>);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("handles empty button", () => {
      render(<Button aria-label="Empty button" />);

      const button = screen.getByRole("button", { name: "Empty button" });
      expect(button).toBeInTheDocument();
    });

    it("allows className to extend base styles", () => {
      render(<Button className="shadow-xl rounded-full">Custom Button</Button>);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("shadow-xl");
      expect(button).toHaveClass("rounded-full");
      expect(button).toHaveClass("inline-flex"); // Base classes still present
    });

    it("handles rapid clicks", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole("button");
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("Display Name", () => {
    it("has correct display name for debugging", () => {
      expect(Button.displayName).toBe("Button");
    });
  });

  describe("Type Safety", () => {
    it("accepts all valid variant types", () => {
      const variants: Array<
        "primary" | "secondary" | "outline" | "ghost" | "danger"
      > = ["primary", "secondary", "outline", "ghost", "danger"];

      const { container } = render(
        <div>
          {variants.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      );

      expect(container.querySelectorAll("button")).toHaveLength(5);
    });

    it("accepts all valid size types", () => {
      const sizes: Array<"sm" | "md" | "lg" | "icon"> = [
        "sm",
        "md",
        "lg",
        "icon",
      ];

      const { container } = render(
        <div>
          {sizes.map((size) => (
            <Button key={size} size={size} aria-label={size}>
              {size}
            </Button>
          ))}
        </div>
      );

      expect(container.querySelectorAll("button")).toHaveLength(4);
    });
  });
});
