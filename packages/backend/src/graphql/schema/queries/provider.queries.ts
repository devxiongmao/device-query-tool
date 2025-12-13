import { builder } from "../builder";
import { ProviderType } from "../types/provider";
import { providerRepository } from "../../../repositories";

builder.queryFields((t) => ({
  /**
   * Get a single provider by ID
   */
  provider: t.field({
    type: ProviderType,
    nullable: true,
    description: "Find a provider by ID",
    args: {
      id: t.arg.id({ required: true, description: "Provider ID" }),
    },
    resolve: async (_root, args, ctx) => {
      const providerId = Number(args.id);
      return ctx.loaders.providerById.load(providerId);
    },
  }),

  /**
   * List all providers
   */
  providers: t.field({
    type: [ProviderType],
    description: "Get all providers",
    resolve: async () => {
      return providerRepository.findAll();
    },
  }),
}));
