import { builder } from "../builder";
import { DeviceType } from "./device";

// Technology enum for bands
export const TechnologyType = builder.enumType("Technology", {
  values: ["GSM", "HSPA", "LTE", "NR"] as const,
});

// Band type definition
export const BandType = builder.objectRef<{
  bandId: number;
  bandNumber: string;
  technology: string;
  dlBandClass: string;
  ulBandClass: string;
}>("Band");

BandType.implement({
  fields: (t) => ({
    id: t.exposeID("bandId"),
    bandNumber: t.exposeString("bandNumber", {
      description: 'Band number (e.g., "2", "4", "n77")',
    }),
    technology: t.exposeString("technology", {
      description: "Technology type (GSM, HSPA, LTE, NR)",
    }),
    dlBandClass: t.exposeString("dlBandClass", {
      nullable: true,
      description: "Downlink bandwidth class for the band",
    }),
    ulBandClass: t.exposeString("ulBandClass", {
      nullable: true,
      description: "Uplink bandwidth class for the band",
    }),

    // Relationships
    devices: t.field({
      type: [DeviceType],
      description: "Devices that support this band (global capability)",
      args: {
        providerId: t.arg.id({
          required: false,
          description: "Filter by provider-specific support",
        }),
      },
      resolve: async (_band, _args, _ctx) => {
        // Will implement with repository
        return [];
      },
    }),
  }),
});
