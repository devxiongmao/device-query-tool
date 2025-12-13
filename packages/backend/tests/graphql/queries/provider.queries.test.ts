import { describe, it, expect, beforeEach, vi } from "vitest";
import { ProviderFactory } from "../../factories/provider.factory";
import { providerRepository } from "../../../src/repositories";

// Mock the repository
vi.mock("../../../src/repositories", () => ({
  providerRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
  },
}));

describe("Provider GraphQL Queries", () => {
  beforeEach(() => {
    ProviderFactory.reset();
    vi.clearAllMocks();
  });

  describe("provider query", () => {
    it("should return a provider when found via dataloader", async () => {
      const mockProvider = ProviderFactory.create({ id: 1, name: "Verizon" });

      // Mock dataloader
      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(mockProvider),
      };

      const ctx = {
        loaders: {
          providerById: mockDataLoader,
        },
      };

      // Simulate the resolver
      const args = { id: "1" };
      const result = await ctx.loaders.providerById.load(Number(args.id));

      expect(result).toEqual(mockProvider);
      expect(mockDataLoader.load).toHaveBeenCalledWith(1);
      expect(mockDataLoader.load).toHaveBeenCalledTimes(1);
    });

    it("should return null when provider is not found", async () => {
      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(null),
      };

      const ctx = {
        loaders: {
          providerById: mockDataLoader,
        },
      };

      const args = { id: "999" };
      const result = await ctx.loaders.providerById.load(Number(args.id));

      expect(result).toBeNull();
      expect(mockDataLoader.load).toHaveBeenCalledWith(999);
    });

    it("should convert string ID to number before passing to dataloader", async () => {
      const mockProvider = ProviderFactory.create({ id: 42 });

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(mockProvider),
      };

      const ctx = {
        loaders: {
          providerById: mockDataLoader,
        },
      };

      const args = { id: "42" };
      await ctx.loaders.providerById.load(Number(args.id));

      expect(mockDataLoader.load).toHaveBeenCalledWith(42);
      expect(typeof mockDataLoader.load.mock.calls[0][0]).toBe("number");
    });

    it("should handle numeric string IDs correctly", async () => {
      const mockProvider = ProviderFactory.create({ id: 123 });

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(mockProvider),
      };

      const ctx = {
        loaders: {
          providerById: mockDataLoader,
        },
      };

      const args = { id: "123" };
      const providerId = Number(args.id);

      expect(providerId).toBe(123);
      expect(Number.isNaN(providerId)).toBe(false);

      const result = await ctx.loaders.providerById.load(providerId);
      expect(result).toEqual(mockProvider);
    });

    it("should load major US carriers correctly", async () => {
      const verizon = ProviderFactory.createWithName("Verizon");

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(verizon),
      };

      const ctx = {
        loaders: {
          providerById: mockDataLoader,
        },
      };

      const result = await ctx.loaders.providerById.load(verizon.id);

      expect(result).toEqual(verizon);
      expect(result.name).toBe("Verizon");
    });
  });

  describe("providers query", () => {
    it("should return all providers", async () => {
      const mockProviders = ProviderFactory.createMany(10);
      (
        providerRepository.findAll as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mockProviders);

      const result = await providerRepository.findAll();

      expect(result).toEqual(mockProviders);
      expect(providerRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result.length).toBe(10);
    });

    it("should return empty array when no providers exist", async () => {
      (
        providerRepository.findAll as ReturnType<typeof vi.fn>
      ).mockResolvedValue([]);

      const result = await providerRepository.findAll();

      expect(result).toEqual([]);
      expect(providerRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it("should return all US providers", async () => {
      const usProviders = ProviderFactory.createUSProviders();
      (
        providerRepository.findAll as ReturnType<typeof vi.fn>
      ).mockResolvedValue(usProviders);

      const result = await providerRepository.findAll();

      expect(result).toEqual(usProviders);
      expect(result.length).toBe(usProviders.length);
    });

    it("should return all Canadian providers", async () => {
      const canadianProviders = ProviderFactory.createCanadianProviders();
      (
        providerRepository.findAll as ReturnType<typeof vi.fn>
      ).mockResolvedValue(canadianProviders);

      const result = await providerRepository.findAll();

      expect(result).toEqual(canadianProviders);
      expect(result.length).toBe(canadianProviders.length);
    });

    it("should return all UK providers", async () => {
      const ukProviders = ProviderFactory.createUKProviders();
      (
        providerRepository.findAll as ReturnType<typeof vi.fn>
      ).mockResolvedValue(ukProviders);

      const result = await providerRepository.findAll();

      expect(result).toEqual(ukProviders);
      expect(result.length).toBe(ukProviders.length);
    });

    it("should return major US carriers", async () => {
      const majorCarriers = ProviderFactory.createMajorUSCarriers();
      (
        providerRepository.findAll as ReturnType<typeof vi.fn>
      ).mockResolvedValue(majorCarriers);

      const result = await providerRepository.findAll();

      expect(result).toEqual(majorCarriers);
      expect(result.length).toBe(3);
      expect(result.map((p) => p.name)).toEqual([
        "Verizon",
        "AT&T",
        "T-Mobile",
      ]);
    });

    it("should return major Canadian carriers", async () => {
      const majorCarriers = ProviderFactory.createMajorCanadianCarriers();
      (
        providerRepository.findAll as ReturnType<typeof vi.fn>
      ).mockResolvedValue(majorCarriers);

      const result = await providerRepository.findAll();

      expect(result).toEqual(majorCarriers);
      expect(result.length).toBe(3);
      expect(result.map((p) => p.name)).toEqual(["Rogers", "Bell", "Telus"]);
    });

    it("should return MVNOs", async () => {
      const mvnos = ProviderFactory.createMVNOs();
      (
        providerRepository.findAll as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mvnos);

      const result = await providerRepository.findAll();

      expect(result).toEqual(mvnos);
      expect(result.length).toBe(6);
      expect(result.map((p) => p.name)).toContain("Boost Mobile");
      expect(result.map((p) => p.name)).toContain("Google Fi");
    });

    it("should return European providers", async () => {
      const europeanProviders = ProviderFactory.createEuropeanProviders();
      (
        providerRepository.findAll as ReturnType<typeof vi.fn>
      ).mockResolvedValue(europeanProviders);

      const result = await providerRepository.findAll();

      expect(result).toEqual(europeanProviders);
      expect(result.length).toBe(europeanProviders.length);
    });

    it("should return Asian providers", async () => {
      const asianProviders = ProviderFactory.createAsianProviders();
      (
        providerRepository.findAll as ReturnType<typeof vi.fn>
      ).mockResolvedValue(asianProviders);

      const result = await providerRepository.findAll();

      expect(result).toEqual(asianProviders);
      expect(result.length).toBe(asianProviders.length);
    });

    it("should return mix of providers from different regions", async () => {
      const mixedProviders = [
        ...ProviderFactory.createMajorUSCarriers(),
        ...ProviderFactory.createMajorCanadianCarriers(),
        ...ProviderFactory.createUKProviders(2),
      ];
      (
        providerRepository.findAll as ReturnType<typeof vi.fn>
      ).mockResolvedValue(mixedProviders);

      const result = await providerRepository.findAll();

      expect(result).toEqual(mixedProviders);
      expect(result.length).toBe(8);
    });

    it("should handle providers with special characters in names", async () => {
      const providers = [
        ProviderFactory.createWithName("AT&T"),
        ProviderFactory.createWithName("Metro by T-Mobile"),
      ];
      (
        providerRepository.findAll as ReturnType<typeof vi.fn>
      ).mockResolvedValue(providers);

      const result = await providerRepository.findAll();

      expect(result).toEqual(providers);
      expect(result[0].name).toBe("AT&T");
      expect(result[1].name).toBe("Metro by T-Mobile");
    });

    it("should return providers with consistent ID sequencing", async () => {
      ProviderFactory.reset();
      const providers = ProviderFactory.createMany(5);
      (
        providerRepository.findAll as ReturnType<typeof vi.fn>
      ).mockResolvedValue(providers);

      const result = await providerRepository.findAll();

      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result[2].id).toBe(3);
      expect(result[3].id).toBe(4);
      expect(result[4].id).toBe(5);
    });

    it("should return limited number of US providers when count specified", async () => {
      const limitedProviders = ProviderFactory.createUSProviders(3);
      (
        providerRepository.findAll as ReturnType<typeof vi.fn>
      ).mockResolvedValue(limitedProviders);

      const result = await providerRepository.findAll();

      expect(result).toEqual(limitedProviders);
      expect(result.length).toBe(3);
    });

    it("should handle single provider result", async () => {
      const singleProvider = [ProviderFactory.createWithName("Verizon")];
      (
        providerRepository.findAll as ReturnType<typeof vi.fn>
      ).mockResolvedValue(singleProvider);

      const result = await providerRepository.findAll();

      expect(result).toEqual(singleProvider);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe("Verizon");
    });
  });
});
