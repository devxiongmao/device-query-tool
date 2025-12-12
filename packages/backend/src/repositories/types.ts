// Common repository types and interfaces

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface SearchDevicesParams extends PaginationParams {
  vendor?: string;
  modelNum?: string;
  marketName?: string;
  releasedAfter?: string; // XMDEV-544: Fix date casting
  releasedBefore?: string; // XMDEV-544: Fix date casting
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
}
