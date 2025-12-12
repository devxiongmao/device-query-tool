import { faker } from "@faker-js/faker";
import type { band } from "../../src/db/schema";

type Band = typeof band.$inferSelect;

export class BandFactory {
  private static idCounter = 1;

  private static technologies = ["LTE", "5G NR", "UMTS", "GSM"];

  private static bandNumbersByTech: Record<string, string[]> = {
    LTE: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "7",
      "8",
      "12",
      "13",
      "17",
      "20",
      "25",
      "26",
      "28",
      "66",
      "71",
    ],
    "5G NR": [
      "n1",
      "n2",
      "n3",
      "n5",
      "n7",
      "n8",
      "n12",
      "n20",
      "n25",
      "n28",
      "n66",
      "n71",
      "n77",
      "n78",
      "n79",
    ],
    UMTS: ["1", "2", "4", "5", "8"],
    GSM: ["850", "900", "1800", "1900"],
  };

  /**
   * Create a band with default or overridden properties
   */
  static create(overrides: Partial<Band> = {}): Band {
    const technology =
      overrides.technology || faker.helpers.arrayElement(this.technologies);
    const bandNumber =
      overrides.bandNumber ||
      faker.helpers.arrayElement(this.bandNumbersByTech[technology] || ["1"]);

    return {
      id: this.idCounter++,
      technology,
      bandNumber,
      dlBandClass: "A",
      ulBandClass: "A",
      ...overrides,
    };
  }

  /**
   * Create multiple bands
   */
  static createMany(count: number, overrides: Partial<Band> = {}): Band[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create a band with specific technology
   */
  static createWithTechnology(
    technology: string,
    overrides: Partial<Band> = {}
  ): Band {
    const bandNumber = faker.helpers.arrayElement(
      this.bandNumbersByTech[technology] || ["1"]
    );
    return this.create({ technology, bandNumber, ...overrides });
  }

  /**
   * Create multiple bands for a specific technology
   */
  static createManyForTechnology(
    technology: string,
    count: number,
    overrides: Partial<Band> = {}
  ): Band[] {
    return Array.from({ length: count }, () =>
      this.createWithTechnology(technology, overrides)
    );
  }

  /**
   * Create a complete set of LTE bands
   */
  static createLTEBands(): Band[] {
    return this.bandNumbersByTech["LTE"].map((bandNumber) =>
      this.create({ technology: "LTE", bandNumber })
    );
  }

  /**
   * Create a complete set of 5G NR bands
   */
  static create5GBands(): Band[] {
    return this.bandNumbersByTech["5G NR"].map((bandNumber) =>
      this.create({ technology: "5G NR", bandNumber })
    );
  }

  /**
   * Reset the ID counter (call this in beforeEach)
   */
  static reset() {
    this.idCounter = 1;
  }
}
