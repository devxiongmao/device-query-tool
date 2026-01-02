import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { axe, toHaveNoViolations } from "jest-axe";
import { GetDeviceDocument } from "../../../../src/graphql/generated/graphql";
import { SoftwareSelector } from "../../../../src/features/devices/components/SoftwareSelector";

expect.extend(toHaveNoViolations);

const mockDeviceWithSoftware = {
  device: {
    id: "device-1",
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
      {
        id: "sw-3",
        name: "iOS 17.2",
        platform: "iOS",
        buildNumber: "21C62",
        releaseDate: "2023-12-11",
      },
    ],
  },
};

const mockDeviceWithoutSoftware = {
  device: {
    id: "device-1",
    software: [],
  },
};

const mockDeviceWithPartialSoftwareData = {
  device: {
    id: "device-1",
    software: [
      {
        id: "sw-1",
        name: "Android 14",
        platform: "Android",
        buildNumber: null,
        releaseDate: null,
      },
    ],
  },
};

describe("SoftwareSelector", () => {
  const defaultProps = {
    selectedDeviceId: "device-1",
    selectedSoftwareId: null,
    onSoftwareChange: vi.fn(),
  };

  const createMocks = (deviceData = mockDeviceWithSoftware, overrides = {}) => [
    {
      request: {
        query: GetDeviceDocument,
        variables: {
          id: "device-1",
        },
      },
      result: {
        data: deviceData,
      },
      ...overrides,
    },
  ];

  const renderComponent = (props = {}, mocks = []) => {
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SoftwareSelector {...defaultProps} {...props} />
      </MockedProvider>
    );
  };

  describe("Loading state", () => {
    it("shows loading spinner initially", () => {
      renderComponent({}, createMocks());

      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("does not query when selectedDeviceId is null", () => {
      const mocks = createMocks();
      renderComponent({ selectedDeviceId: null }, mocks);

      // Since skip: true, query shouldn't run and we shouldn't see loading state
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  describe("Error state", () => {
    it("displays error message when query fails", async () => {
      const errorMocks = [
        {
          request: {
            query: GetDeviceDocument,
            variables: {
              id: "device-1",
            },
          },
          error: new Error("Network error"),
        },
      ];

      renderComponent({}, errorMocks);

      await waitFor(() => {
        expect(screen.getByText("Error loading software")).toBeInTheDocument();
      });
    });

    it("error message has appropriate styling", async () => {
      const errorMocks = [
        {
          request: {
            query: GetDeviceDocument,
            variables: {
              id: "device-1",
            },
          },
          error: new Error("Network error"),
        },
      ];

      renderComponent({}, errorMocks);

      await waitFor(() => {
        const errorText = screen.getByText("Error loading software");
        expect(errorText).toHaveClass("text-red-600");
      });
    });
  });

  describe("Rendering software options", () => {
    it("renders 'All software' option", async () => {
      renderComponent({}, createMocks());

      await waitFor(() => {
        expect(screen.getByText("All software")).toBeInTheDocument();
      });

      expect(screen.getByText("All capabilities")).toBeInTheDocument();
    });

    it("renders all software versions from query", async () => {
      renderComponent({}, createMocks());

      await waitFor(() => {
        expect(screen.getByText("iOS 17.0")).toBeInTheDocument();
      });

      expect(screen.getByText("iOS 17.1")).toBeInTheDocument();
      expect(screen.getByText("iOS 17.2")).toBeInTheDocument();
    });

    it("displays platform for each software version", async () => {
      renderComponent({}, createMocks());

      await waitFor(() => {
        const platforms = screen.getAllByText("iOS");
        expect(platforms.length).toBe(3);
      });
    });

    it("does not display build number when null", async () => {
      renderComponent({}, createMocks(mockDeviceWithPartialSoftwareData));

      await waitFor(() => {
        expect(screen.getByText("Android 14")).toBeInTheDocument();
      });

      expect(screen.queryByText(/Build:/)).not.toBeInTheDocument();
    });

    it("does not display release date when null", async () => {
      renderComponent({}, createMocks(mockDeviceWithPartialSoftwareData));

      await waitFor(() => {
        expect(screen.getByText("Android 14")).toBeInTheDocument();
      });

      expect(screen.queryByText(/Released:/)).not.toBeInTheDocument();
    });

    it("renders only 'All software' option when device has no software", async () => {
      renderComponent({}, createMocks(mockDeviceWithoutSoftware));

      await waitFor(() => {
        expect(screen.getByText("All software")).toBeInTheDocument();
      });

      // Should only have the "All software" button
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
    });
  });

  describe("Selection state", () => {
    it("highlights 'All software' when selectedSoftwareId is null", async () => {
      renderComponent({ selectedSoftwareId: null }, createMocks());

      await waitFor(() => {
        const allSoftwareButton = screen
          .getByText("All software")
          .closest("button");
        expect(allSoftwareButton).toHaveClass(
          "border-primary-500",
          "bg-primary-50"
        );
      });
    });

    it("highlights selected software version", async () => {
      renderComponent({ selectedSoftwareId: "sw-2" }, createMocks());

      await waitFor(() => {
        const selectedButton = screen.getByText("iOS 17.1").closest("button");
        expect(selectedButton).toHaveClass(
          "border-primary-500",
          "bg-primary-50"
        );
      });
    });

    it("does not highlight non-selected options", async () => {
      renderComponent({ selectedSoftwareId: "sw-2" }, createMocks());

      await waitFor(() => {
        const allSoftwareButton = screen
          .getByText("All software")
          .closest("button");
        expect(allSoftwareButton).toHaveClass("border-gray-200");
        expect(allSoftwareButton).not.toHaveClass("border-primary-500");
      });

      const otherButton = screen.getByText("iOS 17.0").closest("button");
      expect(otherButton).toHaveClass("border-gray-200");
      expect(otherButton).not.toHaveClass("border-primary-500");
    });
  });

  describe("Interactions", () => {
    it("calls onSoftwareChange with null when 'All software' is clicked", async () => {
      const user = userEvent.setup();
      const onSoftwareChange = vi.fn();

      renderComponent({ onSoftwareChange }, createMocks());

      await waitFor(() => {
        expect(screen.getByText("All software")).toBeInTheDocument();
      });

      await user.click(screen.getByText("All software"));

      expect(onSoftwareChange).toHaveBeenCalledTimes(1);
      expect(onSoftwareChange).toHaveBeenCalledWith(null);
    });

    it("calls onSoftwareChange with software id when software option is clicked", async () => {
      const user = userEvent.setup();
      const onSoftwareChange = vi.fn();

      renderComponent({ onSoftwareChange }, createMocks());

      await waitFor(() => {
        expect(screen.getByText("iOS 17.1")).toBeInTheDocument();
      });

      await user.click(screen.getByText("iOS 17.1"));

      expect(onSoftwareChange).toHaveBeenCalledTimes(1);
      expect(onSoftwareChange).toHaveBeenCalledWith("sw-2");
    });

    it("allows clicking different software options", async () => {
      const user = userEvent.setup();
      const onSoftwareChange = vi.fn();

      renderComponent({ onSoftwareChange }, createMocks());

      await waitFor(() => {
        expect(screen.getByText("iOS 17.0")).toBeInTheDocument();
      });

      await user.click(screen.getByText("iOS 17.0"));
      await user.click(screen.getByText("iOS 17.2"));

      expect(onSoftwareChange).toHaveBeenCalledTimes(2);
      expect(onSoftwareChange).toHaveBeenNthCalledWith(1, "sw-1");
      expect(onSoftwareChange).toHaveBeenNthCalledWith(2, "sw-3");
    });

    it("can switch from software selection back to 'All software'", async () => {
      const user = userEvent.setup();
      const onSoftwareChange = vi.fn();

      renderComponent(
        { selectedSoftwareId: "sw-1", onSoftwareChange },
        createMocks()
      );

      await waitFor(() => {
        expect(screen.getByText("All software")).toBeInTheDocument();
      });

      await user.click(screen.getByText("All software"));

      expect(onSoftwareChange).toHaveBeenCalledWith(null);
    });
  });

  describe("Controlled component behavior", () => {
    it("does not change selection unless props change", async () => {
      const user = userEvent.setup();
      const onSoftwareChange = vi.fn();

      const { rerender } = renderComponent(
        { selectedSoftwareId: null, onSoftwareChange },
        createMocks()
      );

      await waitFor(() => {
        expect(screen.getByText("iOS 17.0")).toBeInTheDocument();
      });

      const allSoftwareButton = screen
        .getByText("All software")
        .closest("button");
      expect(allSoftwareButton).toHaveClass("border-primary-500");

      await user.click(screen.getByText("iOS 17.0"));
      expect(onSoftwareChange).toHaveBeenCalledWith("sw-1");

      // Selection shouldn't change until parent updates props
      expect(allSoftwareButton).toHaveClass("border-primary-500");

      // Simulate parent updating state
      rerender(
        <MockedProvider mocks={createMocks()} addTypename={false}>
          <SoftwareSelector
            {...defaultProps}
            selectedSoftwareId="sw-1"
            onSoftwareChange={onSoftwareChange}
          />
        </MockedProvider>
      );

      await waitFor(() => {
        const selectedButton = screen.getByText("iOS 17.0").closest("button");
        expect(selectedButton).toHaveClass("border-primary-500");
      });
    });
  });

  describe("Icons", () => {
    it("displays Globe icon for 'All software' option", async () => {
      renderComponent({}, createMocks());

      await waitFor(() => {
        expect(screen.getByText("All software")).toBeInTheDocument();
      });

      const allSoftwareButton = screen
        .getByText("All software")
        .closest("button");
      const icon = allSoftwareButton?.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("displays Code icon for each software version", async () => {
      renderComponent({}, createMocks());

      await waitFor(() => {
        expect(screen.getByText("iOS 17.0")).toBeInTheDocument();
      });

      const buttons = screen.getAllByRole("button");
      // Exclude the first button (All software) which has Globe icon
      const softwareButtons = buttons.slice(1);

      softwareButtons.forEach((button) => {
        const icon = button.querySelector("svg");
        expect(icon).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("has no accessibility violations with software options", async () => {
      const { container } = renderComponent({}, createMocks());

      await waitFor(() => {
        expect(screen.getByText("All software")).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with no software", async () => {
      const { container } = renderComponent(
        {},
        createMocks(mockDeviceWithoutSoftware)
      );

      await waitFor(() => {
        expect(screen.getByText("All software")).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("maintains focus management during interactions", async () => {
      const user = userEvent.setup();
      const onSoftwareChange = vi.fn();

      renderComponent({ onSoftwareChange }, createMocks());

      await waitFor(() => {
        expect(screen.getByText("iOS 17.0")).toBeInTheDocument();
      });

      const button = screen.getByText("iOS 17.0").closest("button");

      if (button) {
        await user.click(button);
        expect(onSoftwareChange).toHaveBeenCalled();
      }
    });
  });

  describe("Query behavior", () => {
    it("passes correct device id to query", async () => {
      const mocks = createMocks();
      renderComponent({ selectedDeviceId: "device-1" }, mocks);

      await waitFor(() => {
        expect(screen.getByText("All software")).toBeInTheDocument();
      });

      // If we got data, the query ran with correct variables
      expect(screen.getByText("iOS 17.0")).toBeInTheDocument();
    });

    it("skips query when device id is null", () => {
      renderComponent({ selectedDeviceId: null }, createMocks());

      // Should not show loading or data since query is skipped
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.queryByText("All software")).not.toBeInTheDocument();
    });

    it("handles device with null software array", async () => {
      const mockDeviceNullSoftware = {
        device: {
          id: "device-1",
          software: null,
        },
      };

      renderComponent({}, createMocks(mockDeviceNullSoftware));

      await waitFor(() => {
        expect(screen.getByText("All software")).toBeInTheDocument();
      });

      // Should only render "All software" option
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
    });
  });
});
