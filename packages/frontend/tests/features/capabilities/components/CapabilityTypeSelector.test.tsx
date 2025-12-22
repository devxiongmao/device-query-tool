import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { CapabilityTypeSelector } from "../../../../src/features/capabilities/components/CapabilityTypeSelector";

expect.extend(toHaveNoViolations);

describe("CapabilityTypeSelector", () => {
  describe("Rendering", () => {
    it("renders all capability type options", () => {
      render(
        <CapabilityTypeSelector selectedType="band" onTypeChange={vi.fn()} />
      );

      expect(screen.getByText("Band")).toBeInTheDocument();
      expect(screen.getByText("Combo")).toBeInTheDocument();
      expect(screen.getByText("Feature")).toBeInTheDocument();
    });

    it("renders descriptions for each capability type", () => {
      render(
        <CapabilityTypeSelector selectedType="band" onTypeChange={vi.fn()} />
      );

      expect(screen.getByText("Search by frequency band")).toBeInTheDocument();
      expect(
        screen.getByText("Search by carrier aggregation combo")
      ).toBeInTheDocument();
      expect(screen.getByText("Search by device feature")).toBeInTheDocument();
    });

    it("renders main label", () => {
      render(
        <CapabilityTypeSelector selectedType="band" onTypeChange={vi.fn()} />
      );

      expect(screen.getByText("Select Capability Type")).toBeInTheDocument();
    });

    it("renders a button for each capability type", () => {
      render(
        <CapabilityTypeSelector selectedType="band" onTypeChange={vi.fn()} />
      );

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(3);
    });

    it("renders icons for each capability type", () => {
      const { container } = render(
        <CapabilityTypeSelector selectedType="band" onTypeChange={vi.fn()} />
      );

      // Check that SVG icons are present (lucide-react icons render as SVGs)
      const svgs = container.querySelectorAll("svg");
      // 3 capability icons + potential checkmark = at least 3
      expect(svgs.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Controlled selected state", () => {
    it("highlights band when selected", () => {
      render(
        <CapabilityTypeSelector selectedType="band" onTypeChange={vi.fn()} />
      );

      const bandButton = screen.getByText("Band").closest("button");
      expect(bandButton).toHaveClass("border-primary-500", "bg-primary-50");
    });

    it("highlights combo when selected", () => {
      render(
        <CapabilityTypeSelector selectedType="combo" onTypeChange={vi.fn()} />
      );

      const comboButton = screen.getByText("Combo").closest("button");
      expect(comboButton).toHaveClass("border-primary-500", "bg-primary-50");
    });

    it("highlights feature when selected", () => {
      render(
        <CapabilityTypeSelector selectedType="feature" onTypeChange={vi.fn()} />
      );

      const featureButton = screen.getByText("Feature").closest("button");
      expect(featureButton).toHaveClass("border-primary-500", "bg-primary-50");
    });

    it("does not highlight unselected options", () => {
      render(
        <CapabilityTypeSelector selectedType="band" onTypeChange={vi.fn()} />
      );

      const comboButton = screen.getByText("Combo").closest("button");
      const featureButton = screen.getByText("Feature").closest("button");

      expect(comboButton).not.toHaveClass("border-primary-500");
      expect(featureButton).not.toHaveClass("border-primary-500");
    });
  });

  describe("Interactions", () => {
    it("calls onTypeChange with band when band is clicked", async () => {
      const user = userEvent.setup();
      const onTypeChange = vi.fn();

      render(
        <CapabilityTypeSelector
          selectedType="combo"
          onTypeChange={onTypeChange}
        />
      );

      const bandButton = screen.getByText("Band").closest("button");
      await user.click(bandButton!);

      expect(onTypeChange).toHaveBeenCalledTimes(1);
      expect(onTypeChange).toHaveBeenCalledWith("band");
    });

    it("calls onTypeChange with combo when combo is clicked", async () => {
      const user = userEvent.setup();
      const onTypeChange = vi.fn();

      render(
        <CapabilityTypeSelector
          selectedType="band"
          onTypeChange={onTypeChange}
        />
      );

      const comboButton = screen.getByText("Combo").closest("button");
      await user.click(comboButton!);

      expect(onTypeChange).toHaveBeenCalledTimes(1);
      expect(onTypeChange).toHaveBeenCalledWith("combo");
    });

    it("calls onTypeChange with feature when feature is clicked", async () => {
      const user = userEvent.setup();
      const onTypeChange = vi.fn();

      render(
        <CapabilityTypeSelector
          selectedType="band"
          onTypeChange={onTypeChange}
        />
      );

      const featureButton = screen.getByText("Feature").closest("button");
      await user.click(featureButton!);

      expect(onTypeChange).toHaveBeenCalledTimes(1);
      expect(onTypeChange).toHaveBeenCalledWith("feature");
    });

    it("allows selecting different capability types in sequence", async () => {
      const user = userEvent.setup();
      const onTypeChange = vi.fn();

      render(
        <CapabilityTypeSelector
          selectedType="band"
          onTypeChange={onTypeChange}
        />
      );

      await user.click(screen.getByText("Combo").closest("button")!);
      await user.click(screen.getByText("Feature").closest("button")!);

      expect(onTypeChange).toHaveBeenNthCalledWith(1, "combo");
      expect(onTypeChange).toHaveBeenNthCalledWith(2, "feature");
    });

    it("calls onTypeChange even when clicking already selected option", async () => {
      const user = userEvent.setup();
      const onTypeChange = vi.fn();

      render(
        <CapabilityTypeSelector
          selectedType="band"
          onTypeChange={onTypeChange}
        />
      );

      const bandButton = screen.getByText("Band").closest("button");
      await user.click(bandButton!);

      expect(onTypeChange).toHaveBeenCalledWith("band");
    });
  });

  describe("Controlled component behavior", () => {
    it("does not change visual state unless props change", async () => {
      const user = userEvent.setup();
      const onTypeChange = vi.fn();

      const { rerender } = render(
        <CapabilityTypeSelector
          selectedType="band"
          onTypeChange={onTypeChange}
        />
      );

      const comboButton = screen.getByText("Combo").closest("button");

      // Click triggers callback
      await user.click(comboButton!);
      expect(onTypeChange).toHaveBeenCalledWith("combo");

      // But visual state remains unchanged until parent updates props
      expect(comboButton).not.toHaveClass("border-primary-500");
      expect(screen.getByText("Band").closest("button")).toHaveClass(
        "border-primary-500"
      );

      // Simulate parent updating state
      rerender(
        <CapabilityTypeSelector
          selectedType="combo"
          onTypeChange={onTypeChange}
        />
      );

      expect(comboButton).toHaveClass("border-primary-500", "bg-primary-50");
    });
  });

  describe("Icon styling", () => {
    it("applies correct color classes to band icon container", () => {
      render(
        <CapabilityTypeSelector selectedType="band" onTypeChange={vi.fn()} />
      );

      const bandButton = screen.getByText("Band").closest("button");
      const iconContainer = bandButton?.querySelector(".bg-blue-100");

      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass("text-blue-700");
    });

    it("applies correct color classes to combo icon container", () => {
      render(
        <CapabilityTypeSelector selectedType="combo" onTypeChange={vi.fn()} />
      );

      const comboButton = screen.getByText("Combo").closest("button");
      const iconContainer = comboButton?.querySelector(".bg-green-100");

      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass("text-green-700");
    });

    it("applies correct color classes to feature icon container", () => {
      render(
        <CapabilityTypeSelector selectedType="feature" onTypeChange={vi.fn()} />
      );

      const featureButton = screen.getByText("Feature").closest("button");
      const iconContainer = featureButton?.querySelector(".bg-purple-100");

      expect(iconContainer).toBeInTheDocument();
      expect(iconContainer).toHaveClass("text-purple-700");
    });
  });

  describe("Accessibility", () => {
    it("has a label for the group", () => {
      render(
        <CapabilityTypeSelector selectedType="band" onTypeChange={vi.fn()} />
      );

      expect(screen.getByText("Select Capability Type")).toBeInTheDocument();
    });

    it("buttons are keyboard accessible", () => {
      render(
        <CapabilityTypeSelector selectedType="band" onTypeChange={vi.fn()} />
      );

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button.tagName).toBe("BUTTON");
      });
    });

    it("has descriptive text for each option", () => {
      render(
        <CapabilityTypeSelector selectedType="band" onTypeChange={vi.fn()} />
      );

      // Each button should have both a label and description for screen readers
      expect(screen.getByText("Band")).toBeInTheDocument();
      expect(screen.getByText("Search by frequency band")).toBeInTheDocument();
    });

    it("has no accessibility violations", async () => {
      const { container } = render(
        <CapabilityTypeSelector selectedType="band" onTypeChange={vi.fn()} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations when different option is selected", async () => {
      const { container } = render(
        <CapabilityTypeSelector selectedType="feature" onTypeChange={vi.fn()} />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
