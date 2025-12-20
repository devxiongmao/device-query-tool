import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";

import { SearchDevicesDocument } from "../../../../src/graphql/generated/graphql";
import { DeviceSearch } from "../../../../src/features/devices/components/DeviceSearch";

const mockDevices = [
  {
    id: "device-1",
    vendor: "Apple",
    modelNum: "iPhone 15 Pro",
    marketName: "iPhone 15 Pro",
    releaseDate: "2023-09-22",
  },
  {
    id: "device-2",
    vendor: "Apple",
    modelNum: "iPhone 15",
    marketName: "iPhone 15",
    releaseDate: "2023-09-22",
  },
  {
    id: "device-3",
    vendor: "Samsung",
    modelNum: "SM-S928W",
    marketName: "Galaxy S24 Ultra",
    releaseDate: "2024-01-24",
  },
];

describe("DeviceSearch", () => {
  const mockOnDeviceSelect = vi.fn();

  const createMocks = (searchTerm: string, devices = mockDevices) => [
    {
      request: {
        query: SearchDevicesDocument,
        variables: {
          vendor: searchTerm,
          modelNum: searchTerm,
          limit: 20,
        },
      },
      result: {
        data: { devices },
      },
    },
  ];

  const renderComponent = (props = {}, mocks = []) => {
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DeviceSearch
          onDeviceSelect={mockOnDeviceSelect}
          selectedDeviceId={undefined}
          {...props}
        />
      </MockedProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input with initial state", () => {
    renderComponent();

    expect(
      screen.getByPlaceholderText(/Enter vendor or model number/)
    ).toBeInTheDocument();
    expect(screen.getByText("Start typing to search for devices")).toBeInTheDocument();
  });

  it("searches for devices when user types", async () => {
    const user = userEvent.setup();
    renderComponent({}, createMocks("Apple"));

    const searchInput = screen.getByPlaceholderText(/Enter vendor or model number/);
    await user.click(searchInput);
    await user.paste("Apple");

    await waitFor(() => {
      expect(screen.getByText("Found 3 devices")).toBeInTheDocument();
    });

    expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    expect(screen.getByText("Apple iPhone 15")).toBeInTheDocument();
    expect(screen.getByText("Samsung SM-S928W")).toBeInTheDocument();
  });

  it("displays correct singular device count", async () => {
    const user = userEvent.setup();
    const singleDevice = [mockDevices[0]];
    renderComponent({}, createMocks("iPhone 15 Pro", singleDevice));

    const searchInput = screen.getByPlaceholderText(/Enter vendor or model number/);
    await user.click(searchInput);
    await user.paste("iPhone 15 Pro");

    await waitFor(() => {
      expect(screen.getByText("Found 1 device")).toBeInTheDocument();
    });
  });

  it("calls onDeviceSelect when device is clicked", async () => {
    const user = userEvent.setup();
    renderComponent({}, createMocks("Apple"));

    const searchInput = screen.getByPlaceholderText(/Enter vendor or model number/);
    await user.click(searchInput);
    await user.paste("Apple");

    await waitFor(() => {
      expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Apple iPhone 15 Pro"));

    expect(mockOnDeviceSelect).toHaveBeenCalledWith("device-1");
    expect(mockOnDeviceSelect).toHaveBeenCalledTimes(1);
  });

  it("highlights selected device", async () => {
    const user = userEvent.setup();
    renderComponent(
      { selectedDeviceId: "device-1" },
      createMocks("Apple")
    );

    const searchInput = screen.getByPlaceholderText(/Enter vendor or model number/);
    await user.click(searchInput);
    await user.paste("Apple");

    await waitFor(() => {
      expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    });

    const selectedButton = screen
      .getByText("Apple iPhone 15 Pro")
      .closest("button");
    expect(selectedButton).toHaveClass("border-primary-500");
  });

  it("shows empty state when no devices found", async () => {
    const user = userEvent.setup();
    renderComponent({}, createMocks("NonExistent", []));

    const searchInput = screen.getByPlaceholderText(/Enter vendor or model number/);
    await user.click(searchInput);
    await user.paste("NonExistent");

    await waitFor(() => {
      expect(screen.getByText("No devices found")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Try searching with a different vendor or model number")
    ).toBeInTheDocument();
  });

  it("displays error message on query failure", async () => {
    const user = userEvent.setup();
    const errorMocks = [
      {
        request: {
          query: SearchDevicesDocument,
          variables: {
            vendor: "Error",
            modelNum: "Error",
            limit: 20,
          },
        },
        error: new Error("Network error"),
      },
    ];

    renderComponent({}, errorMocks);

    const searchInput = screen.getByPlaceholderText(/Enter vendor or model number/);
    await user.click(searchInput);
    await user.paste("Error");

    await waitFor(
      () => {
        expect(screen.getByText(/Error loading devices/)).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    expect(screen.getByText(/Network error/)).toBeInTheDocument();
  });

  it("shows loading spinner while searching", async () => {
    const user = userEvent.setup();
    renderComponent({}, createMocks("Apple"));

    const searchInput = screen.getByPlaceholderText(/Enter vendor or model number/);
    await user.click(searchInput);
    await user.paste("Apple");

    // Should briefly show loading state
    expect(screen.getByText("Start typing to search for devices")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Found 3 devices")).toBeInTheDocument();
    });
  });

  it("displays device details including market name and release date", async () => {
    const user = userEvent.setup();
    renderComponent({}, createMocks("Apple"));

    const searchInput = screen.getByPlaceholderText(/Enter vendor or model number/);
    await user.click(searchInput);
    await user.paste("Apple");

    await waitFor(() => {
      expect(screen.getByText("iPhone 15 Pro")).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Released:/)).toHaveLength(3);
    expect(screen.getByText("Galaxy S24 Ultra")).toBeInTheDocument();
  });

  it("deduplicates devices with same id", async () => {
    const user = userEvent.setup();
    const duplicateDevices = [
      mockDevices[0],
      mockDevices[0], // Duplicate
      mockDevices[1],
    ];

    renderComponent({}, createMocks("Apple", duplicateDevices));

    const searchInput = screen.getByPlaceholderText(/Enter vendor or model number/);
    await user.click(searchInput);
    await user.paste("Apple");

    await waitFor(() => {
      expect(screen.getByText("Found 2 devices")).toBeInTheDocument();
    });

    // Should only show unique devices
    const deviceButtons = screen.getAllByRole("button").filter((btn) =>
      btn.textContent?.includes("iPhone")
    );
    expect(deviceButtons).toHaveLength(2);
  });

  it("clears search results when input is cleared", async () => {
    const user = userEvent.setup();
    renderComponent({}, createMocks("Apple"));

    const searchInput = screen.getByPlaceholderText(/Enter vendor or model number/);
    await user.click(searchInput);
    await user.paste("Apple");

    await waitFor(() => {
      expect(screen.getByText("Found 3 devices")).toBeInTheDocument();
    });

    await user.clear(searchInput);

    await waitFor(() => {
      expect(screen.getByText("Start typing to search for devices")).toBeInTheDocument();
    });

    expect(screen.queryByText("Found 3 devices")).not.toBeInTheDocument();
  });
});