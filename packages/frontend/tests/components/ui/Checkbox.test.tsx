import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { createRef } from "react";
import { Checkbox } from "../../../src/components/ui";
import React from "react";

expect.extend(toHaveNoViolations);

describe("Checkbox Component", () => {
  describe("Rendering", () => {
    it("renders checkbox input", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
    });

    it("renders as input type checkbox", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("type", "checkbox");
    });

    it("applies sr-only class to hide native checkbox", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("sr-only");
    });

    it("renders custom checkbox visual", () => {
      const { container } = render(<Checkbox />);

      // Custom checkbox label should exist
      const customCheckbox = container.querySelector('label[class*="h-5 w-5"]');
      expect(customCheckbox).toBeInTheDocument();
    });

    it("renders check icon", () => {
      const { container } = render(<Checkbox />);

      // Lucide Check icon should be present
      const checkIcon = container.querySelector(".lucide-check");
      expect(checkIcon).toBeInTheDocument();
    });
  });

  describe("Label", () => {
    it("renders with label text", () => {
      render(<Checkbox label="Accept terms" />);

      expect(screen.getByText("Accept terms")).toBeInTheDocument();
    });

    it("renders without label when not provided", () => {
      const { container } = render(<Checkbox />);

      const labels = container.querySelectorAll('label[class*="text-sm"]');
      expect(labels).toHaveLength(0);
    });

    it("associates label with checkbox via htmlFor", () => {
      render(<Checkbox label="Accept terms" />);

      const checkbox = screen.getByRole("checkbox");
      const label = screen.getByText("Accept terms");

      expect(label).toHaveAttribute("for", checkbox.id);
    });

    it("clicking label toggles checkbox", async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Accept terms" />);

      const checkbox = screen.getByRole("checkbox");
      const label = screen.getByText("Accept terms");

      expect(checkbox).not.toBeChecked();

      await user.click(label);
      expect(checkbox).toBeChecked();

      await user.click(label);
      expect(checkbox).not.toBeChecked();
    });

    it("applies cursor-pointer to label", () => {
      render(<Checkbox label="Accept terms" />);

      const label = screen.getByText("Accept terms");
      expect(label).toHaveClass("cursor-pointer");
    });
  });

  describe("Error State", () => {
    it("renders error message when provided", () => {
      render(<Checkbox label="Accept terms" error="This field is required" />);

      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("does not render error when not provided", () => {
      const { container } = render(<Checkbox label="Accept terms" />);

      const errorText = container.querySelector(".text-red-600");
      expect(errorText).not.toBeInTheDocument();
    });

    it("applies error styling to checkbox border", () => {
      const { container } = render(
        <Checkbox label="Accept" error="Required" />
      );

      const customCheckbox = container.querySelector('label[class*="h-5 w-5"]');
      expect(customCheckbox).toHaveClass("border-red-500");
    });

    it("error message has correct styling", () => {
      render(<Checkbox label="Accept" error="Required" />);

      const error = screen.getByText("Required");
      expect(error).toHaveClass("text-sm");
      expect(error).toHaveClass("text-red-600");
      expect(error).toHaveClass("mt-1");
    });

    it("renders both label and error", () => {
      render(<Checkbox label="Accept terms" error="This is required" />);

      expect(screen.getByText("Accept terms")).toBeInTheDocument();
      expect(screen.getByText("This is required")).toBeInTheDocument();
    });

    it("can render error without label", () => {
      render(<Checkbox error="Error without label" />);

      // Error shouldn't render without label
      expect(screen.queryByText("Error without label")).not.toBeInTheDocument();
    });
  });

  describe("Checked State", () => {
    it("is unchecked by default", () => {
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
    });

    it("can be checked with checked prop", () => {
      render(<Checkbox checked />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("can be checked with defaultChecked prop", () => {
      render(<Checkbox defaultChecked />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("toggles checked state on click", async () => {
      const user = userEvent.setup();
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it("check icon is hidden when unchecked", () => {
      const { container } = render(<Checkbox />);

      const checkIcon = container.querySelector(".lucide-check");
      expect(checkIcon).toHaveClass("opacity-0");
    });

    it("check icon is visible when checked", () => {
      const { container } = render(<Checkbox checked readOnly />);

      const checkIcon = container.querySelector(".lucide-check");
      expect(checkIcon).toHaveClass("peer-checked:opacity-100");
    });
  });

  describe("Disabled State", () => {
    it("can be disabled", () => {
      render(<Checkbox disabled />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeDisabled();
    });

    it("applies disabled styling", () => {
      const { container } = render(<Checkbox disabled />);

      const customCheckbox = container.querySelector('label[class*="h-5 w-5"]');
      expect(customCheckbox).toHaveClass("peer-disabled:cursor-not-allowed");
      expect(customCheckbox).toHaveClass("peer-disabled:opacity-50");
    });

    it("does not toggle when disabled", async () => {
      const user = userEvent.setup();
      render(<Checkbox disabled />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it("label click does not toggle when disabled", async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Accept terms" disabled />);

      const checkbox = screen.getByRole("checkbox");
      const label = screen.getByText("Accept terms");

      await user.click(label);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("Event Handlers", () => {
    it("calls onChange when toggled", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Checkbox onChange={handleChange} />);

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("passes event to onChange handler", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Checkbox onChange={handleChange} />);

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            checked: true,
          }),
        })
      );
    });

    it("calls onFocus when focused", async () => {
      const handleFocus = vi.fn();
      const user = userEvent.setup();

      render(<Checkbox onFocus={handleFocus} />);

      const checkbox = screen.getByRole("checkbox");
      await user.tab();

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it("calls onBlur when blurred", async () => {
      const handleBlur = vi.fn();
      const user = userEvent.setup();

      render(
        <>
          <Checkbox onBlur={handleBlur} />
          <input type="text" />
        </>
      );

      const checkbox = screen.getByRole("checkbox");
      await user.tab(); // Focus checkbox
      await user.tab(); // Blur checkbox

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("does not call onChange when disabled", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(<Checkbox onChange={handleChange} disabled />);

      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("Controlled Component", () => {
    it("works as controlled component", async () => {
      const ControlledCheckbox = () => {
        const [checked, setChecked] = React.useState(false);
        return (
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        );
      };

      const user = userEvent.setup();
      render(<ControlledCheckbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it("checked prop overrides user interaction without onChange", async () => {
      const user = userEvent.setup();
      render(<Checkbox checked readOnly />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked(); // Still checked
    });
  });

  describe("ID Generation", () => {
    it("generates unique ID when not provided", () => {
      const { container } = render(
        <>
          <Checkbox label="First" />
          <Checkbox label="Second" />
        </>
      );

      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes[0].id).toBeTruthy();
      expect(checkboxes[1].id).toBeTruthy();
      expect(checkboxes[0].id).not.toBe(checkboxes[1].id);
    });

    it("uses provided ID when given", () => {
      render(<Checkbox id="custom-id" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("id", "custom-id");
    });

    it("label uses provided ID", () => {
      render(<Checkbox id="custom-id" label="Accept" />);

      const label = screen.getByText("Accept");
      expect(label).toHaveAttribute("for", "custom-id");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to checkbox input", () => {
      const ref = createRef<HTMLInputElement>();

      render(<Checkbox ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.type).toBe("checkbox");
    });

    it("allows ref to access input methods", () => {
      const ref = createRef<HTMLInputElement>();

      render(<Checkbox ref={ref} />);

      expect(ref.current?.focus).toBeDefined();
      expect(ref.current?.click).toBeDefined();
    });

    it("can programmatically focus checkbox via ref", () => {
      const ref = createRef<HTMLInputElement>();

      render(<Checkbox ref={ref} />);

      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });

  describe("Custom Props", () => {
    it("accepts custom className", () => {
      const { container } = render(<Checkbox className="custom-class" />);

      const customCheckbox = container.querySelector('label[class*="h-5 w-5"]');
      expect(customCheckbox).toHaveClass("custom-class");
    });

    it("accepts name attribute", () => {
      render(<Checkbox name="terms" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("name", "terms");
    });

    it("accepts value attribute", () => {
      render(<Checkbox value="accepted" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("value", "accepted");
    });

    it("accepts data attributes", () => {
      render(<Checkbox data-testid="custom-checkbox" data-value="123" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("data-testid", "custom-checkbox");
      expect(checkbox).toHaveAttribute("data-value", "123");
    });

    it("accepts aria attributes", () => {
      render(<Checkbox aria-label="Accept terms" aria-required="true" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-label", "Accept terms");
      expect(checkbox).toHaveAttribute("aria-required", "true");
    });

    it("accepts required attribute", () => {
      render(<Checkbox required />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeRequired();
    });

    it("accepts form attribute", () => {
      render(<Checkbox form="my-form" />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("form", "my-form");
    });
  });

  describe("Keyboard Navigation", () => {
    it("is focusable via tab key", async () => {
      const user = userEvent.setup();
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toHaveFocus();

      await user.tab();
      expect(checkbox).toHaveFocus();
    });

    it("toggles on Space key", async () => {
      const user = userEvent.setup();
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");
      await user.tab(); // Focus

      expect(checkbox).not.toBeChecked();
      await user.keyboard(" ");
      expect(checkbox).toBeChecked();

      await user.keyboard(" ");
      expect(checkbox).not.toBeChecked();
    });

    it("shows focus ring when focused", () => {
      const { container } = render(<Checkbox />);

      const customCheckbox = container.querySelector('label[class*="h-5 w-5"]');
      expect(customCheckbox).toHaveClass("peer-focus-visible:ring-2");
      expect(customCheckbox).toHaveClass("peer-focus-visible:ring-primary-500");
      expect(customCheckbox).toHaveClass("peer-focus-visible:ring-offset-2");
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<Checkbox label="Accept terms" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with error", async () => {
      const { container } = render(
        <Checkbox label="Accept terms" error="This field is required" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations when checked", async () => {
      const { container } = render(
        <Checkbox label="Accept" checked readOnly />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations when disabled", async () => {
      const { container } = render(<Checkbox label="Accept" disabled />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has accessible name from label", () => {
      render(<Checkbox label="Accept terms and conditions" />);

      const checkbox = screen.getByRole("checkbox", {
        name: "Accept terms and conditions",
      });
      expect(checkbox).toBeInTheDocument();
    });

    it("supports aria-label when no visual label", () => {
      render(<Checkbox aria-label="Accept terms" />);

      const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
      expect(checkbox).toBeInTheDocument();
    });

    it("can be described by error message", () => {
      render(
        <Checkbox
          label="Accept"
          error="Required"
          aria-describedby="error-message"
        />
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-describedby", "error-message");
    });
  });

  describe("Form Integration", () => {
    it("works in form submission", () => {
      const handleSubmit = vi.fn((e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        return formData.get("terms");
      });

      render(
        <form onSubmit={handleSubmit}>
          <Checkbox name="terms" value="accepted" />
          <button type="submit">Submit</button>
        </form>
      );

      const button = screen.getByRole("button");
      button.click();

      expect(handleSubmit).toHaveBeenCalled();
    });

    it("includes value in form data when checked", () => {
      let formData: FormData | null = null;

      const handleSubmit = vi.fn((e) => {
        e.preventDefault();
        formData = new FormData(e.currentTarget);
      });

      render(
        <form onSubmit={handleSubmit}>
          <Checkbox name="terms" value="accepted" defaultChecked />
          <button type="submit">Submit</button>
        </form>
      );

      const button = screen.getByRole("button");
      button.click();

      expect(formData?.get("terms")).toBe("accepted");
    });

    it("excludes from form data when unchecked", () => {
      let formData: FormData | null = null;

      const handleSubmit = vi.fn((e) => {
        e.preventDefault();
        formData = new FormData(e.currentTarget);
      });

      render(
        <form onSubmit={handleSubmit}>
          <Checkbox name="terms" value="accepted" />
          <button type="submit">Submit</button>
        </form>
      );

      const button = screen.getByRole("button");
      button.click();

      expect(formData?.get("terms")).toBeNull();
    });
  });

  describe("Display Name", () => {
    it("has correct display name", () => {
      expect(Checkbox.displayName).toBe("Checkbox");
    });
  });

  describe("Edge Cases", () => {
    it("handles very long label text", () => {
      const longLabel =
        "I accept all terms and conditions including privacy policy, data usage, cookie policy, and all other legal agreements";
      render(<Checkbox label={longLabel} />);

      expect(screen.getByText(longLabel)).toBeInTheDocument();
    });

    it("handles special characters in label", () => {
      render(<Checkbox label="Accept <terms> & conditions!" />);

      expect(
        screen.getByText("Accept <terms> & conditions!")
      ).toBeInTheDocument();
    });

    it("handles multiple checkboxes in a group", () => {
      render(
        <div>
          <Checkbox label="Option 1" />
          <Checkbox label="Option 2" />
          <Checkbox label="Option 3" />
        </div>
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(3);
    });

    it("renders correctly with empty string label", () => {
      const { container } = render(<Checkbox label="" />);

      // Empty label should not render the label container
      const labelContainer = container.querySelector(".ml-3");
      expect(labelContainer).not.toBeInTheDocument();
    });

    it("handles rapid toggling", async () => {
      const user = userEvent.setup();
      render(<Checkbox />);

      const checkbox = screen.getByRole("checkbox");

      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);

      expect(checkbox).not.toBeChecked();
    });
  });

  describe("Visual States", () => {
    it("applies correct base styling", () => {
      const { container } = render(<Checkbox />);

      const customCheckbox = container.querySelector('label[class*="h-5 w-5"]');
      expect(customCheckbox).toHaveClass("rounded");
      expect(customCheckbox).toHaveClass("border-2");
      expect(customCheckbox).toHaveClass("border-gray-300");
      expect(customCheckbox).toHaveClass("bg-white");
    });

    it("applies checked styling classes", () => {
      const { container } = render(<Checkbox checked readOnly />);

      const customCheckbox = container.querySelector('label[class*="h-5 w-5"]');
      expect(customCheckbox).toHaveClass("peer-checked:bg-primary-600");
      expect(customCheckbox).toHaveClass("peer-checked:border-primary-600");
    });

    it("has cursor-pointer on custom checkbox", () => {
      const { container } = render(<Checkbox />);

      const customCheckbox = container.querySelector('label[class*="h-5 w-5"]');
      expect(customCheckbox).toHaveClass("cursor-pointer");
    });
  });
});
