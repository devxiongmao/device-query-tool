import { builder } from "../builder";
import { DeviceType } from "./device";
import { BandType } from "./band";
import {
  DeviceComboType,
  ProviderDeviceComboType,
  ComboBandType,
} from "./junctions";

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

export const ComboType = builder.objectRef<{
  id: number;
  name: string;
  technology: string;
}>("Combo");

ComboType.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name", {
      description: 'Combo name (e.g., "2A-4A", "B2-n66")',
    }),
    technology: t.exposeString("technology", {
      description: "Combo technology type",
    }),

    // BANDS THAT MAKE UP THIS COMBO (simple list)
    bands: t.field({
      type: [BandType],
      description: "Bands that make up this combo (ordered)",
      resolve: async (combo, _args, ctx) => {
        return ctx.loaders.bandsByCombo.load(combo.id);
      },
    }),

    // Detailed band composition with position (for future use)
    bandComponents: t.field({
      type: [ComboBandType],
      description: "Detailed band components with position information",
      resolve: async (_combo, _args, _ctx) => {
        // We'll implement this in the junctions resolver
        return [];
      },
    }),

    // DEVICES SUPPORTING THIS COMBO (simplified)
    devices: t.field({
      type: [DeviceType],
      description: "Devices that support this combo (simplified)",
      args: {
        providerId: t.arg.id({ required: false }),
      },
      resolve: async (combo, args, ctx) => {
        const results = await ctx.loaders.devicesByCombo.load({
          comboId: combo.id,
          providerId: args.providerId ? Number(args.providerId) : undefined,
        });

        return results.map((r) => r.device);
      },
    }),

    // Detailed device support (for future use)
    deviceSupport: t.field({
      type: [DeviceComboType],
      description: "Detailed device/software/combo relationships (global)",
      resolve: async () => [],
    }),

    // Provider-specific detailed support
    providerDeviceSupport: t.field({
      type: [ProviderDeviceComboType],
      description:
        "Detailed device/software/combo relationships (provider-specific)",
      args: {
        providerId: t.arg.id({ required: false }),
      },
      resolve: async () => [],
    }),
  }),
});
