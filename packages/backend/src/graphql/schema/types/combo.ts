import { builder } from "../builder";
import { BandType } from "./band";
import { DeviceType } from "./device";

// Combo technology enum
export const ComboTechnologyType = builder.enumType("ComboTechnology", {
  values: {
    LTE_CA: {
      value: "LTE CA",
      description: "LTE Carrier Aggregation",
    },
    EN_DC: {
      value: "EN-DC",
      description: "E-UTRA-NR Dual Connectivity",
    },
    NR_CA: {
      value: "NR CA",
      description: "NR Carrier Aggregation",
    },
  } as const,
});

// Combo type definition
export const ComboType = builder.objectRef<{
  comboId: number;
  name: string;
  technology: string;
}>("Combo");

ComboType.implement({
  fields: (t) => ({
    id: t.exposeID("comboId"),
    name: t.exposeString("name", {
      description: 'Combo name (e.g., "2A-4A", "B2-n66")',
    }),
    technology: t.exposeString("technology", {
      description: "Combo technology type",
    }),

    // Relationships
    bands: t.field({
      type: [BandType],
      description: "Bands that make up this combo (in order)",
      resolve: async (_combo, _args, _ctx) => {
        // Will implement with DataLoader
        return [];
      },
    }),

    devices: t.field({
      type: [DeviceType],
      description: "Devices that support this combo",
      args: {
        providerId: t.arg.id({
          required: false,
          description: "Filter by provider-specific support",
        }),
      },
      resolve: async (_combo, _args, _ctx) => {
        // Will implement with repository
        return [];
      },
    }),
  }),
});
