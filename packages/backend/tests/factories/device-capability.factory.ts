import { faker } from "@faker-js/faker";
import type { DeviceCapabilityResult } from "../../src/repositories/types";
import { DeviceFactory } from "./device.factory";
import { SoftwareFactory } from "./software.factory";

export class DeviceCapabilityFactory {
  /**
   * Create a device capability result (global support)
   */
  static createGlobal(
    overrides: Partial<DeviceCapabilityResult> = {}
  ): DeviceCapabilityResult {
    return {
      device: DeviceFactory.create(),
      software: SoftwareFactory.createMany(
        faker.number.int({ min: 1, max: 3 })
      ),
      supportStatus: "global",
      provider: null,
      ...overrides,
    };
  }

  /**
   * Create a device capability result (provider-specific support)
   */
  static createProviderSpecific(
    providerId: number,
    overrides: Partial<DeviceCapabilityResult> = {}
  ): DeviceCapabilityResult {
    return {
      device: DeviceFactory.create(),
      software: SoftwareFactory.createMany(
        faker.number.int({ min: 1, max: 3 })
      ),
      supportStatus: "provider-specific",
      provider: { providerId },
      ...overrides,
    };
  }

  /**
   * Create multiple device capability results
   */
  static createMany(
    count: number,
    isProviderSpecific = false,
    providerId?: number
  ): DeviceCapabilityResult[] {
    return Array.from({ length: count }, () =>
      isProviderSpecific && providerId
        ? this.createProviderSpecific(providerId)
        : this.createGlobal()
    );
  }
}
