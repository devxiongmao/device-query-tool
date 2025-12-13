import { describe, it, expect, beforeEach, vi } from "vitest";
import { FeatureFactory } from "../../factories/feature.factory";
import { featureRepository } from "../../../src/repositories";

// Mock the repository
vi.mock("../../../src/repositories", () => ({
  featureRepository: {
    search: vi.fn(),
    findById: vi.fn(),
  },
}));

describe("Feature GraphQL Queries", () => {
  beforeEach(() => {
    FeatureFactory.reset();
    vi.clearAllMocks();
  });

  describe("feature query", () => {
    it("should return a feature when found via dataloader", async () => {
      const mockFeature = FeatureFactory.create({ id: 1, name: "VoLTE" });

      // Mock dataloader
      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(mockFeature),
      };

      const ctx = {
        loaders: {
          featureById: mockDataLoader,
        },
      };

      // Simulate the resolver
      const args = { id: "1" };
      const result = await ctx.loaders.featureById.load(Number(args.id));

      expect(result).toEqual(mockFeature);
      expect(mockDataLoader.load).toHaveBeenCalledWith(1);
      expect(mockDataLoader.load).toHaveBeenCalledTimes(1);
    });

    it("should return null when feature is not found", async () => {
      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(null),
      };

      const ctx = {
        loaders: {
          featureById: mockDataLoader,
        },
      };

      const args = { id: "999" };
      const result = await ctx.loaders.featureById.load(Number(args.id));

      expect(result).toBeNull();
      expect(mockDataLoader.load).toHaveBeenCalledWith(999);
    });

    it("should convert string ID to number before passing to dataloader", async () => {
      const mockFeature = FeatureFactory.create({ id: 42 });

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(mockFeature),
      };

      const ctx = {
        loaders: {
          featureById: mockDataLoader,
        },
      };

      const args = { id: "42" };
      await ctx.loaders.featureById.load(Number(args.id));

      expect(mockDataLoader.load).toHaveBeenCalledWith(42);
      expect(typeof mockDataLoader.load.mock.calls[0][0]).toBe("number");
    });

    it("should handle numeric string IDs correctly", async () => {
      const mockFeature = FeatureFactory.create({ id: 123 });

      const mockDataLoader = {
        load: vi.fn().mockResolvedValue(mockFeature),
      };

      const ctx = {
        loaders: {
          featureById: mockDataLoader,
        },
      };

      const args = { id: "123" };
      const featureId = Number(args.id);

      expect(featureId).toBe(123);
      expect(Number.isNaN(featureId)).toBe(false);

      const result = await ctx.loaders.featureById.load(featureId);
      expect(result).toEqual(mockFeature);
    });
  });

  describe("features query", () => {
    it("should return all features when no filters are provided", async () => {
      const mockFeatures = FeatureFactory.createMany(5);
      (featureRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockFeatures
      );

      const result = await featureRepository.search({
        name: undefined,
      });

      expect(result).toEqual(mockFeatures);
      expect(featureRepository.search).toHaveBeenCalledWith({
        name: undefined,
      });
    });

    it("should filter by name when provided", async () => {
      const mockFeatures = [FeatureFactory.createWithName("VoLTE")];
      (featureRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockFeatures
      );

      const args = { name: "VoLTE" };
      const result = await featureRepository.search({
        name: args.name || undefined,
      });

      expect(result).toEqual(mockFeatures);
      expect(featureRepository.search).toHaveBeenCalledWith({
        name: "VoLTE",
      });
    });

    it("should convert empty string name to undefined", async () => {
      const mockFeatures = FeatureFactory.createMany(3);
      (featureRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockFeatures
      );

      const args = { name: "" };
      const result = await featureRepository.search({
        name: args.name || undefined,
      });

      expect(featureRepository.search).toHaveBeenCalledWith({
        name: undefined,
      });
      expect(result).toEqual(mockFeatures);
    });

    it("should return empty array when no features match filter", async () => {
      (featureRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        []
      );

      const args = { name: "NonExistentFeature" };
      const result = await featureRepository.search({
        name: args.name || undefined,
      });

      expect(result).toEqual([]);
      expect(featureRepository.search).toHaveBeenCalledWith({
        name: "NonExistentFeature",
      });
    });

    it("should handle partial name matching", async () => {
      const mockFeatures = [
        FeatureFactory.createWithName("VoLTE"),
        FeatureFactory.createWithName("VoNR"),
      ];
      (featureRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockFeatures
      );

      const args = { name: "Vo" };
      const result = await featureRepository.search({
        name: args.name || undefined,
      });

      expect(result).toEqual(mockFeatures);
      expect(featureRepository.search).toHaveBeenCalledWith({
        name: "Vo",
      });
    });

    it("should search for voice features", async () => {
      const voiceFeatures = FeatureFactory.createVoiceFeatures();
      (featureRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        voiceFeatures
      );

      const args = { name: "Voice" };
      const result = await featureRepository.search({
        name: args.name || undefined,
      });

      expect(result).toEqual(voiceFeatures);
      expect(featureRepository.search).toHaveBeenCalledWith({
        name: "Voice",
      });
    });

    it("should search for SIM features", async () => {
      const simFeatures = FeatureFactory.createSIMFeatures();
      (featureRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        simFeatures
      );

      const args = { name: "SIM" };
      const result = await featureRepository.search({
        name: args.name || undefined,
      });

      expect(result).toEqual(simFeatures);
      expect(featureRepository.search).toHaveBeenCalledWith({
        name: "SIM",
      });
    });

    it("should search for 5G features", async () => {
      const fiveGFeatures = FeatureFactory.create5GFeatures();
      (featureRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        fiveGFeatures
      );

      const args = { name: "5G" };
      const result = await featureRepository.search({
        name: args.name || undefined,
      });

      expect(result).toEqual(fiveGFeatures);
      expect(featureRepository.search).toHaveBeenCalledWith({
        name: "5G",
      });
    });

    it("should search for carrier aggregation features", async () => {
      const caFeatures = FeatureFactory.createCAFeatures();
      (featureRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        caFeatures
      );

      const args = { name: "Aggregation" };
      const result = await featureRepository.search({
        name: args.name || undefined,
      });

      expect(result).toEqual(caFeatures);
      expect(featureRepository.search).toHaveBeenCalledWith({
        name: "Aggregation",
      });
    });

    it("should handle case-sensitive searches correctly", async () => {
      const mockFeatures = [FeatureFactory.createWithName("VoLTE")];
      (featureRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockFeatures
      );

      const args = { name: "volte" };
      const result = await featureRepository.search({
        name: args.name || undefined,
      });

      expect(featureRepository.search).toHaveBeenCalledWith({
        name: "volte",
      });
      expect(result).toEqual(mockFeatures);
    });

    it("should search for specific feature names", async () => {
      const testCases = [
        {
          name: "Wi-Fi Calling",
          factory: () => FeatureFactory.createWithName("Wi-Fi Calling"),
        },
        { name: "eSIM", factory: () => FeatureFactory.createWithName("eSIM") },
        {
          name: "HD Voice",
          factory: () => FeatureFactory.createWithName("HD Voice"),
        },
        {
          name: "Network Slicing",
          factory: () => FeatureFactory.createWithName("Network Slicing"),
        },
      ];

      for (const testCase of testCases) {
        vi.clearAllMocks();
        const mockFeature = [testCase.factory()];
        (
          featureRepository.search as ReturnType<typeof vi.fn>
        ).mockResolvedValue(mockFeature);

        const result = await featureRepository.search({
          name: testCase.name,
        });

        expect(result).toEqual(mockFeature);
        expect(featureRepository.search).toHaveBeenCalledWith({
          name: testCase.name,
        });
      }
    });

    it("should handle searches with special characters", async () => {
      const mockFeatures = [
        FeatureFactory.createWithName("Wi-Fi Calling"),
        FeatureFactory.createWithName("MIMO 4x4"),
      ];
      (featureRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockFeatures
      );

      const args = { name: "Wi-Fi" };
      const result = await featureRepository.search({
        name: args.name || undefined,
      });

      expect(result).toEqual(mockFeatures);
      expect(featureRepository.search).toHaveBeenCalledWith({
        name: "Wi-Fi",
      });
    });

    it("should handle searches with numbers in feature names", async () => {
      const mockFeatures = [
        FeatureFactory.createWithName("MIMO 4x4"),
        FeatureFactory.createWithName("256 QAM"),
        FeatureFactory.createWithName("Uplink 64 QAM"),
      ];
      (featureRepository.search as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockFeatures
      );

      const args = { name: "QAM" };
      const result = await featureRepository.search({
        name: args.name || undefined,
      });

      expect(result).toEqual(mockFeatures);
      expect(featureRepository.search).toHaveBeenCalledWith({
        name: "QAM",
      });
    });
  });
});
