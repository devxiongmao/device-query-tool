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
    it("renders all field options when selectedSoftwareId is null", () => {
      render(
        <FieldSelector
          selectedSoftwareId={null}
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      expect(screen.getByText("Software Versions")).toBeInTheDocument();
      expect(screen.getByText("Supported Bands")).toBeInTheDocument();
      expect(screen.getByText("Carrier Aggregation")).toBeInTheDocument();
      expect(screen.getByText("Features")).toBeInTheDocument();
    });

    it("renders a checkbox for each field when selectedSoftwareId is null", () => {
      render(
        <FieldSelector
          selectedSoftwareId={null}
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(4);
    });

    it("renders field descriptions", () => {
      render(
        <FieldSelector
          selectedSoftwareId={null}
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      expect(
        screen.getByText("OS versions and build numbers")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Individual frequency bands")
      ).toBeInTheDocument();
      expect(
        screen.getByText("LTE CA, EN-DC, NR CA combos")
      ).toBeInTheDocument();
      expect(
        screen.getByText("VoLTE, VoWiFi, 5G SA, etc.")
      ).toBeInTheDocument();
    });
  });

  describe("Software field visibility based on selectedSoftwareId", () => {
    it("shows software field when selectedSoftwareId is null", () => {
      render(
        <FieldSelector
          selectedSoftwareId={null}
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      expect(screen.getByText("Software Versions")).toBeInTheDocument();
      expect(screen.getByLabelText("Software Versions")).toBeInTheDocument();
    });

    it("hides software field when selectedSoftwareId is provided", () => {
      render(
        <FieldSelector
          selectedSoftwareId="sw-1"
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      expect(screen.queryByText("Software Versions")).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText("Software Versions")
      ).not.toBeInTheDocument();
    });

    it("renders only 3 checkboxes when selectedSoftwareId is provided", () => {
      render(
        <FieldSelector
          selectedSoftwareId="sw-1"
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(3);
    });

    it("still renders other fields when software field is hidden", () => {
      render(
        <FieldSelector
          selectedSoftwareId="sw-123"
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      expect(screen.getByText("Supported Bands")).toBeInTheDocument();
      expect(screen.getByText("Carrier Aggregation")).toBeInTheDocument();
      expect(screen.getByText("Features")).toBeInTheDocument();
    });

    it("hides software description when selectedSoftwareId is provided", () => {
      render(
        <FieldSelector
          selectedSoftwareId="sw-1"
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      expect(
        screen.queryByText("OS versions and build numbers")
      ).not.toBeInTheDocument();
    });
  });

  describe("Controlled checked state", () => {
    it("reflects selectedFields prop in checkbox checked state", () => {
      render(
        <FieldSelector
          selectedSoftwareId={null}
          selectedFields={mixedSelection}
          onToggleField={vi.fn()}
        />
      );

      expect(screen.getByLabelText("Software Versions")).toBeChecked();
      expect(screen.getByLabelText("Supported Bands")).not.toBeChecked();
      expect(screen.getByLabelText("Carrier Aggregation")).toBeChecked();
      expect(screen.getByLabelText("Features")).not.toBeChecked();
    });

    it("reflects checked state for non-software fields when software is hidden", () => {
      render(
        <FieldSelector
          selectedSoftwareId="sw-1"
          selectedFields={mixedSelection}
          onToggleField={vi.fn()}
        />
      );

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
          selectedSoftwareId={null}
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
          selectedSoftwareId={null}
          selectedFields={allFalse}
          onToggleField={onToggleField}
        />
      );

      await user.click(screen.getByLabelText("Software Versions"));
      await user.click(screen.getByLabelText("Features"));

      expect(onToggleField).toHaveBeenNthCalledWith(1, "software");
      expect(onToggleField).toHaveBeenNthCalledWith(2, "features");
    });

    it("can toggle non-software fields when software field is hidden", async () => {
      const user = userEvent.setup();
      const onToggleField = vi.fn();

      render(
        <FieldSelector
          selectedSoftwareId="sw-1"
          selectedFields={allFalse}
          onToggleField={onToggleField}
        />
      );

      await user.click(screen.getByLabelText("Supported Bands"));
      await user.click(screen.getByLabelText("Features"));

      expect(onToggleField).toHaveBeenNthCalledWith(1, "bands");
      expect(onToggleField).toHaveBeenNthCalledWith(2, "features");
    });

    it("can click on label text to toggle checkbox", async () => {
      const user = userEvent.setup();
      const onToggleField = vi.fn();

      render(
        <FieldSelector
          selectedSoftwareId={null}
          selectedFields={allFalse}
          onToggleField={onToggleField}
        />
      );

      await user.click(screen.getByText("Carrier Aggregation"));

      expect(onToggleField).toHaveBeenCalledWith("combos");
    });
  });

  describe("Controlled component behavior", () => {
    it("does not change checked state unless props change", async () => {
      const user = userEvent.setup();
      const onToggleField = vi.fn();

      const { rerender } = render(
        <FieldSelector
          selectedSoftwareId={null}
          selectedFields={allFalse}
          onToggleField={onToggleField}
        />
      );

      const softwareCheckbox = screen.getByLabelText("Software Versions");

      await user.click(softwareCheckbox);
      expect(onToggleField).toHaveBeenCalledWith("software");

      expect(softwareCheckbox).not.toBeChecked();

      rerender(
        <FieldSelector
          selectedSoftwareId={null}
          selectedFields={{
            ...allFalse,
            software: true,
          }}
          onToggleField={onToggleField}
        />
      );

      expect(softwareCheckbox).toBeChecked();
    });

    it("maintains state of other fields when selectedSoftwareId changes", async () => {
      const onToggleField = vi.fn();

      const { rerender } = render(
        <FieldSelector
          selectedSoftwareId={null}
          selectedFields={{
            software: true,
            bands: true,
            combos: false,
            features: true,
          }}
          onToggleField={onToggleField}
        />
      );

      expect(screen.getByLabelText("Supported Bands")).toBeChecked();
      expect(screen.getByLabelText("Features")).toBeChecked();

      rerender(
        <FieldSelector
          selectedSoftwareId="sw-1"
          selectedFields={{
            software: true,
            bands: true,
            combos: false,
            features: true,
          }}
          onToggleField={onToggleField}
        />
      );

      expect(screen.getByLabelText("Supported Bands")).toBeChecked();
      expect(screen.getByLabelText("Features")).toBeChecked();
    });
  });

  describe("Accessibility", () => {
    it("associates labels with checkboxes", () => {
      render(
        <FieldSelector
          selectedSoftwareId={null}
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      const checkbox = screen.getByLabelText("Carrier Aggregation");
      expect(checkbox).toHaveAttribute("type", "checkbox");
    });

    it("has no accessibility violations with all fields visible", async () => {
      const { container } = render(
        <FieldSelector
          selectedSoftwareId={null}
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations when software field is hidden", async () => {
      const { container } = render(
        <FieldSelector
          selectedSoftwareId="sw-1"
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("maintains proper label associations when software field is hidden", () => {
      render(
        <FieldSelector
          selectedSoftwareId="sw-1"
          selectedFields={allFalse}
          onToggleField={vi.fn()}
        />
      );

      const bandsCheckbox = screen.getByLabelText("Supported Bands");
      const combosCheckbox = screen.getByLabelText("Carrier Aggregation");
      const featuresCheckbox = screen.getByLabelText("Features");

      expect(bandsCheckbox).toHaveAttribute("type", "checkbox");
      expect(combosCheckbox).toHaveAttribute("type", "checkbox");
      expect(featuresCheckbox).toHaveAttribute("type", "checkbox");
    });
  });
});
