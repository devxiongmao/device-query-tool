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
      resolve: async (_junction, _args, _ctx) => {
        // Will implement with DataLoader
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
    software: t.field({
      type: SoftwareType,
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
    band: t.field({
      type: BandType,
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
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
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
    device: t.field({
      type: DeviceType,
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
    software: t.field({
      type: SoftwareType,
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
    band: t.field({
      type: BandType,
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
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
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
    software: t.field({
      type: SoftwareType,
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
    combo: t.field({
      type: ComboType,
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
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
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
    device: t.field({
      type: DeviceType,
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
    software: t.field({
      type: SoftwareType,
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
    combo: t.field({
      type: ComboType,
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
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
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
    software: t.field({
      type: SoftwareType,
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
    provider: t.field({
      type: ProviderType,
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
    feature: t.field({
      type: FeatureType,
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
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
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
    band: t.field({
      type: BandType,
      resolve: async (_junction, _args, _ctx) => {
        return null as any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will implement
      },
    }),
  }),
});
