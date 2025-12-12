import { builder } from "../builder";
import { BandType } from "../types/band";
import { bandRepository } from "../../../repositories";

builder.queryFields((t) => ({
  /**
   * Get a single band by ID
   */
  band: t.field({
    type: BandType,
    nullable: true,
    description: "Find a band by ID",
    args: {
      id: t.arg.id({ required: true, description: "Band ID" }),
    },
    resolve: async (_root, args, ctx) => {
      const bandId = Number(args.id);
      return ctx.loaders.bandById.load(bandId);
    },
  }),

  /**
   * Search/list bands with filters
   */
  bands: t.field({
    type: [BandType],
    description: "Search for bands with optional filters",
    args: {
      technology: t.arg.string({
        required: false,
        description: "Filter by technology (GSM, HSPA, LTE, NR)",
      }),
      bandNumber: t.arg.string({
        required: false,
        description: "Filter by band number (partial match)",
      }),
    },
    resolve: async (_root, args) => {
      return bandRepository.search({
        technology: args.technology || undefined,
        bandNumber: args.bandNumber || undefined,
      });
    },
  }),
}));
