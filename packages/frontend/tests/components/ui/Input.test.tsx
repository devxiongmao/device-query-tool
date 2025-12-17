import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { createRef, useState } from "react";
import { Input } from "../../../src/components/ui";

expect.extend(toHaveNoViolations);

describe("Input Component", () => {
  describe("Basic Functionality", () => {
    it("renders a text input by default", () => {
      render(<Input />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("allows user to type text", async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Hello World");

      expect(input).toHaveValue("Hello World");
    });

    it("accepts different input types", () => {
      const { rerender, container } = render(<Input type="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");

      rerender(<Input type="password" />);
      const passwordInput = container.querySelector('input[type="password"]');
      expect(passwordInput).toHaveAttribute("type", "password");

      rerender(<Input type="number" />);
      expect(screen.getByRole("spinbutton")).toHaveAttribute("type", "number");
    });

    it("displays placeholder text", () => {
      render(<Input placeholder="Enter your name" />);

      expect(
        screen.getByPlaceholderText("Enter your name")
      ).toBeInTheDocument();
    });

    it("clears input value", async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Text to clear");
      expect(input).toHaveValue("Text to clear");

      await user.clear(input);
      expect(input).toHaveValue("");
    });
  });

  describe("Label Behavior", () => {
    it("displays label when provided", () => {
      render(<Input label="Email Address" />);

      expect(screen.getByText("Email Address")).toBeInTheDocument();
    });

    it("does not display label when not provided", () => {
      const { container } = render(<Input />);

      const label = container.querySelector("label");
      expect(label).not.toBeInTheDocument();
    });

    it("associates label with input", () => {
      render(<Input label="Username" />);

      const input = screen.getByLabelText("Username");
      expect(input).toBeInTheDocument();
    });

    it("focuses input when label is clicked", async () => {
      const user = userEvent.setup();
      render(<Input label="Email" />);

      const label = screen.getByText("Email");
      const input = screen.getByLabelText("Email");

      await user.click(label);
      expect(input).toHaveFocus();
    });

    it("can type in input after clicking label", async () => {
      const user = userEvent.setup();
      render(<Input label="Name" />);

      await user.click(screen.getByText("Name"));
      await user.keyboard("John Doe");

      expect(screen.getByLabelText("Name")).toHaveValue("John Doe");
    });
  });

  describe("Error State Behavior", () => {
    it("displays error message when provided", () => {
      render(<Input error="This field is required" />);

      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("does not display error when not provided", () => {
      const { container } = render(<Input />);

      const errorText = container.querySelector(".text-red-600");
      expect(errorText).not.toBeInTheDocument();
    });

    it("hides helper text when error is present", () => {
      render(<Input error="Error message" helperText="Helper text" />);

      expect(screen.getByText("Error message")).toBeInTheDocument();
      expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
    });

    it("error takes precedence over helper text", () => {
      const { rerender } = render(<Input helperText="This is helpful info" />);
      expect(screen.getByText("This is helpful info")).toBeInTheDocument();

      rerender(<Input helperText="This is helpful info" error="Error!" />);
      expect(screen.getByText("Error!")).toBeInTheDocument();
      expect(
        screen.queryByText("This is helpful info")
      ).not.toBeInTheDocument();
    });

    it("can still type in input when error is shown", async () => {
      const user = userEvent.setup();
      render(<Input error="Invalid input" />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Correcting mistake");

      expect(input).toHaveValue("Correcting mistake");
    });

    it("shows multiple errors in sequence", () => {
      const { rerender } = render(<Input error="Error 1" />);
      expect(screen.getByText("Error 1")).toBeInTheDocument();

      rerender(<Input error="Error 2" />);
      expect(screen.getByText("Error 2")).toBeInTheDocument();
      expect(screen.queryByText("Error 1")).not.toBeInTheDocument();
    });
  });

  describe("Helper Text Behavior", () => {
    it("displays helper text when provided", () => {
      render(<Input helperText="Enter a valid email address" />);

      expect(
        screen.getByText("Enter a valid email address")
      ).toBeInTheDocument();
    });

    it("does not display helper text when not provided", () => {
      const { container } = render(<Input />);

      const helperText = container.querySelector(".text-gray-500");
      expect(helperText).not.toBeInTheDocument();
    });

    it("helper text is visible while typing", async () => {
      const user = userEvent.setup();
      render(<Input helperText="Max 50 characters" />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Typing text");

      expect(screen.getByText("Max 50 characters")).toBeInTheDocument();
    });
  });

  describe("Disabled State Behavior", () => {
    it("cannot type in disabled input", async () => {
      const user = userEvent.setup();
      render(<Input disabled />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Attempt to type");

      expect(input).toHaveValue("");
    });

    it("cannot focus disabled input", () => {
      render(<Input disabled />);

      const input = screen.getByRole("textbox");
      input.focus();

      expect(input).not.toHaveFocus();
    });

    it("label click does not focus disabled input", async () => {
      const user = userEvent.setup();
      render(<Input label="Email" disabled />);

      await user.click(screen.getByText("Email"));
      const input = screen.getByLabelText("Email");

      expect(input).not.toHaveFocus();
    });

    it("retains value when disabled", () => {
      render(<Input value="Existing value" disabled readOnly />);

      expect(screen.getByRole("textbox")).toHaveValue("Existing value");
    });
  });

  describe("Value Control", () => {
    it("works as controlled component", async () => {
      const ControlledInput = () => {
        const [value, setValue] = useState("");
        return (
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        );
      };

      const user = userEvent.setup();
      render(<ControlledInput />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Controlled");

      expect(input).toHaveValue("Controlled");
    });

    it("works as uncontrolled component with defaultValue", async () => {
      const user = userEvent.setup();
      render(<Input defaultValue="Initial value" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("Initial value");

      await user.type(input, " plus more");
      expect(input).toHaveValue("Initial value plus more");
    });

    it("controlled value overrides user input without onChange", async () => {
      const user = userEvent.setup();
      render(<Input value="Fixed value" readOnly />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Try to change");

      expect(input).toHaveValue("Fixed value");
    });
  });

  describe("Event Handlers", () => {
    it("calls onChange when user types", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "a");

      expect(handleChange).toHaveBeenCalled();
    });

    it("passes correct value to onChange", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "test");

      const lastCall =
        handleChange.mock.calls[handleChange.mock.calls.length - 1][0];
      expect(lastCall.target.value).toBe("test");
    });

    it("calls onFocus when input is focused", async () => {
      const handleFocus = vi.fn();
      const user = userEvent.setup();
      render(<Input onFocus={handleFocus} />);

      const input = screen.getByRole("textbox");
      await user.click(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it("calls onBlur when input loses focus", async () => {
      const handleBlur = vi.fn();
      const user = userEvent.setup();
      render(
        <>
          <Input onBlur={handleBlur} />
          <button>Other element</button>
        </>
      );

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.click(screen.getByRole("button"));

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("calls onKeyDown when key is pressed", async () => {
      const handleKeyDown = vi.fn();
      const user = userEvent.setup();
      render(<Input onKeyDown={handleKeyDown} />);

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.keyboard("a");

      expect(handleKeyDown).toHaveBeenCalled();
    });

    it("does not call onChange when disabled", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Input onChange={handleChange} disabled />);

      const input = screen.getByRole("textbox");
      await user.type(input, "text");

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("Keyboard Navigation", () => {
    it("can be focused with Tab key", async () => {
      const user = userEvent.setup();
      render(<Input />);

      await user.tab();
      expect(screen.getByRole("textbox")).toHaveFocus();
    });

    it("can navigate between multiple inputs", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Input label="First" />
          <Input label="Second" />
          <Input label="Third" />
        </>
      );

      await user.tab();
      expect(screen.getByLabelText("First")).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText("Second")).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText("Third")).toHaveFocus();
    });

    it("skips disabled input in tab order", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Input label="First" />
          <Input label="Second" disabled />
          <Input label="Third" />
        </>
      );

      await user.tab();
      expect(screen.getByLabelText("First")).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText("Third")).toHaveFocus();
    });

    it("handles Escape key", async () => {
      const handleKeyDown = vi.fn();
      const user = userEvent.setup();
      render(<Input onKeyDown={handleKeyDown} />);

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.keyboard("{Escape}");

      expect(handleKeyDown).toHaveBeenCalled();
      const event = handleKeyDown.mock.calls[0][0];
      expect(event.key).toBe("Escape");
    });

    it("handles Enter key", async () => {
      const handleKeyDown = vi.fn();
      const user = userEvent.setup();
      render(<Input onKeyDown={handleKeyDown} />);

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.keyboard("{Enter}");

      expect(handleKeyDown).toHaveBeenCalled();
      const event = handleKeyDown.mock.calls[0][0];
      expect(event.key).toBe("Enter");
    });
  });

  describe("Form Integration", () => {
    it("submits value in form", () => {
      const handleSubmit = vi.fn((e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        return formData.get("email");
      });

      render(
        <form onSubmit={handleSubmit}>
          <Input name="email" defaultValue="test@example.com" />
          <button type="submit">Submit</button>
        </form>
      );

      screen.getByRole("button").click();
      expect(handleSubmit).toHaveBeenCalled();
    });

    it("updates form value as user types", async () => {
      const user = userEvent.setup();
      let capturedValue = "";

      const handleSubmit = vi.fn((e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        capturedValue = formData.get("username") as string;
      });

      render(
        <form onSubmit={handleSubmit}>
          <Input name="username" />
          <button type="submit">Submit</button>
        </form>
      );

      await user.type(screen.getByRole("textbox"), "johndoe");
      screen.getByRole("button").click();

      expect(capturedValue).toBe("johndoe");
    });

    it("respects required attribute in form validation", () => {
      render(
        <form>
          <Input name="email" required />
          <button type="submit">Submit</button>
        </form>
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeRequired();
    });

    it("can be validated with pattern attribute", () => {
      render(
        <Input type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("pattern");
    });
  });

  describe("ID Generation", () => {
    it("generates unique IDs for multiple inputs without id prop", () => {
      const { container } = render(
        <>
          <Input label="First" />
          <Input label="Second" />
          <Input label="Third" />
        </>
      );

      const inputs = container.querySelectorAll("input");
      const ids = Array.from(inputs).map((input) => input.id);

      expect(ids[0]).toBeTruthy();
      expect(ids[1]).toBeTruthy();
      expect(ids[2]).toBeTruthy();
      expect(new Set(ids).size).toBe(3); // All unique
    });

    it("uses provided id when given", () => {
      render(<Input id="custom-id" label="Email" />);

      const input = screen.getByLabelText("Email");
      expect(input).toHaveAttribute("id", "custom-id");
    });

    it("label references custom id", () => {
      render(<Input id="my-input" label="Name" />);

      const label = screen.getByText("Name");
      expect(label).toHaveAttribute("for", "my-input");
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to input element", () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it("can programmatically focus input via ref", () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input ref={ref} />);

      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });

    it("can programmatically set value via ref", () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input ref={ref} />);

      if (ref.current) {
        ref.current.value = "Programmatic value";
      }

      expect(ref.current).toHaveValue("Programmatic value");
    });

    it("can access input methods via ref", () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input ref={ref} />);

      expect(ref.current?.focus).toBeDefined();
      expect(ref.current?.blur).toBeDefined();
      expect(ref.current?.select).toBeDefined();
    });
  });

  describe("Special Input Types", () => {
    it("accepts number input and validates numeric values", async () => {
      const user = userEvent.setup();
      render(<Input type="number" />);

      const input = screen.getByRole("spinbutton");
      await user.type(input, "123");

      expect(input).toHaveValue(123);
    });

    it("password input hides typed characters", () => {
      const { container } = render(<Input type="password" />);

      const input = container.querySelector('input[type="password"]');
      expect(input).toHaveAttribute("type", "password");
    });

    it("email input accepts email format", async () => {
      const user = userEvent.setup();
      render(<Input type="email" />);

      const input = screen.getByRole("textbox");
      await user.type(input, "user@example.com");

      expect(input).toHaveValue("user@example.com");
    });

    it("url input accepts URL format", async () => {
      const user = userEvent.setup();
      render(<Input type="url" />);

      const input = screen.getByRole("textbox");
      await user.type(input, "https://example.com");

      expect(input).toHaveValue("https://example.com");
    });

    it("tel input accepts phone numbers", async () => {
      const user = userEvent.setup();
      render(<Input type="tel" />);

      const input = screen.getByRole("textbox");
      await user.type(input, "555-1234");

      expect(input).toHaveValue("555-1234");
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<Input label="Email" />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with error", async () => {
      const { container } = render(
        <Input label="Email" error="Invalid email" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with helper text", async () => {
      const { container } = render(
        <Input label="Password" helperText="Must be 8+ characters" />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations when disabled", async () => {
      const { container } = render(<Input label="Email" disabled />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has accessible name from label", () => {
      render(<Input label="Full Name" />);

      expect(
        screen.getByRole("textbox", { name: "Full Name" })
      ).toBeInTheDocument();
    });

    it("supports aria-label when no visual label", () => {
      render(<Input aria-label="Search" />);

      expect(
        screen.getByRole("textbox", { name: "Search" })
      ).toBeInTheDocument();
    });

    it("can be described with aria-describedby", () => {
      render(<Input aria-describedby="help-text" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "help-text");
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid typing", async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByRole("textbox");
      await user.type(input, "VeryFastTyping", { delay: 1 });

      expect(input).toHaveValue("VeryFastTyping");
    });

    it("handles paste events", async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.paste("Pasted content");

      expect(input).toHaveValue("Pasted content");
    });

    it("handles very long text input", async () => {
      const user = userEvent.setup();
      const longText = "a".repeat(500);
      render(<Input />);

      const input = screen.getByRole("textbox");
      await user.type(input, longText);

      expect(input).toHaveValue(longText);
    });

    it("handles special characters", async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByRole("textbox");
      await user.type(input, "!@#$%^&*()");

      expect(input).toHaveValue("!@#$%^&*()");
    });

    it("handles emojis", async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Hello 👋 World 🌍");

      expect(input).toHaveValue("Hello 👋 World 🌍");
    });

    it("handles empty string as value", () => {
      render(<Input value="" readOnly />);

      expect(screen.getByRole("textbox")).toHaveValue("");
    });

    it("displays all text states simultaneously", () => {
      render(
        <Input
          label="Email"
          helperText="Helper"
          placeholder="email@example.com"
        />
      );

      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Helper")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("email@example.com")
      ).toBeInTheDocument();
    });
  });

  describe("Display Name", () => {
    it("has correct display name", () => {
      expect(Input.displayName).toBe("Input");
    });
  });
});
