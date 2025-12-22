import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { MockedProvider } from "@apollo/client/testing";
import {
  DevicesByBandDocument,
  DevicesByBandProviderDocument,
  DevicesByComboDocument,
  DevicesByComboProviderDocument,
  DevicesByFeatureDocument,
  DevicesByFeatureProviderDocument,
} from "../../../../src/graphql/generated/graphql";
import { CapabilityResults } from "../../../../src/features/capabilities/components/CapabilityResults";

expect.extend(toHaveNoViolations);

const mockDeviceResults = [
  {
    device: {
      id: "device-1",
      vendor: "Apple",
      modelNum: "iPhone14,2",
      marketName: "iPhone 13 Pro",
      releaseDate: "2021-09-24",
    },
    software: [
      {
        id: "sw-1",
        name: "iOS 15",
        buildNumber: "19A346",
      },
    ],
    supportStatus: "global",
    provider: {
      id: "provider-1",
      name: "Verizon",
    },
  },
  {
    device: {
      id: "device-2",
      vendor: "Samsung",
      modelNum: "SM-G998U",
      marketName: "Galaxy S21 Ultra",
      releaseDate: "2021-01-29",
    },
    software: [
      {
        id: "sw-2",
        name: "Android 11",
        buildNumber: "RP1A.200720.012",
      },
      {
        id: "sw-3",
        name: "Android 12",
        buildNumber: null,
      },
    ],
    supportStatus: "provider-specific",
    provider: {
      id: "provider-1",
      name: "Verizon",
    },
  },
];

const mockDeviceWithoutOptionalFields = [
  {
    device: {
      id: "device-3",
      vendor: "Google",
      modelNum: "GF5KQ",
      marketName: null,
      releaseDate: "2021-10-28",
    },
    software: [],
    supportStatus: "global",
    provider: null,
  },
];

const createBandMock = (results = mockDeviceResults, providerId?: string) => ({
  request: {
    query: providerId ? DevicesByBandProviderDocument : DevicesByBandDocument,
    variables: providerId
      ? { bandId: "band-1", providerId }
      : { bandId: "band-1" },
  },
  result: {
    data: {
      devicesByBand: results,
    },
  },
});

const createComboMock = (results = mockDeviceResults, providerId?: string) => ({
  request: {
    query: providerId ? DevicesByComboProviderDocument : DevicesByComboDocument,
    variables: providerId
      ? { comboId: "combo-1", providerId }
      : { comboId: "combo-1" },
  },
  result: {
    data: {
      devicesByCombo: results,
    },
  },
});

const createFeatureMock = (
  results = mockDeviceResults,
  providerId?: string
) => ({
  request: {
    query: providerId
      ? DevicesByFeatureProviderDocument
      : DevicesByFeatureDocument,
    variables: providerId
      ? { featureId: "feature-1", providerId }
      : { featureId: "feature-1" },
  },
  result: {
    data: {
      devicesByFeature: results,
    },
  },
});

const createErrorMock = (capabilityType: "band" | "combo" | "feature") => {
  const documentMap = {
    band: DevicesByBandDocument,
    combo: DevicesByComboDocument,
    feature: DevicesByFeatureDocument,
  };

  const variableMap = {
    band: { bandId: "band-1" },
    combo: { comboId: "combo-1" },
    feature: { featureId: "feature-1" },
  };

  return {
    request: {
      query: documentMap[capabilityType],
      variables: variableMap[capabilityType],
    },
    error: new Error("Failed to load devices"),
  };
};

const allFieldsEnabled = {
  marketName: true,
  releaseDate: true,
  softwareDetails: true,
};

const minimalFields = {
  marketName: false,
  releaseDate: false,
  softwareDetails: false,
};

describe("CapabilityResults", () => {
  describe("Loading state", () => {
    it("displays loading spinner while fetching band results", () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      expect(screen.getByText("Searching for devices...")).toBeInTheDocument();
    });

    it("displays loading spinner while fetching combo results", () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <CapabilityResults
            capabilityType="combo"
            capabilityId="combo-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("displays loading spinner while fetching feature results", () => {
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <CapabilityResults
            capabilityType="feature"
            capabilityId="feature-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Error handling", () => {
    it("displays error message when band query fails", async () => {
      render(
        <MockedProvider mocks={[createErrorMock("band")]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      expect(
        await screen.findByText("Error loading results")
      ).toBeInTheDocument();
      expect(screen.getByText("Failed to load devices")).toBeInTheDocument();
    });

    it("displays error message when combo query fails", async () => {
      render(
        <MockedProvider mocks={[createErrorMock("combo")]} addTypename={false}>
          <CapabilityResults
            capabilityType="combo"
            capabilityId="combo-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      expect(
        await screen.findByText("Error loading results")
      ).toBeInTheDocument();
    });

    it("displays error message when feature query fails", async () => {
      render(
        <MockedProvider
          mocks={[createErrorMock("feature")]}
          addTypename={false}
        >
          <CapabilityResults
            capabilityType="feature"
            capabilityId="feature-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      expect(
        await screen.findByText("Error loading results")
      ).toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("displays empty state when no band devices found", async () => {
      render(
        <MockedProvider mocks={[createBandMock([])]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      expect(await screen.findByText("No devices found")).toBeInTheDocument();
      expect(
        screen.getByText("No devices found with this capability")
      ).toBeInTheDocument();
    });

    it("displays provider-specific empty message when provider is selected", async () => {
      render(
        <MockedProvider
          mocks={[createBandMock([], "provider-1")]}
          addTypename={false}
        >
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId="provider-1"
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      expect(await screen.findByText("No devices found")).toBeInTheDocument();
      expect(
        screen.getByText(
          "No devices support this capability for the selected provider"
        )
      ).toBeInTheDocument();
    });
  });

  describe("Results display - Band capability", () => {
    it("displays device results for band query", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      expect(await screen.findByText("Devices Found")).toBeInTheDocument();
      expect(screen.getByText("2 devices")).toBeInTheDocument();
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Samsung")).toBeInTheDocument();
      expect(screen.getByText("iPhone14,2")).toBeInTheDocument();
      expect(screen.getByText("SM-G998U")).toBeInTheDocument();
    });

    it("uses singular 'device' when only one result", async () => {
      render(
        <MockedProvider
          mocks={[createBandMock([mockDeviceResults[0]])]}
          addTypename={false}
        >
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      expect(await screen.findByText("1 device")).toBeInTheDocument();
    });

    it("displays Global Support badge when no provider selected", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      expect(await screen.findByText("Global Support")).toBeInTheDocument();
    });

    it("displays Provider-Specific badge when provider selected", async () => {
      render(
        <MockedProvider
          mocks={[createBandMock(mockDeviceResults, "provider-1")]}
          addTypename={false}
        >
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId="provider-1"
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      expect(await screen.findByText("Provider-Specific")).toBeInTheDocument();
    });
  });

  describe("Results display - Combo capability", () => {
    it("displays device results for combo query", async () => {
      render(
        <MockedProvider mocks={[createComboMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="combo"
            capabilityId="combo-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      expect(await screen.findByText("Devices Found")).toBeInTheDocument();
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Samsung")).toBeInTheDocument();
    });
  });

  describe("Results display - Feature capability", () => {
    it("displays device results for feature query", async () => {
      render(
        <MockedProvider mocks={[createFeatureMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="feature"
            capabilityId="feature-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      expect(await screen.findByText("Devices Found")).toBeInTheDocument();
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Samsung")).toBeInTheDocument();
    });
  });

  describe("Display fields - Market Name", () => {
    it("displays market name column when field is enabled", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={{ ...minimalFields, marketName: true }}
          />
        </MockedProvider>
      );

      expect(await screen.findByText("Market Name")).toBeInTheDocument();
      expect(screen.getByText("iPhone 13 Pro")).toBeInTheDocument();
      expect(screen.getByText("Galaxy S21 Ultra")).toBeInTheDocument();
    });

    it("does not display market name column when field is disabled", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      await screen.findByText("Devices Found");
      expect(screen.queryByText("Market Name")).not.toBeInTheDocument();
    });

    it("displays dash when market name is null", async () => {
      render(
        <MockedProvider
          mocks={[createBandMock(mockDeviceWithoutOptionalFields)]}
          addTypename={false}
        >
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={{ ...minimalFields, marketName: true }}
          />
        </MockedProvider>
      );

      await screen.findByText("Market Name");
      const cells = screen.getAllByText("-");
      expect(cells.length).toBeGreaterThan(0);
    });
  });

  describe("Display fields - Release Date", () => {
    it("displays release date column when field is enabled", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={{ ...minimalFields, releaseDate: true }}
          />
        </MockedProvider>
      );

      expect(await screen.findByText("Release Date")).toBeInTheDocument();
    });

    it("does not display release date column when field is disabled", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      await screen.findByText("Devices Found");
      expect(screen.queryByText("Release Date")).not.toBeInTheDocument();
    });
  });

  describe("Display fields - Software Details", () => {
    it("displays software column when field is enabled", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={{ ...minimalFields, softwareDetails: true }}
          />
        </MockedProvider>
      );

      expect(await screen.findByText("Software")).toBeInTheDocument();
      expect(screen.getByText("iOS 15")).toBeInTheDocument();
      expect(screen.getByText("(19A346)")).toBeInTheDocument();
      expect(screen.getByText("Android 11")).toBeInTheDocument();
      expect(screen.getByText("Android 12")).toBeInTheDocument();
    });

    it("does not display software column when field is disabled", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      await screen.findByText("Devices Found");
      expect(screen.queryByText("Software")).not.toBeInTheDocument();
    });

    it("displays dash when device has no software", async () => {
      render(
        <MockedProvider
          mocks={[createBandMock(mockDeviceWithoutOptionalFields)]}
          addTypename={false}
        >
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={{ ...minimalFields, softwareDetails: true }}
          />
        </MockedProvider>
      );

      await screen.findByText("Software");
      const cells = screen.getAllByText("-");
      expect(cells.length).toBeGreaterThan(0);
    });

    it("displays software without build number when build number is null", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={{ ...minimalFields, softwareDetails: true }}
          />
        </MockedProvider>
      );

      await screen.findByText("Android 12");
      expect(screen.queryByText("(RP1A.200720.012)")).toBeInTheDocument();
    });
  });

  describe("Display fields - All enabled", () => {
    it("displays all optional columns when all fields enabled", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={allFieldsEnabled}
          />
        </MockedProvider>
      );

      expect(await screen.findByText("Market Name")).toBeInTheDocument();
      expect(screen.getByText("Release Date")).toBeInTheDocument();
      expect(screen.getByText("Software")).toBeInTheDocument();
    });
  });

  describe("Provider-specific results", () => {
    it("displays provider column when provider is selected", async () => {
      render(
        <MockedProvider
          mocks={[createBandMock(mockDeviceResults, "provider-1")]}
          addTypename={false}
        >
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId="provider-1"
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      expect(await screen.findByText("Provider")).toBeInTheDocument();
      expect(screen.getAllByText("Verizon")).toHaveLength(2);
    });

    it("does not display provider column when no provider selected", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      await screen.findByText("Devices Found");
      expect(screen.queryByText("Provider")).not.toBeInTheDocument();
    });
  });

  describe("Support status badges", () => {
    it("displays global support badge with success variant", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      await screen.findByText("Devices Found");
      const globalBadges = screen.getAllByText("global");
      expect(globalBadges.length).toBeGreaterThan(0);
    });

    it("displays provider-specific support badge with default variant", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      await screen.findByText("Devices Found");
      expect(screen.getByText("provider-specific")).toBeInTheDocument();
    });
  });

  describe("Table structure", () => {
    it("renders table with correct headers in minimal view", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      await screen.findByText("Devices Found");
      expect(screen.getByText("Vendor")).toBeInTheDocument();
      expect(screen.getByText("Model")).toBeInTheDocument();
      expect(screen.getByText("Support Status")).toBeInTheDocument();
    });

    it("renders table rows for each device", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      await screen.findByText("Devices Found");
      const rows = screen.getAllByRole("row");
      // 1 header row + 2 data rows
      expect(rows.length).toBe(3);
    });
  });

  describe("Accessibility", () => {
    it("has proper table structure", async () => {
      render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={minimalFields}
          />
        </MockedProvider>
      );

      await screen.findByText("Devices Found");
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("has no accessibility violations", async () => {
      const { container } = render(
        <MockedProvider mocks={[createBandMock()]} addTypename={false}>
          <CapabilityResults
            capabilityType="band"
            capabilityId="band-1"
            providerId={null}
            displayFields={allFieldsEnabled}
          />
        </MockedProvider>
      );

      await screen.findByText("Devices Found");
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
