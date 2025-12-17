import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { createRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "../../../src/components/ui";

expect.extend(toHaveNoViolations);

describe("Table Components", () => {
  describe("Basic Table Composition", () => {
    it("renders a complete table", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: "Name" })
      ).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("displays table data in correct structure", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Widget</TableCell>
              <TableCell>$19.99</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gadget</TableCell>
              <TableCell>$29.99</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(3); // 1 header + 2 body rows

      const cells = within(rows[1]).getAllByRole("cell");
      expect(cells[0]).toHaveTextContent("Widget");
      expect(cells[1]).toHaveTextContent("$19.99");
    });

    it("supports multiple rows and columns", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>A1</TableCell>
              <TableCell>A2</TableCell>
              <TableCell>A3</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>B1</TableCell>
              <TableCell>B2</TableCell>
              <TableCell>B3</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>C1</TableCell>
              <TableCell>C2</TableCell>
              <TableCell>C3</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getAllByRole("row")).toHaveLength(3);
      expect(screen.getAllByRole("cell")).toHaveLength(9);
    });
  });

  describe("TableCaption", () => {
    it("renders table caption", () => {
      render(
        <Table>
          <TableCaption>User list for 2025</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText("User list for 2025")).toBeInTheDocument();
    });

    it("caption is associated with table", () => {
      const { container } = render(
        <Table>
          <TableCaption>Product inventory</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Item</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const caption = container.querySelector("caption");
      expect(caption).toHaveTextContent("Product inventory");
    });
  });

  describe("TableFooter", () => {
    it("renders footer rows", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Product A</TableCell>
              <TableCell>10</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>10</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      const table = screen.getByRole("table");
      const footer = table.querySelector("tfoot");
      expect(footer).toBeInTheDocument();
      expect(
        within(footer as HTMLElement).getByText("Total")
      ).toBeInTheDocument();
    });

    it("footer appears at bottom of table", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Body</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Footer</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      const table = container.querySelector("table");
      const children = Array.from(table?.children || []);
      const lastChild = children[children.length - 1];
      expect(lastChild.nodeName).toBe("TFOOT");
    });
  });

  describe("Interactive Behaviors", () => {
    it("rows can be clicked", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Table>
          <TableBody>
            <TableRow onClick={handleClick}>
              <TableCell>Clickable row</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const row = screen.getByRole("row");
      await user.click(row);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("cells can be clicked individually", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell onClick={handleClick}>Click me</TableCell>
              <TableCell>Other cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      await user.click(screen.getByText("Click me"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("supports selectable rows with data-state", () => {
      render(
        <Table>
          <TableBody>
            <TableRow data-state="selected">
              <TableCell>Selected</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Not selected</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const rows = screen.getAllByRole("row");
      expect(rows[0]).toHaveAttribute("data-state", "selected");
      expect(rows[1]).not.toHaveAttribute("data-state");
    });

    it("handles row selection toggle", async () => {
      const ToggleTable = () => {
        const [selected, setSelected] = useState(false);
        return (
          <Table>
            <TableBody>
              <TableRow
                data-state={selected ? "selected" : undefined}
                onClick={() => setSelected(!selected)}
              >
                <TableCell>Toggle me</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        );
      };

      const user = userEvent.setup();
      render(<ToggleTable />);

      const row = screen.getByRole("row");
      expect(row).not.toHaveAttribute("data-state");

      await user.click(row);
      expect(row).toHaveAttribute("data-state", "selected");

      await user.click(row);
      expect(row).not.toHaveAttribute("data-state");
    });
  });

  describe("Empty States", () => {
    it("renders table with no rows", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody />
        </Table>
      );

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getAllByRole("row")).toHaveLength(1); // Only header
    });

    it("displays empty state message", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3}>No data available</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText("No data available")).toBeInTheDocument();
    });
  });

  describe("Alignment and Styling", () => {
    it("supports right-aligned cells", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="text-right">$99.99</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const cell = screen.getByText("$99.99");
      expect(cell).toHaveClass("text-right");
    });

    it("supports custom cell styling", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-bold text-red-600">
                Important
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const cell = screen.getByText("Important");
      expect(cell).toHaveClass("font-bold", "text-red-600");
    });

    it("supports custom row styling", () => {
      render(
        <Table>
          <TableBody>
            <TableRow className="bg-yellow-50">
              <TableCell>Highlighted</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const row = screen.getByRole("row");
      expect(row).toHaveClass("bg-yellow-50");
    });
  });

  describe("Complex Table Structures", () => {
    it("renders table with all sections", () => {
      render(
        <Table>
          <TableCaption>Sales Report Q1 2025</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Sales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>January</TableCell>
              <TableCell>$10,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>February</TableCell>
              <TableCell>$12,000</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell>$22,000</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(screen.getByText("Sales Report Q1 2025")).toBeInTheDocument();
      expect(screen.getByText("Month")).toBeInTheDocument();
      expect(screen.getByText("January")).toBeInTheDocument();
      expect(screen.getByText("Total")).toBeInTheDocument();
    });

    it("handles nested content in cells", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <div>
                  <strong>Name</strong>
                  <p>Description</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
    });

    it("supports checkboxes in cells", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <input
                  type="checkbox"
                  role="checkbox"
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <input
                  type="checkbox"
                  role="checkbox"
                  aria-label="Select row"
                />
              </TableCell>
              <TableCell>Item 1</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByLabelText("Select all")).toBeInTheDocument();
      expect(screen.getByLabelText("Select row")).toBeInTheDocument();
    });
  });

  describe("Ref Forwarding", () => {
    it("forwards ref to table element", () => {
      const ref = createRef<HTMLTableElement>();
      render(
        <Table ref={ref}>
          <TableBody>
            <TableRow>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(ref.current).toBeInstanceOf(HTMLTableElement);
    });

    it("forwards refs to all components", () => {
      const headerRef = createRef<HTMLTableSectionElement>();
      const bodyRef = createRef<HTMLTableSectionElement>();
      const rowRef = createRef<HTMLTableRowElement>();
      const cellRef = createRef<HTMLTableCellElement>();

      render(
        <Table>
          <TableHeader ref={headerRef}>
            <TableRow ref={rowRef}>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody ref={bodyRef}>
            <TableRow>
              <TableCell ref={cellRef}>Cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(headerRef.current).toBeInstanceOf(HTMLTableSectionElement);
      expect(bodyRef.current).toBeInstanceOf(HTMLTableSectionElement);
      expect(rowRef.current).toBeInstanceOf(HTMLTableRowElement);
      expect(cellRef.current).toBeInstanceOf(HTMLTableCellElement);
    });
  });

  describe("Responsive Behavior", () => {
    it("table is wrapped in scrollable container", () => {
      const { container } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const wrapper = container.querySelector(".overflow-auto");
      expect(wrapper).toBeInTheDocument();
    });

    it("handles wide tables with horizontal scroll", () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              {Array.from({ length: 20 }, (_, i) => (
                <TableCell key={i}>Column {i + 1}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getAllByRole("cell")).toHaveLength(20);
    });
  });

  describe("Accessibility", () => {
    it("should have no accessibility violations", async () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>john@example.com</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with caption", async () => {
      const { container } = render(
        <Table>
          <TableCaption>User directory</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("uses semantic table elements", () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Header</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Body</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getAllByRole("rowgroup")).toHaveLength(2)
      expect(screen.getByRole("columnheader")).toBeInTheDocument();
    });
  });

  describe("Dynamic Content", () => {
    it("updates when data changes", () => {
      const { rerender } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Initial</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getByText("Initial")).toBeInTheDocument();

      rerender(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Updated</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.queryByText("Initial")).not.toBeInTheDocument();
      expect(screen.getByText("Updated")).toBeInTheDocument();
    });

    it("handles adding rows dynamically", () => {
      const { rerender } = render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Row 1</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getAllByRole("row")).toHaveLength(1);

      rerender(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Row 1</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 2</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 3</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

      expect(screen.getAllByRole("row")).toHaveLength(3);
    });
  });

  describe("Display Names", () => {
    it("all components have correct display names", () => {
      expect(Table.displayName).toBe("Table");
      expect(TableHeader.displayName).toBe("TableHeader");
      expect(TableBody.displayName).toBe("TableBody");
      expect(TableFooter.displayName).toBe("TableFooter");
      expect(TableRow.displayName).toBe("TableRow");
      expect(TableHead.displayName).toBe("TableHead");
      expect(TableCell.displayName).toBe("TableCell");
      expect(TableCaption.displayName).toBe("TableCaption");
    });
  });
});
