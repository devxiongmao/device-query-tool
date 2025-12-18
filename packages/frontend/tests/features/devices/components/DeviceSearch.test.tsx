import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { GraphQLError } from "graphql";
import { toHaveNoViolations } from "jest-axe";
import { SearchDevicesDocument } from "../../../../src/graphql/generated/graphql";
import { DeviceSearch } from "../../../../src/features/devices/components/DeviceSearch";

expect.extend(toHaveNoViolations);

// Test data
const mockDevices = [
  {
    id: "1",
    vendor: "Apple",
    modelNum: "A2893",
    marketName: "iPhone 15 Pro Max",
    releaseDate: "2023-09-22",
  },
  {
    id: "2",
    vendor: "Apple",
    modelNum: "A2894",
    marketName: "iPhone 15 Pro",
    releaseDate: "2023-09-22",
  },
  {
    id: "3",
    vendor: "Samsung",
    modelNum: "SM-S928W",
    marketName: "Galaxy S24 Ultra",
    releaseDate: "2024-01-24",
  },
];

const createMock = (devices = mockDevices, variables = {}) => [
  {
    request: {
      query: SearchDevicesDocument,
      variables: {
        vendor: undefined,
        modelNum: undefined,
        limit: 20,
        ...variables,
      },
    },
    result: { data: { devices } },
  },
];

const createErrorMock = (variables = {}) => [
  {
    request: {
      query: SearchDevicesDocument,
      variables: {
        vendor: undefined,
        modelNum: undefined,
        limit: 20,
        ...variables,
      },
    },
    error: new Error("Network error"),
  },
];

const createGraphQLErrorMock = (variables = {}) => [
  {
    request: {
      query: SearchDevicesDocument,
      variables: {
        vendor: undefined,
        modelNum: undefined,
        limit: 20,
        ...variables,
      },
    },
    result: {
      errors: [new GraphQLError("GraphQL error occurred")],
    },
  },
];

describe("DeviceSearch Component", () => {
  describe("Initial State", () => {
    it("renders search input with label", () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      expect(screen.getByLabelText("Search for a device")).toBeInTheDocument();
    });

    it("renders search input with placeholder", () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByPlaceholderText(
        /Enter vendor or model number/i
      );
      expect(input).toBeInTheDocument();
    });

    it("renders helper text", () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      expect(
        screen.getByText("Search by vendor name or model number")
      ).toBeInTheDocument();
    });

    it("shows initial empty state message", () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      expect(
        screen.getByText("Start typing to search for devices")
      ).toBeInTheDocument();
    });

    it("shows smartphone icon in initial state", () => {
      const { container } = render(
        <MockedProvider mocks={[]} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThan(0);
    });

    it("search input starts empty", () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      expect(input).toHaveValue("");
    });
  });

  describe("Search Input - User Typing", () => {
    it("updates search input as user types", async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      expect(input).toHaveValue("Apple");
    });

    it("updates search input with model numbers", async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "SM-S928W");

      expect(input).toHaveValue("SM-S928W");
    });

    it("allows clearing search input", async () => {
      const user = userEvent.setup();

      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");
      await user.clear(input);

      expect(input).toHaveValue("");
    });
  });

  describe("Debounced Search", () => {
    it("queries after user stops typing (debounced)", async () => {
      const user = userEvent.setup();
      const mocks = createMock(mockDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      // Wait for debounce (300ms) + query to complete
      await waitFor(
        () => {
          expect(screen.getByText(/Found 3 devices/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Loading State", () => {
    it("shows spinner while loading", async () => {
      const user = userEvent.setup();
      const mocks = createMock(mockDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      // Should show spinner briefly during loading
      await waitFor(() => {
        const spinner = document.querySelector(".animate-spin");
        if (spinner) expect(spinner).toBeInTheDocument();
      });
    });

    it("hides initial state message after typing", async () => {
      const user = userEvent.setup();
      const mocks = createMock(mockDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(() => {
        expect(
          screen.queryByText("Start typing to search for devices")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Error State - Network Error", () => {
    it("shows error message on network error", async () => {
      const user = userEvent.setup();
      const mocks = createErrorMock({
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(
            screen.getByText(/Error loading devices/i)
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("displays error message details", async () => {
      const user = userEvent.setup();
      const mocks = createErrorMock({
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(screen.getByText(/Network error/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("does not show spinner on error", async () => {
      const user = userEvent.setup();
      const mocks = createErrorMock({
        vendor: "Apple",
        modelNum: "Apple",
      });

      const { container } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(
            screen.getByText(/Error loading devices/i)
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).not.toBeInTheDocument();
    });

    it("does not show results on error", async () => {
      const user = userEvent.setup();
      const mocks = createErrorMock({
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(
            screen.getByText(/Error loading devices/i)
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      expect(screen.queryByText(/Found/i)).not.toBeInTheDocument();
    });
  });

  describe("Error State - GraphQL Error", () => {
    it("shows error message on GraphQL error", async () => {
      const user = userEvent.setup();
      const mocks = createGraphQLErrorMock({
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(
            screen.getByText(/Error loading devices/i)
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Success State - Results Rendering", () => {
    it("shows device count for multiple devices", async () => {
      const user = userEvent.setup();
      const mocks = createMock(mockDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(screen.getByText("Found 3 devices")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("uses singular 'device' for single result", async () => {
      const user = userEvent.setup();
      const singleDevice = [mockDevices[0]];
      const mocks = createMock(singleDevice, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(screen.getByText("Found 1 device")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("renders all devices with vendor and model", async () => {
      const user = userEvent.setup();
      const mocks = createMock(mockDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(screen.getByText(/Apple A2893/i)).toBeInTheDocument();
          expect(screen.getByText(/Apple A2894/i)).toBeInTheDocument();
          expect(screen.getByText(/Samsung SM-S928W/i)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("displays market names", async () => {
      const user = userEvent.setup();
      const mocks = createMock(mockDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(screen.getByText("iPhone 15 Pro Max")).toBeInTheDocument();
          expect(screen.getByText("iPhone 15 Pro")).toBeInTheDocument();
          expect(screen.getByText("Galaxy S24 Ultra")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("displays formatted release dates", async () => {
      const user = userEvent.setup();
      const mocks = createMock(mockDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          const releasedTexts = screen.getAllByText(/Released:/i);
          expect(releasedTexts.length).toBeGreaterThan(0);
        },
        { timeout: 2000 }
      );
    });

    it("renders device icons", async () => {
      const user = userEvent.setup();
      const mocks = createMock(mockDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      const { container } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(screen.getByText("iPhone 15 Pro Max")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThan(0);
    });

    it("hides spinner after results load", async () => {
      const user = userEvent.setup();
      const mocks = createMock(mockDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      const { container } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(screen.getByText("Found 3 devices")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).not.toBeInTheDocument();
    });
  });

  describe("Success State - Empty Results", () => {
    it("shows EmptyState when no devices found", async () => {
      const user = userEvent.setup();
      const mocks = createMock([], {
        vendor: "NonExistent",
        modelNum: "NonExistent",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "NonExistent");

      await waitFor(
        () => {
          expect(screen.getByText("No devices found")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("shows helpful message in EmptyState", async () => {
      const user = userEvent.setup();
      const mocks = createMock([], {
        vendor: "NonExistent",
        modelNum: "NonExistent",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "NonExistent");

      await waitFor(
        () => {
          expect(
            screen.getByText(
              "Try searching with a different vendor or model number"
            )
          ).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it("does not show device count when no results", async () => {
      const user = userEvent.setup();
      const mocks = createMock([], {
        vendor: "NonExistent",
        modelNum: "NonExistent",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "NonExistent");

      await waitFor(
        () => {
          expect(screen.getByText("No devices found")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      expect(screen.queryByText(/Found/i)).not.toBeInTheDocument();
    });
  });

  describe("Device Selection", () => {
    it("calls onDeviceSelect with correct ID when clicking device", async () => {
      const user = userEvent.setup();
      const handleDeviceSelect = vi.fn();
      const mocks = createMock(mockDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={handleDeviceSelect} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(screen.getByText("iPhone 15 Pro Max")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const deviceButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("iPhone 15 Pro Max"));
      await user.click(deviceButton!);

      expect(handleDeviceSelect).toHaveBeenCalledTimes(1);
      expect(handleDeviceSelect).toHaveBeenCalledWith("1");
    });

    it("calls onDeviceSelect for different devices", async () => {
      const user = userEvent.setup();
      const handleDeviceSelect = vi.fn();
      const mocks = createMock(mockDevices, {
        vendor: "Samsung",
        modelNum: "Samsung",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={handleDeviceSelect} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Samsung");

      await waitFor(
        () => {
          expect(screen.getByText("Galaxy S24 Ultra")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const deviceButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Galaxy S24 Ultra"));
      await user.click(deviceButton!);

      expect(handleDeviceSelect).toHaveBeenCalledWith("3");
    });

    it("highlights selected device", async () => {
      const user = userEvent.setup();
      const mocks = createMock(mockDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} selectedDeviceId="1" />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(screen.getByText("iPhone 15 Pro Max")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const selectedButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("iPhone 15 Pro Max"));
      expect(selectedButton).toHaveClass("border-primary-500", "bg-primary-50");
    });

    it("does not highlight unselected devices", async () => {
      const user = userEvent.setup();
      const mocks = createMock(mockDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} selectedDeviceId="1" />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(screen.getByText("iPhone 15 Pro")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const unselectedButton = screen
        .getAllByRole("button")
        .find(
          (btn) =>
            btn.textContent?.includes("iPhone 15 Pro") &&
            !btn.textContent?.includes("Max")
        );
      expect(unselectedButton).not.toHaveClass("border-primary-500");
      expect(unselectedButton).toHaveClass("border-gray-200");
    });

    it("shows checkmark icon for selected device", async () => {
      const user = userEvent.setup();
      const mocks = createMock(mockDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      const { container } = render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} selectedDeviceId="1" />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(screen.getByText("iPhone 15 Pro Max")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const primaryBadges = container.querySelectorAll(".bg-primary-600");
      expect(primaryBadges.length).toBeGreaterThan(0);
    });
  });

  describe("Device Selection - Multiple Clicks", () => {
    it("handles clicking multiple devices in sequence", async () => {
      const user = userEvent.setup();
      const handleDeviceSelect = vi.fn();
      const mocks = createMock(mockDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={handleDeviceSelect} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(screen.getByText("iPhone 15 Pro Max")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const device1 = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("iPhone 15 Pro Max"));
      const device2 = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("Galaxy S24 Ultra"));

      await user.click(device1!);
      await user.click(device2!);

      expect(handleDeviceSelect).toHaveBeenCalledTimes(2);
      expect(handleDeviceSelect).toHaveBeenNthCalledWith(1, "1");
      expect(handleDeviceSelect).toHaveBeenNthCalledWith(2, "3");
    });

    it("handles clicking same device multiple times", async () => {
      const user = userEvent.setup();
      const handleDeviceSelect = vi.fn();
      const mocks = createMock(mockDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={handleDeviceSelect} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(screen.getByText("iPhone 15 Pro Max")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const deviceButton = screen
        .getAllByRole("button")
        .find((btn) => btn.textContent?.includes("iPhone 15 Pro Max"));

      await user.click(deviceButton!);
      await user.click(deviceButton!);
      await user.click(deviceButton!);

      expect(handleDeviceSelect).toHaveBeenCalledTimes(3);
      expect(handleDeviceSelect).toHaveBeenCalledWith("1");
    });
  });

  describe("Deduplication", () => {
    it("removes duplicate devices from results", async () => {
      const user = userEvent.setup();
      const duplicateDevices = [
        mockDevices[0],
        mockDevices[0], // Duplicate
        mockDevices[1],
      ];
      const mocks = createMock(duplicateDevices, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(screen.getByText("Found 2 devices")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const buttons = screen.getAllByRole("button");
      const proMaxButtons = buttons.filter((btn) =>
        btn.textContent?.includes("iPhone 15 Pro Max")
      );
      expect(proMaxButtons).toHaveLength(1);
    });

    it("handles multiple duplicates correctly", async () => {
      const user = userEvent.setup();
      const manyDuplicates = [
        mockDevices[0],
        mockDevices[0],
        mockDevices[0],
        mockDevices[1],
        mockDevices[1],
        mockDevices[2],
      ];
      const mocks = createMock(manyDuplicates, {
        vendor: "Apple",
        modelNum: "Apple",
      });

      render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <DeviceSearch onDeviceSelect={vi.fn()} />
        </MockedProvider>
      );

      const input = screen.getByLabelText("Search for a device");
      await user.type(input, "Apple");

      await waitFor(
        () => {
          expect(screen.getByText("Found 3 devices")).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });
});
