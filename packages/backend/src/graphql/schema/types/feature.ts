import { builder } from "../builder";
import { DeviceFeatureType } from "./junctions";

// Feature type definition
export const FeatureType = builder.objectRef<{
  id: number;
  name: string;
  description: string | null;
}>("Feature");

FeatureType.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", {
      description: 'Feature name (e.g., "VoLTE", "VoWiFi")',
    }),
    description: t.exposeString("description", { nullable: true }),

    // Use junction type instead
    availability: t.field({
      type: [DeviceFeatureType],
      description: "Where this feature is available",
      args: {
        deviceId: t.arg.id({ required: false }),
        providerId: t.arg.id({ required: false }),
      },
      resolve: async (_feature, _args, _ctx) => {
        return [];
      },
    }),
  }),
});
