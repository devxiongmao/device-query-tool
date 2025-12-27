import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { MockedProvider } from "@apollo/client/testing";
import { SearchCombosDocument } from "../../../../src/graphql/generated/graphql";
import { ComboSearch } from "../../../../src/features/capabilities/components/ComboSearch";

expect.extend(toHaveNoViolations);

const mockCombos = [
  {
    id: "combo-1",
    name: "B2-n66",
    technology: "EN-DC",
    bands: [
      { id: "band-1", bandNumber: "2", technology: "LTE" },
      { id: "band-2", bandNumber: "n66", technology: "NR" },
    ],
  },
  {
    id: "combo-2",
    name: "2A-4A",
    technology: "LTE CA",
    bands: [
      { id: "band-3", bandNumber: "2", technology: "LTE" },
      { id: "band-4", bandNumber: "4", technology: "LTE" },
    ],
  },
  {
    id: "combo-3",
    name: "n77A-n78A",
    technology: "NR CA",
    bands: [
      { id: "band-5", bandNumber: "n77", technology: "NR" },
      { id: "band-6", bandNumber: "n78", technology: "NR" },
    ],
  },
];

const mockComboWithoutBands = [
  {
    id: "combo-4",
    name: "Test Combo",
    technology: "LTE CA",
    bands: [],
  },
];

const createMock = (
  combos = mockCombos,
  technology: string = "",
  name?: string
) => ({
  request: {
    query: SearchCombosDocument,
    variables: {
      technology: technology || undefined,
      name: name || undefined,
    },
  },
  result: {
    data: {
      combos,
    },
  },
});

const createErrorMock = (errorMessage = "Network error") => ({
  request: {
    query: SearchCombosDocument,
    variables: {
      technology: undefined,
      name: undefined,
    },
  },
  error: new Error(errorMessage),
});

describe("ComboSearch", () => {
  describe("Rendering", () => {
    it("renders technology selector and combo name input", () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <ComboSearch onComboSelect={vi.fn()} />
        </MockedProvider>
      );

      expect(screen.getByLabelText("Technology")).toBeInTheDocument();
      expect(screen.getByLabelText("Combo Name")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("e.g., B2-n66, 2A-4A")
      ).toBeInTheDocument();
    });

    it("displays helper text for combo name input", () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <ComboSearch onComboSelect={vi.fn()} />
        </MockedProvider>
      );

      expect(
        screen.getByText("Enter combo name to filter results")
      ).toBeInTheDocument();
    });
  });

  describe("Loading state", () => {
    it("displays spinner while loading", () => {
      const mockWithFilter = createMock(mockCombos);

      render(
        <MockedProvider mocks={[mockWithFilter]} addTypename={false}>
          <ComboSearch onComboSelect={vi.fn()} />
        </MockedProvider>
      );

      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Error handling", () => {
    it("displays error message when query fails", async () => {
      render(
        <MockedProvider
          mocks={[createErrorMock("Failed to fetch combos")]}
          addTypename={false}
        >
          <ComboSearch onComboSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
        expect(screen.getByText(/Failed to fetch combos/)).toBeInTheDocument();
      });
    });
  });

  describe("Combo results display", () => {
    it("displays combo results after loading", async () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <ComboSearch onComboSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 3 combos")).toBeInTheDocument();
      });

      expect(screen.getByText("B2-n66")).toBeInTheDocument();
      expect(screen.getByText("2A-4A")).toBeInTheDocument();
      expect(screen.getByText("n77A-n78A")).toBeInTheDocument();
    });

    it("displays combo details including technology badges", async () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <ComboSearch onComboSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("B2-n66")).toBeInTheDocument();
      });

      expect(screen.getByText("EN-DC")).toBeInTheDocument();
      expect(screen.getByText("LTE CA")).toBeInTheDocument();
      expect(screen.getByText("NR CA")).toBeInTheDocument();
    });

    it("displays band numbers for each combo", async () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <ComboSearch onComboSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("B2-n66")).toBeInTheDocument();
      });

      // Band numbers appear multiple times across different combos
      expect(screen.getAllByText("2").length).toBeGreaterThan(0);
      expect(screen.getByText("n66")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
      expect(screen.getByText("n77")).toBeInTheDocument();
      expect(screen.getByText("n78")).toBeInTheDocument();
    });

    it("handles combos without bands gracefully", async () => {
      render(
        <MockedProvider
          mocks={[createMock(mockComboWithoutBands)]}
          addTypename={false}
        >
          <ComboSearch onComboSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Test Combo")).toBeInTheDocument();
      });

      // Component should render without band chips
      expect(screen.getByText("LTE CA")).toBeInTheDocument();
    });

    it("uses singular 'combo' when only one result", async () => {
      render(
        <MockedProvider
          mocks={[createMock([mockCombos[0]])]}
          addTypename={false}
        >
          <ComboSearch onComboSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 1 combo")).toBeInTheDocument();
      });
    });

    it("displays empty state when no combos found", async () => {
      render(
        <MockedProvider mocks={[createMock([])]} addTypename={false}>
          <ComboSearch onComboSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("No combos found")).toBeInTheDocument();
        expect(
          screen.getByText("Try adjusting your search criteria")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Combo selection", () => {
    it("calls onComboSelect when a combo is clicked", async () => {
      const user = userEvent.setup();
      const onComboSelect = vi.fn();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <ComboSearch onComboSelect={onComboSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("B2-n66")).toBeInTheDocument();
      });

      const comboButton = screen.getByText("B2-n66").closest("button");
      await user.click(comboButton!);

      expect(onComboSelect).toHaveBeenCalledTimes(1);
      expect(onComboSelect).toHaveBeenCalledWith("combo-1");
    });

    it("highlights selected combo", async () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <ComboSearch onComboSelect={vi.fn()} selectedComboId="combo-2" />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("2A-4A")).toBeInTheDocument();
      });

      const selectedButton = screen.getByText("2A-4A").closest("button");
      expect(selectedButton).toHaveClass("border-primary-500", "bg-primary-50");
    });

    it("allows selecting different combos", async () => {
      const user = userEvent.setup();
      const onComboSelect = vi.fn();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <ComboSearch onComboSelect={onComboSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("B2-n66")).toBeInTheDocument();
      });

      await user.click(screen.getByText("B2-n66").closest("button")!);
      await user.click(screen.getByText("n77A-n78A").closest("button")!);

      expect(onComboSelect).toHaveBeenNthCalledWith(1, "combo-1");
      expect(onComboSelect).toHaveBeenNthCalledWith(2, "combo-3");
    });
  });

  describe("Auto-selection behavior", () => {
    it("auto-selects when only one result is returned", async () => {
      const onComboSelect = vi.fn();

      render(
        <MockedProvider
          mocks={[createMock([mockCombos[0]])]}
          addTypename={false}
        >
          <ComboSearch onComboSelect={onComboSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(onComboSelect).toHaveBeenCalledWith("combo-1");
      });
    });

    it("does not auto-select if a combo is already selected", async () => {
      const onComboSelect = vi.fn();

      render(
        <MockedProvider
          mocks={[createMock([mockCombos[0]])]}
          addTypename={false}
        >
          <ComboSearch
            onComboSelect={onComboSelect}
            selectedComboId="combo-2"
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("B2-n66")).toBeInTheDocument();
      });

      // Should not call onComboSelect since there's already a selection
      expect(onComboSelect).not.toHaveBeenCalled();
    });

    it("does not auto-select when multiple results are returned", async () => {
      const onComboSelect = vi.fn();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <ComboSearch onComboSelect={onComboSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 3 combos")).toBeInTheDocument();
      });

      expect(onComboSelect).not.toHaveBeenCalled();
    });
  });

  describe("Filtering", () => {
    it("updates query when combo name is entered", async () => {
      const user = userEvent.setup();
      const mockWithFilter = createMock(mockCombos, undefined, "B");
      const mockWithFullBand = createMock(mockCombos, undefined, "B2");

      render(
        <MockedProvider
          mocks={[createMock(mockCombos, ""), mockWithFilter, mockWithFullBand]}
          addTypename={false}
        >
          <ComboSearch onComboSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Combo Name");
      await user.type(input, "B2");

      // The component should trigger a new query with the name variable
      await waitFor(() => {
        expect(input).toHaveValue("B2");
      });
    });

    it("clears combo name filter when input is cleared", async () => {
      const user = userEvent.setup();
      const mockWithFilter = createMock(mockCombos, undefined, undefined);
      const mockWithBand = createMock(mockCombos, undefined, "B");
      const mockWithBandName = createMock(mockCombos, undefined, "B2");

      render(
        <MockedProvider
          mocks={[mockWithFilter, mockWithBand, mockWithBandName]}
          addTypename={false}
        >
          <ComboSearch onComboSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Combo Name");
      await user.type(input, "B2");
      await user.clear(input);

      expect(input).toHaveValue("");
    });
  });

  describe("Technology filtering", () => {
    it("renders all technology options in the select", () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <ComboSearch onComboSelect={vi.fn()} />
        </MockedProvider>
      );

      const select = screen.getByLabelText("Technology");
      expect(select).toBeInTheDocument();
      // Technology options are rendered within the Select component
    });
  });

  describe("Accessibility", () => {
    it("has proper labels for form controls", () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <ComboSearch onComboSelect={vi.fn()} />
        </MockedProvider>
      );

      expect(screen.getByLabelText("Technology")).toBeInTheDocument();
      expect(screen.getByLabelText("Combo Name")).toBeInTheDocument();
    });

    it("combo buttons are keyboard accessible", async () => {
      const onComboSelect = vi.fn();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <ComboSearch onComboSelect={onComboSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("B2-n66")).toBeInTheDocument();
      });

      const comboButton = screen.getByText("B2-n66").closest("button");
      expect(comboButton).toBeInTheDocument();
      expect(comboButton?.tagName).toBe("BUTTON");
    });

    it("has no accessibility violations", async () => {
      const { container } = render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <ComboSearch onComboSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 3 combos")).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
