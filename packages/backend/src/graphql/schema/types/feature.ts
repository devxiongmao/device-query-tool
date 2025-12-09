import { builder } from "../builder";
import { DeviceType } from "./device";
import { ProviderType } from "./provider";
import { SoftwareType } from "./software";

// Feature type definition
export const FeatureType = builder.objectRef<{
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}>("Feature");

FeatureType.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", {
      description: 'Feature name (e.g., "VoLTE", "VoWiFi")',
    }),
    description: t.exposeString("description", { nullable: true }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),

    // Relationships
    availability: t.field({
      type: [FeatureAvailabilityType],
      description: "Where this feature is available",
      args: {
        deviceId: t.arg.id({ required: false }),
        providerId: t.arg.id({ required: false }),
      },
      resolve: async (_feature, _args, _ctx) => {
        // Will implement with repository
        return [];
      },
    }),
  }),
});

// Feature availability result type (junction data)
export const FeatureAvailabilityType = builder.objectRef<{
  deviceId: number;
  softwareId: number;
  providerId: number;
  featureId: number;
}>("FeatureAvailability");

FeatureAvailabilityType.implement({
  fields: (t) => ({
    device: t.field({
      type: DeviceType,
      resolve: async (_availability, _args, _ctx) => {
        return null as any; // Will implement
      },
    }),
    software: t.field({
      type: SoftwareType,
      resolve: async (_availability, _args, _ctx) => {
        return null as any; // Will implement
      },
    }),
    provider: t.field({
      type: ProviderType,
      resolve: async (_availability, _args, _ctx) => {
        return null as any; // Will implement
      },
    }),
    feature: t.field({
      type: FeatureType,
      resolve: async (_availability, _args, _ctx) => {
        return null as any; // Will implement
      },
    }),
  }),
});
