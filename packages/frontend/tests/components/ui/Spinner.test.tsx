import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Spinner } from "../../../src/components/ui";

expect.extend(toHaveNoViolations);

describe("Spinner Component", () => {
  describe("Rendering", () => {
    it("renders spinner", () => {
      const { container } = render(<Spinner />);

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("renders with medium size by default", () => {
      const { container } = render(<Spinner />);

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toHaveClass("h-8", "w-8");
    });
  });

  describe("Size Variants", () => {
    it("renders small spinner", () => {
      const { container } = render(<Spinner size="sm" />);

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toHaveClass("h-4", "w-4");
    });

    it("renders medium spinner", () => {
      const { container } = render(<Spinner size="md" />);

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toHaveClass("h-8", "w-8");
    });

    it("renders large spinner", () => {
      const { container } = render(<Spinner size="lg" />);

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toHaveClass("h-12", "w-12");
    });
  });

  describe("Animation", () => {
    it("has animation class applied", () => {
      const { container } = render(<Spinner />);

      const spinner = container.querySelector(".animate-spin");
      expect(spinner).toHaveClass("animate-spin");
    });
  });

  describe("Custom Styling", () => {
    it("accepts custom className", () => {
      const { container } = render(<Spinner className="custom-class" />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("custom-class");
    });

    it("preserves base classes with custom className", () => {
      const { container } = render(<Spinner className="my-4" />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass(
        "my-4",
        "flex",
        "items-center",
        "justify-center"
      );
    });
  });

  describe("Multiple Spinners", () => {
    it("can render multiple spinners simultaneously", () => {
      const { container } = render(
        <>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </>
      );

      const spinners = container.querySelectorAll(".animate-spin");
      expect(spinners).toHaveLength(3);
    });

    it("renders different sizes independently", () => {
      const { container } = render(
        <>
          <Spinner size="sm" />
          <Spinner size="lg" />
        </>
      );

      const spinners = container.querySelectorAll(".animate-spin");
      expect(spinners[0]).toHaveClass("h-4", "w-4");
      expect(spinners[1]).toHaveClass("h-12", "w-12");
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(<Spinner />);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("can be made accessible with wrapper attributes", async () => {
      const { container } = render(
        <div role="status" aria-label="Loading">
          <Spinner />
        </div>
      );

      const status = container.querySelector('[role="status"]');
      expect(status).toHaveAttribute("aria-label", "Loading");

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("can include visually hidden text for screen readers", () => {
      render(
        <div role="status">
          <Spinner />
          <span className="sr-only">Loading...</span>
        </div>
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("Use Cases", () => {
    it("can be used in a loading state", () => {
      const LoadingComponent = ({ isLoading }: { isLoading: boolean }) => (
        <div>{isLoading ? <Spinner /> : <p>Content loaded</p>}</div>
      );

      const { container, rerender } = render(
        <LoadingComponent isLoading={true} />
      );
      expect(container.querySelector(".animate-spin")).toBeInTheDocument();

      rerender(<LoadingComponent isLoading={false} />);
      expect(container.querySelector(".animate-spin")).not.toBeInTheDocument();
      expect(screen.getByText("Content loaded")).toBeInTheDocument();
    });

    it("can be centered in a container", () => {
      const { container } = render(
        <div className="h-screen w-screen">
          <Spinner />
        </div>
      );

      const wrapper = container.querySelector(".flex");
      expect(wrapper).toHaveClass("items-center", "justify-center");
    });
  });

  it("handles rapid mount/unmount cycles", () => {
    const { container, unmount } = render(<Spinner />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();

    unmount();
    expect(container.querySelector(".animate-spin")).not.toBeInTheDocument();
  });
});
