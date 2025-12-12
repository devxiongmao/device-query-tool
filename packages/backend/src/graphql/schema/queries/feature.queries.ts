import { builder } from "../builder";
import { FeatureType } from "../types/feature";
import { featureRepository } from "../../../repositories";

builder.queryFields((t) => ({
  /**
   * Get a single feature by ID
   */
  feature: t.field({
    type: FeatureType,
    nullable: true,
    description: "Find a feature by ID",
    args: {
      id: t.arg.id({ required: true, description: "Feature ID" }),
    },
    resolve: async (_root, args, ctx) => {
      const featureId = Number(args.id);
      return ctx.loaders.featureById.load(featureId);
    },
  }),

  /**
   * Search/list features
   */
  features: t.field({
    type: [FeatureType],
    description: "Search for features with optional filters",
    args: {
      name: t.arg.string({
        required: false,
        description: "Filter by feature name (partial match)",
      }),
    },
    resolve: async (_root, args) => {
      return featureRepository.search({
        name: args.name || undefined,
      });
    },
  }),
}));
