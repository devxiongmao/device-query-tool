import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { BandRepository } from "../../src/repositories/band.repository";
import { BandFactory } from "../factories/band.factory";
import { DeviceCapabilityFactory } from "../factories/device-capability.factory";
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

describe("BandRepository", () => {
  let repository: BandRepository;
  let mockSelect: any;
  let mockSelectDistinct: any;

  beforeEach(() => {
    BandFactory.reset();
    DeviceFactory.reset();
    SoftwareFactory.reset();
    repository = new BandRepository();

    // Setup chainable mocks for regular select
    mockSelect = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      then: vi.fn().mockReturnThis(),
    };

    // Setup chainable mocks for selectDistinct
    mockSelectDistinct = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
    };

    vi.mocked(db.select).mockReturnValue(mockSelect);
    vi.mocked(db.selectDistinct).mockReturnValue(mockSelectDistinct);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("should return band when found", async () => {
      const mockBand = BandFactory.create({ id: 1 });
      mockSelect.limit.mockResolvedValue([mockBand]);

      const result = await repository.findById(1);

      expect(result).toEqual(mockBand);
      expect(db.select).toHaveBeenCalled();
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockSelect.limit).toHaveBeenCalledWith(1);
    });

    it("should return null when band not found", async () => {
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

    it("should return multiple bands for valid IDs", async () => {
      const mockBands = BandFactory.createMany(3);
      mockSelect.where.mockResolvedValue(mockBands);

      const result = await repository.findByIds([1, 2, 3]);

      expect(result).toEqual(mockBands);
      expect(result).toHaveLength(3);
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should handle single ID in array", async () => {
      const mockBand = BandFactory.create({ id: 1 });
      mockSelect.where.mockResolvedValue([mockBand]);

      const result = await repository.findByIds([1]);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockBand);
    });

    it("should handle large array of IDs", async () => {
      const ids = Array.from({ length: 100 }, (_, i) => i + 1);
      const mockBands = BandFactory.createMany(100);
      mockSelect.where.mockResolvedValue(mockBands);

      const result = await repository.findByIds(ids);

      expect(result).toHaveLength(100);
    });
  });

  describe("search", () => {
    it("should return all bands when no filters provided", async () => {
      const mockBands = BandFactory.createMany(5);
      mockSelect.orderBy.mockResolvedValue(mockBands);

      const result = await repository.search();

      expect(result).toEqual(mockBands);
      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should filter by technology", async () => {
      const lteBands = BandFactory.createManyForTechnology("LTE", 3);
      mockSelect.orderBy.mockResolvedValue(lteBands);

      const result = await repository.search({ technology: "LTE" });

      expect(result.every((b) => b.technology === "LTE")).toBe(true);
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should filter by band number using LIKE", async () => {
      const band = BandFactory.create({ bandNumber: "66" });
      mockSelect.orderBy.mockResolvedValue([band]);

      const result = await repository.search({ bandNumber: "66" });

      expect(result[0].bandNumber).toBe("66");
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should combine technology and band number filters", async () => {
      const band = BandFactory.create({
        technology: "5G NR",
        bandNumber: "n77",
      });
      mockSelect.orderBy.mockResolvedValue([band]);

      const result = await repository.search({
        technology: "5G NR",
        bandNumber: "n77",
      });

      expect(result[0].technology).toBe("5G NR");
      expect(result[0].bandNumber).toBe("n77");
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should handle partial band number matches", async () => {
      const bands = [
        BandFactory.create({ bandNumber: "n77" }),
        BandFactory.create({ bandNumber: "n78" }),
      ];
      mockSelect.orderBy.mockResolvedValue(bands);

      const result = await repository.search({ bandNumber: "n7" });

      expect(result).toHaveLength(2);
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should return empty array when no bands match filters", async () => {
      mockSelect.orderBy.mockResolvedValue([]);

      const result = await repository.search({ technology: "NonExistentTech" });

      expect(result).toEqual([]);
    });

    it("should order results by technology and band number", async () => {
      const mockBands = BandFactory.createMany(5);
      mockSelect.orderBy.mockResolvedValue(mockBands);

      await repository.search();

      expect(mockSelect.orderBy).toHaveBeenCalled();
    });
  });

  describe("findAll", () => {
    it("should return all bands ordered by technology and band number", async () => {
      const mockBands = [
        BandFactory.createWithTechnology("LTE"),
        BandFactory.createWithTechnology("5G NR"),
        BandFactory.createWithTechnology("UMTS"),
      ];
      mockSelect.orderBy.mockResolvedValue(mockBands);

      const result = await repository.findAll();

      expect(result).toEqual(mockBands);
      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should return empty array when no bands exist", async () => {
      mockSelect.orderBy.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe("findDevicesSupportingBand", () => {
    const bandId = 1;

    describe("global capability queries (no providerId)", () => {
      it("should return devices supporting a band globally", async () => {
        const device1 = DeviceFactory.create({ id: 1 });
        const device2 = DeviceFactory.create({ id: 2 });
        const software1 = SoftwareFactory.create({ deviceId: 1 });
        const software2 = SoftwareFactory.create({ deviceId: 2 });

        const mockResults = [
          { device: device1, software: software1 },
          { device: device2, software: software2 },
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingBand({ bandId });

        expect(result).toHaveLength(2);
        expect(result[0].supportStatus).toBe("global");
        expect(result[0].provider).toBeNull();
        expect(result[0].device.id).toBe(1);
        expect(result[1].device.id).toBe(2);
      });

      it("should group software by device", async () => {
        const device = DeviceFactory.create({ id: 1 });
        const software1 = SoftwareFactory.create({ id: 1, deviceId: 1 });
        const software2 = SoftwareFactory.create({ id: 2, deviceId: 1 });

        const mockResults = [
          { device, software: software1 },
          { device, software: software2 },
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingBand({ bandId });

        expect(result).toHaveLength(1);
        expect(result[0].software).toHaveLength(2);
        expect(result[0].software[0].id).toBe(1);
        expect(result[0].software[1].id).toBe(2);
      });

      it("should filter by technology when provided", async () => {
        const device = DeviceFactory.create();
        const software = SoftwareFactory.create();
        const mockResults = [{ device, software }];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingBand({
          bandId,
          technology: "5G NR",
        });

        expect(mockSelectDistinct.where).toHaveBeenCalled();
        expect(result).toHaveLength(1);
      });

      it("should return empty array when no devices support the band", async () => {
        mockSelectDistinct.orderBy.mockResolvedValue([]);

        const result = await repository.findDevicesSupportingBand({ bandId });

        expect(result).toEqual([]);
      });

      it("should deduplicate software entries for same device", async () => {
        const device = DeviceFactory.create({ id: 1 });
        const software = SoftwareFactory.create({ id: 1, deviceId: 1 });

        // Simulating duplicate rows from join
        const mockResults = [
          { device, software },
          { device, software }, // duplicate
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingBand({ bandId });

        expect(result).toHaveLength(1);
        expect(result[0].software).toHaveLength(1);
      });
    });

    describe("provider-specific capability queries", () => {
      const providerId = 10;

      it("should return devices supporting a band for specific provider", async () => {
        const device1 = DeviceFactory.create({ id: 1 });
        const device2 = DeviceFactory.create({ id: 2 });
        const software1 = SoftwareFactory.create({ deviceId: 1 });
        const software2 = SoftwareFactory.create({ deviceId: 2 });

        const mockResults = [
          { device: device1, software: software1, providerId },
          { device: device2, software: software2, providerId },
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingBand({
          bandId,
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

        const result = await repository.findDevicesSupportingBand({
          bandId,
          providerId,
        });

        expect(result).toHaveLength(1);
        expect(result[0].software).toHaveLength(2);
      });

      it("should filter by technology for provider-specific query", async () => {
        const device = DeviceFactory.create();
        const software = SoftwareFactory.create();
        const mockResults = [{ device, software, providerId }];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingBand({
          bandId,
          providerId,
          technology: "LTE",
        });

        expect(mockSelectDistinct.where).toHaveBeenCalled();
        expect(result[0].supportStatus).toBe("provider-specific");
      });

      it("should deduplicate software for provider-specific query", async () => {
        const device = DeviceFactory.create({ id: 1 });
        const software = SoftwareFactory.create({ id: 1, deviceId: 1 });

        const mockResults = [
          { device, software, providerId },
          { device, software, providerId }, // duplicate
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingBand({
          bandId,
          providerId,
        });

        expect(result).toHaveLength(1);
        expect(result[0].software).toHaveLength(1);
      });
    });
  });

  describe("findByDeviceSoftware", () => {
    const deviceId = 1;
    const softwareId = 1;

    it("should return bands for device/software combination", async () => {
      const bands = BandFactory.createMany(3);
      const mockResults = bands.map((band) => ({ band }));
      mockSelect.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftware(
        deviceId,
        softwareId
      );

      expect(result).toEqual(bands);
      expect(mockSelect.innerJoin).toHaveBeenCalled();
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should filter by technology when provided", async () => {
      const bands = BandFactory.createManyForTechnology("LTE", 2);
      const mockResults = bands.map((band) => ({ band }));
      mockSelect.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftware(
        deviceId,
        softwareId,
        "LTE"
      );

      expect(result).toEqual(bands);
      expect(result.every((b) => b.technology === "LTE")).toBe(true);
    });

    it("should return empty array when no bands found", async () => {
      mockSelect.then.mockImplementation((fn: any) => fn([]));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftware(
        deviceId,
        softwareId
      );

      expect(result).toEqual([]);
    });

    it("should handle multiple bands across technologies", async () => {
      const bands = [
        BandFactory.createWithTechnology("LTE"),
        BandFactory.createWithTechnology("5G NR"),
      ];
      const mockResults = bands.map((band) => ({ band }));
      mockSelect.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftware(
        deviceId,
        softwareId
      );

      expect(result).toHaveLength(2);
    });
  });

  describe("findByDeviceSoftwareProvider", () => {
    const deviceId = 1;
    const softwareId = 1;
    const providerId = 10;

    it("should return bands for device/software/provider combination", async () => {
      const bands = BandFactory.createMany(3);
      const mockResults = bands.map((band) => ({ band }));
      mockSelect.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftwareProvider(
        deviceId,
        softwareId,
        providerId
      );

      expect(result).toEqual(bands);
      expect(mockSelect.innerJoin).toHaveBeenCalled();
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should filter by technology when provided", async () => {
      const bands = BandFactory.createManyForTechnology("5G NR", 2);
      const mockResults = bands.map((band) => ({ band }));
      mockSelect.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftwareProvider(
        deviceId,
        softwareId,
        providerId,
        "5G NR"
      );

      expect(result).toEqual(bands);
      expect(result.every((b) => b.technology === "5G NR")).toBe(true);
    });

    it("should return empty array when no bands found", async () => {
      mockSelect.then.mockImplementation((fn: any) => fn([]));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftwareProvider(
        deviceId,
        softwareId,
        providerId
      );

      expect(result).toEqual([]);
    });

    it("should handle provider-specific band configurations", async () => {
      const bands = BandFactory.createMany(5);
      const mockResults = bands.map((band) => ({ band }));
      mockSelect.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftwareProvider(
        deviceId,
        softwareId,
        providerId
      );

      expect(result).toHaveLength(5);
    });
  });

  describe("edge cases", () => {
    it("should handle bands with special characters in band number", async () => {
      const band = BandFactory.create({ bandNumber: "n77/n78" });
      mockSelect.limit.mockResolvedValue([band]);

      const result = await repository.findById(1);

      expect(result?.bandNumber).toBe("n77/n78");
    });

    it("should handle case-sensitive technology filtering", async () => {
      const bands = BandFactory.createManyForTechnology("5G NR", 2);
      mockSelect.orderBy.mockResolvedValue(bands);

      const result = await repository.search({ technology: "5G NR" });

      expect(result.every((b) => b.technology === "5G NR")).toBe(true);
    });

    it("should handle very large result sets for findDevicesSupportingBand", async () => {
      const devices = Array.from({ length: 100 }, (_, i) => {
        const device = DeviceFactory.create({ id: i + 1 });
        const software = SoftwareFactory.create({ deviceId: i + 1 });
        return { device, software };
      });
      mockSelectDistinct.orderBy.mockResolvedValue(devices);

      const result = await repository.findDevicesSupportingBand({ bandId: 1 });

      expect(result).toHaveLength(100);
    });
  });
});
