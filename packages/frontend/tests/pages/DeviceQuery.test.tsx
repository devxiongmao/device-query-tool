import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import {
  SearchDevicesDocument,
  GetProvidersDocument,
  GetDeviceCompleteDocument,
  GetProviderDeviceCompleteDocument,
  GetDeviceDocument,
} from "../../src/graphql/generated/graphql";
import { DeviceQueryPage } from "../../src/pages/DeviceQuery";
import { axe, toHaveNoViolations } from "jest-axe";

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
    vendor: "Samsung",
    modelNum: "SM-S928W",
    marketName: "Galaxy S24 Ultra",
    releaseDate: "2024-01-24",
  },
];

const mockProviders = [
  {
    id: "provider-1",
    name: "AT&T",
    country: "United States",
    networkType: "LTE",
  },
  {
    id: "provider-2",
    name: "Verizon",
    country: "United States",
    networkType: "LTE",
  },
];

const mockSoftwareVersions = [
  {
    id: "sw-1",
    name: "iOS 17.0",
    platform: "iOS",
    buildNumber: "21A329",
    releaseDate: "2023-09-18",
  },
  {
    id: "sw-2",
    name: "iOS 17.1",
    platform: "iOS",
    buildNumber: "21B74",
    releaseDate: "2023-10-25",
  },
];

const mockDeviceComplete = {
  device: {
    id: "device-1",
    vendor: "Apple",
    modelNum: "iPhone 15 Pro",
    marketName: "iPhone 15 Pro",
    releaseDate: "2023-09-22",
    software: mockSoftwareVersions,
    supportedBands: [
      {
        id: "band-1",
        bandNumber: "n77",
        technology: "NR",
        dlBandClass: "C",
        ulBandClass: "C",
      },
      {
        id: "band-2",
        bandNumber: "66",
        technology: "LTE",
        dlBandClass: "A",
        ulBandClass: "A",
      },
    ],
    supportedCombos: [{ id: "combo-1", name: "DC_1A_3A", technology: "LTE" }],
    features: [
      {
        id: "feat-1",
        name: "VoLTE",
        description: "Voice over LTE support",
      },
    ],
  },
};

expect.extend(toHaveNoViolations);

describe("DeviceQueryPage", () => {
  const createMocks = (overrides = []) => [
    {
      request: {
        query: SearchDevicesDocument,
        variables: {
          vendor: "Apple",
          modelNum: "Apple",
          limit: 20,
        },
      },
      result: {
        data: { devices: mockDevices },
      },
    },
    {
      request: {
        query: GetProvidersDocument,
      },
      result: {
        data: { providers: mockProviders },
      },
    },
    {
      request: {
        query: GetDeviceDocument,
        variables: {
          id: "device-1",
        },
      },
      result: {
        data: {
          device: {
            id: "device-1",
            software: mockSoftwareVersions,
          },
        },
      },
    },
    {
      request: {
        query: GetDeviceCompleteDocument,
        variables: {
          id: "device-1",
          softwareId: null,
          bandTechnology: undefined,
          comboTechnology: undefined,
        },
      },
      result: {
        data: mockDeviceComplete,
      },
    },
    {
      request: {
        query: GetDeviceCompleteDocument,
        variables: {
          id: "device-1",
          softwareId: "sw-1",
          bandTechnology: undefined,
          comboTechnology: undefined,
        },
      },
      result: {
        data: mockDeviceComplete,
      },
    },
    {
      request: {
        query: GetProviderDeviceCompleteDocument,
        variables: {
          id: "device-1",
          providerId: "provider-1",
          softwareId: null,
          bandTechnology: undefined,
          comboTechnology: undefined,
        },
      },
      result: {
        data: {
          device: {
            ...mockDeviceComplete.device,
            supportedBandsForProvider: mockDeviceComplete.device.supportedBands,
            supportedCombosForProvider:
              mockDeviceComplete.device.supportedCombos,
          },
        },
      },
    },
    {
      request: {
        query: GetProviderDeviceCompleteDocument,
        variables: {
          id: "device-1",
          providerId: "provider-1",
          softwareId: "sw-2",
          bandTechnology: undefined,
          comboTechnology: undefined,
        },
      },
      result: {
        data: {
          device: {
            ...mockDeviceComplete.device,
            supportedBandsForProvider: mockDeviceComplete.device.supportedBands,
            supportedCombosForProvider:
              mockDeviceComplete.device.supportedCombos,
          },
        },
      },
    },
    ...overrides,
  ];

  const renderPage = (mocks = []) => {
    return render(
      <MockedProvider mocks={createMocks(mocks)} addTypename={false}>
        <DeviceQueryPage />
      </MockedProvider>
    );
  };

  it("renders the page header and initial state", () => {
    renderPage();

    expect(screen.getByText("Query by Device")).toBeInTheDocument();
    expect(
      screen.getByText("Search for a device and view its capabilities")
    ).toBeInTheDocument();
    expect(screen.getByText("No device selected")).toBeInTheDocument();
    expect(screen.getByText("1. Select Device")).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = renderPage();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("shows device search functionality", () => {
    renderPage();

    expect(
      screen.getByPlaceholderText(/Enter vendor or model number/)
    ).toBeInTheDocument();
    expect(
      screen.getByText("Start typing to search for devices")
    ).toBeInTheDocument();
  });

  it("does not show software selector or provider selector before device is selected", () => {
    renderPage();

    expect(screen.queryByText("2. Select Software")).not.toBeInTheDocument();
    expect(screen.queryByText("3. Select Provider")).not.toBeInTheDocument();
    expect(screen.queryByText("All software")).not.toBeInTheDocument();
    expect(screen.queryByText("Global")).not.toBeInTheDocument();
  });

  it("searches and displays devices when user types", async () => {
    const user = userEvent.setup();
    renderPage();

    const searchInput = screen.getByPlaceholderText(
      /Enter vendor or model number/
    );
    await user.click(searchInput);
    await user.paste("Apple");

    await waitFor(() => {
      expect(screen.getByText("Found 2 devices")).toBeInTheDocument();
    });

    expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    expect(screen.getByText("Samsung SM-S928W")).toBeInTheDocument();
  });

  it("reveals all filter sections after device selection", async () => {
    const user = userEvent.setup();
    renderPage();

    const searchInput = screen.getByPlaceholderText(
      /Enter vendor or model number/
    );
    await user.click(searchInput);
    await user.paste("Apple");

    await waitFor(() => {
      expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Apple iPhone 15 Pro"));

    await waitFor(() => {
      expect(screen.getByText("2. Select Software")).toBeInTheDocument();
    });

    expect(screen.getByText("3. Select Provider")).toBeInTheDocument();
    expect(screen.getByText("4. Filter Technologies")).toBeInTheDocument();
    expect(screen.getByText("5. Select Fields")).toBeInTheDocument();
  });

  it("displays device results after selection", async () => {
    const user = userEvent.setup();
    renderPage();

    const searchInput = screen.getByPlaceholderText(
      /Enter vendor or model number/
    );
    await user.click(searchInput);
    await user.paste("Apple");
    await waitFor(() => {
      expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Apple iPhone 15 Pro"));

    await waitFor(() => {
      expect(screen.getByText("Global Capabilities")).toBeInTheDocument();
    });

    // Should show Software Versions in both FieldSelector and DeviceResults
    await waitFor(() => {
      expect(screen.getAllByText("Software Versions").length).toBeGreaterThan(
        0
      );
    });
  });

  describe("Software Selection", () => {
    it("displays software selector after device selection", async () => {
      const user = userEvent.setup();
      renderPage();

      const searchInput = screen.getByPlaceholderText(
        /Enter vendor or model number/
      );
      await user.click(searchInput);
      await user.paste("Apple");

      await waitFor(() => {
        expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Apple iPhone 15 Pro"));

      await waitFor(() => {
        expect(screen.getByText("2. Select Software")).toBeInTheDocument();
        expect(screen.getByText("All software")).toBeInTheDocument();
      });
    });

    it("loads and displays software versions", async () => {
      const user = userEvent.setup();
      renderPage();

      const searchInput = screen.getByPlaceholderText(
        /Enter vendor or model number/
      );
      await user.click(searchInput);
      await user.paste("Apple");

      await waitFor(() => {
        expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Apple iPhone 15 Pro"));

      await waitFor(() => {
        expect(screen.getAllByText("iOS 17.0").length).toBeGreaterThan(0);
        expect(screen.getAllByText("iOS 17.1").length).toBeGreaterThan(0);
      });
    });

    it("defaults to 'All software' selection", async () => {
      const user = userEvent.setup();
      renderPage();

      const searchInput = screen.getByPlaceholderText(
        /Enter vendor or model number/
      );
      await user.click(searchInput);
      await user.paste("Apple");

      await waitFor(() => {
        expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Apple iPhone 15 Pro"));

      await waitFor(() => {
        const allSoftwareButton = screen
          .getByText("All software")
          .closest("button");
        expect(allSoftwareButton).toHaveClass("border-primary-500");
      });
    });

    it("allows selecting a specific software version", async () => {
      const user = userEvent.setup();
      renderPage();

      const searchInput = screen.getByPlaceholderText(
        /Enter vendor or model number/
      );
      await user.click(searchInput);
      await user.paste("Apple");

      await waitFor(() => {
        expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Apple iPhone 15 Pro"));

      await waitFor(() => {
        expect(screen.getAllByText("iOS 17.0").length).toBeGreaterThan(0);
      });

      await user.click(screen.getAllByText("iOS 17.0")[0]);

      await waitFor(() => {
        const softwareButton = screen
          .getAllByText("iOS 17.0")[0]
          .closest("button");
        expect(softwareButton).toHaveClass("border-primary-500");
      });
    });

    it("hides Software Versions field selector when specific software is selected", async () => {
      const user = userEvent.setup();
      renderPage();

      const searchInput = screen.getByPlaceholderText(
        /Enter vendor or model number/
      );
      await user.click(searchInput);
      await user.paste("Apple");

      await waitFor(() => {
        expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Apple iPhone 15 Pro"));

      await waitFor(() => {
        expect(screen.getByLabelText("Software Versions")).toBeInTheDocument();
      });

      // Select specific software
      await user.click(screen.getAllByText("iOS 17.0")[0]);

      await waitFor(() => {
        // Software Versions checkbox should be hidden in FieldSelector
        expect(
          screen.queryByLabelText("Software Versions")
        ).not.toBeInTheDocument();
      });

      // Other field options should still be visible
      expect(screen.getByLabelText("Supported Bands")).toBeInTheDocument();
      expect(screen.getByLabelText("Carrier Aggregation")).toBeInTheDocument();
      expect(screen.getByLabelText("Features")).toBeInTheDocument();
    });

    it("shows Software Versions field selector when 'All software' is selected", async () => {
      const user = userEvent.setup();
      renderPage();

      const searchInput = screen.getByPlaceholderText(
        /Enter vendor or model number/
      );
      await user.click(searchInput);
      await user.paste("Apple");

      await waitFor(() => {
        expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Apple iPhone 15 Pro"));

      // Select specific software first
      await waitFor(() => {
        expect(screen.getAllByText("iOS 17.0").length).toBeGreaterThan(0);
      });
      await user.click(screen.getAllByText("iOS 17.0")[0]);

      await waitFor(() => {
        expect(
          screen.queryByLabelText("Software Versions")
        ).not.toBeInTheDocument();
      });

      // Switch back to "All software"
      await user.click(screen.getAllByText("All software")[0]);

      await waitFor(() => {
        expect(screen.getByLabelText("Software Versions")).toBeInTheDocument();
      });
    });
  });

  it("loads and displays provider options", async () => {
    const user = userEvent.setup();
    renderPage();

    const searchInput = screen.getByPlaceholderText(
      /Enter vendor or model number/
    );
    await user.click(searchInput);
    await user.paste("Apple");

    await waitFor(() => {
      expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Apple iPhone 15 Pro"));

    await waitFor(() => {
      expect(screen.getByText("AT&T")).toBeInTheDocument();
      expect(screen.getByText("Verizon")).toBeInTheDocument();
    });
  });

  it("switches between global and provider-specific views", async () => {
    const user = userEvent.setup();
    renderPage();

    const searchInput = screen.getByPlaceholderText(
      /Enter vendor or model number/
    );
    await user.click(searchInput);
    await user.paste("Apple");

    await waitFor(() => {
      expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Apple iPhone 15 Pro"));

    await waitFor(() => {
      expect(screen.getByText("Global Capabilities")).toBeInTheDocument();
    });

    // Select a provider
    await user.click(screen.getByText("AT&T"));

    await waitFor(() => {
      expect(screen.getByText("Provider-Specific")).toBeInTheDocument();
    });
  });

  it("maintains software selection when switching providers", async () => {
    const user = userEvent.setup();
    renderPage();

    const searchInput = screen.getByPlaceholderText(
      /Enter vendor or model number/
    );
    await user.click(searchInput);
    await user.paste("Apple");

    await waitFor(() => {
      expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Apple iPhone 15 Pro"));

    await waitFor(() => {
      expect(screen.getAllByText("iOS 17.1").length).toBeGreaterThan(0);
    });

    // Select software
    await user.click(screen.getAllByText("iOS 17.1")[0]);

    await waitFor(() => {
      const softwareButton = screen
        .getAllByText("iOS 17.1")[0]
        .closest("button");
      expect(softwareButton).toHaveClass("border-primary-500");
    });

    // Select provider
    await user.click(screen.getByText("AT&T"));

    await waitFor(() => {
      expect(screen.getByText("Provider-Specific")).toBeInTheDocument();
    });

    // Software selection should be maintained
    const softwareButton = screen.getAllByText("iOS 17.1")[0].closest("button");
    expect(softwareButton).toHaveClass("border-primary-500");
  });

  it("allows filtering by technology", async () => {
    const user = userEvent.setup();
    renderPage();

    const searchInput = screen.getByPlaceholderText(
      /Enter vendor or model number/
    );
    await user.click(searchInput);
    await user.paste("Apple");

    await waitFor(() => {
      expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Apple iPhone 15 Pro"));

    await waitFor(() => {
      expect(screen.getByText("Filter by Technology")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("5G NR")).toBeInTheDocument();
    expect(screen.getByLabelText("LTE / 4G")).toBeInTheDocument();
    expect(screen.getByLabelText("HSPA / 3G")).toBeInTheDocument();
    expect(screen.getByLabelText("GSM")).toBeInTheDocument();

    await user.click(screen.getByLabelText("5G NR"));

    expect(screen.getByLabelText("5G NR")).toBeChecked();
  });

  it("allows toggling field visibility", async () => {
    const user = userEvent.setup();
    renderPage();

    const searchInput = screen.getByPlaceholderText(
      /Enter vendor or model number/
    );
    await user.click(searchInput);
    await user.paste("Apple");

    await waitFor(() => {
      expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Apple iPhone 15 Pro"));

    await waitFor(() => {
      expect(screen.getByText("Select Data to Display")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Software Versions")).toBeChecked();
    expect(screen.getByLabelText("Supported Bands")).toBeChecked();
    expect(screen.getByLabelText("Carrier Aggregation")).toBeChecked();
    expect(screen.getByLabelText("Features")).toBeChecked();

    await user.click(screen.getByLabelText("Supported Bands"));

    expect(screen.getByLabelText("Supported Bands")).not.toBeChecked();
  });

  it("maintains selected device when switching providers", async () => {
    const user = userEvent.setup();
    renderPage();

    const searchInput = screen.getByPlaceholderText(
      /Enter vendor or model number/
    );
    await user.click(searchInput);
    await user.paste("Apple");

    await waitFor(() => {
      expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    });

    const deviceButton = screen.getByText("Apple iPhone 15 Pro");
    await user.click(deviceButton);

    await waitFor(() => {
      expect(screen.getByText("AT&T")).toBeInTheDocument();
    });

    await user.click(screen.getByText("AT&T"));

    await waitFor(() => {
      expect(screen.getByText("Provider-Specific")).toBeInTheDocument();
    });

    expect(deviceButton.closest("button")).toHaveClass("border-primary-500");
  });
});
