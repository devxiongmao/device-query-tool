import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { ComponentShowcase } from "../../src/pages/ComponentShowcase";

expect.extend(toHaveNoViolations);

describe("ComponentShowcase Component", () => {
  describe("Page Structure", () => {
    it("renders the main heading", () => {
      render(<ComponentShowcase />);

      expect(
        screen.getByRole("heading", {
          level: 1,
          name: /ui components showcase/i,
        })
      ).toBeInTheDocument();
    });

    it("displays the page description", () => {
      render(<ComponentShowcase />);

      expect(
        screen.getByText(/preview of all available ui components/i)
      ).toBeInTheDocument();
    });
  });

  describe("Button Section", () => {
    it("renders the buttons section heading", () => {
      render(<ComponentShowcase />);

      expect(
        screen.getByRole("heading", { name: /^buttons$/i })
      ).toBeInTheDocument();
    });

    it("renders all button variants", () => {
      render(<ComponentShowcase />);

      expect(
        screen.getByRole("button", { name: /^primary$/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /^secondary$/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /^outline$/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /^ghost$/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /^danger$/i })
      ).toBeInTheDocument();
    });

    it("renders buttons of different sizes", () => {
      render(<ComponentShowcase />);

      expect(
        screen.getByRole("button", { name: /^small$/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /^medium$/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /^large$/i })
      ).toBeInTheDocument();
    });

    it("renders disabled button", () => {
      render(<ComponentShowcase />);

      const disabledButton = screen.getByRole("button", {
        name: /^disabled$/i,
      });
      expect(disabledButton).toBeDisabled();
    });

    it("renders button with icon", () => {
      render(<ComponentShowcase />);

      expect(
        screen.getByRole("button", { name: /with icon/i })
      ).toBeInTheDocument();
    });
  });

  describe("Inputs & Selects Section", () => {
    it("renders the inputs section heading", () => {
      render(<ComponentShowcase />);

      expect(
        screen.getByRole("heading", { name: /inputs & selects/i })
      ).toBeInTheDocument();
    });

    it("renders email input with label and helper text", () => {
      render(<ComponentShowcase />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(
        screen.getByText(/we'll never share your email/i)
      ).toBeInTheDocument();
    });

    it("renders password input with error message", () => {
      render(<ComponentShowcase />);

      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByText(/password is too short/i)).toBeInTheDocument();
    });

    it("renders select with label and helper text", () => {
      render(<ComponentShowcase />);

      expect(screen.getByLabelText(/choose an option/i)).toBeInTheDocument();
      expect(
        screen.getByText(/select one option from the list/i)
      ).toBeInTheDocument();
    });

    it("allows user to type in email input", async () => {
      const user = userEvent.setup();
      render(<ComponentShowcase />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });
  });

  describe("Badges Section", () => {
    it("renders the badges section heading", () => {
      render(<ComponentShowcase />);

      expect(
        screen.getByRole("heading", { name: /^badges$/i })
      ).toBeInTheDocument();
    });

    it("renders all badge variants", () => {
      render(<ComponentShowcase />);

      expect(screen.getByText(/^default$/i)).toBeInTheDocument();
      expect(screen.getByText(/^secondary$/i)).toBeInTheDocument();
      expect(screen.getByText(/^success$/i)).toBeInTheDocument();
      expect(screen.getByText(/^warning$/i)).toBeInTheDocument();
      expect(screen.getByText(/^danger$/i)).toBeInTheDocument();
      expect(screen.getByText(/^outline$/i)).toBeInTheDocument();
    });
  });

  describe("Table Section", () => {
    it("renders the table section heading", () => {
      render(<ComponentShowcase />);

      expect(
        screen.getByRole("heading", { name: /^table$/i })
      ).toBeInTheDocument();
    });

    it("renders table headers", () => {
      render(<ComponentShowcase />);

      expect(
        screen.getByRole("columnheader", { name: /device/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: /vendor/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: /status/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: /bands/i })
      ).toBeInTheDocument();
    });

    it("renders table data rows", () => {
      render(<ComponentShowcase />);

      expect(screen.getByText(/iphone 15 pro/i)).toBeInTheDocument();
      expect(screen.getByText(/apple/i)).toBeInTheDocument();
      expect(screen.getByText(/galaxy s24/i)).toBeInTheDocument();
      expect(screen.getByText(/samsung/i)).toBeInTheDocument();
      expect(screen.getByText(/pixel 8/i)).toBeInTheDocument();
      expect(screen.getByText(/google/i)).toBeInTheDocument();
    });

    it("renders status badges in table", () => {
      render(<ComponentShowcase />);

      const activeBadges = screen.getAllByText(/^active$/i);
      expect(activeBadges).toHaveLength(2);

      const pendingBadge = screen.getByText(/^pending$/i);
      expect(pendingBadge).toBeInTheDocument();
    });
  });

  describe("Checkbox Section", () => {
    it("renders the checkboxes section heading", () => {
      render(<ComponentShowcase />);

      expect(
        screen.getByRole("heading", { name: /^checkboxes$/i })
      ).toBeInTheDocument();
    });

    it("renders all checkbox options", () => {
      render(<ComponentShowcase />);

      expect(
        screen.getByLabelText(/accept terms and conditions/i)
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/subscribe to newsletter/i)
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/disabled option/i)).toBeInTheDocument();
    });

    it("allows user to check and uncheck checkbox", async () => {
      const user = userEvent.setup();
      render(<ComponentShowcase />);

      const checkbox = screen.getByLabelText(/accept terms and conditions/i);
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it("renders disabled checkbox", () => {
      render(<ComponentShowcase />);

      const disabledCheckbox = screen.getByLabelText(/disabled option/i);
      expect(disabledCheckbox).toBeDisabled();
    });
  });

  describe("Loading States Section", () => {
    it("renders the loading states section heading", () => {
      render(<ComponentShowcase />);

      expect(
        screen.getByRole("heading", { name: /loading states/i })
      ).toBeInTheDocument();
    });

    it("renders spinner size labels", () => {
      render(<ComponentShowcase />);

      expect(screen.getByText(/^small$/i)).toBeInTheDocument();
      expect(screen.getByText(/^medium$/i)).toBeInTheDocument();
      expect(screen.getByText(/^large$/i)).toBeInTheDocument();
    });
  });

  describe("Empty State Section", () => {
    it("renders the empty state section heading", () => {
      render(<ComponentShowcase />);

      expect(
        screen.getByRole("heading", { name: /^empty state$/i })
      ).toBeInTheDocument();
    });

    it("renders empty state title and description", () => {
      render(<ComponentShowcase />);

      expect(screen.getByText(/no devices found/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /try adjusting your search filters or add a new device/i
        )
      ).toBeInTheDocument();
    });

    it("renders empty state action button", () => {
      render(<ComponentShowcase />);

      expect(
        screen.getByRole("button", { name: /search again/i })
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<ComponentShowcase />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
