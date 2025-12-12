import { builder } from "../builder";
import { DeviceType } from "./device";
import { SoftwareType } from "./software";
import { BandType } from "./band";
import { ComboType } from "./combo";
import { FeatureType } from "./feature";
import { ProviderType } from "./provider";

// ====================
// DEVICE BAND (Global)
// ====================
export const DeviceBandType = builder.objectRef<{
  deviceId: number;
  softwareId: number;
  bandId: number;
}>("DeviceBand");

DeviceBandType.implement({
  description: "Global band support for a device/software combination",
  fields: (t) => ({
    device: t.field({
      type: DeviceType,
      resolve: async (junction, _args, ctx) => {
        const device = await ctx.loaders.deviceById.load(junction.deviceId);
        if (!device) throw new Error("Device not found");
        return device;
      },
    }),
    software: t.field({
      type: SoftwareType,
      resolve: async (junction, _args, ctx) => {
        const software = await ctx.loaders.softwareById.load(
          junction.softwareId
        );
        if (!software) throw new Error("Software not found");
        return software;
      },
    }),
    band: t.field({
      type: BandType,
      resolve: async (junction, _args, ctx) => {
        const band = await ctx.loaders.bandById.load(junction.bandId);
        if (!band) throw new Error("Band not found");
        return band;
      },
    }),
  }),
});

// ==============================
// DEVICE BAND (Provider-Specific)
// ==============================
export const ProviderDeviceBandType = builder.objectRef<{
  providerId: number;
  deviceId: number;
  softwareId: number;
  bandId: number;
}>("ProviderDeviceBand");

ProviderDeviceBandType.implement({
  description:
    "Provider-specific band support for a device/software combination",
  fields: (t) => ({
    provider: t.field({
      type: ProviderType,
      resolve: async (junction, _args, ctx) => {
        const provider = await ctx.loaders.providerById.load(
          junction.providerId
        );
        if (!provider) throw new Error("Provider not found");
        return provider;
      },
    }),
    device: t.field({
      type: DeviceType,
      resolve: async (junction, _args, ctx) => {
        const device = await ctx.loaders.deviceById.load(junction.deviceId);
        if (!device) throw new Error("Device not found");
        return device;
      },
    }),
    software: t.field({
      type: SoftwareType,
      resolve: async (junction, _args, ctx) => {
        const software = await ctx.loaders.softwareById.load(
          junction.softwareId
        );
        if (!software) throw new Error("Software not found");
        return software;
      },
    }),
    band: t.field({
      type: BandType,
      resolve: async (junction, _args, ctx) => {
        const band = await ctx.loaders.bandById.load(junction.bandId);
        if (!band) throw new Error("Band not found");
        return band;
      },
    }),
  }),
});

// ====================
// DEVICE COMBO (Global)
// ====================
export const DeviceComboType = builder.objectRef<{
  deviceId: number;
  softwareId: number;
  comboId: number;
}>("DeviceCombo");

DeviceComboType.implement({
  description: "Global combo support for a device/software combination",
  fields: (t) => ({
    device: t.field({
      type: DeviceType,
      resolve: async (junction, _args, ctx) => {
        const device = await ctx.loaders.deviceById.load(junction.deviceId);
        if (!device) throw new Error("Device not found");
        return device;
      },
    }),
    software: t.field({
      type: SoftwareType,
      resolve: async (junction, _args, ctx) => {
        const software = await ctx.loaders.softwareById.load(
          junction.softwareId
        );
        if (!software) throw new Error("Software not found");
        return software;
      },
    }),
    combo: t.field({
      type: ComboType,
      resolve: async (junction, _args, ctx) => {
        const combo = await ctx.loaders.comboById.load(junction.comboId);
        if (!combo) throw new Error("Combo not found");
        return combo;
      },
    }),
  }),
});

// ==============================
// DEVICE COMBO (Provider-Specific)
// ==============================
export const ProviderDeviceComboType = builder.objectRef<{
  providerId: number;
  deviceId: number;
  softwareId: number;
  comboId: number;
}>("ProviderDeviceCombo");

ProviderDeviceComboType.implement({
  description:
    "Provider-specific combo support for a device/software combination",
  fields: (t) => ({
    provider: t.field({
      type: ProviderType,
      resolve: async (junction, _args, ctx) => {
        const provider = await ctx.loaders.providerById.load(
          junction.providerId
        );
        if (!provider) throw new Error("Provider not found");
        return provider;
      },
    }),
    device: t.field({
      type: DeviceType,
      resolve: async (junction, _args, ctx) => {
        const device = await ctx.loaders.deviceById.load(junction.deviceId);
        if (!device) throw new Error("Device not found");
        return device;
      },
    }),
    software: t.field({
      type: SoftwareType,
      resolve: async (junction, _args, ctx) => {
        const software = await ctx.loaders.softwareById.load(
          junction.softwareId
        );
        if (!software) throw new Error("Software not found");
        return software;
      },
    }),
    combo: t.field({
      type: ComboType,
      resolve: async (junction, _args, ctx) => {
        const combo = await ctx.loaders.comboById.load(junction.comboId);
        if (!combo) throw new Error("Combo not found");
        return combo;
      },
    }),
  }),
});

// ====================
// DEVICE FEATURE
// ====================
export const DeviceFeatureType = builder.objectRef<{
  deviceId: number;
  softwareId: number;
  providerId: number;
  featureId: number;
}>("DeviceFeature");

DeviceFeatureType.implement({
  description: "Feature support for a device/software/provider combination",
  fields: (t) => ({
    device: t.field({
      type: DeviceType,
      resolve: async (junction, _args, ctx) => {
        const device = await ctx.loaders.deviceById.load(junction.deviceId);
        if (!device) throw new Error("Device not found");
        return device;
      },
    }),
    software: t.field({
      type: SoftwareType,
      resolve: async (junction, _args, ctx) => {
        const software = await ctx.loaders.softwareById.load(
          junction.softwareId
        );
        if (!software) throw new Error("Software not found");
        return software;
      },
    }),
    provider: t.field({
      type: ProviderType,
      resolve: async (junction, _args, ctx) => {
        const provider = await ctx.loaders.providerById.load(
          junction.providerId
        );
        if (!provider) throw new Error("Provider not found");
        return provider;
      },
    }),
    feature: t.field({
      type: FeatureType,
      resolve: async (junction, _args, ctx) => {
        const feature = await ctx.loaders.featureById.load(junction.featureId);
        if (!feature) throw new Error("Feature not found");
        return feature;
      },
    }),
  }),
});

// ====================
// COMBO BAND
// ====================
export const ComboBandType = builder.objectRef<{
  comboId: number;
  bandId: number;
}>("ComboBand");

ComboBandType.implement({
  description: "Band component of a combo (with position)",
  fields: (t) => ({
    combo: t.field({
      type: ComboType,
      resolve: async (junction, _args, ctx) => {
        const combo = await ctx.loaders.comboById.load(junction.comboId);
        if (!combo) throw new Error("Combo not found");
        return combo;
      },
    }),
    band: t.field({
      type: BandType,
      resolve: async (junction, _args, ctx) => {
        const band = await ctx.loaders.bandById.load(junction.bandId);
        if (!band) throw new Error("Band not found");
        return band;
      },
    }),
  }),
});
