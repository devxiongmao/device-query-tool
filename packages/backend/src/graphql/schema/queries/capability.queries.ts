import { builder } from "../builder";
import { DeviceCapabilityResultType } from "../types/capability-results";
import {
  bandRepository,
  comboRepository,
  featureRepository,
} from "../../../repositories";

builder.queryFields((t) => ({
  /**
   * Find devices that support a specific band
   * User Story: Query for devices by band (global or provider-specific)
   */
  devicesByBand: t.field({
    type: [DeviceCapabilityResultType],
    description: "Find all devices that support a specific band",
    args: {
      bandId: t.arg.id({
        required: true,
        description: "Band ID to search for",
      }),
      providerId: t.arg.id({
        required: false,
        description: "Filter by provider-specific support",
      }),
      technology: t.arg.string({
        required: false,
        description: "Filter by technology (GSM, HSPA, LTE, NR)",
      }),
    },
    resolve: async (_root, args, ctx) => {
      const results = await bandRepository.findDevicesSupportingBand({
        bandId: Number(args.bandId),
        providerId: args.providerId ? Number(args.providerId) : undefined,
        technology: args.technology || undefined,
      });

      // Populate provider details if provider-specific
      if (args.providerId) {
        const provider = await ctx.loaders.providerById.load(
          Number(args.providerId)
        );
        results.forEach((result) => {
          result.provider = provider;
        });
      }

      return results;
    },
  }),

  /**
   * Find devices that support a specific combo
   * User Story: Query for devices by combo (global or provider-specific)
   */
  devicesByCombo: t.field({
    type: [DeviceCapabilityResultType],
    description: "Find all devices that support a specific combo",
    args: {
      comboId: t.arg.id({
        required: true,
        description: "Combo ID to search for",
      }),
      providerId: t.arg.id({
        required: false,
        description: "Filter by provider-specific support",
      }),
      technology: t.arg.string({
        required: false,
        description: "Filter by technology (LTE CA, EN-DC, NR CA)",
      }),
    },
    resolve: async (_root, args, ctx) => {
      const results = await comboRepository.findDevicesSupportingCombo({
        comboId: Number(args.comboId),
        providerId: args.providerId ? Number(args.providerId) : undefined,
        technology: args.technology || undefined,
      });

      // Populate provider details if provider-specific
      if (args.providerId) {
        const provider = await ctx.loaders.providerById.load(
          Number(args.providerId)
        );
        results.forEach((result) => {
          result.provider = provider;
        });
      }

      return results;
    },
  }),

  /**
   * Find devices that support a specific feature
   * User Story: Query for devices by feature (global or provider-specific)
   */
  devicesByFeature: t.field({
    type: [DeviceCapabilityResultType],
    description: "Find all devices that support a specific feature",
    args: {
      featureId: t.arg.id({
        required: true,
        description: "Feature ID to search for",
      }),
      providerId: t.arg.id({
        required: false,
        description: "Filter by provider-specific support",
      }),
    },
    resolve: async (_root, args, ctx) => {
      const results = await featureRepository.findDevicesSupportingFeature({
        featureId: Number(args.featureId),
        providerId: args.providerId ? Number(args.providerId) : undefined,
      });

      // Populate provider details if provider-specific
      if (args.providerId) {
        const provider = await ctx.loaders.providerById.load(
          Number(args.providerId)
        );
        results.forEach((result) => {
          result.provider = provider;
        });
      }

      return results;
    },
  }),

  /**
   * Advanced: Find devices that match multiple capability criteria
   * (Future enhancement - can implement if needed)
   */
  devicesByCapabilities: t.field({
    type: [DeviceCapabilityResultType],
    description:
      "Find devices matching multiple capability criteria (AND logic)",
    args: {
      bandIds: t.arg.idList({
        required: false,
        description: "Must support ALL these bands",
      }),
      comboIds: t.arg.idList({
        required: false,
        description: "Must support ALL these combos",
      }),
      featureIds: t.arg.idList({
        required: false,
        description: "Must support ALL these features",
      }),
      providerId: t.arg.id({
        required: false,
        description: "Filter by provider",
      }),
    },
    resolve: async (_root, _args, _ctx) => {
      // For now, return empty array
      // This would require a more complex query that intersects multiple result sets
      // Can implement if needed for advanced filtering
      return [];
    },
  }),
}));
