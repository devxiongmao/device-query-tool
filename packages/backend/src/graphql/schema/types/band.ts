import { builder } from "../builder";
import { DeviceType } from "./device";
import { DeviceBandType, ProviderDeviceBandType } from "./junctions";

export const TechnologyType = builder.enumType("Technology", {
  values: ["GSM", "HSPA", "LTE", "NR"] as const,
});

export const BandType = builder.objectRef<{
  id: number;
  bandNumber: string;
  technology: string;
  dlBandClass: string | null;
  ulBandClass: string | null;
}>("Band");

BandType.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    bandNumber: t.exposeString("bandNumber"),
    technology: t.exposeString("technology"),
    dlBandClass: t.exposeString("dlBandClass", {
      nullable: true,
      description: "Downlink bandwidth class for the band",
    }),
    ulBandClass: t.exposeString("ulBandClass", {
      nullable: true,
      description: "Uplink bandwidth class for the band",
    }),

    // DEVICES SUPPORTING THIS BAND (simplified)
    devices: t.field({
      type: [DeviceType],
      description: "Devices that support this band (simplified)",
      args: {
        providerId: t.arg.id({ required: false }),
      },
      resolve: async (band, args, ctx) => {
        const results = await ctx.loaders.devicesByBand.load({
          bandId: band.id,
          providerId: args.providerId ? Number(args.providerId) : undefined,
        });

        return results.map((r) => r.device);
      },
    }),

    // Detailed junction data (for future use)
    deviceSupport: t.field({
      type: [DeviceBandType],
      description: "Detailed device/software/band relationships (global)",
      resolve: async () => [],
    }),

    // Provider-specific detailed support
    providerDeviceSupport: t.field({
      type: [ProviderDeviceBandType],
      description:
        "Detailed device/software/band relationships (provider-specific)",
      args: {
        providerId: t.arg.id({ required: false }),
      },
      resolve: async () => [],
    }),
  }),
});
