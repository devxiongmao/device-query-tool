import { builder } from "../builder";
import { ComboType } from "../types/combo";
import { comboRepository } from "../../../repositories";

builder.queryFields((t) => ({
  /**
   * Get a single combo by ID
   */
  combo: t.field({
    type: ComboType,
    nullable: true,
    description: "Find a combo by ID",
    args: {
      id: t.arg.id({ required: true, description: "Combo ID" }),
    },
    resolve: async (_root, args, ctx) => {
      const comboId = Number(args.id);
      return ctx.loaders.comboById.load(comboId);
    },
  }),

  /**
   * Search/list combos with filters
   */
  combos: t.field({
    type: [ComboType],
    description: "Search for combos with optional filters",
    args: {
      technology: t.arg.string({
        required: false,
        description: "Filter by technology (LTE CA, EN-DC, NR CA)",
      }),
      name: t.arg.string({
        required: false,
        description: "Filter by combo name (partial match)",
      }),
    },
    resolve: async (_root, args) => {
      return comboRepository.search({
        technology: args.technology || undefined,
        name: args.name || undefined,
      });
    },
  }),
}));
