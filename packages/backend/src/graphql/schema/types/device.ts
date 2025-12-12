import { builder } from "../builder";
import { SoftwareType } from "./software";
import { BandType } from "./band";
import { ComboType } from "./combo";
import { FeatureType } from "./feature";

export const DeviceType = builder.objectRef<{
  id: number;
  vendor: string;
  modelNum: string;
  marketName: string | null;
  releaseDate: string;
}>("Device");

DeviceType.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    vendor: t.exposeString("vendor"),
    modelNum: t.exposeString("modelNum"),
    marketName: t.exposeString("marketName", { nullable: true }),
    releaseDate: t.expose("releaseDate", {
      type: "DateTime",
      description: "Device release date",
    }),

    // Software versions
    software: t.field({
      type: [SoftwareType],
      description: "All software versions for this device",
      args: {
        platform: t.arg.string({
          required: false,
          description: "Filter by platform (iOS, Android)",
        }),
        releasedAfter: t.arg({
          type: "DateTime",
          required: false,
          description: "Filter by release date",
        }),
      },
      resolve: async (device, args, ctx) => {
        return ctx.loaders.softwareByDevice.load({
          deviceId: device.id,
          platform: args.platform || undefined,
          releasedAfter:
            args.releasedAfter instanceof Date
              ? args.releasedAfter.toISOString()
              : args.releasedAfter || undefined,
        });
      },
    }),

    // Global band support
    supportedBands: t.field({
      type: [BandType],
      description: "Bands supported globally by this device",
      args: {
        technology: t.arg.string({
          required: false,
          description: "Filter by technology (GSM, HSPA, LTE, NR)",
        }),
        softwareId: t.arg.id({
          required: false,
          description: "Filter by specific software version",
        }),
      },
      resolve: async (device, args, ctx) => {
        // If no specific software version, get all software and aggregate bands
        if (!args.softwareId) {
          const softwares = await ctx.loaders.softwareByDevice.load({
            deviceId: device.id,
          });

          if (softwares.length === 0) return [];

          // Get bands for the latest software version
          const latestSoftware = softwares[softwares.length - 1];
          return ctx.loaders.bandsByDeviceSoftware.load({
            deviceId: device.id,
            softwareId: latestSoftware.id,
            technology: args.technology || undefined,
          });
        }

        // Get bands for specific software version
        return ctx.loaders.bandsByDeviceSoftware.load({
          deviceId: device.id,
          softwareId: Number(args.softwareId),
          technology: args.technology || undefined,
        });
      },
    }),

    // Provider-specific band support
    supportedBandsForProvider: t.field({
      type: [BandType],
      description: "Bands supported by this device for a specific provider",
      args: {
        providerId: t.arg.id({ required: true }),
        technology: t.arg.string({ required: false }),
        softwareId: t.arg.id({ required: false }),
      },
      resolve: async (device, args, ctx) => {
        // Get software
        const softwares = await ctx.loaders.softwareByDevice.load({
          deviceId: device.id,
        });

        if (softwares.length === 0) return [];

        const softwareId = args.softwareId
          ? Number(args.softwareId)
          : softwares[softwares.length - 1].id; // Latest

        return ctx.loaders.bandsByDeviceSoftwareProvider.load({
          deviceId: device.id,
          softwareId,
          providerId: Number(args.providerId),
          technology: args.technology || undefined,
        });
      },
    }),

    // Global combo support
    supportedCombos: t.field({
      type: [ComboType],
      description: "Combos supported globally by this device",
      args: {
        technology: t.arg.string({
          required: false,
          description: "Filter by technology (LTE CA, EN-DC, NR CA)",
        }),
        softwareId: t.arg.id({ required: false }),
      },
      resolve: async (device, args, ctx) => {
        const softwares = await ctx.loaders.softwareByDevice.load({
          deviceId: device.id,
        });

        if (softwares.length === 0) return [];

        const softwareId = args.softwareId
          ? Number(args.softwareId)
          : softwares[softwares.length - 1].id;

        return ctx.loaders.combosByDeviceSoftware.load({
          deviceId: device.id,
          softwareId,
          technology: args.technology || undefined,
        });
      },
    }),

    // Provider-specific combo support
    supportedCombosForProvider: t.field({
      type: [ComboType],
      description: "Combos supported by this device for a specific provider",
      args: {
        providerId: t.arg.id({ required: true }),
        technology: t.arg.string({ required: false }),
        softwareId: t.arg.id({ required: false }),
      },
      resolve: async (device, args, ctx) => {
        const softwares = await ctx.loaders.softwareByDevice.load({
          deviceId: device.id,
        });

        if (softwares.length === 0) return [];

        const softwareId = args.softwareId
          ? Number(args.softwareId)
          : softwares[softwares.length - 1].id;

        return ctx.loaders.combosByDeviceSoftwareProvider.load({
          deviceId: device.id,
          softwareId,
          providerId: Number(args.providerId),
          technology: args.technology || undefined,
        });
      },
    }),

    // Global features
    features: t.field({
      type: [FeatureType],
      description: "Features supported by this device (any provider)",
      args: {
        softwareId: t.arg.id({ required: false }),
      },
      resolve: async (device, args, ctx) => {
        const softwares = await ctx.loaders.softwareByDevice.load({
          deviceId: device.id,
        });

        if (softwares.length === 0) return [];

        const softwareId = args.softwareId
          ? Number(args.softwareId)
          : softwares[softwares.length - 1].id;

        return ctx.loaders.featuresByDeviceSoftwareProvider.load({
          deviceId: device.id,
          softwareId,
          providerId: undefined, // All providers
        });
      },
    }),

    // Provider-specific features
    featuresForProvider: t.field({
      type: [FeatureType],
      description: "Features supported by this device for a specific provider",
      args: {
        providerId: t.arg.id({ required: true }),
        softwareId: t.arg.id({ required: false }),
      },
      resolve: async (device, args, ctx) => {
        const softwares = await ctx.loaders.softwareByDevice.load({
          deviceId: device.id,
        });

        if (softwares.length === 0) return [];

        const softwareId = args.softwareId
          ? Number(args.softwareId)
          : softwares[softwares.length - 1].id;

        return ctx.loaders.featuresByDeviceSoftwareProvider.load({
          deviceId: device.id,
          softwareId,
          providerId: Number(args.providerId),
        });
      },
    }),
  }),
});
