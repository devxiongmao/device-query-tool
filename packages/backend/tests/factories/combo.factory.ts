import { faker } from "@faker-js/faker";
import type { combo } from "../../src/db/schema";

type Combo = typeof combo.$inferSelect;

export class ComboFactory {
  private static idCounter = 1;

  private static technologies = ["LTE", "5G NR", "LTE-A"];

  // Realistic combo names based on technology
  private static comboNamesByTech: Record<string, string[]> = {
    LTE: [
      "2A-4A",
      "2A-5A",
      "4A-12A",
      "2A-4A-12A",
      "4A-66A",
      "2A-4A-5A",
      "2A-4A-66A",
      "4A-5A-7A",
    ],
    "5G NR": [
      "n77A",
      "n78A",
      "n77A-n78A",
      "n41A-n77A",
      "n1A-n77A",
      "n71A-n77A",
      "n2A-n77A-n78A",
      "n5A-n77A",
    ],
    "LTE-A": [
      "2A-4A-5A-7A",
      "2A-4A-12A-66A",
      "4A-5A-7A-66A",
      "2A-4A-5A-12A-66A",
      "4A-12A-66A",
    ],
  };

  /**
   * Create a combo with default or overridden properties
   */
  static create(overrides: Partial<Combo> = {}): Combo {
    const technology =
      overrides.technology || faker.helpers.arrayElement(this.technologies);
    const name =
      overrides.name ||
      faker.helpers.arrayElement(
        this.comboNamesByTech[technology] || ["2A-4A"]
      );

    return {
      id: this.idCounter++,
      technology,
      name,
      ...overrides,
    };
  }

  /**
   * Create multiple combos
   */
  static createMany(count: number, overrides: Partial<Combo> = {}): Combo[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create a combo with specific technology
   */
  static createWithTechnology(
    technology: string,
    overrides: Partial<Combo> = {}
  ): Combo {
    const name = faker.helpers.arrayElement(
      this.comboNamesByTech[technology] || ["2A-4A"]
    );
    return this.create({ technology, name, ...overrides });
  }

  /**
   * Create multiple combos for a specific technology
   */
  static createManyForTechnology(
    technology: string,
    count: number,
    overrides: Partial<Combo> = {}
  ): Combo[] {
    return Array.from({ length: count }, () =>
      this.createWithTechnology(technology, overrides)
    );
  }

  /**
   * Create a combo with specific name
   */
  static createWithName(name: string, overrides: Partial<Combo> = {}): Combo {
    return this.create({ name, ...overrides });
  }

  /**
   * Create LTE combos
   */
  static createLTECombos(count = 5): Combo[] {
    return this.createManyForTechnology("LTE", count);
  }

  /**
   * Create 5G NR combos
   */
  static create5GCombos(count = 5): Combo[] {
    return this.createManyForTechnology("5G NR", count);
  }

  /**
   * Create LTE-Advanced combos
   */
  static createLTEAdvancedCombos(count = 5): Combo[] {
    return this.createManyForTechnology("LTE-A", count);
  }

  /**
   * Reset the ID counter (call this in beforeEach)
   */
  static reset() {
    this.idCounter = 1;
  }
}
