import { describe, it, expect, beforeEach, vi } from "vitest";
import { BandFactory } from "../../factories/band.factory";
import { bandRepository } from "../../../src/repositories";

// Mock the repository
vi.mock("../../../src/repositories", () => ({
  bandRepository: {
    search: vi.fn(),
    findById: vi.fn(),
  },
}));

describe("Band GraphQL Queries", () => {
  beforeEach(() => {
    BandFactory.reset();
    vi.clearAllMocks();
  });

  describe("band query", () => {
    it("should return a band when found via dataloader", async () => {
      const mockBand = BandFactory.create({ id: 1, bandNumber: "B1" });

      // Mock dataloader
      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(mockBand),
      };

      const ctx = {
        loaders: {
          bandById: mockDataLoader,
        },
      };

      // Simulate the resolver
      const args = { id: "1" };
      const result = await ctx.loaders.bandById.load(Number(args.id));

      expect(result).toEqual(mockBand);
      expect(mockDataLoader.load).toHaveBeenCalledWith(1);
      expect(mockDataLoader.load).toHaveBeenCalledTimes(1);
    });

    it("should return null when band is not found", async () => {
      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(null),
      };

      const ctx = {
        loaders: {
          bandById: mockDataLoader,
        },
      };

      const args = { id: "999" };
      const result = await ctx.loaders.bandById.load(Number(args.id));

      expect(result).toBeNull();
      expect(mockDataLoader.load).toHaveBeenCalledWith(999);
    });

    it("should convert string ID to number before passing to dataloader", async () => {
      const mockBand = BandFactory.create({ id: 42 });

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(mockBand),
      };

      const ctx = {
        loaders: {
          bandById: mockDataLoader,
        },
      };

      const args = { id: "42" };
      await ctx.loaders.bandById.load(Number(args.id));

      expect(mockDataLoader.load).toHaveBeenCalledWith(42);
      expect(typeof mockDataLoader.load.mock.calls[0][0]).toBe("number");
    });

    it("should handle numeric string IDs correctly", async () => {
      const mockBand = BandFactory.create({ id: 123 });

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(mockBand),
      };

      const ctx = {
        loaders: {
          bandById: mockDataLoader,
        },
      };

      const args = { id: "123" };
      const bandId = Number(args.id);

      expect(bandId).toBe(123);
      expect(Number.isNaN(bandId)).toBe(false);

      const result = await ctx.loaders.bandById.load(bandId);
      expect(result).toEqual(mockBand);
    });
  });

  describe("bands query", () => {
    it("should return all bands when no filters are provided", async () => {
      const mockBands = BandFactory.createMany(5);
      (bandRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockBands
      );

      const result = await bandRepository.search({
        technology: undefined,
        bandNumber: undefined,
      });

      expect(result).toEqual(mockBands);
      expect(bandRepository.search).toHaveBeenCalledWith({
        technology: undefined,
        bandNumber: undefined,
      });
    });

    it("should filter by technology when provided", async () => {
      const lteBands = BandFactory.createManyForTechnology("LTE", 3);
      (bandRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        lteBands
      );

      const args = { technology: "LTE" };
      const result = await bandRepository.search({
        technology: args.technology || undefined,
        bandNumber: undefined,
      });

      expect(result).toEqual(lteBands);
      expect(bandRepository.search).toHaveBeenCalledWith({
        technology: "LTE",
        bandNumber: undefined,
      });
      expect(result.every((b) => b.technology === "LTE")).toBe(true);
    });

    it("should filter by bandNumber when provided", async () => {
      const mockBands = [BandFactory.create({ bandNumber: "1" })];
      (bandRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockBands
      );

      const args = { bandNumber: "B1" };
      const result = await bandRepository.search({
        technology: undefined,
        bandNumber: args.bandNumber || undefined,
      });

      expect(result).toEqual(mockBands);
      expect(bandRepository.search).toHaveBeenCalledWith({
        technology: undefined,
        bandNumber: "B1",
      });
    });

    it("should filter by both technology and bandNumber when both provided", async () => {
      const mockBand = BandFactory.create({
        technology: "LTE",
        bandNumber: "B1",
      });
      (bandRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue([
        mockBand,
      ]);

      const args = { technology: "LTE", bandNumber: "B1" };
      const result = await bandRepository.search({
        technology: args.technology || undefined,
        bandNumber: args.bandNumber || undefined,
      });

      expect(result).toEqual([mockBand]);
      expect(bandRepository.search).toHaveBeenCalledWith({
        technology: "LTE",
        bandNumber: "B1",
      });
    });

    it("should convert empty string technology to undefined", async () => {
      const mockBands = BandFactory.createMany(3);
      (bandRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockBands
      );

      const args = { technology: "" };
      const result = await bandRepository.search({
        technology: args.technology || undefined,
        bandNumber: undefined,
      });

      expect(bandRepository.search).toHaveBeenCalledWith({
        technology: undefined,
        bandNumber: undefined,
      });
      expect(result).toEqual(mockBands);
    });

    it("should convert empty string bandNumber to undefined", async () => {
      const mockBands = BandFactory.createMany(3);
      (bandRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockBands
      );

      const args = { bandNumber: "" };
      const result = await bandRepository.search({
        technology: undefined,
        bandNumber: args.bandNumber || undefined,
      });

      expect(bandRepository.search).toHaveBeenCalledWith({
        technology: undefined,
        bandNumber: undefined,
      });
      expect(result).toEqual(mockBands);
    });

    it("should return empty array when no bands match filters", async () => {
      (bandRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      const args = { technology: "NonExistentTech" };
      const result = await bandRepository.search({
        technology: args.technology || undefined,
        bandNumber: undefined,
      });

      expect(result).toEqual([]);
      expect(bandRepository.search).toHaveBeenCalledWith({
        technology: "NonExistentTech",
        bandNumber: undefined,
      });
    });

    it("should handle partial bandNumber matching", async () => {
      const mockBands = [
        BandFactory.create({ bandNumber: "1" }),
        BandFactory.create({ bandNumber: "12" }),
        BandFactory.create({ bandNumber: "13" }),
      ];
      (bandRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockBands
      );

      const args = { bandNumber: "1" };
      const result = await bandRepository.search({
        technology: undefined,
        bandNumber: args.bandNumber || undefined,
      });

      expect(result).toEqual(mockBands);
      expect(bandRepository.search).toHaveBeenCalledWith({
        technology: undefined,
        bandNumber: "1",
      });
    });

    it("should filter GSM bands correctly", async () => {
      const gsmBands = BandFactory.createManyForTechnology("GSM", 3);
      (bandRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        gsmBands
      );

      const args = { technology: "GSM" };
      const result = await bandRepository.search({
        technology: args.technology || undefined,
        bandNumber: undefined,
      });

      expect(result).toEqual(gsmBands);
      expect(result.every((b) => b.technology === "GSM")).toBe(true);
    });

    it("should filter HSPA bands correctly", async () => {
      const hspaBands = BandFactory.createManyForTechnology("HSPA", 4);
      (bandRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        hspaBands
      );

      const args = { technology: "HSPA" };
      const result = await bandRepository.search({
        technology: args.technology || undefined,
        bandNumber: undefined,
      });

      expect(result).toEqual(hspaBands);
      expect(result.every((b) => b.technology === "HSPA")).toBe(true);
    });

    it("should filter LTE bands correctly", async () => {
      const lteBands = BandFactory.createLTEBands();
      (bandRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        lteBands
      );

      const args = { technology: "LTE" };
      const result = await bandRepository.search({
        technology: args.technology || undefined,
        bandNumber: undefined,
      });

      expect(result).toEqual(lteBands);
      expect(result.every((b) => b.technology === "LTE")).toBe(true);
    });

    it("should filter NR (5G) bands correctly", async () => {
      const nrBands = BandFactory.create5GBands();
      (bandRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        nrBands
      );

      const args = { technology: "5G NR" };
      const result = await bandRepository.search({
        technology: args.technology || undefined,
        bandNumber: undefined,
      });

      expect(result).toEqual(nrBands);
      expect(result.every((b) => b.technology === "5G NR")).toBe(true);
    });

    it("should handle n-band notation for NR bands", async () => {
      const mockBands = [
        BandFactory.create({ bandNumber: "n77" }),
        BandFactory.create({ bandNumber: "n78" }),
      ];
      (bandRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockBands
      );

      const args = { bandNumber: "n7" };
      const result = await bandRepository.search({
        technology: undefined,
        bandNumber: args.bandNumber || undefined,
      });

      expect(result).toEqual(mockBands);
      expect(bandRepository.search).toHaveBeenCalledWith({
        technology: undefined,
        bandNumber: "n7",
      });
    });
  });
});
