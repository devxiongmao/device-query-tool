import type { DeviceType } from "../graphql/schema/types/device";
import type { SoftwareType } from "../graphql/schema/types/software";
import type { ProviderType } from "../graphql/schema/types/provider";
import type { BandType } from "../graphql/schema/types/band";
import type { ComboType } from "../graphql/schema/types/combo";
import type { FeatureType } from "../graphql/schema/types/feature";

// Common repository types and interfaces

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface SearchDevicesParams extends PaginationParams {
  vendor?: string;
  modelNum?: string;
  marketName?: string;
  releasedAfter?: Date;
  releasedBefore?: Date;
}

export interface FindDevicesByBandParams {
  bandId: number;
  providerId?: number;
  technology?: string;
}

export interface FindDevicesByComboParams {
  comboId: number;
  providerId?: number;
  technology?: string;
}

export interface FindDevicesByFeatureParams {
  featureId: number;
  providerId?: number;
}

export interface DeviceCapabilityResult {
  device: typeof DeviceType.$inferType;
  software: Array<typeof SoftwareType.$inferType>;
  supportStatus: "global" | "provider-specific";
  // Provider can be a partial object (with just providerId) that gets populated by DataLoader,
  // or the full provider type, or null for global support
  provider: typeof ProviderType.$inferType | { providerId: number } | null;
  // Optional capability-specific properties (used in tests and GraphQL resolvers)
  band?: typeof BandType.$inferType;
  combo?: typeof ComboType.$inferType;
  feature?: typeof FeatureType.$inferType;
}
