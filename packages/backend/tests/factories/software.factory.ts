import { faker } from "@faker-js/faker";
import type { software } from "../../src/db/schema";

type Software = typeof software.$inferSelect;

export class SoftwareFactory {
  private static idCounter = 1;

  private static platforms = ["Android", "iOS", "Windows", "macOS", "Linux"];

  private static softwareNames = [
    "System Firmware",
    "Device Manager",
    "Core Services",
    "Network Stack",
    "Security Module",
    "Boot Loader",
    "Update Agent",
    "Diagnostics Suite",
  ];

  /**
   * Create a software with default or overridden properties
   */
  static create(overrides: Partial<Software> = {}): Software {
    return {
      id: this.idCounter++,
      name: faker.helpers.arrayElement(this.softwareNames),
      platform: faker.helpers.arrayElement(this.platforms),
      ptcrb:
        faker.helpers.maybe(
          () => faker.number.int({ min: 10000, max: 99999 }),
          { probability: 0.7 }
        ) ?? null,
      svn:
        faker.helpers.maybe(() => faker.number.int({ min: 1, max: 999 }), {
          probability: 0.7,
        }) ?? null,
      buildNumber:
        faker.helpers.maybe(
          () =>
            `${faker.number.int({ min: 1, max: 15 })}.${faker.number.int({
              min: 0,
              max: 9,
            })}.${faker.number.int({ min: 0, max: 99 })}`,
          { probability: 0.8 }
        ) ?? null,
      releaseDate: faker.date.past({ years: 2 }).toISOString().split("T")[0],
      deviceId: faker.number.int({ min: 1, max: 1000 }),
      ...overrides,
    };
  }

  /**
   * Create multiple software entries
   */
  static createMany(
    count: number,
    overrides: Partial<Software> = {}
  ): Software[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create software for a specific device
   */
  static createForDevice(
    deviceId: number,
    overrides: Partial<Software> = {}
  ): Software {
    return this.create({ deviceId, ...overrides });
  }

  /**
   * Create multiple software entries for a specific device
   */
  static createManyForDevice(
    deviceId: number,
    count: number,
    overrides: Partial<Software> = {}
  ): Software[] {
    return Array.from({ length: count }, () =>
      this.create({ deviceId, ...overrides })
    );
  }

  /**
   * Create software with specific platform
   */
  static createWithPlatform(
    platform: string,
    overrides: Partial<Software> = {}
  ): Software {
    return this.create({ platform, ...overrides });
  }

  /**
   * Create software with specific date range
   */
  static createWithDateRange(
    startDate: string,
    endDate: string,
    overrides: Partial<Software> = {}
  ): Software {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const releaseDate = faker.date
      .between({ from: start, to: end })
      .toISOString()
      .split("T")[0];

    return this.create({ releaseDate, ...overrides });
  }

  /**
   * Create software entries for multiple devices (useful for batch testing)
   */
  static createForDevices(deviceIds: number[]): Software[] {
    return deviceIds.flatMap((deviceId) =>
      this.createManyForDevice(deviceId, faker.number.int({ min: 1, max: 3 }))
    );
  }

  /**
   * Create chronological software versions for a device
   */
  static createVersionHistory(
    deviceId: number,
    buildNumbers: string[],
    overrides: Partial<Software> = {}
  ): Software[] {
    return buildNumbers.map((buildNumber, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (buildNumbers.length - index));

      return this.create({
        deviceId,
        buildNumber,
        releaseDate: date.toISOString().split("T")[0],
        ...overrides,
      });
    });
  }

  /**
   * Reset the ID counter (call this in beforeEach)
   */
  static reset() {
    this.idCounter = 1;
  }
}
