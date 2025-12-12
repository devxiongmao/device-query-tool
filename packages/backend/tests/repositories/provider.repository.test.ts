import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { ProviderRepository } from "../../src/repositories/provider.repository";
import { ProviderFactory } from "../factories/provider.factory";
import { db } from "../../src/db/client";

// Mock the database
vi.mock("../../src/db/client", () => ({
  db: {
    select: vi.fn(),
  },
}));

describe("ProviderRepository", () => {
  let repository: ProviderRepository;
  let mockSelect: any;

  beforeEach(() => {
    ProviderFactory.reset();
    repository = new ProviderRepository();

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
    it("should return provider when found", async () => {
      const mockProvider = ProviderFactory.create({ id: 1 });
      mockSelect.limit.mockResolvedValue([mockProvider]);

      const result = await repository.findById(1);

      expect(result).toEqual(mockProvider);
      expect(db.select).toHaveBeenCalled();
      expect(mockSelect.where).toHaveBeenCalled();
      expect(mockSelect.limit).toHaveBeenCalledWith(1);
    });

    it("should return null when provider not found", async () => {
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

    it("should return provider with all fields populated", async () => {
      const mockProvider = ProviderFactory.createWithName("Verizon");
      mockSelect.limit.mockResolvedValue([mockProvider]);

      const result = await repository.findById(1);

      expect(result).toBeDefined();
      expect(result?.id).toBe(mockProvider.id);
      expect(result?.name).toBe("Verizon");
    });
  });

  describe("findByIds", () => {
    it("should return empty array when given empty array", async () => {
      const result = await repository.findByIds([]);

      expect(result).toEqual([]);
      expect(db.select).not.toHaveBeenCalled();
    });

    it("should return multiple providers for valid IDs", async () => {
      const mockProviders = ProviderFactory.createMajorUSCarriers();
      mockSelect.where.mockResolvedValue(mockProviders);

      const result = await repository.findByIds([1, 2, 3]);

      expect(result).toEqual(mockProviders);
      expect(result).toHaveLength(3);
      expect(mockSelect.where).toHaveBeenCalled();
    });

    it("should handle single ID in array", async () => {
      const mockProvider = ProviderFactory.create({ id: 1 });
      mockSelect.where.mockResolvedValue([mockProvider]);

      const result = await repository.findByIds([1]);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockProvider);
    });

    it("should handle large array of IDs", async () => {
      const ids = Array.from({ length: 100 }, (_, i) => i + 1);
      const mockProviders = ProviderFactory.createMany(100);
      mockSelect.where.mockResolvedValue(mockProviders);

      const result = await repository.findByIds(ids);

      expect(result).toHaveLength(100);
    });

    it("should return providers in any order from database", async () => {
      const providers = [
        ProviderFactory.createWithName("T-Mobile"),
        ProviderFactory.createWithName("Verizon"),
        ProviderFactory.createWithName("AT&T"),
      ];
      mockSelect.where.mockResolvedValue(providers);

      const result = await repository.findByIds([1, 2, 3]);

      expect(result).toHaveLength(3);
      expect(result.map((p) => p.name)).toContain("Verizon");
      expect(result.map((p) => p.name)).toContain("AT&T");
      expect(result.map((p) => p.name)).toContain("T-Mobile");
    });

    it("should handle duplicate IDs gracefully", async () => {
      const mockProviders = ProviderFactory.createMany(2);
      mockSelect.where.mockResolvedValue(mockProviders);

      const result = await repository.findByIds([1, 1, 2, 2]);

      // Database should handle deduplication
      expect(mockSelect.where).toHaveBeenCalled();
      expect(result.length).toBeGreaterThan(0);
    });

    it("should work with major carrier IDs", async () => {
      const majorCarriers = ProviderFactory.createMajorUSCarriers();
      mockSelect.where.mockResolvedValue(majorCarriers);

      const result = await repository.findByIds([1, 2, 3]);

      expect(result.some((p) => p.name === "Verizon")).toBe(true);
      expect(result.some((p) => p.name === "AT&T")).toBe(true);
      expect(result.some((p) => p.name === "T-Mobile")).toBe(true);
    });

    it("should work with MVNO IDs", async () => {
      const mvnos = ProviderFactory.createMVNOs();
      mockSelect.where.mockResolvedValue(mvnos.slice(0, 3));

      const result = await repository.findByIds([10, 11, 12]);

      expect(result).toHaveLength(3);
      expect(
        result.every((p) =>
          [
            "Boost Mobile",
            "Cricket Wireless",
            "Metro by T-Mobile",
            "Visible",
            "Mint Mobile",
            "Google Fi",
          ].includes(p.name)
        )
      ).toBe(true);
    });
  });

  describe("findAll", () => {
    it("should return all providers ordered by name", async () => {
      const mockProviders = [
        ProviderFactory.createWithName("AT&T"),
        ProviderFactory.createWithName("T-Mobile"),
        ProviderFactory.createWithName("Verizon"),
      ];
      mockSelect.orderBy.mockResolvedValue(mockProviders);

      const result = await repository.findAll();

      expect(result).toEqual(mockProviders);
      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should return empty array when no providers exist", async () => {
      mockSelect.orderBy.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });

    it("should handle large number of providers", async () => {
      const mockProviders = ProviderFactory.createMany(100);
      mockSelect.orderBy.mockResolvedValue(mockProviders);

      const result = await repository.findAll();

      expect(result).toHaveLength(100);
      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should include providers from different regions", async () => {
      const usProviders = ProviderFactory.createUSProviders(3);
      const canadianProviders = ProviderFactory.createCanadianProviders(3);
      const allProviders = [...usProviders, ...canadianProviders];
      mockSelect.orderBy.mockResolvedValue(allProviders);

      const result = await repository.findAll();

      expect(result).toHaveLength(6);
      expect(
        result.some((p) => ["Verizon", "AT&T", "T-Mobile"].includes(p.name))
      ).toBe(true);
      expect(
        result.some((p) => ["Rogers", "Bell", "Telus"].includes(p.name))
      ).toBe(true);
    });

    it("should include both major carriers and MVNOs", async () => {
      const majorCarriers = ProviderFactory.createMajorUSCarriers();
      const mvnos = ProviderFactory.createMVNOs();
      const allProviders = [...majorCarriers, ...mvnos];
      mockSelect.orderBy.mockResolvedValue(allProviders);

      const result = await repository.findAll();

      expect(result.length).toBeGreaterThan(0);
      expect(mockSelect.orderBy).toHaveBeenCalled();
    });

    it("should handle providers with special characters in names", async () => {
      const providers = [
        ProviderFactory.createWithName("AT&T"),
        ProviderFactory.createWithName("Metro by T-Mobile"),
        ProviderFactory.createWithName("O'Reilly Mobile"), // hypothetical
      ];
      mockSelect.orderBy.mockResolvedValue(providers);

      const result = await repository.findAll();

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe("AT&T");
    });

    it("should order alphabetically", async () => {
      const providers = [
        ProviderFactory.createWithName("Verizon"),
        ProviderFactory.createWithName("AT&T"),
        ProviderFactory.createWithName("T-Mobile"),
      ];
      // Assume DB returns them ordered
      const orderedProviders = [providers[1], providers[2], providers[0]];
      mockSelect.orderBy.mockResolvedValue(orderedProviders);

      const result = await repository.findAll();

      expect(mockSelect.orderBy).toHaveBeenCalled();
      // The mock returns pre-ordered results
      expect(result[0].name).toBe("AT&T");
    });
  });

  describe("edge cases", () => {
    it("should handle providers with ampersands in name", async () => {
      const provider = ProviderFactory.createWithName("AT&T");
      mockSelect.limit.mockResolvedValue([provider]);

      const result = await repository.findById(1);

      expect(result?.name).toBe("AT&T");
    });

    it("should handle providers with spaces in name", async () => {
      const provider = ProviderFactory.createWithName("US Cellular");
      mockSelect.limit.mockResolvedValue([provider]);

      const result = await repository.findById(1);

      expect(result?.name).toBe("US Cellular");
    });

    it("should handle providers with hyphens in name", async () => {
      const provider = ProviderFactory.createWithName("T-Mobile");
      mockSelect.limit.mockResolvedValue([provider]);

      const result = await repository.findById(1);

      expect(result?.name).toBe("T-Mobile");
    });

    it("should handle providers with multiple words", async () => {
      const provider = ProviderFactory.createWithName("Metro by T-Mobile");
      mockSelect.limit.mockResolvedValue([provider]);

      const result = await repository.findById(1);

      expect(result?.name).toBe("Metro by T-Mobile");
    });

    it("should handle international provider names", async () => {
      const providers = [
        ProviderFactory.createWithName("NTT Docomo"),
        ProviderFactory.createWithName("Deutsche Telekom"),
        ProviderFactory.createWithName("Telefónica"),
      ];
      mockSelect.where.mockResolvedValue(providers);

      const result = await repository.findByIds([1, 2, 3]);

      expect(result).toHaveLength(3);
    });

    it("should handle providers with accented characters", async () => {
      const provider = ProviderFactory.createWithName("Telefónica");
      mockSelect.limit.mockResolvedValue([provider]);

      const result = await repository.findById(1);

      expect(result?.name).toBe("Telefónica");
    });

    it("should handle empty provider name edge case", async () => {
      const provider = ProviderFactory.create({ name: "" });
      mockSelect.limit.mockResolvedValue([provider]);

      const result = await repository.findById(1);

      expect(result).toBeDefined();
      expect(result?.name).toBe("");
    });

    it("should handle very long provider names", async () => {
      const longName =
        "Very Long Provider Name With Many Words International Mobile Communications Corporation";
      const provider = ProviderFactory.create({ name: longName });
      mockSelect.limit.mockResolvedValue([provider]);

      const result = await repository.findById(1);

      expect(result?.name).toBe(longName);
    });

    it("should handle findByIds with sequential IDs", async () => {
      const providers = ProviderFactory.createMany(10);
      mockSelect.where.mockResolvedValue(providers);

      const result = await repository.findByIds([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      ]);

      expect(result).toHaveLength(10);
    });

    it("should handle findByIds with non-sequential IDs", async () => {
      const providers = [
        ProviderFactory.create({ id: 1 }),
        ProviderFactory.create({ id: 5 }),
        ProviderFactory.create({ id: 10 }),
        ProviderFactory.create({ id: 99 }),
      ];
      mockSelect.where.mockResolvedValue(providers);

      const result = await repository.findByIds([1, 5, 10, 99]);

      expect(result).toHaveLength(4);
    });
  });

  describe("DataLoader compatibility", () => {
    it("should work efficiently with DataLoader pattern for batch loading", async () => {
      const providers = ProviderFactory.createMajorUSCarriers();
      mockSelect.where.mockResolvedValue(providers);

      // Simulate DataLoader batch
      const ids = [1, 2, 3];
      const result = await repository.findByIds(ids);

      expect(result).toHaveLength(3);
      expect(db.select).toHaveBeenCalledTimes(1); // Single query
    });

    it("should handle DataLoader with mixed existing and non-existing IDs", async () => {
      const existingProviders = ProviderFactory.createMany(2);
      mockSelect.where.mockResolvedValue(existingProviders);

      // Request IDs where some don't exist
      const result = await repository.findByIds([1, 2, 999]);

      // Returns only existing providers
      expect(result).toHaveLength(2);
    });

    it("should support batching many providers efficiently", async () => {
      const manyProviders = ProviderFactory.createMany(50);
      mockSelect.where.mockResolvedValue(manyProviders);

      const ids = Array.from({ length: 50 }, (_, i) => i + 1);
      const result = await repository.findByIds(ids);

      expect(result).toHaveLength(50);
      expect(db.select).toHaveBeenCalledTimes(1);
    });
  });

  describe("real-world scenarios", () => {
    it("should retrieve all US major carriers", async () => {
      const majorCarriers = ProviderFactory.createMajorUSCarriers();
      mockSelect.where.mockResolvedValue(majorCarriers);

      const result = await repository.findByIds([1, 2, 3]);

      expect(result.map((p) => p.name)).toEqual(
        expect.arrayContaining(["Verizon", "AT&T", "T-Mobile"])
      );
    });

    it("should retrieve Canadian carriers", async () => {
      const canadianCarriers = ProviderFactory.createMajorCanadianCarriers();
      mockSelect.where.mockResolvedValue(canadianCarriers);

      const result = await repository.findByIds([10, 11, 12]);

      expect(result.map((p) => p.name)).toEqual(
        expect.arrayContaining(["Rogers", "Bell", "Telus"])
      );
    });

    it("should handle mixed major carriers and MVNOs", async () => {
      const providers = [
        ProviderFactory.createWithName("Verizon"),
        ProviderFactory.createWithName("Visible"), // MVNO on Verizon
        ProviderFactory.createWithName("AT&T"),
        ProviderFactory.createWithName("Cricket Wireless"), // MVNO on AT&T
      ];
      mockSelect.where.mockResolvedValue(providers);

      const result = await repository.findByIds([1, 2, 3, 4]);

      expect(result).toHaveLength(4);
      expect(result.some((p) => p.name === "Verizon")).toBe(true);
      expect(result.some((p) => p.name === "Visible")).toBe(true);
    });
  });
});
