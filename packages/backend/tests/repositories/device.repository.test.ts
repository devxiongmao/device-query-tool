import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { DeviceFactory } from "../factories/device.factory";
import { db } from "../../src/db/client";
import { DeviceRepository } from "../../src/repositories/device.repository";

// Mock the database
vi.mock("../../src/db/client", () => ({
  db: {
    select: vi.fn(),
  },
}));

describe("DeviceRepository", () => {
  let repository: DeviceRepository;
  let mockSelect: any;

  beforeEach(() => {
    DeviceFactory.reset();
    repository = new DeviceRepository();

    // Setup chainable mock
    mockSelect = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      offset: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
    };

    (db.select as ReturnType<typeof vi.fn>).mockReturnValue(mockSelect);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("should return device when found", async () => {
      const mockDevice = DeviceFactory.create({ id: 1 });
      mockSelect.limit.mockResolvedValue([mockDevice]);

      const result = await repository.findById(1);

      expect(result).toEqual(mockDevice);
      expect(db.select).toHaveBeenCalled();
    });

    it("should return null when device not found", async () => {
      mockSelect.limit.mockResolvedValue([]);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });

    it("should call database with correct parameters", async () => {
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

    it("should return multiple devices for valid IDs", async () => {
      const mockDevices = DeviceFactory.createMany(3);
      mockSelect.where.mockResolvedValue(mockDevices);

      const result = await repository.findByIds([1, 2, 3]);

      expect(result).toEqual(mockDevices);
      expect(result).toHaveLength(3);
    });

    it("should handle single ID in array", async () => {
      const mockDevice = DeviceFactory.create({ id: 1 });
      mockSelect.where.mockResolvedValue([mockDevice]);

      const result = await repository.findByIds([1]);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockDevice);
    });
  });

  describe("search", () => {
    it("should return all devices when no filters provided", async () => {
      const mockDevices = DeviceFactory.createMany(5);
      mockSelect.orderBy.mockResolvedValue(mockDevices);

      const result = await repository.search({});

      expect(result).toEqual(mockDevices);
      expect(mockSelect.limit).toHaveBeenCalledWith(50); // default limit
      expect(mockSelect.offset).toHaveBeenCalledWith(0); // default offset
    });

    it("should filter by vendor", async () => {
      const appleDevice = DeviceFactory.createWithVendor("Apple");
      mockSelect.orderBy.mockResolvedValue([appleDevice]);

      const result = await repository.search({ vendor: "Apple" });

      expect(mockSelect.where).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it("should filter by model number", async () => {
      const device = DeviceFactory.create({ modelNum: "SM-G991" });
      mockSelect.orderBy.mockResolvedValue([device]);

      const result = await repository.search({ modelNum: "SM-G991" });

      expect(mockSelect.where).toHaveBeenCalled();
      expect(result[0].modelNum).toBe("SM-G991");
    });

    it("should filter by market name", async () => {
      const device = DeviceFactory.create({ marketName: "Galaxy S21" });
      mockSelect.orderBy.mockResolvedValue([device]);

      const result = await repository.search({ marketName: "Galaxy S21" });

      expect(mockSelect.where).toHaveBeenCalled();
      expect(result[0].marketName).toBe("Galaxy S21");
    });

    it("should filter by release date range", async () => {
      const device = DeviceFactory.createWithDateRange(
        "2023-01-01",
        "2023-12-31"
      );
      mockSelect.orderBy.mockResolvedValue([device]);

      const result = await repository.search({
        releasedAfter: new Date("2023-01-01"),
        releasedBefore: new Date("2023-12-31"),
      });

      expect(mockSelect.where).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it("should combine multiple filters", async () => {
      const device = DeviceFactory.create({
        vendor: "Samsung",
        modelNum: "SM-G991",
        releaseDate: "2023-06-15",
      });
      mockSelect.orderBy.mockResolvedValue([device]);

      const result = await repository.search({
        vendor: "Samsung",
        modelNum: "SM-G991",
        releasedAfter: new Date("2023-01-01"),
      });

      expect(mockSelect.where).toHaveBeenCalled();
      expect(result[0].vendor).toBe("Samsung");
    });

    it("should respect custom limit and offset", async () => {
      const mockDevices = DeviceFactory.createMany(10);
      mockSelect.orderBy.mockResolvedValue(mockDevices);

      await repository.search({ limit: 10, offset: 20 });

      expect(mockSelect.limit).toHaveBeenCalledWith(10);
      expect(mockSelect.offset).toHaveBeenCalledWith(20);
    });

    it("should handle partial text matches in vendor", async () => {
      const samsungDevice = DeviceFactory.createWithVendor(
        "Samsung Electronics"
      );
      mockSelect.orderBy.mockResolvedValue([samsungDevice]);

      const result = await repository.search({ vendor: "Samsung" });

      expect(result[0].vendor).toContain("Samsung");
    });

    it("should handle special characters in search strings", async () => {
      const device = DeviceFactory.create({ modelNum: "SM-G991/DS" });
      mockSelect.orderBy.mockResolvedValue([device]);

      const result = await repository.search({ modelNum: "SM-G991/DS" });

      expect(mockSelect.where).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe("findAll", () => {
    it("should return all devices ordered by vendor and model", async () => {
      const mockDevices = [
        DeviceFactory.create({ vendor: "Apple", modelNum: "A001" }),
        DeviceFactory.create({ vendor: "Samsung", modelNum: "S001" }),
      ];
      mockSelect.orderBy.mockResolvedValue(mockDevices);

      const result = await repository.findAll();

      expect(result).toEqual(mockDevices);
      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should return empty array when no devices exist", async () => {
      mockSelect.orderBy.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe("count", () => {
    it("should return total device count", async () => {
      mockSelect.from.mockResolvedValue([{ count: 42 }]);

      const result = await repository.count();

      expect(result).toBe(42);
    });

    it("should return 0 when no devices exist", async () => {
      mockSelect.from.mockResolvedValue([{ count: 0 }]);

      const result = await repository.count();

      expect(result).toBe(0);
    });

    it("should handle string count values from database", async () => {
      mockSelect.from.mockResolvedValue([{ count: "123" }]);

      const result = await repository.count();

      expect(result).toBe(123);
      expect(typeof result).toBe("number");
    });
  });
});
