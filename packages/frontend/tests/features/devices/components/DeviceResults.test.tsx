import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { axe, toHaveNoViolations } from "jest-axe";
import {
  GetDeviceCompleteDocument,
  GetProviderDeviceCompleteDocument,
} from "../../../../src/graphql/generated/graphql";
import { DeviceResults } from "../../../../src/features/devices/components/DeviceResults";

const mockGlobalDevice = {
  device: {
    id: "device-1",
    vendor: "Apple",
    modelNum: "iPhone 15 Pro",
    marketName: "iPhone 15 Pro",
    releaseDate: "2023-09-22",
    software: [
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
    ],
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
      {
        id: "band-3",
        bandNumber: "12",
        technology: "LTE",
        dlBandClass: "B",
        ulBandClass: "B",
      },
    ],
    supportedCombos: [
      { id: "combo-1", name: "DC_1A_3A", technology: "LTE" },
      { id: "combo-2", name: "EN-DC_66A_n77C", technology: "NR" },
    ],
    features: [
      {
        id: "feat-1",
        name: "VoLTE",
        description: "Voice over LTE support",
      },
      {
        id: "feat-2",
        name: "5G SA",
        description: "5G Standalone mode",
      },
    ],
  },
};

const mockProviderDevice = {
  device: {
    ...mockGlobalDevice.device,
    supportedBandsForProvider: [
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
    supportedCombosForProvider: [
      { id: "combo-1", name: "DC_1A_3A", technology: "LTE" },
    ],
  },
};

expect.extend(toHaveNoViolations);

describe("DeviceResults", () => {
  const defaultProps = {
    deviceId: "device-1",
    providerId: null,
    selectedTechnologies: [],
    selectedFields: {
      software: true,
      bands: true,
      combos: true,
      features: true,
    },
  };

  const createMocks = (isProvider = false, overrides = {}) => [
    {
      request: {
        query: isProvider
          ? GetProviderDeviceCompleteDocument
          : GetDeviceCompleteDocument,
        variables: isProvider
          ? {
              id: "device-1",
              providerId: "provider-1",
              bandTechnology: undefined,
              comboTechnology: undefined,
            }
          : {
              id: "device-1",
              bandTechnology: undefined,
              comboTechnology: undefined,
            },
      },
      result: {
        data: isProvider ? mockProviderDevice : mockGlobalDevice,
      },
      ...overrides,
    },
  ];

  const renderComponent = (props = {}, mocks = []) => {
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DeviceResults {...defaultProps} {...props} />
      </MockedProvider>
    );
  };

  it("should have no accessibility violations", async () => {
    const { container } = renderComponent({}, createMocks());
    // Wait for the async query to complete before running accessibility check
    await waitFor(() => {
      expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("shows loading state initially", () => {
    renderComponent({}, createMocks());

    expect(screen.getByText("Loading device details...")).toBeInTheDocument();
  });

  it("displays device header with global capabilities badge", async () => {
    renderComponent({}, createMocks());

    await waitFor(() => {
      expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    });

    expect(screen.getByText("Global Capabilities")).toBeInTheDocument();
    expect(screen.getByText(/Released/)).toBeInTheDocument();
  });

  it("displays provider-specific badge when provider is selected", async () => {
    renderComponent({ providerId: "provider-1" }, createMocks(true));

    await waitFor(() => {
      expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    });

    expect(screen.getByText("Provider-Specific")).toBeInTheDocument();
  });

  it("displays all data sections when all fields are selected", async () => {
    renderComponent({}, createMocks());

    await waitFor(() => {
      expect(screen.getByText("Software Versions")).toBeInTheDocument();
    });

    expect(screen.getByText("Supported Bands")).toBeInTheDocument();
    expect(screen.getByText("Carrier Aggregation Combos")).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
  });

  it("hides software section when field is deselected", async () => {
    renderComponent(
      {
        selectedFields: {
          software: false,
          bands: true,
          combos: true,
          features: true,
        },
      },
      createMocks()
    );

    await waitFor(() => {
      expect(screen.getByText("Supported Bands")).toBeInTheDocument();
    });

    expect(screen.queryByText("Software Versions")).not.toBeInTheDocument();
  });

  it("displays software versions with correct data", async () => {
    renderComponent({}, createMocks());

    await waitFor(() => {
      expect(screen.getByText("iOS 17.0")).toBeInTheDocument();
    });

    expect(screen.getByText("iOS 17.1")).toBeInTheDocument();
    expect(screen.getByText("21A329")).toBeInTheDocument();
    expect(screen.getByText("21B74")).toBeInTheDocument();
  });

  it("displays supported bands with technology badges", async () => {
    renderComponent({}, createMocks());

    await waitFor(() => {
      expect(screen.getByText("n77")).toBeInTheDocument();
    });

    expect(screen.getByText("66")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();

    // Check for technology badges
    const nrBadges = screen.getAllByText("NR");
    const lteBadges = screen.getAllByText("LTE");
    expect(nrBadges.length).toBeGreaterThan(0);
    expect(lteBadges.length).toBeGreaterThan(0);
  });

  it("displays band count badge", async () => {
    renderComponent({}, createMocks());

    await waitFor(() => {
      expect(screen.getByText("3 bands")).toBeInTheDocument();
    });
  });

  it("filters bands by selected technology", async () => {
    const mocksWithTechFilter = [
      {
        request: {
          query: GetDeviceCompleteDocument,
          variables: {
            id: "device-1",
            bandTechnology: "NR",
            comboTechnology: "NR",
          },
        },
        result: {
          data: mockGlobalDevice,
        },
      },
    ];

    renderComponent({ selectedTechnologies: ["NR"] }, mocksWithTechFilter);

    await waitFor(() => {
      expect(screen.getByText("1 bands")).toBeInTheDocument();
    });

    expect(screen.getByText("n77")).toBeInTheDocument();
    expect(screen.queryByText("66")).not.toBeInTheDocument();
    expect(screen.queryByText("12")).not.toBeInTheDocument();
  });

  it("displays carrier aggregation combos", async () => {
    renderComponent({}, createMocks());

    await waitFor(() => {
      expect(screen.getByText("DC_1A_3A")).toBeInTheDocument();
    });

    expect(screen.getByText("EN-DC_66A_n77C")).toBeInTheDocument();
    expect(screen.getByText("2 combos")).toBeInTheDocument();
  });

  it("filters combos by selected technology", async () => {
    const mocksWithTechFilter = [
      {
        request: {
          query: GetDeviceCompleteDocument,
          variables: {
            id: "device-1",
            bandTechnology: "LTE",
            comboTechnology: "LTE",
          },
        },
        result: {
          data: mockGlobalDevice,
        },
      },
    ];

    renderComponent({ selectedTechnologies: ["LTE"] }, mocksWithTechFilter);

    await waitFor(() => {
      expect(screen.getByText("DC_1A_3A")).toBeInTheDocument();
    });

    expect(screen.queryByText("EN-DC_66A_n77C")).not.toBeInTheDocument();
    expect(screen.getByText("1 combos")).toBeInTheDocument();
  });

  it("displays device features with descriptions", async () => {
    renderComponent({}, createMocks());

    await waitFor(() => {
      expect(screen.getByText("VoLTE")).toBeInTheDocument();
    });

    expect(screen.getByText("Voice over LTE support")).toBeInTheDocument();
    expect(screen.getByText("5G SA")).toBeInTheDocument();
    expect(screen.getByText("5G Standalone mode")).toBeInTheDocument();
    expect(screen.getByText("2 features")).toBeInTheDocument();
  });

  it("shows empty state when no results match technology filter", async () => {
    const mocksWithTechFilter = [
      {
        request: {
          query: GetDeviceCompleteDocument,
          variables: {
            id: "device-1",
            bandTechnology: "GSM",
            comboTechnology: "GSM",
          },
        },
        result: {
          data: mockGlobalDevice,
        },
      },
    ];

    renderComponent(
      {
        selectedTechnologies: ["GSM"],
        selectedFields: {
          software: false,
          bands: true,
          combos: true,
          features: false,
        },
      },
      mocksWithTechFilter
    );

    await waitFor(() => {
      expect(
        screen.getByText("No results for selected technologies")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("This device doesn't support the selected technologies")
    ).toBeInTheDocument();
  });

  it("handles query error gracefully", async () => {
    const errorMocks = [
      {
        request: {
          query: GetDeviceCompleteDocument,
          variables: {
            id: "device-1",
            bandTechnology: undefined,
            comboTechnology: undefined,
          },
        },
        error: new Error("Network error"),
      },
    ];

    renderComponent({}, errorMocks);

    await waitFor(() => {
      expect(screen.getByText("Error loading device")).toBeInTheDocument();
    });

    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("handles device not found", async () => {
    const notFoundMocks = [
      {
        request: {
          query: GetDeviceCompleteDocument,
          variables: {
            id: "device-1",
            bandTechnology: undefined,
            comboTechnology: undefined,
          },
        },
        result: {
          data: { device: null },
        },
      },
    ];

    renderComponent({}, notFoundMocks);

    await waitFor(() => {
      expect(screen.getByText("Device not found")).toBeInTheDocument();
    });

    expect(
      screen.getByText("The requested device could not be found")
    ).toBeInTheDocument();
  });

  it("uses provider-specific bands when provider is selected", async () => {
    renderComponent({ providerId: "provider-1" }, createMocks(true));

    await waitFor(() => {
      expect(screen.getByText("2 bands")).toBeInTheDocument();
    });

    // Provider data only has 2 bands vs 3 in global
    expect(screen.getByText("n77")).toBeInTheDocument();
    expect(screen.getByText("66")).toBeInTheDocument();
    expect(screen.queryByText("12")).not.toBeInTheDocument();
  });

  it("applies single technology filter to query variables", async () => {
    const mocksWithTechFilter = [
      {
        request: {
          query: GetDeviceCompleteDocument,
          variables: {
            id: "device-1",
            bandTechnology: "NR",
            comboTechnology: "NR",
          },
        },
        result: {
          data: mockGlobalDevice,
        },
      },
    ];

    renderComponent({ selectedTechnologies: ["NR"] }, mocksWithTechFilter);

    await waitFor(() => {
      expect(screen.getByText("Apple iPhone 15 Pro")).toBeInTheDocument();
    });
  });
});
