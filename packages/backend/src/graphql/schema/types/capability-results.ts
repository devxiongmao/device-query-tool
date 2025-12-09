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
  device: any; // eslint-disable-line @typescript-eslint/no-explicit-any -- will be typed properly
  software: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  supportStatus: "global" | "provider-specific";
  provider: any | null; // eslint-disable-line @typescript-eslint/no-explicit-any
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
