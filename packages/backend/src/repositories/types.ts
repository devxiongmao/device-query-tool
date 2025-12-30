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
  device: any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Will be typed from Drizzle schema
  software: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  supportStatus: "global" | "provider-specific";
  provider: any | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  // Optional capability-specific properties (used in tests and GraphQL resolvers)
  band?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  combo?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  feature?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
