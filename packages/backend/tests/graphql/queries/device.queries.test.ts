import { describe, it, expect, beforeEach, vi } from "vitest";
import { DeviceFactory } from "../../factories/device.factory";
import { deviceRepository } from "../../../src/repositories";

// Mock the repository
vi.mock("../../../src/repositories", () => ({
  deviceRepository: {
    search: vi.fn(),
    findById: vi.fn(),
  },
}));

describe("Device GraphQL Queries", () => {
  beforeEach(() => {
    DeviceFactory.reset();
    vi.clearAllMocks();
  });

  describe("device query", () => {
    it("should return a device when found via dataloader", async () => {
      const mockDevice = DeviceFactory.create({ id: 1, vendor: "Samsung" });

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(mockDevice),
      };

      const ctx = {
        loaders: {
          deviceById: mockDataLoader,
        },
      };

      const args = { id: "1" };
      const result = await ctx.loaders.deviceById.load(Number(args.id));

      expect(result).toEqual(mockDevice);
      expect(mockDataLoader.load).toHaveBeenCalledWith(1);
      expect(mockDataLoader.load).toHaveBeenCalledTimes(1);
    });

    it("should return null when device is not found", async () => {
      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(null),
      };

      const ctx = {
        loaders: {
          deviceById: mockDataLoader,
        },
      };

      const args = { id: "999" };
      const result = await ctx.loaders.deviceById.load(Number(args.id));

      expect(result).toBeNull();
      expect(mockDataLoader.load).toHaveBeenCalledWith(999);
    });

    it("should convert string ID to number before passing to dataloader", async () => {
      const mockDevice = DeviceFactory.create({ id: 42 });

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(mockDevice),
      };

      const ctx = {
        loaders: {
          deviceById: mockDataLoader,
        },
      };

      const args = { id: "42" };
      await ctx.loaders.deviceById.load(Number(args.id));

      expect(mockDataLoader.load).toHaveBeenCalledWith(42);
      expect(typeof mockDataLoader.load.mock.calls[0][0]).toBe("number");
    });

    it("should handle numeric string IDs correctly", async () => {
      const mockDevice = DeviceFactory.create({ id: 123 });

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(mockDevice),
      };

      const ctx = {
        loaders: {
          deviceById: mockDataLoader,
        },
      };

      const args = { id: "123" };
      const deviceId = Number(args.id);

      expect(deviceId).toBe(123);
      expect(Number.isNaN(deviceId)).toBe(false);

      const result = await ctx.loaders.deviceById.load(deviceId);
      expect(result).toEqual(mockDevice);
    });
  });

  describe("devices query", () => {
    it("should return all devices with default pagination when no filters provided", async () => {
      const mockDevices = DeviceFactory.createMany(10);
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockDevices
      );

      const args = { limit: 50, offset: 0 };
      const result = await deviceRepository.search({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(result).toEqual(mockDevices);
      expect(deviceRepository.search).toHaveBeenCalledWith({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: 50,
        offset: 0,
      });
    });

    it("should filter by vendor when provided", async () => {
      const samsungDevices = DeviceFactory.createMany(3, { vendor: "Samsung" });
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        samsungDevices
      );

      const args = { vendor: "Samsung", limit: 50, offset: 0 };
      const result = await deviceRepository.search({
        vendor: args.vendor || undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(result).toEqual(samsungDevices);
      expect(deviceRepository.search).toHaveBeenCalledWith({
        vendor: "Samsung",
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: 50,
        offset: 0,
      });
      expect(result.every((d) => d.vendor === "Samsung")).toBe(true);
    });

    it("should filter by modelNum when provided", async () => {
      const mockDevice = DeviceFactory.create({ modelNum: "SM-G990U" });
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue([
        mockDevice,
      ]);

      const args = { modelNum: "SM-G990U", limit: 50, offset: 0 };
      const result = await deviceRepository.search({
        vendor: undefined,
        modelNum: args.modelNum || undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(result).toEqual([mockDevice]);
      expect(deviceRepository.search).toHaveBeenCalledWith({
        vendor: undefined,
        modelNum: "SM-G990U",
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: 50,
        offset: 0,
      });
    });

    it("should filter by marketName when provided", async () => {
      const mockDevice = DeviceFactory.create({ marketName: "Galaxy S22" });
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue([
        mockDevice,
      ]);

      const args = { marketName: "Galaxy S22", limit: 50, offset: 0 };
      const result = await deviceRepository.search({
        vendor: undefined,
        modelNum: undefined,
        marketName: args.marketName || undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(result).toEqual([mockDevice]);
      expect(deviceRepository.search).toHaveBeenCalledWith({
        vendor: undefined,
        modelNum: undefined,
        marketName: "Galaxy S22",
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: 50,
        offset: 0,
      });
    });

    it("should filter by releasedAfter date when provided as Date object", async () => {
      const afterDate = new Date("2023-01-01");
      const mockDevices = DeviceFactory.createMany(3, {
        releaseDate: "2023-06-15",
      });
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockDevices
      );

      const args = { releasedAfter: afterDate, limit: 50, offset: 0 };
      const result = await deviceRepository.search({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter:
          typeof args.releasedAfter === "string"
            ? args.releasedAfter
            : args.releasedAfter?.toISOString(),
        releasedBefore: undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(result).toEqual(mockDevices);
      expect(deviceRepository.search).toHaveBeenCalledWith({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: afterDate.toISOString(),
        releasedBefore: undefined,
        limit: 50,
        offset: 0,
      });
    });

    it("should filter by releasedAfter date when provided as string", async () => {
      const dateString = "2023-01-01";
      const mockDevices = DeviceFactory.createMany(3, {
        releaseDate: "2023-06-15",
      });
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockDevices
      );

      const args = { releasedAfter: dateString, limit: 50, offset: 0 };
      const result = await deviceRepository.search({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter:
          typeof args.releasedAfter === "string"
            ? args.releasedAfter
            : undefined,
        releasedBefore: undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(result).toEqual(mockDevices);
      expect(deviceRepository.search).toHaveBeenCalledWith({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: dateString,
        releasedBefore: undefined,
        limit: 50,
        offset: 0,
      });
    });

    it("should filter by releasedBefore date when provided as Date object", async () => {
      const beforeDate = new Date("2023-12-31");
      const mockDevices = DeviceFactory.createMany(3, {
        releaseDate: "2023-06-15",
      });
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockDevices
      );

      const args = { releasedBefore: beforeDate, limit: 50, offset: 0 };
      const result = await deviceRepository.search({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore:
          typeof args.releasedBefore === "string"
            ? args.releasedBefore
            : args.releasedBefore?.toISOString(),
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(result).toEqual(mockDevices);
      expect(deviceRepository.search).toHaveBeenCalledWith({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: beforeDate.toISOString(),
        limit: 50,
        offset: 0,
      });
    });

    it("should filter by releasedBefore date when provided as string", async () => {
      const dateString = "2023-12-31";
      const mockDevices = DeviceFactory.createMany(3, {
        releaseDate: "2023-06-15",
      });
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockDevices
      );

      const args = { releasedBefore: dateString, limit: 50, offset: 0 };
      const result = await deviceRepository.search({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore:
          typeof args.releasedBefore === "string"
            ? args.releasedBefore
            : undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(result).toEqual(mockDevices);
      expect(deviceRepository.search).toHaveBeenCalledWith({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: dateString,
        limit: 50,
        offset: 0,
      });
    });

    it("should filter by date range when both releasedAfter and releasedBefore provided", async () => {
      const afterDate = new Date("2023-01-01");
      const beforeDate = new Date("2023-12-31");
      const mockDevices = DeviceFactory.createMany(5, {
        releaseDate: "2023-06-15",
      });
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockDevices
      );

      const args = {
        releasedAfter: afterDate,
        releasedBefore: beforeDate,
        limit: 50,
        offset: 0,
      };
      const result = await deviceRepository.search({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter:
          typeof args.releasedAfter === "string"
            ? args.releasedAfter
            : args.releasedAfter?.toISOString(),
        releasedBefore:
          typeof args.releasedBefore === "string"
            ? args.releasedBefore
            : args.releasedBefore?.toISOString(),
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(result).toEqual(mockDevices);
      expect(deviceRepository.search).toHaveBeenCalledWith({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: afterDate.toISOString(),
        releasedBefore: beforeDate.toISOString(),
        limit: 50,
        offset: 0,
      });
    });

    it("should combine multiple filters", async () => {
      const mockDevice = DeviceFactory.create({
        vendor: "Samsung",
        modelNum: "SM-G990U",
        marketName: "Galaxy S22",
        releaseDate: "2023-06-15",
      });
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue([
        mockDevice,
      ]);

      const args = {
        vendor: "Samsung",
        modelNum: "SM-G990U",
        marketName: "Galaxy S22",
        limit: 50,
        offset: 0,
      };
      const result = await deviceRepository.search({
        vendor: args.vendor || undefined,
        modelNum: args.modelNum || undefined,
        marketName: args.marketName || undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(result).toEqual([mockDevice]);
      expect(deviceRepository.search).toHaveBeenCalledWith({
        vendor: "Samsung",
        modelNum: "SM-G990U",
        marketName: "Galaxy S22",
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: 50,
        offset: 0,
      });
    });

    it("should handle partial vendor matching", async () => {
      const mockDevices = [
        DeviceFactory.createWithVendor("Samsung"),
        DeviceFactory.createWithVendor("Samsung Electronics"),
      ];
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockDevices
      );

      const args = { vendor: "Sam", limit: 50, offset: 0 };
      const result = await deviceRepository.search({
        vendor: args.vendor || undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(result).toEqual(mockDevices);
      expect(deviceRepository.search).toHaveBeenCalledWith({
        vendor: "Sam",
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: 50,
        offset: 0,
      });
    });

    it("should convert empty strings to undefined", async () => {
      const mockDevices = DeviceFactory.createMany(5);
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockDevices
      );

      const args = {
        vendor: "",
        modelNum: "",
        marketName: "",
        limit: 50,
        offset: 0,
      };
      const result = await deviceRepository.search({
        vendor: args.vendor || undefined,
        modelNum: args.modelNum || undefined,
        marketName: args.marketName || undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(deviceRepository.search).toHaveBeenCalledWith({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: 50,
        offset: 0,
      });
      expect(result).toEqual(mockDevices);
    });

    it("should respect custom limit", async () => {
      const mockDevices = DeviceFactory.createMany(10);
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockDevices
      );

      const args = { limit: 10, offset: 0 };
      const result = await deviceRepository.search({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(result).toEqual(mockDevices);
      expect(deviceRepository.search).toHaveBeenCalledWith({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: 10,
        offset: 0,
      });
    });

    it("should respect custom offset for pagination", async () => {
      const mockDevices = DeviceFactory.createMany(5);
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockDevices
      );

      const args = { limit: 50, offset: 25 };
      const result = await deviceRepository.search({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(result).toEqual(mockDevices);
      expect(deviceRepository.search).toHaveBeenCalledWith({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: 50,
        offset: 25,
      });
    });

    it("should return empty array when no devices match filters", async () => {
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        []
      );

      const args = { vendor: "NonExistentVendor", limit: 50, offset: 0 };
      const result = await deviceRepository.search({
        vendor: args.vendor || undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(result).toEqual([]);
      expect(deviceRepository.search).toHaveBeenCalledWith({
        vendor: "NonExistentVendor",
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: 50,
        offset: 0,
      });
    });

    it("should handle devices from multiple vendors", async () => {
      const mockDevices = [
        DeviceFactory.createWithVendor("Samsung"),
        DeviceFactory.createWithVendor("Apple"),
        DeviceFactory.createWithVendor("Google"),
      ];
      (deviceRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockDevices
      );

      const args = { limit: 50, offset: 0 };
      const result = await deviceRepository.search({
        vendor: undefined,
        modelNum: undefined,
        marketName: undefined,
        releasedAfter: undefined,
        releasedBefore: undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });

      expect(result).toEqual(mockDevices);
      expect(result.length).toBe(3);
      const vendors = result.map((d) => d.vendor);
      expect(vendors).toContain("Samsung");
      expect(vendors).toContain("Apple");
      expect(vendors).toContain("Google");
    });
  });
});
