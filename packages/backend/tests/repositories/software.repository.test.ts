import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { SoftwareRepository } from "../../src/repositories/software.repository";
import { SoftwareFactory } from "../factories/software.factory";
import { db } from "../../src/db/client";

// Mock the database
vi.mock("../../src/db/client", () => ({
  db: {
    select: vi.fn(),
  },
}));

describe("SoftwareRepository", () => {
  let repository: SoftwareRepository;
  let mockSelect: any;

  beforeEach(() => {
    SoftwareFactory.reset();
    repository = new SoftwareRepository();

    // Setup chainable mock
    mockSelect = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
    };

    (db.select as ReturnType<typeof vi.fn>).mockReturnValue(mockSelect);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("should return software when found", async () => {
      const mockSoftware = SoftwareFactory.create({ id: 1 });
      mockSelect.limit.mockResolvedValue([mockSoftware]);

      const result = await repository.findById(1);

      expect(result).toEqual(mockSoftware);
      expect(db.select).toHaveBeenCalled();
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockSelect.limit).toHaveBeenCalledWith(1);
    });

    it("should return null when software not found", async () => {
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

    it("should return multiple software entries for valid IDs", async () => {
      const mockSoftware = SoftwareFactory.createMany(3);
      mockSelect.where.mockResolvedValue(mockSoftware);

      const result = await repository.findByIds([1, 2, 3]);

      expect(result).toEqual(mockSoftware);
      expect(result).toHaveLength(3);
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should handle single ID in array", async () => {
      const mockSoftware = SoftwareFactory.create({ id: 1 });
      mockSelect.where.mockResolvedValue([mockSoftware]);

      const result = await repository.findByIds([1]);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockSoftware);
    });

    it("should handle large array of IDs", async () => {
      const ids = Array.from({ length: 100 }, (_, i) => i + 1);
      const mockSoftware = SoftwareFactory.createMany(100);
      mockSelect.where.mockResolvedValue(mockSoftware);

      const result = await repository.findByIds(ids);

      expect(result).toHaveLength(100);
      expect(mockSelect.where).toHaveBeenCalled();
    });
  });

  describe("findByDevice", () => {
    const deviceId = 1;

    it("should return all software for a device with no filters", async () => {
      const mockSoftware = SoftwareFactory.createManyForDevice(deviceId, 3);
      mockSelect.orderBy.mockResolvedValue(mockSoftware);

      const result = await repository.findByDevice(deviceId);

      expect(result).toEqual(mockSoftware);
      expect(result.every((s) => s.deviceId === deviceId)).toBe(true);
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should filter by platform", async () => {
      const mockSoftware = [
        SoftwareFactory.createForDevice(deviceId, { platform: "Android" }),
      ];
      mockSelect.orderBy.mockResolvedValue(mockSoftware);

      const result = await repository.findByDevice(deviceId, {
        platform: "Android",
      });

      expect(result[0].platform).toBe("Android");
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should filter by release date", async () => {
      const mockSoftware = [
        SoftwareFactory.createForDevice(deviceId, {
          releaseDate: "2024-06-01",
        }),
      ];
      mockSelect.orderBy.mockResolvedValue(mockSoftware);

      const result = await repository.findByDevice(deviceId, {
        releasedAfter: "2024-01-01",
      });

      expect(result[0].releaseDate).toBe("2024-06-01");
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should combine platform and date filters", async () => {
      const mockSoftware = [
        SoftwareFactory.createForDevice(deviceId, {
          platform: "iOS",
          releaseDate: "2024-06-01",
        }),
      ];
      mockSelect.orderBy.mockResolvedValue(mockSoftware);

      const result = await repository.findByDevice(deviceId, {
        platform: "iOS",
        releasedAfter: "2024-01-01",
      });

      expect(result[0].platform).toBe("iOS");
      expect(result[0].releaseDate).toBe("2024-06-01");
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should return empty array when no software matches filters", async () => {
      mockSelect.orderBy.mockResolvedValue([]);

      const result = await repository.findByDevice(deviceId, {
        platform: "NonExistentPlatform",
      });

      expect(result).toEqual([]);
    });

    it("should order results by release date", async () => {
      const mockSoftware = SoftwareFactory.createVersionHistory(deviceId, [
        "1.0",
        "2.0",
        "3.0",
      ]);
      mockSelect.orderBy.mockResolvedValue(mockSoftware);

      await repository.findByDevice(deviceId);

      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should handle edge case with undefined filters", async () => {
      const mockSoftware = SoftwareFactory.createManyForDevice(deviceId, 2);
      mockSelect.orderBy.mockResolvedValue(mockSoftware);

      const result = await repository.findByDevice(deviceId, undefined);

      expect(result).toEqual(mockSoftware);
    });
  });

  describe("findByDevices", () => {
    it("should return empty array when given empty array", async () => {
      const result = await repository.findByDevices([]);

      expect(result).toEqual([]);
      expect(db.select).not.toHaveBeenCalled();
    });

    it("should return software for multiple devices", async () => {
      const deviceIds = [1, 2, 3];
      const mockSoftware = SoftwareFactory.createForDevices(deviceIds);
      mockSelect.orderBy.mockResolvedValue(mockSoftware);

      const result = await repository.findByDevices(deviceIds);

      expect(result.length).toBeGreaterThan(0);
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should return software for single device in array", async () => {
      const deviceId = 1;
      const mockSoftware = SoftwareFactory.createManyForDevice(deviceId, 2);
      mockSelect.orderBy.mockResolvedValue(mockSoftware);

      const result = await repository.findByDevices([deviceId]);

      expect(result.every((s) => s.deviceId === deviceId)).toBe(true);
    });

    it("should handle large batch of device IDs", async () => {
      const deviceIds = Array.from({ length: 50 }, (_, i) => i + 1);
      const mockSoftware = deviceIds.flatMap((id) =>
        SoftwareFactory.createManyForDevice(id, 2)
      );
      mockSelect.orderBy.mockResolvedValue(mockSoftware);

      const result = await repository.findByDevices(deviceIds);

      expect(result.length).toBeGreaterThan(0);
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should order results by deviceId and releaseDate", async () => {
      const deviceIds = [1, 2];
      const mockSoftware = [
        SoftwareFactory.createForDevice(1, { releaseDate: "2024-01-01" }),
        SoftwareFactory.createForDevice(1, { releaseDate: "2024-06-01" }),
        SoftwareFactory.createForDevice(2, { releaseDate: "2024-03-01" }),
      ];
      mockSelect.orderBy.mockResolvedValue(mockSoftware);

      await repository.findByDevices(deviceIds);

      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should return empty array when no software exists for devices", async () => {
      mockSelect.orderBy.mockResolvedValue([]);

      const result = await repository.findByDevices([999, 1000]);

      expect(result).toEqual([]);
    });

    it("should handle duplicate device IDs gracefully", async () => {
      const deviceIds = [1, 1, 2, 2];
      const mockSoftware = SoftwareFactory.createForDevices([1, 2]);
      mockSelect.orderBy.mockResolvedValue(mockSoftware);

      const result = await repository.findByDevices(deviceIds);

      expect(result.length).toBeGreaterThan(0);
      expect(mockSelect.where).toHaveBeenCalled();
    });
  });

  describe("edge cases and error scenarios", () => {
    it("should handle software with null or undefined fields gracefully", async () => {
      const mockSoftware = SoftwareFactory.create({
        platform: "Android",
      });
      mockSelect.limit.mockResolvedValue([mockSoftware]);

      const result = await repository.findById(1);

      expect(result).toBeDefined();
      expect(result?.platform).toBe("Android");
    });

    it("should handle very old release dates", async () => {
      const oldDate = "2010-01-01";
      const mockSoftware = [
        SoftwareFactory.createForDevice(1, { releaseDate: oldDate }),
      ];
      mockSelect.orderBy.mockResolvedValue(mockSoftware);

      const result = await repository.findByDevice(1, {
        releasedAfter: "2009-01-01",
      });

      expect(result[0].releaseDate).toBe(oldDate);
    });

    it("should handle future release dates", async () => {
      const futureDate = "2026-12-31";
      const mockSoftware = [
        SoftwareFactory.createForDevice(1, { releaseDate: futureDate }),
      ];
      mockSelect.orderBy.mockResolvedValue(mockSoftware);

      const result = await repository.findByDevice(1);

      expect(result[0].releaseDate).toBe(futureDate);
    });
  });
});
