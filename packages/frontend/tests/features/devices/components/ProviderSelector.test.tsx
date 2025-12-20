import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { GraphQLError } from "graphql";
import { axe, toHaveNoViolations } from "jest-axe";
import { GetProvidersDocument } from "../../../../src/graphql/generated/graphql";
import { ProviderSelector } from "../../../../src/features/devices/components/ProviderSelector";

expect.extend(toHaveNoViolations);

// Test data
const mockProviders = [
  { id: "1", name: "Telus", country: "Canada", networkType: "5G" },
  { id: "2", name: "Rogers", country: "Canada", networkType: "LTE" },
  { id: "3", name: "Bell", country: "Canada", networkType: "5G" },
];

const createMock = (providers = mockProviders, error = false) => {
  if (error) {
    return [
      {
        request: { query: GetProvidersDocument },
        error: new Error("Network error"),
      },
    ];
  }

  return [
    {
      request: { query: GetProvidersDocument },
      result: { data: { providers } },
    },
  ];
};

const createGraphQLErrorMock = () => [
  {
    request: { query: GetProvidersDocument },
    result: {
      errors: [new GraphQLError("GraphQL error occurred")],
    },
  },
];

describe("ProviderSelector Component", () => {
  describe("Loading State", () => {
    it("shows spinner while loading", () => {
      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("does not show Global option while loading", () => {
      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      expect(screen.queryByText("Global")).not.toBeInTheDocument();
    });

    it("does not show providers while loading", () => {
      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      expect(screen.queryByText("Telus")).not.toBeInTheDocument();
      expect(screen.queryByText("Rogers")).not.toBeInTheDocument();
    });
  });

  describe("Error State - Network Error", () => {
    it("shows error message on network error", async () => {
      render(
        <MockedProvider mocks={createMock([], true)} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Error loading providers")).toBeInTheDocument();
      });
    });

    it("does not show spinner on error", async () => {
      const { container } = render(
        <MockedProvider mocks={createMock([], true)} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Error loading providers")).toBeInTheDocument();
      });

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).not.toBeInTheDocument();
    });

    it("does not show providers on error", async () => {
      render(
        <MockedProvider mocks={createMock([], true)} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Error loading providers")).toBeInTheDocument();
      });

      expect(screen.queryByText("Global")).not.toBeInTheDocument();
      expect(screen.queryByText("Telus")).not.toBeInTheDocument();
    });

    it("shows error in a Card", async () => {
      render(
        <MockedProvider mocks={createMock([], true)} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Error loading providers")).toBeInTheDocument();
      });

      const errorText = screen.getByText("Error loading providers");
      expect(errorText).toHaveClass("text-sm", "text-red-600");
    });
  });

  describe("Error State - GraphQL Error", () => {
    it("shows error message on GraphQL error", async () => {
      render(
        <MockedProvider mocks={createGraphQLErrorMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Error loading providers")).toBeInTheDocument();
      });
    });
  });

  describe("Success State - Rendering", () => {
    it("renders Global option after loading", async () => {
      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });
    });

    it("renders Global option with correct description", async () => {
      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("All capabilities")).toBeInTheDocument();
      });
    });

    it("renders Global option with Globe icon", async () => {
      const { container } = render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });

      // Lucide icons render as SVGs
      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThan(0);
    });

    it("renders all providers from query", async () => {
      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Telus")).toBeInTheDocument();
        expect(screen.getByText("Rogers")).toBeInTheDocument();
        expect(screen.getByText("Bell")).toBeInTheDocument();
      });
    });

    it("displays provider countries correctly", async () => {
      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        const canadaElements = screen.getAllByText("Canada");
        expect(canadaElements).toHaveLength(3);
      });
    });

    it("renders providers in correct order", async () => {
      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Telus")).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole("button");
      // First button is Global
      expect(buttons[0]).toHaveTextContent("Global");
      expect(buttons[1]).toHaveTextContent("Telus");
      expect(buttons[2]).toHaveTextContent("Rogers");
      expect(buttons[3]).toHaveTextContent("Bell");
    });

    it("hides spinner after successful load", async () => {
      const { container } = render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).not.toBeInTheDocument();
    });
  });

  describe("Success State - Selection Highlighting", () => {
    it("highlights Global option when selectedProviderId is null", async () => {
      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });

      const globalButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Global"));
      expect(globalButton).toHaveClass("border-primary-500", "bg-primary-50");
    });

    it("does not highlight providers when Global is selected", async () => {
      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Telus")).toBeInTheDocument();
      });

      const telusButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Telus"));
      expect(telusButton).not.toHaveClass("border-primary-500");
      expect(telusButton).toHaveClass("border-gray-200");
    });

    it("highlights selected provider", async () => {
      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector selectedProviderId="2" onProviderChange={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Rogers")).toBeInTheDocument();
      });

      const rogersButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Rogers"));
      expect(rogersButton).toHaveClass("border-primary-500", "bg-primary-50");
    });

    it("does not highlight Global when provider is selected", async () => {
      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector selectedProviderId="1" onProviderChange={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });

      const globalButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Global"));
      expect(globalButton).not.toHaveClass("border-primary-500");
      expect(globalButton).toHaveClass("border-gray-200");
    });

    it("does not highlight any provider when selectedProviderId does not match", async () => {
      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId="999"
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).not.toHaveClass("border-primary-500");
      });
    });
  });

  describe("User Interactions - Clicking Global", () => {
    it("calls onProviderChange with null when clicking Global", async () => {
      const user = userEvent.setup();
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId="1"
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });

      const globalButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Global"));
      await user.click(globalButton!);

      expect(handleProviderChange).toHaveBeenCalledTimes(1);
      expect(handleProviderChange).toHaveBeenCalledWith(null);
    });

    it("calls onProviderChange when clicking Global while already selected", async () => {
      const user = userEvent.setup();
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });

      const globalButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Global"));
      await user.click(globalButton!);

      expect(handleProviderChange).toHaveBeenCalledTimes(1);
      expect(handleProviderChange).toHaveBeenCalledWith(null);
    });
  });

  describe("User Interactions - Clicking Providers", () => {
    it("calls onProviderChange with provider id when clicking provider", async () => {
      const user = userEvent.setup();
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Telus")).toBeInTheDocument();
      });

      const telusButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Telus"));
      await user.click(telusButton!);

      expect(handleProviderChange).toHaveBeenCalledTimes(1);
      expect(handleProviderChange).toHaveBeenCalledWith("1");
    });

    it("calls onProviderChange with correct id for different providers", async () => {
      const user = userEvent.setup();
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Rogers")).toBeInTheDocument();
      });

      const rogersButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Rogers"));
      await user.click(rogersButton!);

      expect(handleProviderChange).toHaveBeenCalledTimes(1);
      expect(handleProviderChange).toHaveBeenCalledWith("2");
    });

    it("calls onProviderChange when clicking already selected provider", async () => {
      const user = userEvent.setup();
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId="3"
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Bell")).toBeInTheDocument();
      });

      const bellButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Bell"));
      await user.click(bellButton!);

      expect(handleProviderChange).toHaveBeenCalledTimes(1);
      expect(handleProviderChange).toHaveBeenCalledWith("3");
    });
  });

  describe("User Interactions - Multiple Clicks", () => {
    it("handles clicking multiple providers in sequence", async () => {
      const user = userEvent.setup();
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Telus")).toBeInTheDocument();
      });

      const telusButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Telus"));
      const rogersButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Rogers"));
      const bellButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Bell"));

      await user.click(telusButton!);
      await user.click(rogersButton!);
      await user.click(bellButton!);

      expect(handleProviderChange).toHaveBeenCalledTimes(3);
      expect(handleProviderChange).toHaveBeenNthCalledWith(1, "1");
      expect(handleProviderChange).toHaveBeenNthCalledWith(2, "2");
      expect(handleProviderChange).toHaveBeenNthCalledWith(3, "3");
    });

    it("handles switching between Global and providers", async () => {
      const user = userEvent.setup();
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });

      const globalButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Global"));
      const telusButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Telus"));

      await user.click(telusButton!);
      await user.click(globalButton!);
      await user.click(telusButton!);

      expect(handleProviderChange).toHaveBeenCalledTimes(3);
      expect(handleProviderChange).toHaveBeenNthCalledWith(1, "1");
      expect(handleProviderChange).toHaveBeenNthCalledWith(2, null);
      expect(handleProviderChange).toHaveBeenNthCalledWith(3, "1");
    });

    it("handles rapid clicking of same provider", async () => {
      const user = userEvent.setup();
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Telus")).toBeInTheDocument();
      });

      const telusButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Telus"));

      await user.click(telusButton!);
      await user.click(telusButton!);
      await user.click(telusButton!);

      expect(handleProviderChange).toHaveBeenCalledTimes(3);
      expect(handleProviderChange).toHaveBeenCalledWith("1");
    });
  });

  describe("Props Updates", () => {
    it("updates selection when selectedProviderId prop changes", async () => {
      const { rerender } = render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector selectedProviderId="1" onProviderChange={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Telus")).toBeInTheDocument();
      });

      let telusButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Telus"));
      expect(telusButton).toHaveClass("border-primary-500");

      rerender(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector selectedProviderId="2" onProviderChange={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        const rogersButton = screen
          .getAllByRole("button")
          .find((btn) => btn.textContent?.includes("Rogers"));
        expect(rogersButton).toHaveClass("border-primary-500");
      });

      telusButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Telus"));
      expect(telusButton).not.toHaveClass("border-primary-500");
    });

    it("updates selection from provider to Global", async () => {
      const { rerender } = render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector selectedProviderId="1" onProviderChange={vi.fn()} />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Telus")).toBeInTheDocument();
      });

      rerender(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      const globalButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Global"));
      expect(globalButton).toHaveClass("border-primary-500");
    });

    it("updates selection from Global to provider", async () => {
      const { rerender } = render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });

      rerender(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector selectedProviderId="3" onProviderChange={vi.fn()} />
        </MockedProvider>
      );

      const bellButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Bell"));
      expect(bellButton).toHaveClass("border-primary-500");
    });
  });

  describe("Edge Cases - Empty Providers", () => {
    it("renders only Global option when providers array is empty", async () => {
      render(
        <MockedProvider mocks={createMock([])} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveTextContent("Global");
    });

    it("Global option is functional when providers array is empty", async () => {
      const user = userEvent.setup();
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock([])} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });

      const globalButton = screen.getByRole("button");
      await user.click(globalButton);

      expect(handleProviderChange).toHaveBeenCalledWith(null);
    });
  });

  describe("Edge Cases - Single Provider", () => {
    it("renders Global and one provider correctly", async () => {
      const singleProvider = [
        { id: "1", name: "Telus", country: "Canada", networkType: "5G" },
      ];

      render(
        <MockedProvider mocks={createMock(singleProvider)} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
        expect(screen.getByText("Telus")).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });
  });

  describe("Edge Cases - Many Providers", () => {
    it("renders many providers correctly", async () => {
      const manyProviders = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Provider ${i + 1}`,
        country: "Canada",
        networkType: "5G",
      }));

      render(
        <MockedProvider mocks={createMock(manyProviders)} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Provider 1")).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(11); // 1 Global + 10 providers
    });

    it("can select any provider from many providers", async () => {
      const user = userEvent.setup();
      const handleProviderChange = vi.fn();
      const manyProviders = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Provider ${i + 1}`,
        country: "Canada",
        networkType: "5G",
      }));

      render(
        <MockedProvider mocks={createMock(manyProviders)} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Provider 5")).toBeInTheDocument();
      });

      const provider5Button = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Provider 5"));
      await user.click(provider5Button!);

      expect(handleProviderChange).toHaveBeenCalledWith("5");
    });
  });

  describe("Edge Cases - Malformed Data", () => {
    it("handles providers with missing optional fields gracefully", async () => {
      const providersWithMissingFields = [
        { id: "1", name: "Telus", country: "Canada", networkType: "5G" },
        { id: "2", name: "", country: "Canada", networkType: "LTE" },
      ];

      render(
        <MockedProvider
          mocks={createMock(providersWithMissingFields)}
          addTypename={false}
        >
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Telus")).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(3); // Global + 2 providers
    });
  });

  describe("Callback Behavior", () => {
    it("does not call onProviderChange on mount", async () => {
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });

      expect(handleProviderChange).not.toHaveBeenCalled();
    });

    it("does not call onProviderChange during loading", () => {
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      expect(handleProviderChange).not.toHaveBeenCalled();
    });

    it("does not call onProviderChange on error", async () => {
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock([], true)} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Error loading providers")).toBeInTheDocument();
      });

      expect(handleProviderChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations in loading state", async () => {
      const { container } = render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations in error state", async () => {
      const { container } = render(
        <MockedProvider mocks={createMock([], true)} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Error loading providers")).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations with providers loaded", async () => {
      const { container } = render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("all provider buttons are keyboard accessible", async () => {
      const user = userEvent.setup();
      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={vi.fn()}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole("button");
      const firstButton = buttons[0];

      firstButton.focus();
      expect(firstButton).toHaveFocus();

      await user.keyboard("{Tab}");
      expect(buttons[1]).toHaveFocus();

      await user.keyboard("{Tab}");
      expect(buttons[2]).toHaveFocus();
    });

    it("supports keyboard activation with Enter key", async () => {
      const user = userEvent.setup();
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Global")).toBeInTheDocument();
      });

      const globalButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Global"));
      globalButton?.focus();

      await user.keyboard("{Enter}");

      expect(handleProviderChange).toHaveBeenCalledWith(null);
    });

    it("supports keyboard activation with Space key", async () => {
      const user = userEvent.setup();
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Telus")).toBeInTheDocument();
      });

      const telusButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Telus"));
      telusButton?.focus();

      await user.keyboard(" ");

      expect(handleProviderChange).toHaveBeenCalledWith("1");
    });
  });

  describe("Integration Scenarios", () => {
    it("simulates complete user workflow: load, select provider, change to Global", async () => {
      const user = userEvent.setup();
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      // Wait for load
      await waitFor(() => {
        expect(screen.getByText("Telus")).toBeInTheDocument();
      });

      // Select a provider
      const telusButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Telus"));
      await user.click(telusButton!);

      expect(handleProviderChange).toHaveBeenCalledWith("1");

      // Change to Global
      const globalButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Global"));
      await user.click(globalButton!);

      expect(handleProviderChange).toHaveBeenCalledWith(null);
      expect(handleProviderChange).toHaveBeenCalledTimes(2);
    });

    it("simulates browsing through multiple providers", async () => {
      const user = userEvent.setup();
      const handleProviderChange = vi.fn();

      render(
        <MockedProvider mocks={createMock()} addTypename={false}>
          <ProviderSelector
            selectedProviderId={null}
            onProviderChange={handleProviderChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        expect(screen.getByText("Telus")).toBeInTheDocument();
      });

      const telusButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Telus"));
      const rogersButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Rogers"));
      const bellButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Bell"));

      await user.click(telusButton!);
      await user.click(rogersButton!);
      await user.click(bellButton!);

      expect(handleProviderChange).toHaveBeenCalledTimes(3);
      expect(handleProviderChange).toHaveBeenNthCalledWith(1, "1");
      expect(handleProviderChange).toHaveBeenNthCalledWith(2, "2");
      expect(handleProviderChange).toHaveBeenNthCalledWith(3, "3");
    });
  });
});
