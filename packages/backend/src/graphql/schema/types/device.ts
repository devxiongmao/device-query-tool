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
  createdAt: Date;
  updatedAt: Date;
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
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),

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
      resolve: async (_device, _args, _ctx) => {
        // Will implement in next task
        return [];
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
      resolve: async (_device, _args, _ctx) => {
        // Will implement in next task
        return [];
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
      resolve: async (_device, _args, _ctx) => {
        // Will implement in next task
        return [];
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
      resolve: async (_device, _args, _ctx) => {
        // Will implement in next task
        return [];
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
      resolve: async (_device, _args, _ctx) => {
        // Will implement in next task
        return [];
      },
    }),

    // Global features
    features: t.field({
      type: [FeatureType],
      description: "Features supported by this device (any provider)",
      args: {
        softwareId: t.arg.id({ required: false }),
      },
      resolve: async (_device, _args, _ctx) => {
        // Will implement in next task
        return [];
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
      resolve: async (_device, _args, _ctx) => {
        // Will implement in next task
        return [];
      },
    }),
  }),
});
