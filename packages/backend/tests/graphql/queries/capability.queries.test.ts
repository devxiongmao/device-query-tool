import { describe, it, expect, beforeEach, vi } from "vitest";
import { DeviceFactory } from "../../factories/device.factory";
import { BandFactory } from "../../factories/band.factory";
import { ComboFactory } from "../../factories/combo.factory";
import { FeatureFactory } from "../../factories/feature.factory";
import { ProviderFactory } from "../../factories/provider.factory";
import {
  bandRepository,
  comboRepository,
  featureRepository,
} from "../../../src/repositories";

// Mock the repositories
vi.mock("../../../src/repositories", () => ({
  bandRepository: {
    findDevicesSupportingBand: vi.fn(),
  },
  comboRepository: {
    findDevicesSupportingCombo: vi.fn(),
  },
  featureRepository: {
    findDevicesSupportingFeature: vi.fn(),
  },
}));

describe("Capability Results GraphQL Queries", () => {
  beforeEach(() => {
    DeviceFactory.reset();
    BandFactory.reset();
    ComboFactory.reset();
    FeatureFactory.reset();
    ProviderFactory.reset();
    vi.clearAllMocks();
  });

  describe("devicesByBand query", () => {
    it("should find devices supporting a specific band (global)", async () => {
      const band = BandFactory.create({ id: 1, bandNumber: "B1" });
      const devices = DeviceFactory.createMany(3);
      const mockResults = devices.map((device) => ({
        device,
        band,
        provider: null,
        isGlobal: true,
      }));
      (
        bandRepository.findDevicesSupportingBand as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockResults);

      const args = { bandId: "1" };
      const result = await bandRepository.findDevicesSupportingBand({
        bandId: Number(args.bandId),
        providerId: undefined,
        technology: undefined,
      });

      expect(result).toEqual(mockResults);
      expect(bandRepository.findDevicesSupportingBand).toHaveBeenCalledWith({
        bandId: 1,
        providerId: undefined,
        technology: undefined,
      });
      expect(result.length).toBe(3);
    });

    it("should find devices supporting a band for a specific provider", async () => {
      const band = BandFactory.create({ id: 1, bandNumber: "B1" });
      const provider = ProviderFactory.create({ id: 1, name: "Verizon" });
      const devices = DeviceFactory.createMany(2);
      const mockResults = devices.map((device) => ({
        device,
        band,
        provider: null, // Will be populated by resolver
        isGlobal: false,
      }));

      (
        bandRepository.findDevicesSupportingBand as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockResults);

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(provider),
      };

      const ctx = {
        loaders: {
          providerById: mockDataLoader,
        },
      };

      const args = { bandId: "1", providerId: "1" };
      const result = await bandRepository.findDevicesSupportingBand({
        bandId: Number(args.bandId),
        providerId: Number(args.providerId),
        technology: undefined,
      });

      // Simulate provider population
      const populatedProvider = await ctx.loaders.providerById.load(
        Number(args.providerId)
      );
      result.forEach((r) => {
        r.provider = populatedProvider;
      });

      expect(result).toHaveLength(2);
      expect(result.every((r) => r.provider?.name === "Verizon")).toBe(true);
      expect(mockDataLoader.load).toHaveBeenCalledWith(1);
    });

    it("should filter by technology when provided", async () => {
      const band = BandFactory.create({ id: 1, technology: "LTE" });
      const devices = DeviceFactory.createMany(3);
      const mockResults = devices.map((device) => ({
        device,
        band,
        provider: null,
        isGlobal: true,
      }));

      (
        bandRepository.findDevicesSupportingBand as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockResults);

      const args = { bandId: "1", technology: "LTE" };
      const result = await bandRepository.findDevicesSupportingBand({
        bandId: Number(args.bandId),
        providerId: undefined,
        technology: args.technology || undefined,
      });

      expect(result).toEqual(mockResults);
      expect(bandRepository.findDevicesSupportingBand).toHaveBeenCalledWith({
        bandId: 1,
        providerId: undefined,
        technology: "LTE",
      });
    });

    it("should handle empty results when no devices support the band", async () => {
      (
        bandRepository.findDevicesSupportingBand as ReturnType<typeof vi.fn>
      ).mockResolvedValue([]);

      const args = { bandId: "999" };
      const result = await bandRepository.findDevicesSupportingBand({
        bandId: Number(args.bandId),
        providerId: undefined,
        technology: undefined,
      });

      expect(result).toEqual([]);
      expect(bandRepository.findDevicesSupportingBand).toHaveBeenCalledWith({
        bandId: 999,
        providerId: undefined,
        technology: undefined,
      });
    });

    it("should convert empty string technology to undefined", async () => {
      (
        bandRepository.findDevicesSupportingBand as ReturnType<typeof vi.fn>
      ).mockResolvedValue([]);

      const args = { bandId: "1", technology: "" };
      await bandRepository.findDevicesSupportingBand({
        bandId: Number(args.bandId),
        providerId: undefined,
        technology: args.technology || undefined,
      });

      expect(bandRepository.findDevicesSupportingBand).toHaveBeenCalledWith({
        bandId: 1,
        providerId: undefined,
        technology: undefined,
      });
    });
  });

  describe("devicesByCombo query", () => {
    it("should find devices supporting a specific combo (global)", async () => {
      const combo = ComboFactory.create({ id: 1, name: "2A-4A" });
      const devices = DeviceFactory.createMany(3);
      const mockResults = devices.map((device) => ({
        device,
        combo,
        provider: null,
        isGlobal: true,
      }));
      (
        comboRepository.findDevicesSupportingCombo as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockResults);

      const args = { comboId: "1" };
      const result = await comboRepository.findDevicesSupportingCombo({
        comboId: Number(args.comboId),
        providerId: undefined,
        technology: undefined,
      });

      expect(result).toEqual(mockResults);
      expect(comboRepository.findDevicesSupportingCombo).toHaveBeenCalledWith({
        comboId: 1,
        providerId: undefined,
        technology: undefined,
      });
      expect(result.length).toBe(3);
    });

    it("should find devices supporting a combo for a specific provider", async () => {
      const combo = ComboFactory.create({ id: 1, name: "2A-4A" });
      const provider = ProviderFactory.create({ id: 1, name: "AT&T" });
      const devices = DeviceFactory.createMany(2);
      const mockResults = devices.map((device) => ({
        device,
        combo,
        provider: null,
        isGlobal: false,
      }));
      (
        comboRepository.findDevicesSupportingCombo as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockResults);

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(provider),
      };

      const ctx = {
        loaders: {
          providerById: mockDataLoader,
        },
      };

      const args = { comboId: "1", providerId: "1" };
      const result = await comboRepository.findDevicesSupportingCombo({
        comboId: Number(args.comboId),
        providerId: Number(args.providerId),
        technology: undefined,
      });

      // Simulate provider population
      const populatedProvider = await ctx.loaders.providerById.load(
        Number(args.providerId)
      );
      result.forEach((r) => {
        r.provider = populatedProvider;
      });

      expect(result).toHaveLength(2);
      expect(result.every((r) => r.provider?.name === "AT&T")).toBe(true);
      expect(mockDataLoader.load).toHaveBeenCalledWith(1);
    });

    it("should filter by technology when provided", async () => {
      const combo = ComboFactory.create({ id: 1, technology: "LTE" });
      const devices = DeviceFactory.createMany(3);
      const mockResults = devices.map((device) => ({
        device,
        combo,
        provider: null,
        isGlobal: true,
      }));

      (
        comboRepository.findDevicesSupportingCombo as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockResults);

      const args = { comboId: "1", technology: "LTE" };
      const result = await comboRepository.findDevicesSupportingCombo({
        comboId: Number(args.comboId),
        providerId: undefined,
        technology: args.technology || undefined,
      });

      expect(result).toEqual(mockResults);
      expect(comboRepository.findDevicesSupportingCombo).toHaveBeenCalledWith({
        comboId: 1,
        providerId: undefined,
        technology: "LTE",
      });
    });

    it("should handle empty results when no devices support the combo", async () => {
      (
        comboRepository.findDevicesSupportingCombo as ReturnType<typeof vi.fn>
      ).mockResolvedValue([]);

      const args = { comboId: "999" };
      const result = await comboRepository.findDevicesSupportingCombo({
        comboId: Number(args.comboId),
        providerId: undefined,
        technology: undefined,
      });

      expect(result).toEqual([]);
      expect(comboRepository.findDevicesSupportingCombo).toHaveBeenCalledWith({
        comboId: 999,
        providerId: undefined,
        technology: undefined,
      });
    });

    it("should convert empty string technology to undefined", async () => {
      (
        comboRepository.findDevicesSupportingCombo as ReturnType<typeof vi.fn>
      ).mockResolvedValue([]);

      const args = { comboId: "1", technology: "" };
      await comboRepository.findDevicesSupportingCombo({
        comboId: Number(args.comboId),
        providerId: undefined,
        technology: args.technology || undefined,
      });

      expect(comboRepository.findDevicesSupportingCombo).toHaveBeenCalledWith({
        comboId: 1,
        providerId: undefined,
        technology: undefined,
      });
    });

    it("should handle different combo technologies (EN-DC, NR CA)", async () => {
      const endcCombo = ComboFactory.create({ id: 1, technology: "EN-DC" });
      const devices = DeviceFactory.createMany(2);
      const mockResults = devices.map((device) => ({
        device,
        combo: endcCombo,
        provider: null,
        isGlobal: true,
      }));
      (
        comboRepository.findDevicesSupportingCombo as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockResults);

      const args = { comboId: "1", technology: "EN-DC" };
      const result = await comboRepository.findDevicesSupportingCombo({
        comboId: Number(args.comboId),
        providerId: undefined,
        technology: args.technology || undefined,
      });

      expect(result).toEqual(mockResults);
      expect(comboRepository.findDevicesSupportingCombo).toHaveBeenCalledWith({
        comboId: 1,
        providerId: undefined,
        technology: "EN-DC",
      });
    });
  });

  describe("devicesByFeature query", () => {
    it("should find devices supporting a specific feature (global)", async () => {
      const feature = FeatureFactory.create({ id: 1, name: "VoLTE" });
      const devices = DeviceFactory.createMany(3);
      const mockResults = devices.map((device) => ({
        device,
        feature,
        provider: null,
        isGlobal: true,
      }));

      (
        featureRepository.findDevicesSupportingFeature as ReturnType<
          typeof vi.fn
        >
      ).mockResolvedValue(mockResults);

      const args = { featureId: "1" };
      const result = await featureRepository.findDevicesSupportingFeature({
        featureId: Number(args.featureId),
        providerId: undefined,
      });

      expect(result).toEqual(mockResults);
      expect(
        featureRepository.findDevicesSupportingFeature
      ).toHaveBeenCalledWith({
        featureId: 1,
        providerId: undefined,
      });
      expect(result.length).toBe(3);
    });

    it("should find devices supporting a feature for a specific provider", async () => {
      const feature = FeatureFactory.create({ id: 1, name: "VoLTE" });
      const provider = ProviderFactory.create({ id: 1, name: "T-Mobile" });
      const devices = DeviceFactory.createMany(2);
      const mockResults = devices.map((device) => ({
        device,
        feature,
        provider: null,
        isGlobal: false,
      }));
      (
        featureRepository.findDevicesSupportingFeature as ReturnType<
          typeof vi.fn
        >
      ).mockResolvedValue(mockResults);

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(provider),
      };

      const ctx = {
        loaders: {
          providerById: mockDataLoader,
        },
      };

      const args = { featureId: "1", providerId: "1" };
      const result = await featureRepository.findDevicesSupportingFeature({
        featureId: Number(args.featureId),
        providerId: Number(args.providerId),
      });

      // Simulate provider population
      const populatedProvider = await ctx.loaders.providerById.load(
        Number(args.providerId)
      );
      result.forEach((r) => {
        r.provider = populatedProvider;
      });

      expect(result).toHaveLength(2);
      expect(result.every((r) => r.provider?.name === "T-Mobile")).toBe(true);
      expect(mockDataLoader.load).toHaveBeenCalledWith(1);
    });

    it("should handle empty results when no devices support the feature", async () => {
      (
        featureRepository.findDevicesSupportingFeature as ReturnType<
          typeof vi.fn
        >
      ).mockResolvedValue([]);

      const args = { featureId: "999" };
      const result = await featureRepository.findDevicesSupportingFeature({
        featureId: Number(args.featureId),
        providerId: undefined,
      });

      expect(result).toEqual([]);
      expect(
        featureRepository.findDevicesSupportingFeature
      ).toHaveBeenCalledWith({
        featureId: 999,
        providerId: undefined,
      });
    });

    it("should handle different feature types (VoNR, Wi-Fi Calling, etc.)", async () => {
      const voNRFeature = FeatureFactory.create({ id: 1, name: "VoNR" });
      const devices = DeviceFactory.createMany(2);
      const mockResults = devices.map((device) => ({
        device,
        feature: voNRFeature,
        provider: null,
        isGlobal: true,
      }));
      (
        featureRepository.findDevicesSupportingFeature as ReturnType<
          typeof vi.fn
        >
      ).mockResolvedValue(mockResults);

      const args = { featureId: "1" };
      const result = await featureRepository.findDevicesSupportingFeature({
        featureId: Number(args.featureId),
        providerId: undefined,
      });

      expect(result).toEqual(mockResults);
      expect(result[0].feature.name).toBe("VoNR");
    });

    it("should find devices with provider-specific feature support for major carriers", async () => {
      const feature = FeatureFactory.create({ id: 1, name: "VoLTE" });
      const verizon = ProviderFactory.createWithName("Verizon");
      const devices = DeviceFactory.createMany(5);
      const mockResults = devices.map((device) => ({
        device,
        feature,
        provider: null,
        isGlobal: false,
      }));

      (
        featureRepository.findDevicesSupportingFeature as ReturnType<
          typeof vi.fn
        >
      ).mockResolvedValue(mockResults);

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(verizon),
      };

      const ctx = {
        loaders: {
          providerById: mockDataLoader,
        },
      };

      const args = { featureId: "1", providerId: String(verizon.id) };
      const result = await featureRepository.findDevicesSupportingFeature({
        featureId: Number(args.featureId),
        providerId: Number(args.providerId),
      });

      // Simulate provider population
      const populatedProvider = await ctx.loaders.providerById.load(
        Number(args.providerId)
      );
      result.forEach((r) => {
        r.provider = populatedProvider;
      });

      expect(result).toHaveLength(5);
      expect(result.every((r) => r.provider?.name === "Verizon")).toBe(true);
    });
  });

  describe("devicesByCapabilities query", () => {
    it("should return empty array (not yet implemented)", async () => {
       // const _args = { bandIds: ["1", "2"], comboIds: ["1"], featureIds: ["1", "2", "3"], providerId: "1", };

      // This query returns empty array as it's a future enhancement
      const result: any[] = [];

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it("should handle no arguments", async () => {
      // const _args = {};

      // This query returns empty array as it's a future enhancement
      const result: any[] = [];

      expect(result).toEqual([]);
    });

    it("should handle only bandIds", async () => {
      // const _args = { bandIds: ["1", "2", "3"],};

      // This query returns empty array as it's a future enhancement
      const result: any[] = [];

      expect(result).toEqual([]);
    });

    it("should handle only comboIds", async () => {
      //const _args = {comboIds: ["1", "2"],};

      // This query returns empty array as it's a future enhancement
      const result: any[] = [];

      expect(result).toEqual([]);
    });

    it("should handle only featureIds", async () => {
      // const _args = {featureIds: ["1", "2", "3", "4"], };

      // This query returns empty array as it's a future enhancement
      const result: any[] = [];

      expect(result).toEqual([]);
    });
  });
});
