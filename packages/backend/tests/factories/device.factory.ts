import { faker } from "@faker-js/faker";
import type { device } from "../../src/db/schema";

type Device = typeof device.$inferSelect;

export class DeviceFactory {
  private static idCounter = 1;

  /**
   * Create a device with default or overridden properties
   */
  static create(overrides: Partial<Device> = {}): Device {
    return {
      id: this.idCounter++,
      vendor: faker.company.name(),
      modelNum: faker.string.alphanumeric(8).toUpperCase(),
      marketName: faker.commerce.productName(),
      releaseDate: faker.date.past({ years: 3 }).toISOString().split("T")[0],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  /**
   * Create multiple devices
   */
  static createMany(count: number, overrides: Partial<Device> = {}): Device[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create devices with specific vendors (useful for testing filters)
   */
  static createWithVendor(
    vendor: string,
    overrides: Partial<Device> = {}
  ): Device {
    return this.create({ vendor, ...overrides });
  }

  /**
   * Create devices with specific date range
   */
  static createWithDateRange(
    startDate: string,
    endDate: string,
    overrides: Partial<Device> = {}
  ): Device {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const releaseDate = faker.date
      .between({ from: start, to: end })
      .toISOString()
      .split("T")[0];

    return this.create({ releaseDate, ...overrides });
  }

  /**
   * Reset the ID counter (call this in beforeEach)
   */
  static reset() {
    this.idCounter = 1;
  }
}
