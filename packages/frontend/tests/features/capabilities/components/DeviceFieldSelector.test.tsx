import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import {
  DeviceFieldSelector,
  type CapabilityDisplayFields,
} from "../../../../src/features/capabilities/components/DeviceFieldSelector";

expect.extend(toHaveNoViolations);

const allFalse: CapabilityDisplayFields = {
  marketName: false,
  releaseDate: false,
  softwareDetails: false,
};

const allTrue: CapabilityDisplayFields = {
  marketName: true,
  releaseDate: true,
  softwareDetails: true,
};

const mixedSelection: CapabilityDisplayFields = {
  marketName: true,
  releaseDate: false,
  softwareDetails: true,
};

describe("DeviceFieldSelector", () => {
  describe("Rendering", () => {
    it("renders all field options", () => {
      render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      expect(screen.getByText("Market Name")).toBeInTheDocument();
      expect(screen.getByText("Release Date")).toBeInTheDocument();
      expect(screen.getByText("Software Details")).toBeInTheDocument();
    });

    it("renders descriptions for each field", () => {
      render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      expect(screen.getByText("Consumer product name")).toBeInTheDocument();
      expect(screen.getByText("When device was released")).toBeInTheDocument();
      expect(
        screen.getByText("OS version and build numbers")
      ).toBeInTheDocument();
    });

    it("renders main label", () => {
      render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      expect(
        screen.getByText("Additional Device Information")
      ).toBeInTheDocument();
    });

    it("renders a checkbox for each field", () => {
      render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(3);
    });
  });

  describe("Controlled checked state", () => {
    it("reflects selectedFields prop in checkbox checked state", () => {
      render(
        <DeviceFieldSelector
          selectedFields={mixedSelection}
          onToggleField={vi.fn()}
        />
      );

      expect(screen.getByLabelText("Market Name")).toBeChecked();
      expect(screen.getByLabelText("Release Date")).not.toBeChecked();
      expect(screen.getByLabelText("Software Details")).toBeChecked();
    });

    it("checks all checkboxes when all fields are selected", () => {
      render(
        <DeviceFieldSelector selectedFields={allTrue} onToggleField={vi.fn()} />
      );

      expect(screen.getByLabelText("Market Name")).toBeChecked();
      expect(screen.getByLabelText("Release Date")).toBeChecked();
      expect(screen.getByLabelText("Software Details")).toBeChecked();
    });

    it("unchecks all checkboxes when no fields are selected", () => {
      render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      expect(screen.getByLabelText("Market Name")).not.toBeChecked();
      expect(screen.getByLabelText("Release Date")).not.toBeChecked();
      expect(screen.getByLabelText("Software Details")).not.toBeChecked();
    });
  });

  describe("Interactions", () => {
    it("calls onToggleField with marketName when checkbox is clicked", async () => {
      const user = userEvent.setup();
      const onToggleField = vi.fn();

      render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={onToggleField}
        />
      );

      await user.click(screen.getByLabelText("Market Name"));

      expect(onToggleField).toHaveBeenCalledTimes(1);
      expect(onToggleField).toHaveBeenCalledWith("marketName");
    });

    it("calls onToggleField with releaseDate when checkbox is clicked", async () => {
      const user = userEvent.setup();
      const onToggleField = vi.fn();

      render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={onToggleField}
        />
      );

      await user.click(screen.getByLabelText("Release Date"));

      expect(onToggleField).toHaveBeenCalledTimes(1);
      expect(onToggleField).toHaveBeenCalledWith("releaseDate");
    });

    it("calls onToggleField with softwareDetails when checkbox is clicked", async () => {
      const user = userEvent.setup();
      const onToggleField = vi.fn();

      render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={onToggleField}
        />
      );

      await user.click(screen.getByLabelText("Software Details"));

      expect(onToggleField).toHaveBeenCalledTimes(1);
      expect(onToggleField).toHaveBeenCalledWith("softwareDetails");
    });

    it("allows toggling multiple different fields", async () => {
      const user = userEvent.setup();
      const onToggleField = vi.fn();

      render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={onToggleField}
        />
      );

      await user.click(screen.getByLabelText("Market Name"));
      await user.click(screen.getByLabelText("Software Details"));

      expect(onToggleField).toHaveBeenNthCalledWith(1, "marketName");
      expect(onToggleField).toHaveBeenNthCalledWith(2, "softwareDetails");
    });

    it("calls onToggleField when clicking on label text", async () => {
      const user = userEvent.setup();
      const onToggleField = vi.fn();

      render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={onToggleField}
        />
      );

      // Click on the label text, not the checkbox
      await user.click(screen.getByText("Release Date"));

      expect(onToggleField).toHaveBeenCalledWith("releaseDate");
    });
  });

  describe("Controlled component behavior", () => {
    it("does not change checked state unless props change", async () => {
      const user = userEvent.setup();
      const onToggleField = vi.fn();

      const { rerender } = render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={onToggleField}
        />
      );

      const marketNameCheckbox = screen.getByLabelText("Market Name");

      // Click triggers callback
      await user.click(marketNameCheckbox);
      expect(onToggleField).toHaveBeenCalledWith("marketName");

      // But checkbox remains unchecked until parent updates props
      expect(marketNameCheckbox).not.toBeChecked();

      // Simulate parent updating state
      rerender(
        <DeviceFieldSelector
          selectedFields={{
            ...allFalse,
            marketName: true,
          }}
          onToggleField={onToggleField}
        />
      );

      expect(marketNameCheckbox).toBeChecked();
    });

    it("maintains state correctly when toggling multiple fields", async () => {
      const user = userEvent.setup();
      const onToggleField = vi.fn();

      const { rerender } = render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={onToggleField}
        />
      );

      // Toggle market name
      await user.click(screen.getByLabelText("Market Name"));
      rerender(
        <DeviceFieldSelector
          selectedFields={{ ...allFalse, marketName: true }}
          onToggleField={onToggleField}
        />
      );

      expect(screen.getByLabelText("Market Name")).toBeChecked();
      expect(screen.getByLabelText("Release Date")).not.toBeChecked();

      // Toggle software details
      await user.click(screen.getByLabelText("Software Details"));
      rerender(
        <DeviceFieldSelector
          selectedFields={{
            ...allFalse,
            marketName: true,
            softwareDetails: true,
          }}
          onToggleField={onToggleField}
        />
      );

      expect(screen.getByLabelText("Market Name")).toBeChecked();
      expect(screen.getByLabelText("Software Details")).toBeChecked();
      expect(screen.getByLabelText("Release Date")).not.toBeChecked();
    });
  });

  describe("Accessibility", () => {
    it("associates labels with checkboxes", () => {
      render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      // If this works, label -> input association is correct
      const marketNameCheckbox = screen.getByLabelText("Market Name");
      const releaseDateCheckbox = screen.getByLabelText("Release Date");
      const softwareDetailsCheckbox = screen.getByLabelText("Software Details");

      expect(marketNameCheckbox).toHaveAttribute("type", "checkbox");
      expect(releaseDateCheckbox).toHaveAttribute("type", "checkbox");
      expect(softwareDetailsCheckbox).toHaveAttribute("type", "checkbox");
    });

    it("has proper label structure", () => {
      render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      // Main label
      expect(
        screen.getByText("Additional Device Information")
      ).toBeInTheDocument();

      // Individual field labels
      expect(screen.getByLabelText("Market Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Release Date")).toBeInTheDocument();
      expect(screen.getByLabelText("Software Details")).toBeInTheDocument();
    });

    it("labels have cursor-pointer class for better UX", () => {
      const { container } = render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      const labels = container.querySelectorAll('label[for^="field-"]');
      labels.forEach((label) => {
        expect(label).toHaveClass("cursor-pointer");
      });
    });

    it("has no accessibility violations", async () => {
      const { container } = render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with mixed selection", async () => {
      const { container } = render(
        <DeviceFieldSelector
          selectedFields={mixedSelection}
          onToggleField={vi.fn()}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with all selected", async () => {
      const { container } = render(
        <DeviceFieldSelector selectedFields={allTrue} onToggleField={vi.fn()} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Field descriptions", () => {
    it("displays descriptions alongside labels", () => {
      render(
        <DeviceFieldSelector
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      // Each field should have both label and description visible
      expect(screen.getByText("Market Name")).toBeInTheDocument();
      expect(screen.getByText("Consumer product name")).toBeInTheDocument();

      expect(screen.getByText("Release Date")).toBeInTheDocument();
      expect(screen.getByText("When device was released")).toBeInTheDocument();

      expect(screen.getByText("Software Details")).toBeInTheDocument();
      expect(
        screen.getByText("OS version and build numbers")
      ).toBeInTheDocument();
    });
  });
});
