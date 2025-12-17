import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { createRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../src/components/ui";

expect.extend(toHaveNoViolations);

describe("Card Components", () => {
  describe("Card", () => {
    it("renders with children", () => {
      render(<Card>Card content</Card>);

      expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    it("renders as a div element", () => {
      const { container } = render(<Card>Content</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card.nodeName).toBe("DIV");
    });

    it("applies base classes", () => {
      const { container } = render(<Card>Content</Card>);

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("rounded-lg");
      expect(card).toHaveClass("border");
      expect(card).toHaveClass("border-gray-200");
      expect(card).toHaveClass("bg-white");
      expect(card).toHaveClass("shadow-sm");
    });

    it("accepts custom className", () => {
      const { container } = render(
        <Card className="custom-class">Content</Card>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("custom-class");
      expect(card).toHaveClass("rounded-lg"); // Base classes still present
    });

    it("forwards ref to div element", () => {
      const ref = createRef<HTMLDivElement>();

      render(<Card ref={ref}>Content</Card>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.textContent).toBe("Content");
    });

    it("accepts and applies HTML div attributes", () => {
      const { container } = render(
        <Card id="card-1" data-testid="custom-card" role="article">
          Content
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute("id", "card-1");
      expect(card).toHaveAttribute("data-testid", "custom-card");
      expect(card).toHaveAttribute("role", "article");
    });

    it("has correct display name", () => {
      expect(Card.displayName).toBe("Card");
    });
  });

  describe("CardHeader", () => {
    it("renders with children", () => {
      render(
        <Card>
          <CardHeader>Header content</CardHeader>
        </Card>
      );

      expect(screen.getByText("Header content")).toBeInTheDocument();
    });

    it("renders as a div element", () => {
      const { container } = render(<CardHeader>Header</CardHeader>);

      const header = container.firstChild as HTMLElement;
      expect(header.nodeName).toBe("DIV");
    });

    it("applies base classes", () => {
      const { container } = render(<CardHeader>Header</CardHeader>);

      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass("flex");
      expect(header).toHaveClass("flex-col");
      expect(header).toHaveClass("space-y-1.5");
      expect(header).toHaveClass("p-6");
    });

    it("accepts custom className", () => {
      const { container } = render(
        <CardHeader className="custom-header">Header</CardHeader>
      );

      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass("custom-header");
      expect(header).toHaveClass("flex"); // Base classes still present
    });

    it("forwards ref to div element", () => {
      const ref = createRef<HTMLDivElement>();

      render(<CardHeader ref={ref}>Header</CardHeader>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.textContent).toBe("Header");
    });

    it("has correct display name", () => {
      expect(CardHeader.displayName).toBe("CardHeader");
    });
  });

  describe("CardTitle", () => {
    it("renders with children", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
        </Card>
      );

      expect(screen.getByText("Card Title")).toBeInTheDocument();
    });

    it("renders as an h3 element", () => {
      render(<CardTitle>Title</CardTitle>);

      const title = screen.getByRole("heading", { level: 3 });
      expect(title).toBeInTheDocument();
      expect(title.nodeName).toBe("H3");
    });

    it("applies base classes", () => {
      render(<CardTitle>Title</CardTitle>);

      const title = screen.getByRole("heading");
      expect(title).toHaveClass("text-xl");
      expect(title).toHaveClass("font-semibold");
      expect(title).toHaveClass("leading-none");
      expect(title).toHaveClass("tracking-tight");
    });

    it("accepts custom className", () => {
      render(<CardTitle className="custom-title">Title</CardTitle>);

      const title = screen.getByRole("heading");
      expect(title).toHaveClass("custom-title");
      expect(title).toHaveClass("text-xl"); // Base classes still present
    });

    it("forwards ref to h3 element", () => {
      const ref = createRef<HTMLParagraphElement>();

      render(<CardTitle ref={ref}>Title</CardTitle>);

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
      expect(ref.current?.textContent).toBe("Title");
    });

    it("accepts HTML heading attributes", () => {
      render(<CardTitle id="title-1">Title</CardTitle>);

      const title = screen.getByRole("heading");
      expect(title).toHaveAttribute("id", "title-1");
    });

    it("has correct display name", () => {
      expect(CardTitle.displayName).toBe("CardTitle");
    });
  });

  describe("CardDescription", () => {
    it("renders with children", () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>Card description text</CardDescription>
          </CardHeader>
        </Card>
      );

      expect(screen.getByText("Card description text")).toBeInTheDocument();
    });

    it("renders as a p element", () => {
      const { container } = render(
        <CardDescription>Description</CardDescription>
      );

      const description = container.firstChild as HTMLElement;
      expect(description.nodeName).toBe("P");
    });

    it("applies base classes", () => {
      const { container } = render(
        <CardDescription>Description</CardDescription>
      );

      const description = container.firstChild as HTMLElement;
      expect(description).toHaveClass("text-sm");
      expect(description).toHaveClass("text-gray-500");
    });

    it("accepts custom className", () => {
      const { container } = render(
        <CardDescription className="custom-desc">Description</CardDescription>
      );

      const description = container.firstChild as HTMLElement;
      expect(description).toHaveClass("custom-desc");
      expect(description).toHaveClass("text-sm"); // Base classes still present
    });

    it("forwards ref to p element", () => {
      const ref = createRef<HTMLParagraphElement>();

      render(<CardDescription ref={ref}>Description</CardDescription>);

      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
      expect(ref.current?.textContent).toBe("Description");
    });

    it("has correct display name", () => {
      expect(CardDescription.displayName).toBe("CardDescription");
    });
  });

  describe("CardContent", () => {
    it("renders with children", () => {
      render(
        <Card>
          <CardContent>Content area</CardContent>
        </Card>
      );

      expect(screen.getByText("Content area")).toBeInTheDocument();
    });

    it("renders as a div element", () => {
      const { container } = render(<CardContent>Content</CardContent>);

      const content = container.firstChild as HTMLElement;
      expect(content.nodeName).toBe("DIV");
    });

    it("applies base classes", () => {
      const { container } = render(<CardContent>Content</CardContent>);

      const content = container.firstChild as HTMLElement;
      expect(content).toHaveClass("p-6");
      expect(content).toHaveClass("pt-0");
    });

    it("accepts custom className", () => {
      const { container } = render(
        <CardContent className="custom-content">Content</CardContent>
      );

      const content = container.firstChild as HTMLElement;
      expect(content).toHaveClass("custom-content");
      expect(content).toHaveClass("p-6"); // Base classes still present
    });

    it("forwards ref to div element", () => {
      const ref = createRef<HTMLDivElement>();

      render(<CardContent ref={ref}>Content</CardContent>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.textContent).toBe("Content");
    });

    it("has correct display name", () => {
      expect(CardContent.displayName).toBe("CardContent");
    });
  });

  describe("CardFooter", () => {
    it("renders with children", () => {
      render(
        <Card>
          <CardFooter>Footer content</CardFooter>
        </Card>
      );

      expect(screen.getByText("Footer content")).toBeInTheDocument();
    });

    it("renders as a div element", () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);

      const footer = container.firstChild as HTMLElement;
      expect(footer.nodeName).toBe("DIV");
    });

    it("applies base classes", () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);

      const footer = container.firstChild as HTMLElement;
      expect(footer).toHaveClass("flex");
      expect(footer).toHaveClass("items-center");
      expect(footer).toHaveClass("p-6");
      expect(footer).toHaveClass("pt-0");
    });

    it("accepts custom className", () => {
      const { container } = render(
        <CardFooter className="custom-footer">Footer</CardFooter>
      );

      const footer = container.firstChild as HTMLElement;
      expect(footer).toHaveClass("custom-footer");
      expect(footer).toHaveClass("flex"); // Base classes still present
    });

    it("forwards ref to div element", () => {
      const ref = createRef<HTMLDivElement>();

      render(<CardFooter ref={ref}>Footer</CardFooter>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.textContent).toBe("Footer");
    });

    it("has correct display name", () => {
      expect(CardFooter.displayName).toBe("CardFooter");
    });
  });

  describe("Card Composition", () => {
    it("renders complete card with all components", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Main content here</CardContent>
          <CardFooter>Footer actions</CardFooter>
        </Card>
      );

      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card Description")).toBeInTheDocument();
      expect(screen.getByText("Main content here")).toBeInTheDocument();
      expect(screen.getByText("Footer actions")).toBeInTheDocument();
    });

    it("renders card with only header and content", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title Only</CardTitle>
          </CardHeader>
          <CardContent>Content only</CardContent>
        </Card>
      );

      expect(screen.getByText("Title Only")).toBeInTheDocument();
      expect(screen.getByText("Content only")).toBeInTheDocument();
    });

    it("renders card with only content", () => {
      render(
        <Card>
          <CardContent>Just content</CardContent>
        </Card>
      );

      expect(screen.getByText("Just content")).toBeInTheDocument();
    });

    it("renders empty card", () => {
      const { container } = render(<Card />);

      const card = container.firstChild as HTMLElement;
      expect(card).toBeInTheDocument();
      expect(card).toBeEmptyDOMElement();
    });

    it("allows multiple CardContent sections", () => {
      render(
        <Card>
          <CardContent>First section</CardContent>
          <CardContent>Second section</CardContent>
        </Card>
      );

      expect(screen.getByText("First section")).toBeInTheDocument();
      expect(screen.getByText("Second section")).toBeInTheDocument();
    });

    it("renders complex nested content", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Product</CardTitle>
            <CardDescription>Product details</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <p>Price: $99.99</p>
              <p>Stock: 10</p>
            </div>
          </CardContent>
          <CardFooter>
            <button>Add to Cart</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText("Product")).toBeInTheDocument();
      expect(screen.getByText("Price: $99.99")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Add to Cart" })
      ).toBeInTheDocument();
    });
  });

  describe("Custom Styling", () => {
    it("allows custom styles on all components", () => {
      const { container } = render(
        <Card className="shadow-xl">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-2xl">Title</CardTitle>
            <CardDescription className="text-base">Description</CardDescription>
          </CardHeader>
          <CardContent className="py-8">Content</CardContent>
          <CardFooter className="justify-end">Footer</CardFooter>
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass("shadow-xl");

      const header = card.querySelector(".bg-gray-50");
      expect(header).toBeInTheDocument();

      const title = screen.getByRole("heading");
      expect(title).toHaveClass("text-2xl");

      const description = screen.getByText("Description");
      expect(description).toHaveClass("text-base");
    });
  });

  describe("Event Handlers", () => {
    it("handles onClick on Card", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Card onClick={handleClick}>Clickable card</Card>
      );

      const card = container.firstChild as HTMLElement;
      card.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles onClick on CardContent", () => {
      const handleClick = vi.fn();
      const { container } = render(
        <CardContent onClick={handleClick}>Clickable content</CardContent>
      );

      const content = container.firstChild as HTMLElement;
      content.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations with basic card", async () => {
      const { container } = render(
        <Card>
          <CardContent>Simple card content</CardContent>
        </Card>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations with complete card", async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
            <CardDescription>This card is fully accessible</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main content area with useful information</p>
          </CardContent>
          <CardFooter>
            <button type="button">Action</button>
          </CardFooter>
        </Card>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("CardTitle uses proper heading level", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Heading Level 3</CardTitle>
          </CardHeader>
        </Card>
      );

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
    });

    it("supports semantic HTML with role attributes", async () => {
      const { container } = render(
        <Card role="article">
          <CardHeader>
            <CardTitle>Article Title</CardTitle>
          </CardHeader>
          <CardContent>Article content</CardContent>
        </Card>
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveAttribute("role", "article");

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Edge Cases", () => {
    it("handles very long content in CardTitle", () => {
      const longTitle =
        "This is a very long card title that might wrap to multiple lines or overflow";
      render(<CardTitle>{longTitle}</CardTitle>);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("handles special characters in content", () => {
      render(
        <Card>
          <CardContent>{"Content with <tags> & special chars!"}</CardContent>
        </Card>
      );

      expect(
        screen.getByText("Content with <tags> & special chars!")
      ).toBeInTheDocument();
    });

    it("handles multiple refs to different components", () => {
      const cardRef = createRef<HTMLDivElement>();
      const headerRef = createRef<HTMLDivElement>();
      const contentRef = createRef<HTMLDivElement>();

      render(
        <Card ref={cardRef}>
          <CardHeader ref={headerRef}>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent ref={contentRef}>Content</CardContent>
        </Card>
      );

      expect(cardRef.current).toBeInstanceOf(HTMLDivElement);
      expect(headerRef.current).toBeInstanceOf(HTMLDivElement);
      expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    });

    it("renders with data attributes for testing", () => {
      const { container } = render(
        <Card data-testid="main-card">
          <CardHeader data-testid="card-header">
            <CardTitle data-testid="card-title">Title</CardTitle>
          </CardHeader>
        </Card>
      );

      expect(
        container.querySelector('[data-testid="main-card"]')
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-testid="card-header"]')
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-testid="card-title"]')
      ).toBeInTheDocument();
    });
  });

  describe("Layout and Spacing", () => {
    it("CardHeader has correct flex layout", () => {
      const { container } = render(<CardHeader>Header</CardHeader>);

      const header = container.firstChild as HTMLElement;
      expect(header).toHaveClass("flex");
      expect(header).toHaveClass("flex-col");
      expect(header).toHaveClass("space-y-1.5");
    });

    it("CardFooter has correct flex layout", () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);

      const footer = container.firstChild as HTMLElement;
      expect(footer).toHaveClass("flex");
      expect(footer).toHaveClass("items-center");
    });

    it("CardContent has no top padding", () => {
      const { container } = render(<CardContent>Content</CardContent>);

      const content = container.firstChild as HTMLElement;
      expect(content).toHaveClass("pt-0");
      expect(content).toHaveClass("p-6");
    });
  });
});
