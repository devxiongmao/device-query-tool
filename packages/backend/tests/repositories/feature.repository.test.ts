import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { FeatureRepository } from "../../src/repositories/feature.repository";
import { FeatureFactory } from "../factories/feature.factory";
import { DeviceFactory } from "../factories/device.factory";
import { SoftwareFactory } from "../factories/software.factory";
import { db } from "../../src/db/client";

// Mock the database
vi.mock("../../src/db/client", () => ({
  db: {
    select: vi.fn(),
    selectDistinct: vi.fn(),
  },
}));

describe("FeatureRepository", () => {
  let repository: FeatureRepository;
  let mockSelect: any;
  let mockSelectDistinct: any;

  beforeEach(() => {
    FeatureFactory.reset();
    DeviceFactory.reset();
    SoftwareFactory.reset();
    repository = new FeatureRepository();

    // Setup chainable mocks for regular select
    mockSelect = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
    };

    // Setup chainable mocks for selectDistinct
    mockSelectDistinct = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      then: vi.fn().mockReturnThis(),
    };

    vi.mocked(db.select).mockReturnValue(mockSelect);
    vi.mocked(db.selectDistinct).mockReturnValue(mockSelectDistinct);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("should return feature when found", async () => {
      const mockFeature = FeatureFactory.create({ id: 1 });
      mockSelect.limit.mockResolvedValue([mockFeature]);

      const result = await repository.findById(1);

      expect(result).toEqual(mockFeature);
      expect(db.select).toHaveBeenCalled();
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockSelect.limit).toHaveBeenCalledWith(1);
    });

    it("should return null when feature not found", async () => {
      mockSelect.limit.mockResolvedValue([]);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });

    it("should handle valid ID parameter", async () => {
      mockSelect.limit.mockResolvedValue([]);

      await repository.findById(42);

      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockSelect.limit).toHaveBeenCalledWith(1);
    });
  });

  describe("findByIds", () => {
    it("should return empty array when given empty array", async () => {
      const result = await repository.findByIds([]);

      expect(result).toEqual([]);
      expect(db.select).not.toHaveBeenCalled();
    });

    it("should return multiple features for valid IDs", async () => {
      const mockFeatures = FeatureFactory.createMany(3);
      mockSelect.where.mockResolvedValue(mockFeatures);

      const result = await repository.findByIds([1, 2, 3]);

      expect(result).toEqual(mockFeatures);
      expect(result).toHaveLength(3);
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should handle single ID in array", async () => {
      const mockFeature = FeatureFactory.create({ id: 1 });
      mockSelect.where.mockResolvedValue([mockFeature]);

      const result = await repository.findByIds([1]);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockFeature);
    });

    it("should handle large array of IDs", async () => {
      const ids = Array.from({ length: 100 }, (_, i) => i + 1);
      const mockFeatures = FeatureFactory.createMany(100);
      mockSelect.where.mockResolvedValue(mockFeatures);

      const result = await repository.findByIds(ids);

      expect(result).toHaveLength(100);
    });
  });

  describe("search", () => {
    it("should return all features when no filters provided", async () => {
      const mockFeatures = FeatureFactory.createMany(5);
      mockSelect.orderBy.mockResolvedValue(mockFeatures);

      const result = await repository.search();

      expect(result).toEqual(mockFeatures);
      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should filter by name using LIKE", async () => {
      const feature = FeatureFactory.createWithName("VoLTE");
      mockSelect.orderBy.mockResolvedValue([feature]);

      const result = await repository.search({ name: "VoLTE" });

      expect(result[0].name).toBe("VoLTE");
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should handle partial name matches", async () => {
      const features = [
        FeatureFactory.createWithName("VoLTE"),
        FeatureFactory.createWithName("VoNR"),
      ];
      mockSelect.orderBy.mockResolvedValue(features);

      const result = await repository.search({ name: "Vo" });

      expect(result).toHaveLength(2);
      expect(result.every((f) => f.name.includes("Vo"))).toBe(true);
    });

    it("should return empty array when no features match filter", async () => {
      mockSelect.orderBy.mockResolvedValue([]);

      const result = await repository.search({ name: "NonExistentFeature" });

      expect(result).toEqual([]);
    });

    it("should order results by name", async () => {
      const mockFeatures = FeatureFactory.createMany(5);
      mockSelect.orderBy.mockResolvedValue(mockFeatures);

      await repository.search();

      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should handle empty filter object", async () => {
      const mockFeatures = FeatureFactory.createMany(3);
      mockSelect.orderBy.mockResolvedValue(mockFeatures);

      const result = await repository.search({});

      expect(result).toEqual(mockFeatures);
    });

    it("should handle case-sensitive searches", async () => {
      const feature = FeatureFactory.createWithName("VoLTE");
      mockSelect.orderBy.mockResolvedValue([feature]);

      const result = await repository.search({ name: "volte" });

      expect(mockSelect.where).toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("should return all features ordered by name", async () => {
      const mockFeatures = [
        FeatureFactory.createWithName("eSIM"),
        FeatureFactory.createWithName("VoLTE"),
        FeatureFactory.createWithName("Wi-Fi Calling"),
      ];
      mockSelect.orderBy.mockResolvedValue(mockFeatures);

      const result = await repository.findAll();

      expect(result).toEqual(mockFeatures);
      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should return empty array when no features exist", async () => {
      mockSelect.orderBy.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });

    it("should handle large number of features", async () => {
      const mockFeatures = FeatureFactory.createMany(100);
      mockSelect.orderBy.mockResolvedValue(mockFeatures);

      const result = await repository.findAll();

      expect(result).toHaveLength(100);
    });
  });

  describe("findDevicesSupportingFeature", () => {
    const featureId = 1;

    describe("global feature queries (no providerId)", () => {
      it("should return devices supporting a feature globally", async () => {
        const device1 = DeviceFactory.create({ id: 1 });
        const device2 = DeviceFactory.create({ id: 2 });
        const software1 = SoftwareFactory.create({ deviceId: 1 });
        const software2 = SoftwareFactory.create({ deviceId: 2 });

        const mockResults = [
          { device: device1, software: software1, providerId: 1 },
          { device: device1, software: software1, providerId: 2 },
          { device: device2, software: software2, providerId: 1 },
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingFeature({
          featureId,
        });

        expect(result).toHaveLength(2);
        expect(result[0].supportStatus).toBe("global");
        expect(result[0].provider).toBeNull();
        expect(result[0].device.id).toBe(1);
        expect(result[1].device.id).toBe(2);
      });

      it("should group software by device for global query", async () => {
        const device = DeviceFactory.create({ id: 1 });
        const software1 = SoftwareFactory.create({ id: 1, deviceId: 1 });
        const software2 = SoftwareFactory.create({ id: 2, deviceId: 1 });

        const mockResults = [
          { device, software: software1, providerId: 1 },
          { device, software: software2, providerId: 1 },
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingFeature({
          featureId,
        });

        expect(result).toHaveLength(1);
        expect(result[0].software).toHaveLength(2);
        expect(result[0].software[0].id).toBe(1);
        expect(result[0].software[1].id).toBe(2);
      });

      it("should deduplicate software entries for same device", async () => {
        const device = DeviceFactory.create({ id: 1 });
        const software = SoftwareFactory.create({ id: 1, deviceId: 1 });

        // Simulating duplicate rows from multiple providers
        const mockResults = [
          { device, software, providerId: 1 },
          { device, software, providerId: 2 },
          { device, software, providerId: 3 },
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingFeature({
          featureId,
        });

        expect(result).toHaveLength(1);
        expect(result[0].software).toHaveLength(1);
      });

      it("should return empty array when no devices support the feature", async () => {
        mockSelectDistinct.orderBy.mockResolvedValue([]);

        const result = await repository.findDevicesSupportingFeature({
          featureId,
        });

        expect(result).toEqual([]);
      });

      it("should handle multiple devices with varying software counts", async () => {
        const device1 = DeviceFactory.create({ id: 1 });
        const device2 = DeviceFactory.create({ id: 2 });
        const software1 = SoftwareFactory.create({ id: 1, deviceId: 1 });
        const software2 = SoftwareFactory.create({ id: 2, deviceId: 1 });
        const software3 = SoftwareFactory.create({ id: 3, deviceId: 2 });

        const mockResults = [
          { device: device1, software: software1, providerId: 1 },
          { device: device1, software: software2, providerId: 1 },
          { device: device2, software: software3, providerId: 1 },
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingFeature({
          featureId,
        });

        expect(result).toHaveLength(2);
        expect(result[0].software).toHaveLength(2);
        expect(result[1].software).toHaveLength(1);
      });
    });

    describe("provider-specific feature queries", () => {
      const providerId = 10;

      it("should return devices supporting a feature for specific provider", async () => {
        const device1 = DeviceFactory.create({ id: 1 });
        const device2 = DeviceFactory.create({ id: 2 });
        const software1 = SoftwareFactory.create({ deviceId: 1 });
        const software2 = SoftwareFactory.create({ deviceId: 2 });

        const mockResults = [
          { device: device1, software: software1, providerId },
          { device: device2, software: software2, providerId },
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingFeature({
          featureId,
          providerId,
        });

        expect(result).toHaveLength(2);
        expect(result[0].supportStatus).toBe("provider-specific");
        expect(result[0].provider).toEqual({ providerId });
        expect(result[1].provider).toEqual({ providerId });
      });

      it("should group software by device for provider-specific query", async () => {
        const device = DeviceFactory.create({ id: 1 });
        const software1 = SoftwareFactory.create({ id: 1, deviceId: 1 });
        const software2 = SoftwareFactory.create({ id: 2, deviceId: 1 });

        const mockResults = [
          { device, software: software1, providerId },
          { device, software: software2, providerId },
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingFeature({
          featureId,
          providerId,
        });

        expect(result).toHaveLength(1);
        expect(result[0].software).toHaveLength(2);
      });

      it("should deduplicate software for provider-specific query", async () => {
        const device = DeviceFactory.create({ id: 1 });
        const software = SoftwareFactory.create({ id: 1, deviceId: 1 });

        const mockResults = [
          { device, software, providerId },
          { device, software, providerId }, // duplicate
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingFeature({
          featureId,
          providerId,
        });

        expect(result).toHaveLength(1);
        expect(result[0].software).toHaveLength(1);
      });

      it("should return empty array when no devices match provider criteria", async () => {
        mockSelectDistinct.orderBy.mockResolvedValue([]);

        const result = await repository.findDevicesSupportingFeature({
          featureId,
          providerId,
        });

        expect(result).toEqual([]);
      });

      it("should only include devices for the specified provider", async () => {
        const device1 = DeviceFactory.create({ id: 1 });
        const device2 = DeviceFactory.create({ id: 2 });
        const software1 = SoftwareFactory.create({ deviceId: 1 });
        const software2 = SoftwareFactory.create({ deviceId: 2 });

        // Only device1 supports feature on provider 10
        const mockResults = [
          { device: device1, software: software1, providerId: 10 },
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingFeature({
          featureId,
          providerId: 10,
        });

        expect(result).toHaveLength(1);
        expect(result[0].device.id).toBe(1);
      });
    });
  });

  describe("findByDeviceSoftwareProvider", () => {
    const deviceId = 1;
    const softwareId = 1;

    it("should return features for device/software without provider filter", async () => {
      const features = FeatureFactory.createMany(3);
      const mockResults = features.map((feature) => ({ feature }));
      mockSelectDistinct.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelectDistinct.where.mockResolvedValue(mockSelectDistinct);

      const result = await repository.findByDeviceSoftwareProvider(
        deviceId,
        softwareId
      );

      expect(result).toEqual(features);
      expect(mockSelectDistinct.innerJoin).toHaveBeenCalled();
      expect(mockSelectDistinct.where).toHaveBeenCalled();
    });

    it("should filter by provider when provided", async () => {
      const features = FeatureFactory.createMany(2);
      const mockResults = features.map((feature) => ({ feature }));
      mockSelectDistinct.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelectDistinct.where.mockResolvedValue(mockSelectDistinct);

      const result = await repository.findByDeviceSoftwareProvider(
        deviceId,
        softwareId,
        10
      );

      expect(result).toEqual(features);
      expect(mockSelectDistinct.where).toHaveBeenCalled();
    });

    it("should return empty array when no features found", async () => {
      mockSelectDistinct.then.mockImplementation((fn: any) => fn([]));
      mockSelectDistinct.where.mockResolvedValue(mockSelectDistinct);

      const result = await repository.findByDeviceSoftwareProvider(
        deviceId,
        softwareId
      );

      expect(result).toEqual([]);
    });

    it("should return distinct features only", async () => {
      const feature = FeatureFactory.create({ id: 1, name: "VoLTE" });
      const mockResults = [{ feature }, { feature }]; // duplicate
      mockSelectDistinct.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelectDistinct.where.mockResolvedValue(mockSelectDistinct);

      const result = await repository.findByDeviceSoftwareProvider(
        deviceId,
        softwareId
      );

      expect(result).toHaveLength(2); // selectDistinct should handle this
    });

    it("should handle device/software with many features", async () => {
      const features = FeatureFactory.createMany(15);
      const mockResults = features.map((feature) => ({ feature }));
      mockSelectDistinct.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelectDistinct.where.mockResolvedValue(mockSelectDistinct);

      const result = await repository.findByDeviceSoftwareProvider(
        deviceId,
        softwareId
      );

      expect(result).toHaveLength(15);
    });

    it("should differentiate features by provider", async () => {
      const voiceFeatures = FeatureFactory.createVoiceFeatures();
      const mockResults = voiceFeatures.map((feature) => ({ feature }));
      mockSelectDistinct.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelectDistinct.where.mockResolvedValue(mockSelectDistinct);

      const result = await repository.findByDeviceSoftwareProvider(
        deviceId,
        softwareId,
        10
      );

      expect(result.length).toBeGreaterThan(0);
      expect(mockSelectDistinct.where).toHaveBeenCalled();
    });

    it("should handle optional providerId parameter", async () => {
      const features = FeatureFactory.createMany(3);
      const mockResults = features.map((feature) => ({ feature }));
      mockSelectDistinct.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelectDistinct.where.mockResolvedValue(mockSelectDistinct);

      const result = await repository.findByDeviceSoftwareProvider(
        deviceId,
        softwareId,
        undefined
      );

      expect(result).toEqual(features);
    });
  });

  describe("edge cases", () => {
    it("should handle features with special characters in name", async () => {
      const feature = FeatureFactory.create({ name: "Wi-Fi Calling (VoWiFi)" });
      mockSelect.limit.mockResolvedValue([feature]);

      const result = await repository.findById(1);

      expect(result?.name).toBe("Wi-Fi Calling (VoWiFi)");
    });

    it("should handle features with numbers in name", async () => {
      const feature = FeatureFactory.create({ name: "256 QAM" });
      mockSelect.limit.mockResolvedValue([feature]);

      const result = await repository.findById(1);

      expect(result?.name).toBe("256 QAM");
    });

    it("should handle very long feature names", async () => {
      const longName =
        "Enhanced Multi-User Multiple Input Multiple Output with Beamforming";
      const feature = FeatureFactory.create({ name: longName });
      mockSelect.limit.mockResolvedValue([feature]);

      const result = await repository.findById(1);

      expect(result?.name).toBe(longName);
    });

    it("should handle features with acronyms", async () => {
      const features = [
        FeatureFactory.create({ name: "HPUE" }),
        FeatureFactory.create({ name: "LAA" }),
        FeatureFactory.create({ name: "NR-DC" }),
      ];
      mockSelect.where.mockResolvedValue(features);

      const result = await repository.findByIds([1, 2, 3]);

      expect(result).toHaveLength(3);
    });

    it("should handle very large result sets for findDevicesSupportingFeature", async () => {
      const devices = Array.from({ length: 100 }, (_, i) => {
        const device = DeviceFactory.create({ id: i + 1 });
        const software = SoftwareFactory.create({ deviceId: i + 1 });
        return { device, software, providerId: 1 };
      });
      mockSelectDistinct.orderBy.mockResolvedValue(devices);

      const result = await repository.findDevicesSupportingFeature({
        featureId: 1,
      });

      expect(result).toHaveLength(100);
    });

    it("should handle cross-provider feature support correctly", async () => {
      const device = DeviceFactory.create({ id: 1 });
      const software = SoftwareFactory.create({ deviceId: 1 });

      // Device supports feature on multiple providers
      const mockResults = [
        { device, software, providerId: 1 },
        { device, software, providerId: 2 },
        { device, software, providerId: 3 },
      ];
      mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

      const resultGlobal = await repository.findDevicesSupportingFeature({
        featureId: 1,
      });

      expect(resultGlobal).toHaveLength(1);
      expect(resultGlobal[0].supportStatus).toBe("global");
    });
  });
});
