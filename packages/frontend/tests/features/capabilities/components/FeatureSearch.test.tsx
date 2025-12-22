import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { MockedProvider } from "@apollo/client/testing";
import { FeatureSearch } from "../../../../src/features/capabilities/components/FeatureSearch";
import { SearchFeaturesDocument } from "../../../../src/graphql/generated/graphql";

expect.extend(toHaveNoViolations);

const mockFeatures = [
  {
    id: "feature-1",
    name: "VoLTE",
    description: "Voice over LTE technology",
  },
  {
    id: "feature-2",
    name: "VoWiFi",
    description: "Voice over WiFi calling",
  },
  {
    id: "feature-3",
    name: "5G SA",
    description: "5G Standalone mode",
  },
];

const mockFeatureWithoutDescription = [
  {
    id: "feature-4",
    name: "eMBMS",
    description: null,
  },
];

const createMock = (features = mockFeatures, name?: string) => ({
  request: {
    query: SearchFeaturesDocument,
    variables: {
      name: name || undefined,
    },
  },
  result: {
    data: {
      features,
    },
  },
});

const createErrorMock = (errorMessage = "Network error") => ({
  request: {
    query: SearchFeaturesDocument,
    variables: {
      name: undefined,
    },
  },
  error: new Error(errorMessage),
});

describe("FeatureSearch", () => {
  describe("Rendering", () => {
    it("renders feature name input", () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <FeatureSearch onFeatureSelect={vi.fn()} />
        </MockedProvider>
      );

      expect(screen.getByLabelText("Feature Name")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("e.g., VoLTE, VoWiFi, 5G SA")
      ).toBeInTheDocument();
    });

    it("displays helper text for feature name input", () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <FeatureSearch onFeatureSelect={vi.fn()} />
        </MockedProvider>
      );

      expect(
        screen.getByText("Enter feature name to search")
      ).toBeInTheDocument();
    });
  });

  describe("Loading state", () => {
    it("displays spinner while loading", () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <FeatureSearch onFeatureSelect={vi.fn()} />
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
          mocks={[createErrorMock("Failed to fetch features")]}
          addTypename={false}
        >
          <FeatureSearch onFeatureSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Error:/)).toBeInTheDocument();
        expect(
          screen.getByText(/Failed to fetch features/)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Feature results display", () => {
    it("displays feature results after loading", async () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <FeatureSearch onFeatureSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 3 features")).toBeInTheDocument();
      });

      expect(screen.getByText("VoLTE")).toBeInTheDocument();
      expect(screen.getByText("VoWiFi")).toBeInTheDocument();
      expect(screen.getByText("5G SA")).toBeInTheDocument();
    });

    it("displays feature descriptions", async () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <FeatureSearch onFeatureSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("VoLTE")).toBeInTheDocument();
      });

      expect(screen.getByText("Voice over LTE technology")).toBeInTheDocument();
      expect(screen.getByText("Voice over WiFi calling")).toBeInTheDocument();
      expect(screen.getByText("5G Standalone mode")).toBeInTheDocument();
    });

    it("handles features without descriptions gracefully", async () => {
      render(
        <MockedProvider
          mocks={[createMock(mockFeatureWithoutDescription)]}
          addTypename={false}
        >
          <FeatureSearch onFeatureSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("eMBMS")).toBeInTheDocument();
      });

      // Should render without description paragraph
      expect(screen.queryByText("null")).not.toBeInTheDocument();
    });

    it("uses singular 'feature' when only one result", async () => {
      render(
        <MockedProvider
          mocks={[createMock([mockFeatures[0]])]}
          addTypename={false}
        >
          <FeatureSearch onFeatureSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 1 feature")).toBeInTheDocument();
      });
    });

    it("displays empty state when no features found", async () => {
      render(
        <MockedProvider mocks={[createMock([])]} addTypename={false}>
          <FeatureSearch onFeatureSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("No features found")).toBeInTheDocument();
        expect(
          screen.getByText("Try a different search term")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Feature selection", () => {
    it("calls onFeatureSelect when a feature is clicked", async () => {
      const user = userEvent.setup();
      const onFeatureSelect = vi.fn();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <FeatureSearch onFeatureSelect={onFeatureSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("VoLTE")).toBeInTheDocument();
      });

      const featureButton = screen.getByText("VoLTE").closest("button");
      await user.click(featureButton!);

      expect(onFeatureSelect).toHaveBeenCalledTimes(1);
      expect(onFeatureSelect).toHaveBeenCalledWith("feature-1");
    });

    it("highlights selected feature", async () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <FeatureSearch
            onFeatureSelect={vi.fn()}
            selectedFeatureId="feature-2"
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("VoWiFi")).toBeInTheDocument();
      });

      const selectedButton = screen.getByText("VoWiFi").closest("button");
      expect(selectedButton).toHaveClass("border-primary-500", "bg-primary-50");
    });

    it("allows selecting different features", async () => {
      const user = userEvent.setup();
      const onFeatureSelect = vi.fn();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <FeatureSearch onFeatureSelect={onFeatureSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("VoLTE")).toBeInTheDocument();
      });

      await user.click(screen.getByText("VoLTE").closest("button")!);
      await user.click(screen.getByText("5G SA").closest("button")!);

      expect(onFeatureSelect).toHaveBeenNthCalledWith(1, "feature-1");
      expect(onFeatureSelect).toHaveBeenNthCalledWith(2, "feature-3");
    });
  });

  describe("Auto-selection behavior", () => {
    it("auto-selects when only one result is returned", async () => {
      const onFeatureSelect = vi.fn();

      render(
        <MockedProvider
          mocks={[createMock([mockFeatures[0]])]}
          addTypename={false}
        >
          <FeatureSearch onFeatureSelect={onFeatureSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(onFeatureSelect).toHaveBeenCalledWith("feature-1");
      });
    });

    it("does not auto-select if a feature is already selected", async () => {
      const onFeatureSelect = vi.fn();

      render(
        <MockedProvider
          mocks={[createMock([mockFeatures[0]])]}
          addTypename={false}
        >
          <FeatureSearch
            onFeatureSelect={onFeatureSelect}
            selectedFeatureId="feature-2"
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("VoLTE")).toBeInTheDocument();
      });

      // Should not call onFeatureSelect since there's already a selection
      expect(onFeatureSelect).not.toHaveBeenCalled();
    });

    it("does not auto-select when multiple results are returned", async () => {
      const onFeatureSelect = vi.fn();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <FeatureSearch onFeatureSelect={onFeatureSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 3 features")).toBeInTheDocument();
      });

      expect(onFeatureSelect).not.toHaveBeenCalled();
    });
  });

  describe("Search filtering", () => {
    it("updates query when search term is entered", async () => {
      const user = userEvent.setup();
      const mockWithFilter = createMock(mockFeatures, "VoLTE");

      render(
        <MockedProvider
          mocks={[createMock(), mockWithFilter]}
          addTypename={false}
        >
          <FeatureSearch onFeatureSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Feature Name");
      await user.type(input, "VoLTE");

      // The component should trigger a new query with the name variable
      await waitFor(() => {
        expect(input).toHaveValue("VoLTE");
      });
    });

    it("clears search filter when input is cleared", async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <FeatureSearch onFeatureSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Feature Name");
      await user.type(input, "VoLTE");
      await user.clear(input);

      expect(input).toHaveValue("");
    });
  });

  describe("Accessibility", () => {
    it("has proper label for search input", () => {
      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <FeatureSearch onFeatureSelect={vi.fn()} />
        </MockedProvider>
      );

      expect(screen.getByLabelText("Feature Name")).toBeInTheDocument();
    });

    it("feature buttons are keyboard accessible", async () => {
      const onFeatureSelect = vi.fn();

      render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <FeatureSearch onFeatureSelect={onFeatureSelect} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("VoLTE")).toBeInTheDocument();
      });

      const featureButton = screen.getByText("VoLTE").closest("button");
      expect(featureButton).toBeInTheDocument();
      expect(featureButton?.tagName).toBe("BUTTON");
    });

    it("has no accessibility violations", async () => {
      const { container } = render(
        <MockedProvider mocks={[createMock()]} addTypename={false}>
          <FeatureSearch onFeatureSelect={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Found 3 features")).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
