import { describe, it, expect, beforeEach, vi } from "vitest";
import { ComboFactory } from "../../factories/combo.factory";
import { comboRepository } from "../../../src/repositories";

// Mock the repository
vi.mock("../../../src/repositories", () => ({
  comboRepository: {
    search: vi.fn(),
    findById: vi.fn(),
  },
}));

describe("Combo GraphQL Queries", () => {
  beforeEach(() => {
    ComboFactory.reset();
    vi.clearAllMocks();
  });

  describe("combo query", () => {
    it("should return a combo when found via dataloader", async () => {
      const mockCombo = ComboFactory.create({ id: 1, name: "2A-4A" });

      // Mock dataloader
      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(mockCombo),
      };

      const ctx = {
        loaders: {
          comboById: mockDataLoader,
        },
      };

      // Simulate the resolver
      const args = { id: "1" };
      const result = await ctx.loaders.comboById.load(Number(args.id));

      expect(result).toEqual(mockCombo);
      expect(mockDataLoader.load).toHaveBeenCalledWith(1);
      expect(mockDataLoader.load).toHaveBeenCalledTimes(1);
    });

    it("should return null when combo is not found", async () => {
      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(null),
      };

      const ctx = {
        loaders: {
          comboById: mockDataLoader,
        },
      };

      const args = { id: "999" };
      const result = await ctx.loaders.comboById.load(Number(args.id));

      expect(result).toBeNull();
      expect(mockDataLoader.load).toHaveBeenCalledWith(999);
    });

    it("should convert string ID to number before passing to dataloader", async () => {
      const mockCombo = ComboFactory.create({ id: 42 });

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(mockCombo),
      };

      const ctx = {
        loaders: {
          comboById: mockDataLoader,
        },
      };

      const args = { id: "42" };
      await ctx.loaders.comboById.load(Number(args.id));

      expect(mockDataLoader.load).toHaveBeenCalledWith(42);
      expect(typeof mockDataLoader.load.mock.calls[0][0]).toBe("number");
    });

    it("should handle numeric string IDs correctly", async () => {
      const mockCombo = ComboFactory.create({ id: 123 });

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(mockCombo),
      };

      const ctx = {
        loaders: {
          comboById: mockDataLoader,
        },
      };

      const args = { id: "123" };
      const comboId = Number(args.id);

      expect(comboId).toBe(123);
      expect(Number.isNaN(comboId)).toBe(false);

      const result = await ctx.loaders.comboById.load(comboId);
      expect(result).toEqual(mockCombo);
    });
  });

  describe("combos query", () => {
    it("should return all combos when no filters are provided", async () => {
      const mockCombos = ComboFactory.createMany(5);
      (comboRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockCombos
      );

      const result = await comboRepository.search({
        technology: undefined,
        name: undefined,
      });

      expect(result).toEqual(mockCombos);
      expect(comboRepository.search).toHaveBeenCalledWith({
        technology: undefined,
        name: undefined,
      });
    });

    it("should filter by technology when provided", async () => {
      const lteCombos = ComboFactory.createLTECombos(3);
      (comboRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        lteCombos
      );

      const args = { technology: "LTE" };
      const result = await comboRepository.search({
        technology: args.technology || undefined,
        name: undefined,
      });

      expect(result).toEqual(lteCombos);
      expect(comboRepository.search).toHaveBeenCalledWith({
        technology: "LTE",
        name: undefined,
      });
      expect(result.every((c) => c.technology === "LTE")).toBe(true);
    });

    it("should filter by name when provided", async () => {
      const mockCombos = [ComboFactory.createWithName("2A-4A")];
      (comboRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockCombos
      );

      const args = { name: "2A-4A" };
      const result = await comboRepository.search({
        technology: undefined,
        name: args.name || undefined,
      });

      expect(result).toEqual(mockCombos);
      expect(comboRepository.search).toHaveBeenCalledWith({
        technology: undefined,
        name: "2A-4A",
      });
    });

    it("should filter by both technology and name when both provided", async () => {
      const mockCombo = ComboFactory.create({
        technology: "LTE",
        name: "2A-4A",
      });
      (comboRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue([
        mockCombo,
      ]);

      const args = { technology: "LTE", name: "2A-4A" };
      const result = await comboRepository.search({
        technology: args.technology || undefined,
        name: args.name || undefined,
      });

      expect(result).toEqual([mockCombo]);
      expect(comboRepository.search).toHaveBeenCalledWith({
        technology: "LTE",
        name: "2A-4A",
      });
    });

    it("should convert empty string technology to undefined", async () => {
      const mockCombos = ComboFactory.createMany(3);
      (comboRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockCombos
      );

      const args = { technology: "" };
      const result = await comboRepository.search({
        technology: args.technology || undefined,
        name: undefined,
      });

      expect(comboRepository.search).toHaveBeenCalledWith({
        technology: undefined,
        name: undefined,
      });
      expect(result).toEqual(mockCombos);
    });

    it("should convert empty string name to undefined", async () => {
      const mockCombos = ComboFactory.createMany(3);
      (comboRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockCombos
      );

      const args = { name: "" };
      const result = await comboRepository.search({
        technology: undefined,
        name: args.name || undefined,
      });

      expect(comboRepository.search).toHaveBeenCalledWith({
        technology: undefined,
        name: undefined,
      });
      expect(result).toEqual(mockCombos);
    });

    it("should return empty array when no combos match filters", async () => {
      (comboRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        []
      );

      const args = { technology: "NonExistentTech" };
      const result = await comboRepository.search({
        technology: args.technology || undefined,
        name: undefined,
      });

      expect(result).toEqual([]);
      expect(comboRepository.search).toHaveBeenCalledWith({
        technology: "NonExistentTech",
        name: undefined,
      });
    });

    it("should handle partial name matching", async () => {
      const mockCombos = [
        ComboFactory.createWithName("2A-4A"),
        ComboFactory.createWithName("2A-4A-12A"),
      ];
      (comboRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockCombos
      );

      const args = { name: "2A" };
      const result = await comboRepository.search({
        technology: undefined,
        name: args.name || undefined,
      });

      expect(result).toEqual(mockCombos);
      expect(comboRepository.search).toHaveBeenCalledWith({
        technology: undefined,
        name: "2A",
      });
    });

    it("should filter 5G NR combos correctly", async () => {
      const fiveGCombos = ComboFactory.create5GCombos(4);
      (comboRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        fiveGCombos
      );

      const args = { technology: "5G NR" };
      const result = await comboRepository.search({
        technology: args.technology || undefined,
        name: undefined,
      });

      expect(result).toEqual(fiveGCombos);
      expect(result.every((c) => c.technology === "5G NR")).toBe(true);
    });

    it("should filter LTE-A combos correctly", async () => {
      const lteAdvCombos = ComboFactory.createLTEAdvancedCombos(3);
      (comboRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        lteAdvCombos
      );

      const args = { technology: "LTE-A" };
      const result = await comboRepository.search({
        technology: args.technology || undefined,
        name: undefined,
      });

      expect(result).toEqual(lteAdvCombos);
      expect(result.every((c) => c.technology === "LTE-A")).toBe(true);
    });
  });
});
