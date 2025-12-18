import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import {
  FieldSelector,
  type SelectedFields,
} from "../../../../src/features/devices/components/FieldSelector";

expect.extend(toHaveNoViolations);

const allFalse: SelectedFields = {
  software: false,
  bands: false,
  combos: false,
  features: false,
};

const mixedSelection: SelectedFields = {
  software: true,
  bands: false,
  combos: true,
  features: false,
};

describe("FieldSelector", () => {
  describe("Rendering", () => {
    it("renders all field options", () => {
      render(
        <FieldSelector selectedFields={allFalse} onToggleField={vi.fn()} />
      );

      expect(screen.getByText("Software Versions")).toBeInTheDocument();
      expect(screen.getByText("Supported Bands")).toBeInTheDocument();
      expect(screen.getByText("Carrier Aggregation")).toBeInTheDocument();
      expect(screen.getByText("Features")).toBeInTheDocument();
    });

    it("renders a checkbox for each field", () => {
      render(
        <FieldSelector selectedFields={allFalse} onToggleField={vi.fn()} />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(4);
    });
  });

  describe("Controlled checked state", () => {
    it("reflects selectedFields prop in checkbox checked state", () => {
      render(
        <FieldSelector
          selectedFields={mixedSelection}
          onToggleField={vi.fn()}
        />
      );

      expect(screen.getByLabelText("Software Versions")).toBeChecked();

      expect(screen.getByLabelText("Supported Bands")).not.toBeChecked();

      expect(screen.getByLabelText("Carrier Aggregation")).toBeChecked();

      expect(screen.getByLabelText("Features")).not.toBeChecked();
    });
  });

  describe("Interactions", () => {
    it("calls onToggleField with the correct field when a checkbox is clicked", async () => {
      const user = userEvent.setup();
      const onToggleField = vi.fn();

      render(
        <FieldSelector
          selectedFields={allFalse}
          onToggleField={onToggleField}
        />
      );

      await user.click(screen.getByLabelText("Supported Bands"));

      expect(onToggleField).toHaveBeenCalledTimes(1);
      expect(onToggleField).toHaveBeenCalledWith("bands");
    });

    it("allows toggling multiple different fields", async () => {
      const user = userEvent.setup();
      const onToggleField = vi.fn();

      render(
        <FieldSelector
          selectedFields={allFalse}
          onToggleField={onToggleField}
        />
      );

      await user.click(screen.getByLabelText("Software Versions"));
      await user.click(screen.getByLabelText("Features"));

      expect(onToggleField).toHaveBeenNthCalledWith(1, "software");
      expect(onToggleField).toHaveBeenNthCalledWith(2, "features");
    });
  });

  describe("Controlled component behavior", () => {
    it("does not change checked state unless props change", async () => {
      const user = userEvent.setup();
      const onToggleField = vi.fn();

      const { rerender } = render(
        <FieldSelector
          selectedFields={allFalse}
          onToggleField={onToggleField}
        />
      );

      const softwareCheckbox = screen.getByLabelText("Software Versions");

      // Click triggers callback
      await user.click(softwareCheckbox);
      expect(onToggleField).toHaveBeenCalledWith("software");

      // But checkbox remains unchecked until parent updates props
      expect(softwareCheckbox).not.toBeChecked();

      // Simulate parent updating state
      rerender(
        <FieldSelector
          selectedFields={{
            ...allFalse,
            software: true,
          }}
          onToggleField={onToggleField}
        />
      );

      expect(softwareCheckbox).toBeChecked();
    });
  });

  describe("Accessibility", () => {
    it("associates labels with checkboxes", () => {
      render(
        <FieldSelector selectedFields={allFalse} onToggleField={vi.fn()} />
      );

      // If this works, label -> input association is correct
      const checkbox = screen.getByLabelText("Carrier Aggregation");

      expect(checkbox).toHaveAttribute("type", "checkbox");
    });

    it("has no accessibility violations", async () => {
      const { container } = render(
        <FieldSelector selectedFields={allFalse} onToggleField={vi.fn()} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
