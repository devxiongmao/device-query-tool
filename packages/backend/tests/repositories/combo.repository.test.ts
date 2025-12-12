import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { ComboRepository } from "../../src/repositories/combo.repository";
import { ComboFactory } from "../factories/combo.factory";
import { BandFactory } from "../factories/band.factory";
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

describe("ComboRepository", () => {
  let repository: ComboRepository;
  let mockSelect: any;
  let mockSelectDistinct: any;

  beforeEach(() => {
    ComboFactory.reset();
    BandFactory.reset();
    DeviceFactory.reset();
    SoftwareFactory.reset();
    repository = new ComboRepository();

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

    (db.select as ReturnType<typeof vi.fn>).mockReturnValue(mockSelect);
    (db.selectDistinct as ReturnType<typeof vi.fn>).mockReturnValue(mockSelectDistinct);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("should return combo when found", async () => {
      const mockCombo = ComboFactory.create({ id: 1 });
      mockSelect.limit.mockResolvedValue([mockCombo]);

      const result = await repository.findById(1);

      expect(result).toEqual(mockCombo);
      expect(db.select).toHaveBeenCalled();
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockSelect.limit).toHaveBeenCalledWith(1);
    });

    it("should return null when combo not found", async () => {
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

    it("should return multiple combos for valid IDs", async () => {
      const mockCombos = ComboFactory.createMany(3);
      mockSelect.where.mockResolvedValue(mockCombos);

      const result = await repository.findByIds([1, 2, 3]);

      expect(result).toEqual(mockCombos);
      expect(result).toHaveLength(3);
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should handle single ID in array", async () => {
      const mockCombo = ComboFactory.create({ id: 1 });
      mockSelect.where.mockResolvedValue([mockCombo]);

      const result = await repository.findByIds([1]);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockCombo);
    });

    it("should handle large array of IDs", async () => {
      const ids = Array.from({ length: 100 }, (_, i) => i + 1);
      const mockCombos = ComboFactory.createMany(100);
      mockSelect.where.mockResolvedValue(mockCombos);

      const result = await repository.findByIds(ids);

      expect(result).toHaveLength(100);
    });
  });

  describe("search", () => {
    it("should return all combos when no filters provided", async () => {
      const mockCombos = ComboFactory.createMany(5);
      mockSelect.orderBy.mockResolvedValue(mockCombos);

      const result = await repository.search();

      expect(result).toEqual(mockCombos);
      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should filter by technology", async () => {
      const lteCombos = ComboFactory.createManyForTechnology("LTE", 3);
      mockSelect.orderBy.mockResolvedValue(lteCombos);

      const result = await repository.search({ technology: "LTE" });

      expect(result.every((c) => c.technology === "LTE")).toBe(true);
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should filter by name using LIKE", async () => {
      const combo = ComboFactory.createWithName("2A-4A");
      mockSelect.orderBy.mockResolvedValue([combo]);

      const result = await repository.search({ name: "2A-4A" });

      expect(result[0].name).toBe("2A-4A");
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should combine technology and name filters", async () => {
      const combo = ComboFactory.create({
        technology: "5G NR",
        name: "n77A-n78A",
      });
      mockSelect.orderBy.mockResolvedValue([combo]);

      const result = await repository.search({
        technology: "5G NR",
        name: "n77A",
      });

      expect(result[0].technology).toBe("5G NR");
      expect(result[0].name).toContain("n77A");
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should handle partial name matches", async () => {
      const combos = [
        ComboFactory.createWithName("2A-4A"),
        ComboFactory.createWithName("2A-4A-12A"),
        ComboFactory.createWithName("2A-4A-66A"),
      ];
      mockSelect.orderBy.mockResolvedValue(combos);

      const result = await repository.search({ name: "2A-4A" });

      expect(result).toHaveLength(3);
      expect(result.every((c) => c.name.includes("2A-4A"))).toBe(true);
    });

    it("should return empty array when no combos match filters", async () => {
      mockSelect.orderBy.mockResolvedValue([]);

      const result = await repository.search({ technology: "NonExistentTech" });

      expect(result).toEqual([]);
    });

    it("should order results by technology and name", async () => {
      const mockCombos = ComboFactory.createMany(5);
      mockSelect.orderBy.mockResolvedValue(mockCombos);

      await repository.search();

      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should handle empty filter object", async () => {
      const mockCombos = ComboFactory.createMany(3);
      mockSelect.orderBy.mockResolvedValue(mockCombos);

      const result = await repository.search({});

      expect(result).toEqual(mockCombos);
    });
  });

  describe("findAll", () => {
    it("should return all combos ordered by technology and name", async () => {
      const mockCombos = [
        ComboFactory.createWithTechnology("LTE"),
        ComboFactory.createWithTechnology("5G NR"),
        ComboFactory.createWithTechnology("LTE-A"),
      ];
      mockSelect.orderBy.mockResolvedValue(mockCombos);

      const result = await repository.findAll();

      expect(result).toEqual(mockCombos);
      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should return empty array when no combos exist", async () => {
      mockSelect.orderBy.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe("findBandsByCombo", () => {
    const comboId = 1;

    it("should return bands that make up a combo", async () => {
      const bands = BandFactory.createMany(3);
      const mockResults = bands.map((band) => ({ band }));
      mockSelect.where.mockResolvedValue(mockResults);

      const result = await repository.findBandsByCombo(comboId);

      expect(result).toHaveLength(3);
      expect(mockSelect.innerJoin).toHaveBeenCalled();
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should return empty array when combo has no bands", async () => {
      mockSelect.where.mockResolvedValue([]);

      const result = await repository.findBandsByCombo(comboId);

      expect(result).toEqual([]);
    });

    it("should handle combo with single band", async () => {
      const band = BandFactory.create();
      mockSelect.where.mockResolvedValue([{ band }]);

      const result = await repository.findBandsByCombo(comboId);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({ band });
    });

    it("should handle combo with many bands", async () => {
      const bands = BandFactory.createMany(10);
      const mockResults = bands.map((band) => ({ band }));
      mockSelect.where.mockResolvedValue(mockResults);

      const result = await repository.findBandsByCombo(comboId);

      expect(result).toHaveLength(10);
    });
  });

  describe("findBandsByCombos", () => {
    it("should return empty array when given empty array", async () => {
      const result = await repository.findBandsByCombos([]);

      expect(result).toEqual([]);
      expect(db.select).not.toHaveBeenCalled();
    });

    it("should return bands for multiple combos with comboId", async () => {
      const combo1Bands = BandFactory.createMany(2);
      const combo2Bands = BandFactory.createMany(3);

      const mockResults = [
        ...combo1Bands.map((band) => ({ comboId: 1, band })),
        ...combo2Bands.map((band) => ({ comboId: 2, band })),
      ];
      mockSelect.orderBy.mockResolvedValue(mockResults);

      const result = await repository.findBandsByCombos([1, 2]);

      expect(result).toHaveLength(5);
      expect(result.filter((r) => r.comboId === 1)).toHaveLength(2);
      expect(result.filter((r) => r.comboId === 2)).toHaveLength(3);
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should handle single combo ID in array", async () => {
      const bands = BandFactory.createMany(3);
      const mockResults = bands.map((band) => ({ comboId: 1, band }));
      mockSelect.orderBy.mockResolvedValue(mockResults);

      const result = await repository.findBandsByCombos([1]);

      expect(result).toHaveLength(3);
      expect(result.every((r) => r.comboId === 1)).toBe(true);
    });

    it("should order results by comboId", async () => {
      const mockResults = [
        { comboId: 1, band: BandFactory.create() },
        { comboId: 1, band: BandFactory.create() },
        { comboId: 2, band: BandFactory.create() },
      ];
      mockSelect.orderBy.mockResolvedValue(mockResults);

      await repository.findBandsByCombos([1, 2]);

      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should handle large batch of combo IDs", async () => {
      const comboIds = Array.from({ length: 50 }, (_, i) => i + 1);
      const mockResults = comboIds.flatMap((comboId) =>
        BandFactory.createMany(2).map((band) => ({ comboId, band }))
      );
      mockSelect.orderBy.mockResolvedValue(mockResults);

      const result = await repository.findBandsByCombos(comboIds);

      expect(result).toHaveLength(100);
    });

    it("should handle combo with no bands gracefully", async () => {
      const mockResults = [
        { comboId: 1, band: BandFactory.create() },
        // combo 2 has no bands
      ];
      mockSelect.orderBy.mockResolvedValue(mockResults);

      const result = await repository.findBandsByCombos([1, 2]);

      expect(result).toHaveLength(1);
      expect(result[0].comboId).toBe(1);
    });
  });

  describe("findDevicesSupportingCombo", () => {
    const comboId = 1;

    describe("global capability queries (no providerId)", () => {
      it("should return devices supporting a combo globally", async () => {
        const device1 = DeviceFactory.create({ id: 1 });
        const device2 = DeviceFactory.create({ id: 2 });
        const software1 = SoftwareFactory.create({ deviceId: 1 });
        const software2 = SoftwareFactory.create({ deviceId: 2 });

        const mockResults = [
          { device: device1, software: software1 },
          { device: device2, software: software2 },
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingCombo({ comboId });

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

        const result = await repository.findDevicesSupportingCombo({ comboId });

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

        const result = await repository.findDevicesSupportingCombo({
          comboId,
          technology: "5G NR",
        });

        expect(mockSelectDistinct.where).toHaveBeenCalled();
        expect(result).toHaveLength(1);
      });

      it("should return empty array when no devices support the combo", async () => {
        mockSelectDistinct.orderBy.mockResolvedValue([]);

        const result = await repository.findDevicesSupportingCombo({ comboId });

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

        const result = await repository.findDevicesSupportingCombo({ comboId });

        expect(result).toHaveLength(1);
        expect(result[0].software).toHaveLength(1);
      });

      it("should handle multiple devices with varying software counts", async () => {
        const device1 = DeviceFactory.create({ id: 1 });
        const device2 = DeviceFactory.create({ id: 2 });
        const software1 = SoftwareFactory.create({ id: 1, deviceId: 1 });
        const software2 = SoftwareFactory.create({ id: 2, deviceId: 1 });
        const software3 = SoftwareFactory.create({ id: 3, deviceId: 2 });

        const mockResults = [
          { device: device1, software: software1 },
          { device: device1, software: software2 },
          { device: device2, software: software3 },
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingCombo({ comboId });

        expect(result).toHaveLength(2);
        expect(result[0].software).toHaveLength(2);
        expect(result[1].software).toHaveLength(1);
      });
    });

    describe("provider-specific capability queries", () => {
      const providerId = 10;

      it("should return devices supporting a combo for specific provider", async () => {
        const device1 = DeviceFactory.create({ id: 1 });
        const device2 = DeviceFactory.create({ id: 2 });
        const software1 = SoftwareFactory.create({ deviceId: 1 });
        const software2 = SoftwareFactory.create({ deviceId: 2 });

        const mockResults = [
          { device: device1, software: software1, providerId },
          { device: device2, software: software2, providerId },
        ];
        mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

        const result = await repository.findDevicesSupportingCombo({
          comboId,
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

        const result = await repository.findDevicesSupportingCombo({
          comboId,
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

        const result = await repository.findDevicesSupportingCombo({
          comboId,
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

        const result = await repository.findDevicesSupportingCombo({
          comboId,
          providerId,
        });

        expect(result).toHaveLength(1);
        expect(result[0].software).toHaveLength(1);
      });

      it("should return empty array when no devices match provider criteria", async () => {
        mockSelectDistinct.orderBy.mockResolvedValue([]);

        const result = await repository.findDevicesSupportingCombo({
          comboId,
          providerId,
        });

        expect(result).toEqual([]);
      });
    });
  });

  describe("findByDeviceSoftware", () => {
    const deviceId = 1;
    const softwareId = 1;

    it("should return combos for device/software combination", async () => {
      const combos = ComboFactory.createMany(3);
      const mockResults = combos.map((combo) => ({ combo }));
      mockSelect.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftware(
        deviceId,
        softwareId
      );

      expect(result).toEqual(combos);
      expect(mockSelect.innerJoin).toHaveBeenCalled();
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should filter by technology when provided", async () => {
      const combos = ComboFactory.createManyForTechnology("LTE", 2);
      const mockResults = combos.map((combo) => ({ combo }));
      mockSelect.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftware(
        deviceId,
        softwareId,
        "LTE"
      );

      expect(result).toEqual(combos);
      expect(result.every((c) => c.technology === "LTE")).toBe(true);
    });

    it("should return empty array when no combos found", async () => {
      mockSelect.then.mockImplementation((fn: any) => fn([]));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftware(
        deviceId,
        softwareId
      );

      expect(result).toEqual([]);
    });

    it("should handle multiple combos across technologies", async () => {
      const combos = [
        ComboFactory.createWithTechnology("LTE"),
        ComboFactory.createWithTechnology("5G NR"),
      ];
      const mockResults = combos.map((combo) => ({ combo }));
      mockSelect.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftware(
        deviceId,
        softwareId
      );

      expect(result).toHaveLength(2);
    });

    it("should handle device/software with many combos", async () => {
      const combos = ComboFactory.createMany(10);
      const mockResults = combos.map((combo) => ({ combo }));
      mockSelect.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftware(
        deviceId,
        softwareId
      );

      expect(result).toHaveLength(10);
    });
  });

  describe("findByDeviceSoftwareProvider", () => {
    const deviceId = 1;
    const softwareId = 1;
    const providerId = 10;

    it("should filter by technology when provided", async () => {
      const combos = ComboFactory.createManyForTechnology("5G NR", 2);
      const mockResults = combos.map((combo) => ({ combo }));
      mockSelect.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftwareProvider(
        deviceId,
        softwareId,
        providerId,
        "5G NR"
      );

      expect(result).toEqual(combos);
      expect(result.every((c) => c.technology === "5G NR")).toBe(true);
    });

    it("should return empty array when no combos found", async () => {
      mockSelect.then.mockImplementation((fn: any) => fn([]));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftwareProvider(
        deviceId,
        softwareId,
        providerId
      );

      expect(result).toEqual([]);
    });

    it("should return combos for device/software/provider combination", async () => {
      const combos = ComboFactory.createMany(3);
      const mockResults = combos.map((combo) => ({ combo }));
      mockSelect.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftwareProvider(
        deviceId,
        softwareId,
        providerId
      );

      expect(result).toHaveLength(3);
    });

    it("should handle different providers having different combos", async () => {
      const combos = ComboFactory.createMany(3);
      const mockResults = combos.map((combo) => ({ combo }));
      mockSelect.then.mockImplementation((fn: any) => fn(mockResults));
      mockSelect.where.mockResolvedValue(mockSelect);

      const result = await repository.findByDeviceSoftwareProvider(
        deviceId,
        softwareId,
        providerId
      );

      expect(result).toHaveLength(3);
      expect(mockSelect.where).toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("should handle combos with special characters in name", async () => {
      const combo = ComboFactory.create({ name: "n77A+n78A-CA" });
      mockSelect.limit.mockResolvedValue([combo]);

      const result = await repository.findById(1);

      expect(result?.name).toBe("n77A+n78A-CA");
    });

    it("should handle very long combo names", async () => {
      const longName = "2A-4A-5A-7A-12A-13A-17A-25A-26A-30A-41A-66A-71A";
      const combo = ComboFactory.create({ name: longName });
      mockSelect.limit.mockResolvedValue([combo]);

      const result = await repository.findById(1);

      expect(result?.name).toBe(longName);
    });

    it("should handle case-sensitive technology filtering", async () => {
      const combos = ComboFactory.createManyForTechnology("5G NR", 2);
      mockSelect.orderBy.mockResolvedValue(combos);

      const result = await repository.search({ technology: "5G NR" });

      expect(result.every((c) => c.technology === "5G NR")).toBe(true);
    });

    it("should handle very large result sets for findDevicesSupportingCombo", async () => {
      const devices = Array.from({ length: 100 }, (_, i) => {
        const device = DeviceFactory.create({ id: i + 1 });
        const software = SoftwareFactory.create({ deviceId: i + 1 });
        return { device, software };
      });
      mockSelectDistinct.orderBy.mockResolvedValue(devices);

      const result = await repository.findDevicesSupportingCombo({
        comboId: 1,
      });

      expect(result).toHaveLength(100);
    });

    it("should handle findBandsByCombos with uneven band distributions", async () => {
      const mockResults = [
        { comboId: 1, band: BandFactory.create() },
        { comboId: 2, band: BandFactory.create() },
        { comboId: 2, band: BandFactory.create() },
        { comboId: 2, band: BandFactory.create() },
        { comboId: 3, band: BandFactory.create() },
        { comboId: 3, band: BandFactory.create() },
      ];
      mockSelect.orderBy.mockResolvedValue(mockResults);

      const result = await repository.findBandsByCombos([1, 2, 3]);

      expect(result.filter((r) => r.comboId === 1)).toHaveLength(1);
      expect(result.filter((r) => r.comboId === 2)).toHaveLength(3);
      expect(result.filter((r) => r.comboId === 3)).toHaveLength(2);
    });

    it("should handle mixed technology results in findDevicesSupportingCombo", async () => {
      const device1 = DeviceFactory.create({ id: 1 });
      const device2 = DeviceFactory.create({ id: 2 });
      const software1 = SoftwareFactory.create({
        deviceId: 1,
        platform: "Android",
      });
      const software2 = SoftwareFactory.create({
        deviceId: 2,
        platform: "iOS",
      });

      const mockResults = [
        { device: device1, software: software1 },
        { device: device2, software: software2 },
      ];
      mockSelectDistinct.orderBy.mockResolvedValue(mockResults);

      const result = await repository.findDevicesSupportingCombo({
        comboId: 1,
      });

      expect(result).toHaveLength(2);
      expect(result[0].software[0].platform).toBe("Android");
      expect(result[1].software[0].platform).toBe("iOS");
    });
  });
});
