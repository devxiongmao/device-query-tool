import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { createRef, useState } from "react";
import { Select } from "../../../src/components/ui";

expect.extend(toHaveNoViolations);

const mockOptions = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
];

describe("Select Component", () => {
  describe("Basic Functionality", () => {
    it("renders all options", () => {
      render(<Select options={mockOptions} />);

      expect(
        screen.getByRole("option", { name: "Option 1" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Option 2" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Option 3" })
      ).toBeInTheDocument();
    });

    it("allows user to select an option", async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} />);

      const select = screen.getByRole("combobox");
      await user.selectOptions(select, "2");

      expect(select).toHaveValue("2");
    });

    it("displays selected option text", async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} />);

      const select = screen.getByRole("combobox");
      await user.selectOptions(select, "3");

      const selectedOption = screen.getByRole("option", {
        name: "Option 3",
      }) as HTMLOptionElement;
      expect(selectedOption.selected).toBe(true);
    });

    it("can change selection multiple times", async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} />);

      const select = screen.getByRole("combobox");

      await user.selectOptions(select, "1");
      expect(select).toHaveValue("1");

      await user.selectOptions(select, "3");
      expect(select).toHaveValue("3");

      await user.selectOptions(select, "2");
      expect(select).toHaveValue("2");
    });
  });

  describe("Label Behavior", () => {
    it("displays label when provided", () => {
      render(<Select label="Choose option" options={mockOptions} />);

      expect(screen.getByText("Choose option")).toBeInTheDocument();
    });

    it("associates label with select", () => {
      render(<Select label="Country" options={mockOptions} />);

      const select = screen.getByLabelText("Country");
      expect(select).toBeInTheDocument();
    });

    it("focuses select when label is clicked", async () => {
      const user = userEvent.setup();
      render(<Select label="Region" options={mockOptions} />);

      await user.click(screen.getByText("Region"));
      expect(screen.getByLabelText("Region")).toHaveFocus();
    });
  });

  describe("Placeholder Behavior", () => {
    it("displays placeholder as first disabled option", () => {
      render(<Select placeholder="Select an option" options={mockOptions} />);

      const placeholder = screen.getByRole("option", {
        name: "Select an option",
      }) as HTMLOptionElement;
      expect(placeholder).toBeInTheDocument();
      expect(placeholder.disabled).toBe(true);
    });

    it("placeholder has empty string value", () => {
      render(<Select placeholder="Choose..." options={mockOptions} />);

      const placeholder = screen.getByRole("option", {
        name: "Choose...",
      }) as HTMLOptionElement;
      expect(placeholder.value).toBe("");
    });

    it("does not render placeholder when not provided", () => {
      render(<Select options={mockOptions} />);

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(3); // Only mockOptions, no placeholder
    });

    it("can select actual option after placeholder", async () => {
      const user = userEvent.setup();
      render(<Select placeholder="Select..." options={mockOptions} />);

      const select = screen.getByRole("combobox");
      await user.selectOptions(select, "2");

      expect(select).toHaveValue("2");
    });
  });

  describe("Error State Behavior", () => {
    it("displays error message", () => {
      render(<Select options={mockOptions} error="Selection required" />);

      expect(screen.getByText("Selection required")).toBeInTheDocument();
    });

    it("hides helper text when error is present", () => {
      render(
        <Select
          options={mockOptions}
          error="Error message"
          helperText="Helper text"
        />
      );

      expect(screen.getByText("Error message")).toBeInTheDocument();
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
    });

    it("can still select options when error is shown", async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} error="Invalid selection" />);

      const select = screen.getByRole("combobox");
      await user.selectOptions(select, "2");

      expect(select).toHaveValue("2");
    });
  });

  describe("Helper Text Behavior", () => {
    it("displays helper text", () => {
      render(<Select options={mockOptions} helperText="Choose wisely" />);

      expect(screen.getByText("Choose wisely")).toBeInTheDocument();
    });

    it("helper text remains visible after selection", async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} helperText="Pick one" />);

      await user.selectOptions(screen.getByRole("combobox"), "1");
      expect(screen.getByText("Pick one")).toBeInTheDocument();
    });
  });

  describe("Disabled State Behavior", () => {
    it("cannot change selection when disabled", async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} disabled defaultValue="1" />);

      const select = screen.getByRole("combobox");
      await user.selectOptions(select, "2");

      expect(select).toHaveValue("1"); // Still has original value
    });

    it("cannot focus disabled select", () => {
      render(<Select options={mockOptions} disabled />);

      const select = screen.getByRole("combobox");
      select.focus();

      expect(select).not.toHaveFocus();
    });

    it("retains value when disabled", () => {
      render(<Select options={mockOptions} disabled value="2" readOnly />);

      expect(screen.getByRole("combobox")).toHaveValue("2");
    });
  });

  describe("onChange Handler", () => {
    it("calls onChange with selected value", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Select options={mockOptions} onChange={handleChange} />);

      await user.selectOptions(screen.getByRole("combobox"), "2");

      expect(handleChange).toHaveBeenCalledWith("2");
    });

    it("calls onChange each time selection changes", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Select options={mockOptions} onChange={handleChange} />);

      const select = screen.getByRole("combobox");

      await user.selectOptions(select, "1");
      await user.selectOptions(select, "3");
      await user.selectOptions(select, "2");

      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleChange).toHaveBeenNthCalledWith(1, "1");
      expect(handleChange).toHaveBeenNthCalledWith(2, "3");
      expect(handleChange).toHaveBeenNthCalledWith(3, "2");
    });

    it("does not call onChange when disabled", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Select options={mockOptions} onChange={handleChange} disabled />);

      await user.selectOptions(screen.getByRole("combobox"), "2");

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("Value Control", () => {
    it("works as controlled component", async () => {
      const ControlledSelect = () => {
        const [value, setValue] = useState("");
        return (
          <Select options={mockOptions} value={value} onChange={setValue} />
        );
      };

      const user = userEvent.setup();
      render(<ControlledSelect />);

      const select = screen.getByRole("combobox");
      await user.selectOptions(select, "2");

      expect(select).toHaveValue("2");
    });

    it("works as uncontrolled component with defaultValue", async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} defaultValue="1" />);

      const select = screen.getByRole("combobox");
      expect(select).toHaveValue("1");

      await user.selectOptions(select, "3");
      expect(select).toHaveValue("3");
    });
  });

  describe("Keyboard Navigation", () => {
    it("can be focused with Tab key", async () => {
      const user = userEvent.setup();
      render(<Select options={mockOptions} />);

      await user.tab();
      expect(screen.getByRole("combobox")).toHaveFocus();
    });

    it("can navigate between multiple selects", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Select label="First" options={mockOptions} />
          <Select label="Second" options={mockOptions} />
          <Select label="Third" options={mockOptions} />
        </>
      );

      await user.tab();
      expect(screen.getByLabelText("First")).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText("Second")).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText("Third")).toHaveFocus();
    });

    it("skips disabled select in tab order", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Select label="First" options={mockOptions} />
          <Select label="Second" options={mockOptions} disabled />
          <Select label="Third" options={mockOptions} />
        </>
      );

      await user.tab();
      expect(screen.getByLabelText("First")).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText("Third")).toHaveFocus();
    });
  });

  describe("Form Integration", () => {
    it("submits selected value in form", async () => {
      const user = userEvent.setup();
      let formData: FormData | null = null;

      const handleSubmit = vi.fn((e) => {
        e.preventDefault();
        formData = new FormData(e.currentTarget);
      });

      render(
        <form onSubmit={handleSubmit}>
          <Select name="country" options={mockOptions} defaultValue="2" />
          <button type="submit">Submit</button>
        </form>
      );

      await user.click(screen.getByRole("button"));

      expect(formData?.get("country")).toBe("2");
    });

    it("respects required attribute", () => {
      render(<Select options={mockOptions} required />);

      expect(screen.getByRole("combobox")).toBeRequired();
    });
  });

  describe("ID Generation", () => {
    it("generates unique IDs for multiple selects", () => {
      const { container } = render(
        <>
          <Select label="First" options={mockOptions} />
          <Select label="Second" options={mockOptions} />
        </>
      );

      const selects = container.querySelectorAll("select");
      expect(selects[0].id).toBeTruthy();
      expect(selects[1].id).toBeTruthy();
      expect(selects[0].id).not.toBe(selects[1].id);
    });

    it("uses provided id when given", () => {
      render(<Select id="custom-id" label="Test" options={mockOptions} />);

      expect(screen.getByLabelText("Test")).toHaveAttribute("id", "custom-id");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to select element", () => {
      const ref = createRef<HTMLSelectElement>();
      render(<Select ref={ref} options={mockOptions} />);

      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });

    it("can programmatically focus select via ref", () => {
      const ref = createRef<HTMLSelectElement>();
      render(<Select ref={ref} options={mockOptions} />);

      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });

    it("can programmatically set value via ref", () => {
      const ref = createRef<HTMLSelectElement>();
      render(<Select ref={ref} options={mockOptions} />);

      if (ref.current) {
        ref.current.value = "3";
      }

      expect(ref.current).toHaveValue("3");
    });
  });

  describe("Dynamic Options", () => {
    it("updates when options change", () => {
      const { rerender } = render(<Select options={mockOptions} />);

      expect(screen.getAllByRole("option")).toHaveLength(3);

      const newOptions = [
        { value: "a", label: "Option A" },
        { value: "b", label: "Option B" },
      ];

      rerender(<Select options={newOptions} />);

      expect(screen.getAllByRole("option")).toHaveLength(2);
      expect(
        screen.getByRole("option", { name: "Option A" })
      ).toBeInTheDocument();
    });

    it("handles empty options array", () => {
      render(<Select options={[]} placeholder="No options" />);

      const options = screen.getAllByRole("option");
      expect(options).toHaveLength(1); // Only placeholder
    });

    it("handles many options", () => {
      const manyOptions = Array.from({ length: 50 }, (_, i) => ({
        value: `${i}`,
        label: `Option ${i}`,
      }));

      render(<Select options={manyOptions} />);

      expect(screen.getAllByRole("option")).toHaveLength(50);
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(
        <Select label="Country" options={mockOptions} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with error", async () => {
      const { container } = render(
        <Select label="Country" options={mockOptions} error="Required" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has accessible name from label", () => {
      render(<Select label="Country" options={mockOptions} />);

      expect(
        screen.getByRole("combobox", { name: "Country" })
      ).toBeInTheDocument();
    });

    it("supports aria-label without visual label", () => {
      render(<Select aria-label="Country selector" options={mockOptions} />);

      expect(
        screen.getByRole("combobox", { name: "Country selector" })
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles options with same labels but different values", async () => {
      const user = userEvent.setup();
      const duplicateLabelOptions = [
        { value: "1", label: "Same" },
        { value: "2", label: "Same" },
        { value: "3", label: "Different" },
      ];

      render(<Select options={duplicateLabelOptions} />);

      const select = screen.getByRole("combobox");
      await user.selectOptions(select, "2");

      expect(select).toHaveValue("2");
    });

    it("handles options with special characters", async () => {
      const user = userEvent.setup();
      const specialOptions = [
        { value: "1", label: "Option <1>" },
        { value: "2", label: "Option & 2" },
      ];

      render(<Select options={specialOptions} />);

      await user.selectOptions(screen.getByRole("combobox"), "1");
      expect(screen.getByRole("combobox")).toHaveValue("1");
    });

    it("handles very long option labels", async () => {
      const user = userEvent.setup();
      const longLabelOptions = [
        {
          value: "1",
          label: "This is a very long option label that might overflow",
        },
      ];

      render(<Select options={longLabelOptions} />);

      await user.selectOptions(screen.getByRole("combobox"), "1");
      expect(screen.getByRole("combobox")).toHaveValue("1");
    });

    it("displays ChevronDown icon", () => {
      const { container } = render(<Select options={mockOptions} />);

      const icon = container.querySelector(".lucide-chevron-down");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Display Name", () => {
    it("has correct display name", () => {
      expect(Select.displayName).toBe("Select");
    });
  });
});
