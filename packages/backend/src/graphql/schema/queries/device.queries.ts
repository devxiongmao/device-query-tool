import { builder } from "../builder";
import { DeviceType } from "../types/device";
import { deviceRepository } from "../../../repositories";

// Extend the Query type with device queries
builder.queryFields((t) => ({
  /**
   * Get a single device by ID
   */
  device: t.field({
    type: DeviceType,
    nullable: true,
    description: "Find a device by ID",
    args: {
      id: t.arg.id({ required: true, description: "Device ID" }),
    },
    resolve: async (_root, args, ctx) => {
      const deviceId = Number(args.id);
      return ctx.loaders.deviceById.load(deviceId);
    },
  }),

  /**
   * Search/list devices with filters
   */
  devices: t.field({
    type: [DeviceType],
    description: "Search for devices with optional filters",
    args: {
      vendor: t.arg.string({
        required: false,
        description: "Filter by vendor (partial match)",
      }),
      modelNum: t.arg.string({
        required: false,
        description: "Filter by model number (partial match)",
      }),
      marketName: t.arg.string({
        required: false,
        description: "Filter by market name (partial match)",
      }),
      releasedAfter: t.arg({
        type: "DateTime",
        required: false,
        description: "Filter by release date (after)",
      }),
      releasedBefore: t.arg({
        type: "DateTime",
        required: false,
        description: "Filter by release date (before)",
      }),
      limit: t.arg.int({
        defaultValue: 50,
        description: "Maximum number of results (default: 50)",
      }),
      offset: t.arg.int({
        defaultValue: 0,
        description: "Offset for pagination (default: 0)",
      }),
    },
    resolve: async (_root, args, _ctx) => {
      return deviceRepository.search({
        vendor: args.vendor || undefined,
        modelNum: args.modelNum || undefined,
        marketName: args.marketName || undefined,
        releasedAfter: args.releasedAfter || undefined,
        releasedBefore: args.releasedBefore || undefined,
        limit: args.limit ?? undefined,
        offset: args.offset ?? undefined,
      });
    },
  }),
}));
