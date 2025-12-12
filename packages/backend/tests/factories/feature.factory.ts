import { faker } from "@faker-js/faker";
import type { feature } from "../../src/db/schema";

type Feature = typeof feature.$inferSelect;

export class FeatureFactory {
  private static idCounter = 1;

  // Realistic feature names for mobile devices
  private static featureNames = [
    "VoLTE",
    "VoNR",
    "Wi-Fi Calling",
    "Video Calling",
    "RCS Messaging",
    "eSIM",
    "Dual SIM",
    "HD Voice",
    "EVS Codec",
    "MIMO 4x4",
    "Carrier Aggregation",
    "Beamforming",
    "eMBMS",
    "HPUE",
    "LAA",
    "NR-DC",
    "EN-DC",
    "SMS over IMS",
    "Emergency Calling",
    "Location Services",
    "Network Slicing",
    "256 QAM",
    "Uplink 64 QAM",
    "TTI Bundling",
    "Power Class 2",
  ];

  /**
   * Create a feature with default or overridden properties
   */
  static create(overrides: Partial<Feature> = {}): Feature {
    return {
      id: this.idCounter++,
      name: overrides.name || faker.helpers.arrayElement(this.featureNames),
      description: "A description of the feature",
      ...overrides,
    };
  }

  /**
   * Create multiple features
   */
  static createMany(
    count: number,
    overrides: Partial<Feature> = {}
  ): Feature[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  /**
   * Create a feature with specific name
   */
  static createWithName(
    name: string,
    overrides: Partial<Feature> = {}
  ): Feature {
    return this.create({ name, ...overrides });
  }

  /**
   * Create common voice features
   */
  static createVoiceFeatures(): Feature[] {
    return [
      this.create({ name: "VoLTE" }),
      this.create({ name: "VoNR" }),
      this.create({ name: "Wi-Fi Calling" }),
      this.create({ name: "Video Calling" }),
      this.create({ name: "HD Voice" }),
      this.create({ name: "EVS Codec" }),
    ];
  }

  /**
   * Create common SIM features
   */
  static createSIMFeatures(): Feature[] {
    return [this.create({ name: "eSIM" }), this.create({ name: "Dual SIM" })];
  }

  /**
   * Create common 5G features
   */
  static create5GFeatures(): Feature[] {
    return [
      this.create({ name: "VoNR" }),
      this.create({ name: "NR-DC" }),
      this.create({ name: "EN-DC" }),
      this.create({ name: "Network Slicing" }),
    ];
  }

  /**
   * Create common carrier aggregation features
   */
  static createCAFeatures(): Feature[] {
    return [
      this.create({ name: "Carrier Aggregation" }),
      this.create({ name: "LAA" }),
      this.create({ name: "MIMO 4x4" }),
      this.create({ name: "Beamforming" }),
    ];
  }

  /**
   * Reset the ID counter (call this in beforeEach)
   */
  static reset() {
    this.idCounter = 1;
  }
}
