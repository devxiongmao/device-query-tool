import { faker } from "@faker-js/faker";
import type { provider } from "../../src/db/schema";

type Provider = typeof provider.$inferSelect;

export class ProviderFactory {
  private static idCounter = 1;

  // Realistic carrier/provider names by region
  private static providers = {
    us: [
      "Verizon",
      "AT&T",
      "T-Mobile",
      "Sprint",
      "US Cellular",
      "Dish Wireless",
      "Boost Mobile",
      "Cricket Wireless",
      "Metro by T-Mobile",
      "Visible",
      "Mint Mobile",
      "Google Fi",
    ],
    canada: [
      "Rogers",
      "Bell",
      "Telus",
      "Freedom Mobile",
      "Videotron",
      "SaskTel",
      "Fido",
      "Koodo",
      "Virgin Plus",
    ],
    uk: [
      "EE",
      "O2",
      "Vodafone",
      "Three",
      "Sky Mobile",
      "Tesco Mobile",
      "giffgaff",
      "Smarty",
    ],
    europe: [
      "Orange",
      "Vodafone",
      "Telefonica",
      "Deutsche Telekom",
      "Swisscom",
      "KPN",
      "Telenor",
      "Telia",
    ],
    asia: [
      "NTT Docomo",
      "KDDI",
      "SoftBank",
      "China Mobile",
      "China Unicom",
      "Singtel",
      "SK Telecom",
      "KT Corporation",
    ],
  };

  /**
   * Create a provider with default or overridden properties
   */
  static create(overrides: Partial<Provider> = {}): Provider {
    const allProviders = Object.values(this.providers).flat();

    return {
      id: this.idCounter++,
      name: overrides.name || faker.helpers.arrayElement(allProviders),
      country: "US",
      networkType: "5G",
      ...overrides,
    };
  }

  /**
   * Create multiple providers
   */
  static createMany(
    count: number,
    overrides: Partial<Provider> = {}
  ): Provider[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create a provider with specific name
   */
  static createWithName(
    name: string,
    overrides: Partial<Provider> = {}
  ): Provider {
    return this.create({ name, ...overrides });
  }

  /**
   * Create US providers
   */
  static createUSProviders(count?: number): Provider[] {
    const providers = count
      ? this.providers.us.slice(0, count)
      : this.providers.us;
    return providers.map((name) => this.create({ name }));
  }

  /**
   * Create Canadian providers
   */
  static createCanadianProviders(count?: number): Provider[] {
    const providers = count
      ? this.providers.canada.slice(0, count)
      : this.providers.canada;
    return providers.map((name) => this.create({ name }));
  }

  /**
   * Create UK providers
   */
  static createUKProviders(count?: number): Provider[] {
    const providers = count
      ? this.providers.uk.slice(0, count)
      : this.providers.uk;
    return providers.map((name) => this.create({ name }));
  }

  /**
   * Create European providers
   */
  static createEuropeanProviders(count?: number): Provider[] {
    const providers = count
      ? this.providers.europe.slice(0, count)
      : this.providers.europe;
    return providers.map((name) => this.create({ name }));
  }

  /**
   * Create Asian providers
   */
  static createAsianProviders(count?: number): Provider[] {
    const providers = count
      ? this.providers.asia.slice(0, count)
      : this.providers.asia;
    return providers.map((name) => this.create({ name }));
  }

  /**
   * Create major US carriers (big 3)
   */
  static createMajorUSCarriers(): Provider[] {
    return [
      this.create({ name: "Verizon" }),
      this.create({ name: "AT&T" }),
      this.create({ name: "T-Mobile" }),
    ];
  }

  /**
   * Create major Canadian carriers (big 3)
   */
  static createMajorCanadianCarriers(): Provider[] {
    return [
      this.create({ name: "Rogers" }),
      this.create({ name: "Bell" }),
      this.create({ name: "Telus" }),
    ];
  }

  /**
   * Create MVNOs (Mobile Virtual Network Operators)
   */
  static createMVNOs(): Provider[] {
    return [
      this.create({ name: "Boost Mobile" }),
      this.create({ name: "Cricket Wireless" }),
      this.create({ name: "Metro by T-Mobile" }),
      this.create({ name: "Visible" }),
      this.create({ name: "Mint Mobile" }),
      this.create({ name: "Google Fi" }),
    ];
  }

  /**
   * Reset the ID counter (call this in beforeEach)
   */
  static reset() {
    this.idCounter = 1;
  }
}
