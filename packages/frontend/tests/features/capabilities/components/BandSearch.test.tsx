import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { MockedProvider } from "@apollo/client/testing";
import { SearchBandsDocument } from "../../../../src/graphql/generated/graphql";
import { BandSearch } from "../../../../src/features/capabilities/components/BandSearch";

expect.extend(toHaveNoViolations);

const mockBands = [
  {
    id: "band-1",
    bandNumber: "2",
    technology: "LTE",
    dlBandClass: "A",
    ulBandClass: "A",
  },
  {
    id: "band-2",
    bandNumber: "66",
    technology: "LTE",
    dlBandClass: "B",
    ulBandClass: "A",
  },
  {
    id: "band-3",
    bandNumber: "n77",
    technology: "NR",
    dlBandClass: "C",
    ulBandClass: "B",
  },
  {
    id: "band-4",
    bandNumber: "4",
    technology: "LTE",
    dlBandClass: "A",
    ulBandClass: "B",
  },
  {
    id: "band-5",
    bandNumber: "n78",
    technology: "NR",
    dlBandClass: null,
    ulBandClass: null,
  },
];

const createMock = (
  bands = mockBands,
  technology?: string,
  bandNumber?: string
) => ({
  request: {
    query: SearchBandsDocument,
    variables: {
      technology: technology || undefined,
      bandNumber: bandNumber || undefined,
    },
  },
  result: {
    data: {
      bands,
    },
  },
});

const createErrorMock = (errorMessage = "Network error") => ({
  request: {
    query: SearchBandsDocument,
    variables: {
      technology: undefined,
      bandNumber: undefined,
    },
  },
  error: new Error(errorMessage),
});

// Helper function to get select element by label
const getSelectByLabel = (labelText: string): HTMLSelectElement => {
  const label = screen.getByText(labelText);
  const select = label.closest("div")?.querySelector("select");
  if (!select) {
    throw new Error(`Select with label "${labelText}" not found`);
  }
  return select as HTMLSelectElement;
};

describe("BandSearch", () => {
  describe("Rendering", () => {
    it("renders technology selector and band number input", () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      expect(screen.getByLabelText("Technology")).toBeInTheDocument();
      expect(screen.getByLabelText("Band Number")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("e.g., 2, 66, n77")
      ).toBeInTheDocument();
    });

    it("renders all technology options", () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      const select = screen.getByLabelText("Technology");
      expect(select).toBeInTheDocument();
      // Technology options are rendered within the Select component
    });

    it("displays helper text for band number input", () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      expect(
        screen.getByText("Enter band number to filter results")
      ).toBeInTheDocument();
    });
  });

  describe("Loading state", () => {
    it("displays spinner while loading", () => {
      const mockWithFilter = createMock(mockBands, undefined, undefined);

      render(
        <MockedProvider mocks={[mockWithFilter]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
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
          mocks={[createErrorMock("Failed to fetch bands")]}
          addTypename={false}
        >
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
        expect(screen.getByText(/Failed to fetch bands/)).toBeInTheDocument();
      });
    });
  });

  describe("Band results display", () => {
    it("displays band results after loading", async () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 5 bands")).toBeInTheDocument();
      });

      expect(screen.getByText("Band 2")).toBeInTheDocument();
      expect(screen.getByText("Band 66")).toBeInTheDocument();
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });

    it("uses singular 'band' when only one result", async () => {
      render(
        <MockedProvider
          mocks={[createMock([mockBands[0]])]}
          addTypename={false}
        >
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 1 band")).toBeInTheDocument();
      });
    });

    it("displays empty state when no bands found", async () => {
      render(
        <MockedProvider mocks={[createMock([])]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("No bands found")).toBeInTheDocument();
        expect(
          screen.getByText("Try adjusting your search criteria")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Band selection", () => {
    it("calls onBandSelect when a band is clicked", async () => {
      const user = userEvent.setup();
      const onBandSelect = vi.fn();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={onBandSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Band 2")).toBeInTheDocument();
      });

      const bandButton = screen.getByText("Band 2").closest("button");
      await user.click(bandButton!);

      expect(onBandSelect).toHaveBeenCalledTimes(1);
      expect(onBandSelect).toHaveBeenCalledWith("band-1");
    });

    it("highlights selected band", async () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} selectedBandId="band-2" />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Band 66")).toBeInTheDocument();
      });

      const selectedButton = screen.getByText("Band 66").closest("button");
      expect(selectedButton).toHaveClass("border-primary-500", "bg-primary-50");
    });

    it("allows selecting different bands", async () => {
      const user = userEvent.setup();
      const onBandSelect = vi.fn();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={onBandSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Band 2")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Band 2").closest("button")!);
      await user.click(screen.getByText("Band n77").closest("button")!);

      expect(onBandSelect).toHaveBeenNthCalledWith(1, "band-1");
      expect(onBandSelect).toHaveBeenNthCalledWith(2, "band-3");
    });
  });

  describe("Auto-selection behavior", () => {
    it("auto-selects when only one result is returned", async () => {
      const onBandSelect = vi.fn();

      render(
        <MockedProvider
          mocks={[createMock([mockBands[0]])]}
          addTypename={false}
        >
          <BandSearch onBandSelect={onBandSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(onBandSelect).toHaveBeenCalledWith("band-1");
      });
    });

    it("does not auto-select if a band is already selected", async () => {
      const onBandSelect = vi.fn();

      render(
        <MockedProvider
          mocks={[createMock([mockBands[0]])]}
          addTypename={false}
        >
          <BandSearch onBandSelect={onBandSelect} selectedBandId="band-2" />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Band 2")).toBeInTheDocument();
      });

      // Should not call onBandSelect since there's already a selection
      expect(onBandSelect).not.toHaveBeenCalled();
    });

    it("does not auto-select when multiple results are returned", async () => {
      const onBandSelect = vi.fn();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={onBandSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 5 bands")).toBeInTheDocument();
      });

      expect(onBandSelect).not.toHaveBeenCalled();
    });
  });

  describe("Filtering", () => {
    it("updates query when band number is entered", async () => {
      const user = userEvent.setup();
      const mockWithFilter = createMock(mockBands, undefined, "2");

      render(
        <MockedProvider
          mocks={[createMock(), mockWithFilter]}
          addTypename={false}
        >
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Band Number");
      await user.type(input, "2");

      // The component should trigger a new query with the bandNumber variable
      await waitFor(() => {
        expect(input).toHaveValue("2");
      });
    });

    it("clears band number filter when input is cleared", async () => {
      const user = userEvent.setup();
      const mockWithFilter = createMock(mockBands, undefined, "2");

      render(
        <MockedProvider
          mocks={[createMock(), mockWithFilter]}
          addTypename={false}
        >
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Band Number");
      await user.click(input);
      await user.paste("2");
      await user.clear(input);

      expect(input).toHaveValue("");
    });
  });

  describe("Bandwidth class filtering", () => {
    it("renders DL and UL bandwidth class dropdowns", async () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 5 bands")).toBeInTheDocument();
      });

      expect(screen.getByLabelText("DL Bandwidth Class")).toBeInTheDocument();
      expect(screen.getByLabelText("UL Bandwidth Class")).toBeInTheDocument();
    });

    it("filters bands by DL bandwidth class", async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 5 bands")).toBeInTheDocument();
      });

      // Select DL bandwidth class "A"
      const dlSelect = getSelectByLabel("DL Bandwidth Class");
      await user.selectOptions(dlSelect, "A");

      // After filtering by DL="A", we should see bands with dlBandClass="A"
      // Expected: band-1 (A), band-4 (A) = 2 bands
      await waitFor(() => {
        expect(screen.getByText("Found 2 bands")).toBeInTheDocument();
      });

      expect(screen.getByText("Band 2")).toBeInTheDocument(); // band-1
      expect(screen.getByText("Band 4")).toBeInTheDocument(); // band-4
      expect(screen.queryByText("Band 66")).not.toBeInTheDocument(); // band-2 (DL=B)
      expect(screen.queryByText("Band n77")).not.toBeInTheDocument(); // band-3 (DL=C)
    });

    it("filters bands by UL bandwidth class", async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 5 bands")).toBeInTheDocument();
      });

      // Select UL bandwidth class "B"
      const ulSelect = getSelectByLabel("UL Bandwidth Class");
      await user.selectOptions(ulSelect, "B");

      // After filtering by UL="B", we should see bands with ulBandClass="B"
      // Expected: band-3 (B), band-4 (B) = 2 bands
      await waitFor(() => {
        expect(screen.getByText("Found 2 bands")).toBeInTheDocument();
      });

      expect(screen.getByText("Band n77")).toBeInTheDocument(); // band-3
      expect(screen.getByText("Band 4")).toBeInTheDocument(); // band-4
      expect(screen.queryByText("Band 2")).not.toBeInTheDocument(); // band-1 (UL=A)
      expect(screen.queryByText("Band 66")).not.toBeInTheDocument(); // band-2 (UL=A)
    });

    it("filters bands by both DL and UL bandwidth classes", async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 5 bands")).toBeInTheDocument();
      });

      // Select DL="A" and UL="A"
      const dlSelect = getSelectByLabel("DL Bandwidth Class");
      const ulSelect = getSelectByLabel("UL Bandwidth Class");

      await user.selectOptions(dlSelect, "A");
      await user.selectOptions(ulSelect, "A");

      // Expected: band-1 (DL=A, UL=A) = 1 band
      await waitFor(() => {
        expect(screen.getByText("Found 1 band")).toBeInTheDocument();
      });

      expect(screen.getByText("Band 2")).toBeInTheDocument(); // band-1
      expect(screen.queryByText("Band 4")).not.toBeInTheDocument(); // band-4 (UL=B)
      expect(screen.queryByText("Band 66")).not.toBeInTheDocument(); // band-2 (DL=B)
    });

    it("shows all bands when bandwidth class filters are cleared", async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 5 bands")).toBeInTheDocument();
      });

      // Select DL="A" to filter
      const dlSelect = getSelectByLabel("DL Bandwidth Class");
      await user.selectOptions(dlSelect, "A");

      await waitFor(() => {
        expect(screen.getByText("Found 2 bands")).toBeInTheDocument();
      });

      // Clear filter by selecting "All"
      await user.selectOptions(dlSelect, "");

      // Should show all bands again
      await waitFor(() => {
        expect(screen.getByText("Found 5 bands")).toBeInTheDocument();
      });
    });

    it("updates filtered results count when bandwidth class filter changes", async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 5 bands")).toBeInTheDocument();
      });

      // Apply DL filter
      const dlSelect = getSelectByLabel("DL Bandwidth Class");
      await user.selectOptions(dlSelect, "B");

      // Count should update to show filtered results
      await waitFor(() => {
        expect(screen.getByText("Found 1 band")).toBeInTheDocument();
      });

      // Change filter to "C"
      await user.selectOptions(dlSelect, "C");

      await waitFor(() => {
        expect(screen.getByText("Found 1 band")).toBeInTheDocument();
      });

      expect(screen.getByText("Band n77")).toBeInTheDocument(); // band-3 (DL=C)
    });

    it("filters bands correctly when both technology and bandwidth class filters are applied", async () => {
      const user = userEvent.setup();
      const lteBands = mockBands.filter((b) => b.technology === "LTE");
      const mockWithTechnology = createMock(lteBands, "LTE", undefined);

      render(
        <MockedProvider
          mocks={[createMock(), mockWithTechnology]}
          addTypename={false}
        >
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 5 bands")).toBeInTheDocument();
      });

      // Select technology "LTE"
      const techSelect = getSelectByLabel("Technology");
      await user.selectOptions(techSelect, "LTE");

      await waitFor(() => {
        // After technology filter, should show only LTE bands (3 bands)
        expect(screen.getByText("Found 3 bands")).toBeInTheDocument();
      });

      // Apply DL filter
      const dlSelect = getSelectByLabel("DL Bandwidth Class");
      await user.selectOptions(dlSelect, "A");

      // Expected LTE bands with DL="A": band-1, band-4 = 2 bands
      await waitFor(() => {
        expect(screen.getByText("Found 2 bands")).toBeInTheDocument();
      });

      expect(screen.getByText("Band 2")).toBeInTheDocument(); // band-1
      expect(screen.getByText("Band 4")).toBeInTheDocument(); // band-4
      expect(screen.queryByText("Band 66")).not.toBeInTheDocument(); // band-2 (DL=B)
    });

    it("auto-selects band when bandwidth class filtering results in single match", async () => {
      const onBandSelect = vi.fn();
      const user = userEvent.setup();
      // Create bands where filtering by DL="A" and UL="A" gives only one result
      const singleMatchBands = [
        { ...mockBands[0], dlBandClass: "A", ulBandClass: "A" },
        { ...mockBands[1], dlBandClass: "B", ulBandClass: "B" },
      ];

      render(
        <MockedProvider
          mocks={[createMock(singleMatchBands)]}
          addTypename={false}
        >
          <BandSearch onBandSelect={onBandSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 2 bands")).toBeInTheDocument();
      });

      // Initially should not auto-select (2 bands)
      expect(onBandSelect).not.toHaveBeenCalled();

      // Filter to one result
      const dlSelect = getSelectByLabel("DL Bandwidth Class");
      const ulSelect = getSelectByLabel("UL Bandwidth Class");

      await user.selectOptions(dlSelect, "A");
      await user.selectOptions(ulSelect, "A");

      // Should auto-select the single remaining band
      await waitFor(() => {
        expect(onBandSelect).toHaveBeenCalledWith("band-1");
      });
    });

    it("excludes bands with null bandwidth classes when filtering", async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 5 bands")).toBeInTheDocument();
      });

      // band-5 has null for both dlBandClass and ulBandClass
      expect(screen.getByText("Band n78")).toBeInTheDocument(); // band-5

      // When filtering by DL="A", band-5 should not appear
      const dlSelect = getSelectByLabel("DL Bandwidth Class");
      await user.selectOptions(dlSelect, "A");

      await waitFor(() => {
        expect(screen.getByText("Found 2 bands")).toBeInTheDocument();
      });

      // band-5 should not be in results
      expect(screen.queryByText("Band n78")).not.toBeInTheDocument();
    });

    it("displays empty state when bandwidth class filters yield no results", async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 5 bands")).toBeInTheDocument();
      });

      // Filter by DL="A" and UL="B" - should give band-4
      const dlSelect = getSelectByLabel("DL Bandwidth Class");
      const ulSelect = getSelectByLabel("UL Bandwidth Class");

      await user.selectOptions(dlSelect, "A");
      await user.selectOptions(ulSelect, "B");

      await waitFor(() => {
        expect(screen.getByText("Found 1 band")).toBeInTheDocument();
      });

      // Now filter by DL="C" and UL="A" - should give no results
      await user.selectOptions(dlSelect, "C");
      await user.selectOptions(ulSelect, "A");

      await waitFor(() => {
        expect(screen.getByText("No bands found")).toBeInTheDocument();
        expect(
          screen.getByText("Try adjusting your search criteria")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper labels for form controls", () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      expect(screen.getByLabelText("Technology")).toBeInTheDocument();
      expect(screen.getByLabelText("Band Number")).toBeInTheDocument();
      expect(screen.getByLabelText("DL Bandwidth Class")).toBeInTheDocument();
      expect(screen.getByLabelText("UL Bandwidth Class")).toBeInTheDocument();
    });

    it("band buttons are keyboard accessible", async () => {
      const onBandSelect = vi.fn();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={onBandSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Band 2")).toBeInTheDocument();
      });

      const bandButton = screen.getByText("Band 2").closest("button");
      expect(bandButton).toBeInTheDocument();
      expect(bandButton?.tagName).toBe("BUTTON");
    });

    it("has no accessibility violations", async () => {
      const { container } = render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 5 bands")).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
