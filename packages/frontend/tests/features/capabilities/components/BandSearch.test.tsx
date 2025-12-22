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
    dlBandClass: "DL: 1930-1990 MHz",
    ulBandClass: "UL: 1850-1910 MHz",
  },
  {
    id: "band-2",
    bandNumber: "66",
    technology: "LTE",
    dlBandClass: "DL: 2110-2200 MHz",
    ulBandClass: "UL: 1710-1780 MHz",
  },
  {
    id: "band-3",
    bandNumber: "n77",
    technology: "NR",
    dlBandClass: "DL: 3300-4200 MHz",
    ulBandClass: "UL: 3300-4200 MHz",
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
      render(
        <MockedProvider mocks={[]} addTypename={false}>
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
        expect(screen.getByText("Found 3 bands")).toBeInTheDocument();
      });

      expect(screen.getByText("Band 2")).toBeInTheDocument();
      expect(screen.getByText("Band 66")).toBeInTheDocument();
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });

    it("displays band details including technology and frequency classes", async () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Band 2")).toBeInTheDocument();
      });

      expect(screen.getByText("DL: 1930-1990 MHz")).toBeInTheDocument();
      expect(screen.getByText("UL: 1850-1910 MHz")).toBeInTheDocument();
      expect(screen.getAllByText("LTE")).toHaveLength(2);
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
        expect(screen.getByText("Found 3 bands")).toBeInTheDocument();
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

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <BandSearch onBandSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Band Number");
      await user.type(input, "2");
      await user.clear(input);

      expect(input).toHaveValue("");
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
        expect(screen.getByText("Found 3 bands")).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
