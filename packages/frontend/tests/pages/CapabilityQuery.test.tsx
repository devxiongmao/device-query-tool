import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { CapabilityQueryPage } from "../../src/pages/CapabilityQuery";
import {
  SearchBandsDocument,
  SearchCombosDocument,
  SearchFeaturesDocument,
  DevicesByBandDocument,
  DevicesByComboDocument,
  DevicesByFeatureDocument,
  DevicesByBandProviderDocument,
  GetProvidersDocument,
} from "../../src/graphql/generated/graphql";
import { axe, toHaveNoViolations } from "jest-axe";

const mockBands = [
  {
    id: "band-1",
    bandNumber: "n77",
    technology: "NR",
    dlBandClass: "C-Band (3.3-4.2 GHz)",
    ulBandClass: "C-Band (3.3-4.2 GHz)",
  },
  {
    id: "band-2",
    bandNumber: "66",
    technology: "LTE",
    dlBandClass: "AWS Extension (1710-1780 MHz)",
    ulBandClass: "AWS Extension (2110-2200 MHz)",
  },
];

const mockCombos = [
  {
    id: "combo-1",
    name: "DC_1A_3A",
    technology: "LTE CA",
    bands: [
      { id: "band-3", bandNumber: "1" },
      { id: "band-4", bandNumber: "3" },
    ],
  },
  {
    id: "combo-2",
    name: "DC_n77A_n78A",
    technology: "NR CA",
    bands: [
      { id: "band-1", bandNumber: "n77" },
      { id: "band-5", bandNumber: "n78" },
    ],
  },
];

const mockFeatures = [
  {
    id: "feat-1",
    name: "VoLTE",
    description: "Voice over LTE support",
  },
  {
    id: "feat-2",
    name: "VoNR",
    description: "Voice over NR support",
  },
];

const mockProviders = [
  { id: "provider-1", name: "AT&T", country: "United States" },
  { id: "provider-2", name: "Verizon", country: "United States" },
];

const mockDevicesForBand = [
  {
    device: {
      id: "device-1",
      vendor: "Apple",
      modelNum: "A2848",
      marketName: "iPhone 15 Pro",
      releaseDate: "2023-09-22",
    },
    software: [
      {
        id: "sw-1",
        name: "iOS 17",
        buildNumber: "21A329",
      },
    ],
    supportStatus: "global",
    provider: null,
  },
  {
    device: {
      id: "device-2",
      vendor: "Samsung",
      modelNum: "SM-S928W",
      marketName: "Galaxy S24 Ultra",
      releaseDate: "2024-01-24",
    },
    software: [
      {
        id: "sw-2",
        name: "Android 14",
        buildNumber: "UP1A.231005.007",
      },
    ],
    supportStatus: "global",
    provider: null,
  },
];

const mockDevicesForCombo = [
  {
    device: {
      id: "device-1",
      vendor: "Apple",
      modelNum: "A2848",
      marketName: "iPhone 15 Pro",
      releaseDate: "2023-09-22",
    },
    software: [],
    supportStatus: "global",
    provider: null,
  },
];

const mockDevicesForFeature = [
  {
    device: {
      id: "device-1",
      vendor: "Apple",
      modelNum: "A2848",
      marketName: "iPhone 15 Pro",
      releaseDate: "2023-09-22",
    },
    software: [],
    supportStatus: "global",
    provider: null,
  },
];

const mockDevicesForBandProvider = [
  {
    device: {
      id: "device-1",
      vendor: "Apple",
      modelNum: "A2848",
      marketName: "iPhone 15 Pro",
      releaseDate: "2023-09-22",
    },
    software: [],
    supportStatus: "provider-specific",
    provider: {
      id: "provider-1",
      name: "AT&T",
    },
  },
];

expect.extend(toHaveNoViolations);

describe("CapabilityQueryPage", () => {
  const createMocks = (overrides: any[] = []) => [ // eslint-disable-line @typescript-eslint/no-explicit-any
    {
      request: {
        query: SearchBandsDocument,
        variables: {
          technology: undefined,
          bandNumber: undefined,
        },
      },
      result: {
        data: { bands: mockBands },
      },
    },
    {
      request: {
        query: SearchBandsDocument,
        variables: {
          technology: "NR",
          bandNumber: undefined,
        },
      },
      result: {
        data: { bands: [mockBands[0]] },
      },
    },
    {
      request: {
        query: SearchBandsDocument,
        variables: {
          technology: undefined,
          bandNumber: "n77",
        },
      },
      result: {
        data: { bands: [mockBands[0]] },
      },
    },
    {
      request: {
        query: SearchCombosDocument,
        variables: {
          technology: undefined,
          name: undefined,
        },
      },
      result: {
        data: { combos: mockCombos },
      },
    },
    {
      request: {
        query: SearchFeaturesDocument,
        variables: {
          name: undefined,
        },
      },
      result: {
        data: { features: mockFeatures },
      },
    },
    {
      request: {
        query: SearchFeaturesDocument,
        variables: {
          name: "VoLTE",
        },
      },
      result: {
        data: { features: [mockFeatures[0]] },
      },
    },
    {
      request: {
        query: DevicesByBandDocument,
        variables: {
          bandId: "band-1",
        },
      },
      result: {
        data: { devicesByBand: mockDevicesForBand },
      },
    },
    {
      request: {
        query: DevicesByComboDocument,
        variables: {
          comboId: "combo-1",
        },
      },
      result: {
        data: { devicesByCombo: mockDevicesForCombo },
      },
    },
    {
      request: {
        query: DevicesByFeatureDocument,
        variables: {
          featureId: "feat-1",
        },
      },
      result: {
        data: { devicesByFeature: mockDevicesForFeature },
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
        query: DevicesByBandProviderDocument,
        variables: {
          bandId: "band-1",
          providerId: "provider-1",
        },
      },
      result: {
        data: { devicesByBand: mockDevicesForBandProvider },
      },
    },
    ...overrides,
  ];

  const renderPage = (mocks: any[] = []) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    return render(
      <MockedProvider mocks={createMocks(mocks)} addTypename={false}>
        <CapabilityQueryPage />
      </MockedProvider>
    );
  };

  it("renders the page header and initial state", () => {
    renderPage();

    expect(screen.getByText("Query by Capability")).toBeInTheDocument();
    expect(
      screen.getByText("Search for devices by band, combo, or feature")
    ).toBeInTheDocument();
    expect(screen.getByText("No capability selected")).toBeInTheDocument();
    expect(screen.getByText("1. Select Capability Type")).toBeInTheDocument();
  });

  it("should have no accessibility violations", async () => {
    const { container } = renderPage();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("shows capability type selector with all options", () => {
    renderPage();

    expect(screen.getByText("2. Search Band")).toBeInTheDocument();
    expect(screen.getByText("Band")).toBeInTheDocument();
    expect(screen.getByText("Combo")).toBeInTheDocument();
    expect(screen.getByText("Feature")).toBeInTheDocument();
    expect(screen.getByText("Search by frequency band")).toBeInTheDocument();
  });

  it("does not show provider selector before capability is selected", () => {
    renderPage();

    expect(screen.queryByText("3. Filter by Provider")).not.toBeInTheDocument();
  });

  it("does not show display options before capability is selected", () => {
    renderPage();

    expect(screen.queryByText("4. Display Options")).not.toBeInTheDocument();
  });

  it("displays band search by default", async () => {
    renderPage();

    expect(screen.getByText("2. Search Band")).toBeInTheDocument();
    expect(screen.getByLabelText("Technology")).toBeInTheDocument();
    expect(screen.getByLabelText("Band Number")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Found 2 bands")).toBeInTheDocument();
    });
  });

  it("loads and displays bands on initial render", async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Band n77")).toBeInTheDocument();
      expect(screen.getByText("Band 66")).toBeInTheDocument();
      expect(screen.getByText("NR")).toBeInTheDocument();
      expect(screen.getByText("LTE")).toBeInTheDocument();
    });
  });

  it("changes search component when capability type changes to Combo", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });

    const comboButton = screen.getByText("Combo");
    await user.click(comboButton);

    expect(screen.getByText("2. Search Combo")).toBeInTheDocument();
    expect(screen.getByLabelText("Combo Name")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Found 2 combos")).toBeInTheDocument();
      expect(screen.getByText("DC_1A_3A")).toBeInTheDocument();
      expect(screen.getByText("DC_n77A_n78A")).toBeInTheDocument();
    });
  });

  it("changes search component when capability type changes to Feature", async () => {
    const user = userEvent.setup();
    renderPage();

    const featureButton = screen.getByText("Feature");
    await user.click(featureButton);

    expect(screen.getByText("2. Search Feature")).toBeInTheDocument();
    expect(screen.getByLabelText("Feature Name")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Found 2 features")).toBeInTheDocument();
      expect(screen.getByText("VoLTE")).toBeInTheDocument();
      expect(screen.getByText("VoNR")).toBeInTheDocument();
    });
  });

  it("resets selected capability when changing capability type", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });

    // Select a band
    const bandButton = screen.getByText("Band n77");
    await user.click(bandButton);

    await waitFor(() => {
      expect(screen.getByText("Devices Found")).toBeInTheDocument();
    });

    // Switch to combo
    const comboTypeButton = screen.getByText("Combo");
    await user.click(comboTypeButton);

    // Should show empty state again
    await waitFor(() => {
      expect(screen.getByText("No capability selected")).toBeInTheDocument();
    });
  });

  it("reveals provider filter section after band selection", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });

    const bandButton = screen.getByText("Band n77");
    await user.click(bandButton);

    await waitFor(() => {
      expect(screen.getByText("3. Filter by Provider")).toBeInTheDocument();
    });
  });

  it("reveals display options section after band selection", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });

    const bandButton = screen.getByText("Band n77");
    await user.click(bandButton);

    await waitFor(() => {
      expect(screen.getByText("4. Display Options")).toBeInTheDocument();
    });
  });

  it("displays device results after band selection", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });

    const bandButton = screen.getByText("Band n77");
    await user.click(bandButton);

    await waitFor(() => {
      expect(screen.getByText("Devices Found")).toBeInTheDocument();
      expect(screen.getByText("2 devices")).toBeInTheDocument();
      expect(screen.getByText("Global Support")).toBeInTheDocument();
    });

    // Check device data in table
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Samsung")).toBeInTheDocument();
    expect(screen.getByText("A2848")).toBeInTheDocument();
    expect(screen.getByText("SM-S928W")).toBeInTheDocument();
  });

  it("allows toggling display field options", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });

    const bandButton = screen.getByText("Band n77");
    await user.click(bandButton);

    await waitFor(() => {
      expect(screen.getByText("4. Display Options")).toBeInTheDocument();
    });

    // Check that fields are checked by default
    const marketNameCheckbox = screen.getByLabelText("Market Name");
    const releaseDateCheckbox = screen.getByLabelText("Release Date");
    const softwareCheckbox = screen.getByLabelText("Software Details");

    expect(marketNameCheckbox).toBeChecked();
    expect(releaseDateCheckbox).toBeChecked();
    expect(softwareCheckbox).not.toBeChecked();

    // Toggle software details on
    await user.click(softwareCheckbox);
    expect(softwareCheckbox).toBeChecked();

    // Toggle market name off
    await user.click(marketNameCheckbox);
    expect(marketNameCheckbox).not.toBeChecked();
  });

  it("loads and displays provider options after capability selection", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });

    const bandButton = screen.getByText("Band n77");
    await user.click(bandButton);

    await waitFor(() => {
      expect(screen.getByText("AT&T")).toBeInTheDocument();
      expect(screen.getByText("Verizon")).toBeInTheDocument();
    });
  });

  it("switches to provider-specific view when provider is selected", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });

    const bandButton = screen.getByText("Band n77");
    await user.click(bandButton);

    await waitFor(() => {
      expect(screen.getByText("Global Support")).toBeInTheDocument();
    });

    // Select a provider
    const providerButton = screen.getByText("AT&T");
    await user.click(providerButton);

    await waitFor(() => {
      expect(screen.getByText("Provider-Specific")).toBeInTheDocument();
    });
  });

  it("filters bands by technology", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Found 2 bands")).toBeInTheDocument();
    });

    const technologySelect = screen.getByLabelText("Technology");
    await user.click(technologySelect);
    await user.selectOptions(technologySelect, "NR");

    await waitFor(() => {
      expect(screen.getByText("Found 1 band")).toBeInTheDocument();
      expect(screen.getByText("Band n77")).toBeInTheDocument();
      expect(screen.queryByText("Band 66")).not.toBeInTheDocument();
    });
  });

  it("filters bands by band number", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Found 2 bands")).toBeInTheDocument();
    });

    const bandNumberInput = screen.getByLabelText("Band Number");
    await user.clear(bandNumberInput);
    await user.type(bandNumberInput, "n77");

    await waitFor(() => {
      expect(screen.getByText("Found 1 band")).toBeInTheDocument();
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });
  });

  it("searches features by name", async () => {
    const user = userEvent.setup();
    renderPage();

    const featureButton = screen.getByText("Feature");
    await user.click(featureButton);

    await waitFor(() => {
      expect(screen.getByText("Found 2 features")).toBeInTheDocument();
    });

    const featureInput = screen.getByLabelText("Feature Name");
    await user.clear(featureInput);
    await user.type(featureInput, "VoLTE");

    await waitFor(() => {
      expect(screen.getByText("Found 1 feature")).toBeInTheDocument();
      expect(screen.getByText("VoLTE")).toBeInTheDocument();
      expect(screen.queryByText("VoNR")).not.toBeInTheDocument();
    });
  });

  it("maintains capability selection when changing provider filter", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });

    const bandButton = screen.getByText("Band n77");
    await user.click(bandButton);

    await waitFor(() => {
      expect(screen.getByText("Devices Found")).toBeInTheDocument();
    });

    // Verify band button is selected
    expect(bandButton.closest("button")).toHaveClass("border-primary-500");

    // Change provider
    const providerButton = screen.getByText("AT&T");
    await user.click(providerButton);

    await waitFor(() => {
      expect(screen.getByText("Provider-Specific")).toBeInTheDocument();
    });

    // Band should still be selected
    expect(bandButton.closest("button")).toHaveClass("border-primary-500");
  });

  it("maintains all filters when toggling display options", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });

    const bandButton = screen.getByText("Band n77");
    await user.click(bandButton);

    await waitFor(() => {
      expect(screen.getByText("Devices Found")).toBeInTheDocument();
    });

    // Select provider
    const providerButton = screen.getByText("AT&T");
    await user.click(providerButton);

    await waitFor(() => {
      expect(screen.getByText("Provider-Specific")).toBeInTheDocument();
    });

    // Toggle display options
    const softwareCheckbox = screen.getByLabelText("Software Details");
    await user.click(softwareCheckbox);

    // Verify band and provider are still selected
    expect(bandButton.closest("button")).toHaveClass("border-primary-500");
    expect(screen.getByText("Provider-Specific")).toBeInTheDocument();
  });

  it("handles combo selection and displays results", async () => {
    const user = userEvent.setup();
    renderPage();

    const comboButton = screen.getByText("Combo");
    await user.click(comboButton);

    await waitFor(() => {
      expect(screen.getByText("DC_1A_3A")).toBeInTheDocument();
    });

    const comboCard = screen.getByText("DC_1A_3A");
    await user.click(comboCard);

    await waitFor(() => {
      expect(screen.getByText("Devices Found")).toBeInTheDocument();
      expect(screen.getByText("1 device")).toBeInTheDocument();
    });
  });

  it("handles feature selection and displays results", async () => {
    const user = userEvent.setup();
    renderPage();

    const featureButton = screen.getByText("Feature");
    await user.click(featureButton);

    await waitFor(() => {
      expect(screen.getByText("VoLTE")).toBeInTheDocument();
    });

    const featureCard = screen.getByText("VoLTE");
    await user.click(featureCard);

    await waitFor(() => {
      expect(screen.getByText("Devices Found")).toBeInTheDocument();
      expect(screen.getByText("1 device")).toBeInTheDocument();
    });
  });

  it("displays helpful message in empty state", () => {
    renderPage();

    expect(screen.getByText("No capability selected")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Select a capability type and search for a specific band, combo, or feature"
      )
    ).toBeInTheDocument();
  });

  it("displays market name column when enabled", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });

    const bandButton = screen.getByText("Band n77");
    await user.click(bandButton);

    await waitFor(() => {
      expect(screen.getAllByText("Market Name")).toHaveLength(2);
      expect(screen.getByText("iPhone 15 Pro")).toBeInTheDocument();
      expect(screen.getByText("Galaxy S24 Ultra")).toBeInTheDocument();
    });
  });

  it("hides market name column when disabled", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });

    const bandButton = screen.getByText("Band n77");
    await user.click(bandButton);

    await waitFor(() => {
      expect(screen.getAllByText("Market Name")).toHaveLength(2);
    });

    // Disable market name
    const marketNameCheckbox = screen.getByLabelText("Market Name");
    await user.click(marketNameCheckbox);

    await waitFor(() => {
      expect(screen.getAllByText("Market Name")).toHaveLength(1);
    });
  });

  it("displays software details column when enabled", async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Band n77")).toBeInTheDocument();
    });

    const bandButton = screen.getByText("Band n77");
    await user.click(bandButton);

    await waitFor(() => {
      expect(screen.getByText("4. Display Options")).toBeInTheDocument();
    });

    // Enable software details
    const softwareCheckbox = screen.getByLabelText("Software Details");
    await user.click(softwareCheckbox);

    await waitFor(() => {
      expect(screen.getByText("Software")).toBeInTheDocument();
      expect(screen.getByText("iOS 17")).toBeInTheDocument();
      expect(screen.getByText("Android 14")).toBeInTheDocument();
    });
  });
});
