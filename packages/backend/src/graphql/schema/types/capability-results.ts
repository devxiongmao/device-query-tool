import { builder } from "../builder";
import { DeviceType } from "./device";
import { SoftwareType } from "./software";
import { ProviderType } from "./provider";

// Support status enum
export const SupportStatusType = builder.enumType("SupportStatus", {
  values: {
    GLOBAL: {
      value: "global",
      description: "Globally supported across all providers",
    },
    PROVIDER_SPECIFIC: {
      value: "provider-specific",
      description: "Supported only by specific providers",
    },
  } as const,
});

// Result type for capability queries
// Used when searching for devices by band/combo/feature
export const DeviceCapabilityResultType = builder.objectRef<{
  device: typeof DeviceType.$inferType;
  software: Array<typeof SoftwareType.$inferType>;
  supportStatus: "global" | "provider-specific";
  provider: typeof ProviderType.$inferType | null;
}>("DeviceCapabilityResult");

DeviceCapabilityResultType.implement({
  fields: (t) => ({
    device: t.field({
      type: DeviceType,
      description: "The device that supports this capability",
      resolve: (result) => result.device,
    }),

    software: t.field({
      type: [SoftwareType],
      description: "Software versions that support this capability",
      resolve: (result) => result.software,
    }),

    supportStatus: t.field({
      type: SupportStatusType,
      description: "Whether this is global or provider-specific support",
      resolve: (result) => result.supportStatus,
    }),

    provider: t.field({
      type: ProviderType,
      nullable: true,
      description: "Provider (if provider-specific)",
      resolve: (result) => result.provider,
    }),
  }),
});
