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
  frequencyRange: string;
  bandClass: string | null;
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
    frequencyRange: t.exposeString("frequencyRange", {
      description: "Frequency range in MHz",
    }),
    bandClass: t.exposeString("bandClass", {
      nullable: true,
      description: 'Band class/name (e.g., "PCS", "AWS", "C-Band")',
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
