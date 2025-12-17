import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";

import { Search, AlertCircle, Inbox, FileQuestion } from "lucide-react";
import { EmptyState } from "../../../src/components/ui";

expect.extend(toHaveNoViolations);

describe("EmptyState Component", () => {
  describe("Rendering", () => {
    it("renders with required title", () => {
      render(<EmptyState title="No results found" />);

      expect(screen.getByText("No results found")).toBeInTheDocument();
    });

    it("renders as a div element", () => {
      const { container } = render(<EmptyState title="Empty" />);

      const emptyState = container.firstChild as HTMLElement;
      expect(emptyState.nodeName).toBe("DIV");
    });

    it("applies base classes", () => {
      const { container } = render(<EmptyState title="Empty" />);

      const emptyState = container.firstChild as HTMLElement;
      expect(emptyState).toHaveClass("flex");
      expect(emptyState).toHaveClass("flex-col");
      expect(emptyState).toHaveClass("items-center");
      expect(emptyState).toHaveClass("justify-center");
      expect(emptyState).toHaveClass("py-12");
      expect(emptyState).toHaveClass("px-4");
      expect(emptyState).toHaveClass("text-center");
    });
  });

  describe("Title", () => {
    it("renders title as h3 heading", () => {
      render(<EmptyState title="No items found" />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe("No items found");
    });

    it("applies correct title styling", () => {
      render(<EmptyState title="Title" />);

      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-lg");
      expect(heading).toHaveClass("font-semibold");
      expect(heading).toHaveClass("text-gray-900");
      expect(heading).toHaveClass("mb-1");
    });

    it("handles long title text", () => {
      const longTitle =
        "This is a very long title that might wrap to multiple lines in the empty state";
      render(<EmptyState title={longTitle} />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("handles special characters in title", () => {
      render(<EmptyState title="No <results> found & more!" />);

      expect(
        screen.getByText("No <results> found & more!")
      ).toBeInTheDocument();
    });
  });

  describe("Description", () => {
    it("renders description when provided", () => {
      render(
        <EmptyState
          title="No results"
          description="Try adjusting your search"
        />
      );

      expect(screen.getByText("Try adjusting your search")).toBeInTheDocument();
    });

    it("does not render description when not provided", () => {
      const { container } = render(<EmptyState title="No results" />);

      const description = container.querySelector("p");
      expect(description).not.toBeInTheDocument();
    });

    it("applies correct description styling", () => {
      render(<EmptyState title="Empty" description="No items to display" />);

      const description = screen.getByText("No items to display");
      expect(description.nodeName).toBe("P");
      expect(description).toHaveClass("text-sm");
      expect(description).toHaveClass("text-gray-500");
      expect(description).toHaveClass("max-w-sm");
      expect(description).toHaveClass("mb-4");
    });

    it("handles long description text", () => {
      const longDesc =
        "This is a very long description that explains what the user should do when there are no items to display in this section";
      render(<EmptyState title="Empty" description={longDesc} />);

      expect(screen.getByText(longDesc)).toBeInTheDocument();
    });

    it("handles empty string description", () => {
      const { container } = render(<EmptyState title="Empty" description="" />);

      // Empty string should not render description
      const description = container.querySelector("p");
      expect(description).not.toBeInTheDocument();
    });
  });

  describe("Icon", () => {
    it("renders icon when provided", () => {
      const { container } = render(
        <EmptyState title="No results" icon={Search} />
      );

      const icon = container.querySelector(".lucide-search");
      expect(icon).toBeInTheDocument();
    });

    it("does not render icon when not provided", () => {
      const { container } = render(<EmptyState title="No results" />);

      const iconContainer = container.querySelector(".w-16.h-16");
      expect(iconContainer).not.toBeInTheDocument();
    });

    it("renders icon with correct container styling", () => {
      const { container } = render(
        <EmptyState title="Empty" icon={AlertCircle} />
      );

      const iconContainer = container.querySelector(".w-16.h-16");
      expect(iconContainer).toHaveClass("w-16");
      expect(iconContainer).toHaveClass("h-16");
      expect(iconContainer).toHaveClass("bg-gray-100");
      expect(iconContainer).toHaveClass("rounded-full");
      expect(iconContainer).toHaveClass("flex");
      expect(iconContainer).toHaveClass("items-center");
      expect(iconContainer).toHaveClass("justify-center");
      expect(iconContainer).toHaveClass("mb-4");
    });

    it("renders icon with correct styling", () => {
      const { container } = render(<EmptyState title="Empty" icon={Inbox} />);

      const icon = container.querySelector(".lucide-inbox");
      expect(icon).toHaveClass("w-8");
      expect(icon).toHaveClass("h-8");
      expect(icon).toHaveClass("text-gray-400");
    });

    it("renders different Lucide icons", () => {
      const icons = [
        { icon: Search, className: "lucide-search" },
        { icon: AlertCircle, className: "lucide-alert-circle" },
        { icon: Inbox, className: "lucide-inbox" },
        { icon: FileQuestion, className: "lucide-file-question" },
      ];

      icons.forEach(({ icon, className }) => {
        const { container } = render(<EmptyState title="Test" icon={icon} />);
        expect(container.querySelector(`.${className}`)).toBeInTheDocument();
      });
    });
  });

  describe("Action", () => {
    it("renders action when provided", () => {
      render(
        <EmptyState title="No results" action={<button>Try again</button>} />
      );

      expect(
        screen.getByRole("button", { name: "Try again" })
      ).toBeInTheDocument();
    });

    it("does not render action when not provided", () => {
      const { container } = render(<EmptyState title="No results" />);

      const actionContainer = container.querySelector(".mt-2");
      expect(actionContainer).not.toBeInTheDocument();
    });

    it("wraps action in div with correct styling", () => {
      const { container } = render(
        <EmptyState title="Empty" action={<button>Action</button>} />
      );

      const actionContainer = container.querySelector(".mt-2");
      expect(actionContainer).toBeInTheDocument();
      expect(actionContainer).toHaveClass("mt-2");
    });

    it("renders action button that can be clicked", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <EmptyState
          title="No results"
          action={<button onClick={handleClick}>Retry</button>}
        />
      );

      const button = screen.getByRole("button", { name: "Retry" });
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("renders multiple action buttons", () => {
      render(
        <EmptyState
          title="No results"
          action={
            <>
              <button>Action 1</button>
              <button>Action 2</button>
            </>
          }
        />
      );

      expect(
        screen.getByRole("button", { name: "Action 1" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Action 2" })
      ).toBeInTheDocument();
    });

    it("renders complex action content", () => {
      render(
        <EmptyState
          title="No results"
          action={
            <div>
              <button>Primary Action</button>
              <a href="/help">Learn more</a>
            </div>
          }
        />
      );

      expect(
        screen.getByRole("button", { name: "Primary Action" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Learn more" })
      ).toBeInTheDocument();
    });
  });

  describe("Custom ClassName", () => {
    it("accepts custom className", () => {
      const { container } = render(
        <EmptyState title="Empty" className="custom-class" />
      );

      const emptyState = container.firstChild as HTMLElement;
      expect(emptyState).toHaveClass("custom-class");
    });

    it("preserves base classes with custom className", () => {
      const { container } = render(
        <EmptyState title="Empty" className="bg-blue-50" />
      );

      const emptyState = container.firstChild as HTMLElement;
      expect(emptyState).toHaveClass("bg-blue-50");
      expect(emptyState).toHaveClass("flex");
      expect(emptyState).toHaveClass("flex-col");
    });

    it("allows overriding padding with className", () => {
      const { container } = render(
        <EmptyState title="Empty" className="py-20 px-8" />
      );

      const emptyState = container.firstChild as HTMLElement;
      expect(emptyState).toHaveClass("py-20");
      expect(emptyState).toHaveClass("px-8");
    });
  });

  describe("Complete Compositions", () => {
    it("renders with all props provided", () => {
      render(
        <EmptyState
          icon={Search}
          title="No results found"
          description="Try adjusting your search filters"
          action={<button>Reset filters</button>}
        />
      );

      expect(
        screen.getByRole("heading", { name: "No results found" })
      ).toBeInTheDocument();
      expect(
        screen.getByText("Try adjusting your search filters")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Reset filters" })
      ).toBeInTheDocument();
    });

    it("renders with only title and icon", () => {
      render(<EmptyState icon={AlertCircle} title="Error occurred" />);

      expect(
        screen.getByRole("heading", { name: "Error occurred" })
      ).toBeInTheDocument();
    });

    it("renders with title and description only", () => {
      render(
        <EmptyState
          title="No items"
          description="Add your first item to get started"
        />
      );

      expect(
        screen.getByRole("heading", { name: "No items" })
      ).toBeInTheDocument();
      expect(
        screen.getByText("Add your first item to get started")
      ).toBeInTheDocument();
    });

    it("renders with title and action only", () => {
      render(
        <EmptyState title="Nothing here" action={<button>Create new</button>} />
      );

      expect(
        screen.getByRole("heading", { name: "Nothing here" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Create new" })
      ).toBeInTheDocument();
    });
  });

  describe("Content Order", () => {
    it("renders components in correct order", () => {
      const { container } = render(
        <EmptyState
          icon={Search}
          title="Title"
          description="Description"
          action={<button>Action</button>}
        />
      );

      const children = Array.from(container.firstChild?.childNodes || []);

      // Icon container should be first
      expect((children[0] as HTMLElement).className).toContain("w-16");

      // Title (h3) should be second
      expect((children[1] as HTMLElement).nodeName).toBe("H3");

      // Description (p) should be third
      expect((children[2] as HTMLElement).nodeName).toBe("P");

      // Action container should be last
      expect((children[3] as HTMLElement).className).toContain("mt-2");
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations with only title", async () => {
      const { container } = render(<EmptyState title="No results" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations with all props", async () => {
      const { container } = render(
        <EmptyState
          icon={Search}
          title="No results found"
          description="Try adjusting your search"
          action={<button>Search again</button>}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("uses semantic heading for title", () => {
      render(<EmptyState title="Empty State" />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it("action button is keyboard accessible", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <EmptyState
          title="Empty"
          action={<button onClick={handleClick}>Action</button>}
        />
      );

      await user.tab();
      const button = screen.getByRole("button");
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("icon has appropriate aria-hidden attribute from Lucide", () => {
      const { container } = render(<EmptyState title="Empty" icon={Search} />);

      const icon = container.querySelector(".lucide-search");
      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Responsive Design", () => {
    it("description has max-width constraint", () => {
      render(<EmptyState title="Empty" description="Description text" />);

      const description = screen.getByText("Description text");
      expect(description).toHaveClass("max-w-sm");
    });

    it("uses text-center for centering", () => {
      const { container } = render(<EmptyState title="Empty" />);

      const emptyState = container.firstChild as HTMLElement;
      expect(emptyState).toHaveClass("text-center");
    });

    it("uses flex for vertical layout", () => {
      const { container } = render(<EmptyState title="Empty" />);

      const emptyState = container.firstChild as HTMLElement;
      expect(emptyState).toHaveClass("flex");
      expect(emptyState).toHaveClass("flex-col");
      expect(emptyState).toHaveClass("items-center");
    });
  });

  describe("Edge Cases", () => {
    it("handles null action gracefully", () => {
      const { container } = render(<EmptyState title="Empty" action={null} />);

      const actionContainer = container.querySelector(".mt-2");
      expect(actionContainer).not.toBeInTheDocument();
    });

    it("handles undefined action gracefully", () => {
      const { container } = render(
        <EmptyState title="Empty" action={undefined} />
      );

      const actionContainer = container.querySelector(".mt-2");
      expect(actionContainer).not.toBeInTheDocument();
    });

    it("handles numeric title", () => {
      render(<EmptyState title="404" />);

      expect(screen.getByText("404")).toBeInTheDocument();
    });

    it("renders with React fragments in action", () => {
      render(
        <EmptyState
          title="Empty"
          action={
            <>
              <button>Button 1</button>
              <button>Button 2</button>
            </>
          }
        />
      );

      expect(
        screen.getByRole("button", { name: "Button 1" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Button 2" })
      ).toBeInTheDocument();
    });

    it("handles extremely long description", () => {
      const veryLongDescription =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.".repeat(10);
      render(<EmptyState title="Empty" description={veryLongDescription} />);

      expect(screen.getByText(veryLongDescription)).toBeInTheDocument();
    });
  });

  describe("TypeScript Props", () => {
    it("accepts LucideIcon type for icon prop", () => {
      // This test ensures TypeScript compilation works
      const icons: Array<typeof Search | typeof AlertCircle | typeof Inbox> = [
        Search,
        AlertCircle,
        Inbox,
      ];

      icons.forEach((Icon, index) => {
        const { container } = render(
          <EmptyState title={`Test ${index}`} icon={Icon} />
        );
        expect(container).toBeInTheDocument();
      });
    });

    it("title is required prop", () => {
      // This would fail TypeScript compilation if title wasn't required
      render(<EmptyState title="Required title" />);
      expect(screen.getByText("Required title")).toBeInTheDocument();
    });

    it("accepts ReactNode for action", () => {
      const actions: React.ReactNode[] = [
        <button key="1">Button</button>,
        <div key="2">Custom element</div>,
        "Text node",
      ];

      actions.forEach((action, index) => {
        render(<EmptyState title={`Test ${index}`} action={action} />);
      });
    });
  });

  describe("Visual Hierarchy", () => {
    it("icon has margin bottom spacing", () => {
      const { container } = render(<EmptyState title="Empty" icon={Search} />);

      const iconContainer = container.querySelector(".w-16");
      expect(iconContainer).toHaveClass("mb-4");
    });

    it("title has margin bottom spacing", () => {
      render(<EmptyState title="Empty" />);

      const title = screen.getByRole("heading");
      expect(title).toHaveClass("mb-1");
    });

    it("description has margin bottom spacing", () => {
      render(<EmptyState title="Empty" description="Description" />);

      const description = screen.getByText("Description");
      expect(description).toHaveClass("mb-4");
    });

    it("action has margin top spacing", () => {
      const { container } = render(
        <EmptyState title="Empty" action={<button>Action</button>} />
      );

      const actionContainer = container.querySelector(".mt-2");
      expect(actionContainer).toHaveClass("mt-2");
    });
  });
});
