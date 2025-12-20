import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { TechnologyFilter } from "../../../../src/features/devices/components/TechnologyFilter";

expect.extend(toHaveNoViolations);

describe("TechnologyFilter Component", () => {
  describe("Rendering", () => {
    it("renders the filter label", () => {
      render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={vi.fn()}
        />
      );

      expect(screen.getByText("Filter by Technology")).toBeInTheDocument();
    });

    it("renders all four technology options", () => {
      render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={vi.fn()}
        />
      );

      expect(screen.getByText("GSM")).toBeInTheDocument();
      expect(screen.getByText("HSPA / 3G")).toBeInTheDocument();
      expect(screen.getByText("LTE / 4G")).toBeInTheDocument();
      expect(screen.getByText("5G NR")).toBeInTheDocument();
    });

    it("renders technologies in correct order", () => {
      render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={vi.fn()}
        />
      );

      const labels = screen.getAllByText(/GSM|HSPA|LTE|5G NR/);
      expect(labels[0]).toHaveTextContent("GSM");
      expect(labels[1]).toHaveTextContent("HSPA / 3G");
      expect(labels[2]).toHaveTextContent("LTE / 4G");
      expect(labels[3]).toHaveTextContent("5G NR");
    });
  });

  describe("Initial State - No Selection", () => {
    it("renders all checkboxes unchecked when selectedTechnologies is empty", () => {
      render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={vi.fn()}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(4);
      checkboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });
  });

  describe("Initial State - With Selection", () => {
    it("renders only selected technologies as checked", () => {
      render(
        <TechnologyFilter
          selectedTechnologies={["LTE", "NR"]}
          onToggleTechnology={vi.fn()}
        />
      );

      const gsmCheckbox = screen.getByRole("checkbox", { name: /GSM/i });
      const hspaCheckbox = screen.getByRole("checkbox", { name: /HSPA/i });
      const lteCheckbox = screen.getByRole("checkbox", { name: /LTE/i });
      const nrCheckbox = screen.getByRole("checkbox", { name: /5G NR/i });

      expect(gsmCheckbox).not.toBeChecked();
      expect(hspaCheckbox).not.toBeChecked();
      expect(lteCheckbox).toBeChecked();
      expect(nrCheckbox).toBeChecked();
    });

    it("handles single technology selection", () => {
      render(
        <TechnologyFilter
          selectedTechnologies={["HSPA"]}
          onToggleTechnology={vi.fn()}
        />
      );

      const hspaCheckbox = screen.getByRole("checkbox", { name: /HSPA/i });
      expect(hspaCheckbox).toBeChecked();

      const otherCheckboxes = screen
        .getAllByRole("checkbox")
        .filter((cb) => cb !== hspaCheckbox);
      otherCheckboxes.forEach((checkbox) => {
        expect(checkbox).not.toBeChecked();
      });
    });

    it("handles all technologies selected", () => {
      render(
        <TechnologyFilter
          selectedTechnologies={["GSM", "HSPA", "LTE", "NR"]}
          onToggleTechnology={vi.fn()}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });
  });

  describe("User Interaction - Checking Checkboxes", () => {
    it("calls onToggleTechnology with correct value when clicking unchecked GSM checkbox", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={handleToggle}
        />
      );

      const gsmCheckbox = screen.getByRole("checkbox", { name: /GSM/i });
      await user.click(gsmCheckbox);

      expect(handleToggle).toHaveBeenCalledTimes(1);
      expect(handleToggle).toHaveBeenCalledWith("GSM");
    });

    it("calls onToggleTechnology when clicking unchecked LTE checkbox", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      render(
        <TechnologyFilter
          selectedTechnologies={["GSM"]}
          onToggleTechnology={handleToggle}
        />
      );

      const lteCheckbox = screen.getByRole("checkbox", { name: /LTE/i });
      await user.click(lteCheckbox);

      expect(handleToggle).toHaveBeenCalledTimes(1);
      expect(handleToggle).toHaveBeenCalledWith("LTE");
    });

    it("calls onToggleTechnology when clicking unchecked 5G NR checkbox", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={handleToggle}
        />
      );

      const nrCheckbox = screen.getByRole("checkbox", { name: /5G NR/i });
      await user.click(nrCheckbox);

      expect(handleToggle).toHaveBeenCalledTimes(1);
      expect(handleToggle).toHaveBeenCalledWith("NR");
    });
  });

  describe("User Interaction - Unchecking Checkboxes", () => {
    it("calls onToggleTechnology when clicking checked checkbox", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      render(
        <TechnologyFilter
          selectedTechnologies={["LTE"]}
          onToggleTechnology={handleToggle}
        />
      );

      const lteCheckbox = screen.getByRole("checkbox", { name: /LTE/i });
      await user.click(lteCheckbox);

      expect(handleToggle).toHaveBeenCalledTimes(1);
      expect(handleToggle).toHaveBeenCalledWith("LTE");
    });

    it("calls onToggleTechnology when unchecking multiple times", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      render(
        <TechnologyFilter
          selectedTechnologies={["GSM", "LTE", "NR"]}
          onToggleTechnology={handleToggle}
        />
      );

      const gsmCheckbox = screen.getByRole("checkbox", { name: /GSM/i });
      const lteCheckbox = screen.getByRole("checkbox", { name: /LTE/i });

      await user.click(gsmCheckbox);
      await user.click(lteCheckbox);

      expect(handleToggle).toHaveBeenCalledTimes(2);
      expect(handleToggle).toHaveBeenNthCalledWith(1, "GSM");
      expect(handleToggle).toHaveBeenNthCalledWith(2, "LTE");
    });
  });

  describe("User Interaction - Clicking Labels", () => {
    it("calls onToggleTechnology when clicking the technology label", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={handleToggle}
        />
      );

      const lteLabel = screen.getByText("LTE / 4G");
      await user.click(lteLabel);

      expect(handleToggle).toHaveBeenCalledTimes(1);
      expect(handleToggle).toHaveBeenCalledWith("LTE");
    });

    it("calls onToggleTechnology when clicking the HSPA label", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={handleToggle}
        />
      );

      const hspaLabel = screen.getByText("HSPA / 3G");
      await user.click(hspaLabel);

      expect(handleToggle).toHaveBeenCalledTimes(1);
      expect(handleToggle).toHaveBeenCalledWith("HSPA");
    });
  });

  describe("User Interaction - Rapid Toggling", () => {
    it("handles rapid clicking of same checkbox", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={handleToggle}
        />
      );

      const gsmCheckbox = screen.getByRole("checkbox", { name: /GSM/i });
      await user.click(gsmCheckbox);
      await user.click(gsmCheckbox);
      await user.click(gsmCheckbox);

      expect(handleToggle).toHaveBeenCalledTimes(3);
      expect(handleToggle).toHaveBeenCalledWith("GSM");
    });

    it("handles clicking different checkboxes in sequence", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={handleToggle}
        />
      );

      await user.click(screen.getByRole("checkbox", { name: /GSM/i }));
      await user.click(screen.getByRole("checkbox", { name: /HSPA/i }));
      await user.click(screen.getByRole("checkbox", { name: /LTE/i }));
      await user.click(screen.getByRole("checkbox", { name: /5G NR/i }));

      expect(handleToggle).toHaveBeenCalledTimes(4);
      expect(handleToggle).toHaveBeenNthCalledWith(1, "GSM");
      expect(handleToggle).toHaveBeenNthCalledWith(2, "HSPA");
      expect(handleToggle).toHaveBeenNthCalledWith(3, "LTE");
      expect(handleToggle).toHaveBeenNthCalledWith(4, "NR");
    });
  });

  describe("Props Updates", () => {
    it("updates checked state when selectedTechnologies prop changes", () => {
      const { rerender } = render(
        <TechnologyFilter
          selectedTechnologies={["GSM"]}
          onToggleTechnology={vi.fn()}
        />
      );

      const gsmCheckbox = screen.getByRole("checkbox", { name: /GSM/i });
      const lteCheckbox = screen.getByRole("checkbox", { name: /LTE/i });

      expect(gsmCheckbox).toBeChecked();
      expect(lteCheckbox).not.toBeChecked();

      rerender(
        <TechnologyFilter
          selectedTechnologies={["LTE"]}
          onToggleTechnology={vi.fn()}
        />
      );

      expect(gsmCheckbox).not.toBeChecked();
      expect(lteCheckbox).toBeChecked();
    });

    it("handles adding technologies to selection", () => {
      const { rerender } = render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={vi.fn()}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((cb) => expect(cb).not.toBeChecked());

      rerender(
        <TechnologyFilter
          selectedTechnologies={["GSM", "LTE", "NR"]}
          onToggleTechnology={vi.fn()}
        />
      );

      expect(screen.getByRole("checkbox", { name: /GSM/i })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: /HSPA/i })).not.toBeChecked();
      expect(screen.getByRole("checkbox", { name: /LTE/i })).toBeChecked();
      expect(screen.getByRole("checkbox", { name: /5G NR/i })).toBeChecked();
    });

    it("handles clearing all selections", () => {
      const { rerender } = render(
        <TechnologyFilter
          selectedTechnologies={["GSM", "HSPA", "LTE", "NR"]}
          onToggleTechnology={vi.fn()}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach((cb) => expect(cb).toBeChecked());

      rerender(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={vi.fn()}
        />
      );

      checkboxes.forEach((cb) => expect(cb).not.toBeChecked());
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations with no selection", async () => {
      const { container } = render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={vi.fn()}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations with selections", async () => {
      const { container } = render(
        <TechnologyFilter
          selectedTechnologies={["LTE", "NR"]}
          onToggleTechnology={vi.fn()}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has proper label associations for each checkbox", () => {
      render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={vi.fn()}
        />
      );

      const gsmCheckbox = screen.getByRole("checkbox", { name: /GSM/i });
      const hspaCheckbox = screen.getByRole("checkbox", { name: /HSPA/i });
      const lteCheckbox = screen.getByRole("checkbox", { name: /LTE/i });
      const nrCheckbox = screen.getByRole("checkbox", { name: /5G NR/i });

      expect(gsmCheckbox).toHaveAttribute("id", "tech-GSM");
      expect(hspaCheckbox).toHaveAttribute("id", "tech-HSPA");
      expect(lteCheckbox).toHaveAttribute("id", "tech-LTE");
      expect(nrCheckbox).toHaveAttribute("id", "tech-NR");
    });

    it("allows keyboard navigation between checkboxes", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={handleToggle}
        />
      );

      const gsmCheckbox = screen.getByRole("checkbox", { name: /GSM/i });

      gsmCheckbox.focus();
      expect(gsmCheckbox).toHaveFocus();

      await user.keyboard("{Tab}");
      const hspaCheckbox = screen.getByRole("checkbox", { name: /HSPA/i });
      expect(hspaCheckbox).toHaveFocus();
    });

    it("allows keyboard interaction with Space key", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={handleToggle}
        />
      );

      const lteCheckbox = screen.getByRole("checkbox", { name: /LTE/i });
      lteCheckbox.focus();

      await user.keyboard(" ");

      expect(handleToggle).toHaveBeenCalledTimes(1);
      expect(handleToggle).toHaveBeenCalledWith("LTE");
    });
  });

  describe("Edge Cases", () => {
    it("handles invalid technology values in selectedTechnologies", () => {
      render(
        <TechnologyFilter
          selectedTechnologies={["INVALID", "LTE", "ANOTHER_INVALID"]}
          onToggleTechnology={vi.fn()}
        />
      );

      expect(screen.getByRole("checkbox", { name: /GSM/i })).not.toBeChecked();
      expect(screen.getByRole("checkbox", { name: /HSPA/i })).not.toBeChecked();
      expect(screen.getByRole("checkbox", { name: /LTE/i })).toBeChecked();
      expect(
        screen.getByRole("checkbox", { name: /5G NR/i })
      ).not.toBeChecked();
    });

    it("handles duplicate values in selectedTechnologies", () => {
      render(
        <TechnologyFilter
          selectedTechnologies={["LTE", "LTE", "LTE"]}
          onToggleTechnology={vi.fn()}
        />
      );

      const lteCheckbox = screen.getByRole("checkbox", { name: /LTE/i });
      expect(lteCheckbox).toBeChecked();
    });

    it("does not call onToggleTechnology on mount", () => {
      const handleToggle = vi.fn();

      render(
        <TechnologyFilter
          selectedTechnologies={["GSM"]}
          onToggleTechnology={handleToggle}
        />
      );

      expect(handleToggle).not.toHaveBeenCalled();
    });
  });

  describe("Integration Scenarios", () => {
    it("simulates selecting all technologies one by one", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      render(
        <TechnologyFilter
          selectedTechnologies={[]}
          onToggleTechnology={handleToggle}
        />
      );

      await user.click(screen.getByRole("checkbox", { name: /GSM/i }));
      await user.click(screen.getByRole("checkbox", { name: /HSPA/i }));
      await user.click(screen.getByRole("checkbox", { name: /LTE/i }));
      await user.click(screen.getByRole("checkbox", { name: /5G NR/i }));

      expect(handleToggle).toHaveBeenCalledTimes(4);
    });

    it("simulates deselecting all technologies", async () => {
      const user = userEvent.setup();
      const handleToggle = vi.fn();

      render(
        <TechnologyFilter
          selectedTechnologies={["GSM", "HSPA", "LTE", "NR"]}
          onToggleTechnology={handleToggle}
        />
      );

      await user.click(screen.getByRole("checkbox", { name: /GSM/i }));
      await user.click(screen.getByRole("checkbox", { name: /HSPA/i }));
      await user.click(screen.getByRole("checkbox", { name: /LTE/i }));
      await user.click(screen.getByRole("checkbox", { name: /5G NR/i }));

      expect(handleToggle).toHaveBeenCalledTimes(4);
    });
  });
});
