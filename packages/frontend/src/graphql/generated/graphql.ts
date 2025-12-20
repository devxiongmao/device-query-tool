import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
};

export type Band = {
  __typename?: 'Band';
  bandNumber?: Maybe<Scalars['String']['output']>;
  /** Detailed device/software/band relationships (global) */
  deviceSupport?: Maybe<Array<DeviceBand>>;
  /** Devices that support this band (simplified) */
  devices?: Maybe<Array<Device>>;
  /** Downlink bandwidth class for the band */
  dlBandClass?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  /** Detailed device/software/band relationships (provider-specific) */
  providerDeviceSupport?: Maybe<Array<ProviderDeviceBand>>;
  technology?: Maybe<Scalars['String']['output']>;
  /** Uplink bandwidth class for the band */
  ulBandClass?: Maybe<Scalars['String']['output']>;
};


export type BandDevicesArgs = {
  providerId?: InputMaybe<Scalars['ID']['input']>;
};


export type BandProviderDeviceSupportArgs = {
  providerId?: InputMaybe<Scalars['ID']['input']>;
};

export type Combo = {
  __typename?: 'Combo';
  /** Detailed band components with position information */
  bandComponents?: Maybe<Array<ComboBand>>;
  /** Bands that make up this combo (ordered) */
  bands?: Maybe<Array<Band>>;
  /** Detailed device/software/combo relationships (global) */
  deviceSupport?: Maybe<Array<DeviceCombo>>;
  /** Devices that support this combo (simplified) */
  devices?: Maybe<Array<Device>>;
  id?: Maybe<Scalars['ID']['output']>;
  /** Combo name (e.g., "2A-4A", "B2-n66") */
  name?: Maybe<Scalars['String']['output']>;
  /** Detailed device/software/combo relationships (provider-specific) */
  providerDeviceSupport?: Maybe<Array<ProviderDeviceCombo>>;
  /** Combo technology type */
  technology?: Maybe<Scalars['String']['output']>;
};


export type ComboDevicesArgs = {
  providerId?: InputMaybe<Scalars['ID']['input']>;
};


export type ComboProviderDeviceSupportArgs = {
  providerId?: InputMaybe<Scalars['ID']['input']>;
};

/** Band component of a combo (with position) */
export type ComboBand = {
  __typename?: 'ComboBand';
  band?: Maybe<Band>;
  combo?: Maybe<Combo>;
};

export const ComboTechnology = {
  /** E-UTRA-NR Dual Connectivity */
  EnDc: 'EN_DC',
  /** LTE Carrier Aggregation */
  LteCa: 'LTE_CA',
  /** NR Carrier Aggregation */
  NrCa: 'NR_CA'
} as const;

export type ComboTechnology = typeof ComboTechnology[keyof typeof ComboTechnology];
export type Device = {
  __typename?: 'Device';
  /** Features supported by this device (any provider) */
  features?: Maybe<Array<Feature>>;
  /** Features supported by this device for a specific provider */
  featuresForProvider?: Maybe<Array<Feature>>;
  id?: Maybe<Scalars['ID']['output']>;
  marketName?: Maybe<Scalars['String']['output']>;
  modelNum?: Maybe<Scalars['String']['output']>;
  /** Device release date */
  releaseDate?: Maybe<Scalars['DateTime']['output']>;
  /** All software versions for this device */
  software?: Maybe<Array<Software>>;
  /** Bands supported globally by this device */
  supportedBands?: Maybe<Array<Band>>;
  /** Bands supported by this device for a specific provider */
  supportedBandsForProvider?: Maybe<Array<Band>>;
  /** Combos supported globally by this device */
  supportedCombos?: Maybe<Array<Combo>>;
  /** Combos supported by this device for a specific provider */
  supportedCombosForProvider?: Maybe<Array<Combo>>;
  vendor?: Maybe<Scalars['String']['output']>;
};


export type DeviceFeaturesArgs = {
  softwareId?: InputMaybe<Scalars['ID']['input']>;
};


export type DeviceFeaturesForProviderArgs = {
  providerId: Scalars['ID']['input'];
  softwareId?: InputMaybe<Scalars['ID']['input']>;
};


export type DeviceSoftwareArgs = {
  platform?: InputMaybe<Scalars['String']['input']>;
  releasedAfter?: InputMaybe<Scalars['DateTime']['input']>;
};


export type DeviceSupportedBandsArgs = {
  softwareId?: InputMaybe<Scalars['ID']['input']>;
  technology?: InputMaybe<Scalars['String']['input']>;
};


export type DeviceSupportedBandsForProviderArgs = {
  providerId: Scalars['ID']['input'];
  softwareId?: InputMaybe<Scalars['ID']['input']>;
  technology?: InputMaybe<Scalars['String']['input']>;
};


export type DeviceSupportedCombosArgs = {
  softwareId?: InputMaybe<Scalars['ID']['input']>;
  technology?: InputMaybe<Scalars['String']['input']>;
};


export type DeviceSupportedCombosForProviderArgs = {
  providerId: Scalars['ID']['input'];
  softwareId?: InputMaybe<Scalars['ID']['input']>;
  technology?: InputMaybe<Scalars['String']['input']>;
};

/** Global band support for a device/software combination */
export type DeviceBand = {
  __typename?: 'DeviceBand';
  band?: Maybe<Band>;
  device?: Maybe<Device>;
  software?: Maybe<Software>;
};

export type DeviceCapabilityResult = {
  __typename?: 'DeviceCapabilityResult';
  /** The device that supports this capability */
  device?: Maybe<Device>;
  /** Provider (if provider-specific) */
  provider?: Maybe<Provider>;
  /** Software versions that support this capability */
  software?: Maybe<Array<Software>>;
  /** Whether this is global or provider-specific support */
  supportStatus?: Maybe<SupportStatus>;
};

/** Global combo support for a device/software combination */
export type DeviceCombo = {
  __typename?: 'DeviceCombo';
  combo?: Maybe<Combo>;
  device?: Maybe<Device>;
  software?: Maybe<Software>;
};

/** Feature support for a device/software/provider combination */
export type DeviceFeature = {
  __typename?: 'DeviceFeature';
  device?: Maybe<Device>;
  feature?: Maybe<Feature>;
  provider?: Maybe<Provider>;
  software?: Maybe<Software>;
};

export type Feature = {
  __typename?: 'Feature';
  /** Where this feature is available */
  availability?: Maybe<Array<DeviceFeature>>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  /** Feature name (e.g., "VoLTE", "VoWiFi") */
  name?: Maybe<Scalars['String']['output']>;
};


export type FeatureAvailabilityArgs = {
  deviceId?: InputMaybe<Scalars['ID']['input']>;
  providerId?: InputMaybe<Scalars['ID']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _placeholder?: Maybe<Scalars['String']['output']>;
};

export type Provider = {
  __typename?: 'Provider';
  country?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  /** Provider name (e.g., "Telus", "Rogers") */
  name?: Maybe<Scalars['String']['output']>;
  /** Network type (e.g., "5G", "LTE") */
  networkType?: Maybe<Scalars['String']['output']>;
};

/** Provider-specific band support for a device/software combination */
export type ProviderDeviceBand = {
  __typename?: 'ProviderDeviceBand';
  band?: Maybe<Band>;
  device?: Maybe<Device>;
  provider?: Maybe<Provider>;
  software?: Maybe<Software>;
};

/** Provider-specific combo support for a device/software combination */
export type ProviderDeviceCombo = {
  __typename?: 'ProviderDeviceCombo';
  combo?: Maybe<Combo>;
  device?: Maybe<Device>;
  provider?: Maybe<Provider>;
  software?: Maybe<Software>;
};

export type Query = {
  __typename?: 'Query';
  /** Find a band by ID */
  band?: Maybe<Band>;
  /** Search for bands with optional filters */
  bands?: Maybe<Array<Band>>;
  /** Find a combo by ID */
  combo?: Maybe<Combo>;
  /** Search for combos with optional filters */
  combos?: Maybe<Array<Combo>>;
  /** Find a device by ID */
  device?: Maybe<Device>;
  /** Search for devices with optional filters */
  devices?: Maybe<Array<Device>>;
  /** Find all devices that support a specific band */
  devicesByBand?: Maybe<Array<DeviceCapabilityResult>>;
  /** Find devices matching multiple capability criteria (AND logic) */
  devicesByCapabilities?: Maybe<Array<DeviceCapabilityResult>>;
  /** Find all devices that support a specific combo */
  devicesByCombo?: Maybe<Array<DeviceCapabilityResult>>;
  /** Find all devices that support a specific feature */
  devicesByFeature?: Maybe<Array<DeviceCapabilityResult>>;
  /** Find a feature by ID */
  feature?: Maybe<Feature>;
  /** Search for features with optional filters */
  features?: Maybe<Array<Feature>>;
  /** Find a provider by ID */
  provider?: Maybe<Provider>;
  /** Get all providers */
  providers?: Maybe<Array<Provider>>;
};


export type QueryBandArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBandsArgs = {
  bandNumber?: InputMaybe<Scalars['String']['input']>;
  technology?: InputMaybe<Scalars['String']['input']>;
};


export type QueryComboArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCombosArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  technology?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDeviceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDevicesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  marketName?: InputMaybe<Scalars['String']['input']>;
  modelNum?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  releasedAfter?: InputMaybe<Scalars['DateTime']['input']>;
  releasedBefore?: InputMaybe<Scalars['DateTime']['input']>;
  vendor?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDevicesByBandArgs = {
  bandId: Scalars['ID']['input'];
  providerId?: InputMaybe<Scalars['ID']['input']>;
  technology?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDevicesByCapabilitiesArgs = {
  bandIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  comboIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  featureIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  providerId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryDevicesByComboArgs = {
  comboId: Scalars['ID']['input'];
  providerId?: InputMaybe<Scalars['ID']['input']>;
  technology?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDevicesByFeatureArgs = {
  featureId: Scalars['ID']['input'];
  providerId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryFeatureArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFeaturesArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProviderArgs = {
  id: Scalars['ID']['input'];
};

export type Software = {
  __typename?: 'Software';
  buildNumber?: Maybe<Scalars['String']['output']>;
  /** The device this software runs on */
  device?: Maybe<Device>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  /** Operating system platform (iOS, Android, etc.) */
  platform?: Maybe<Scalars['String']['output']>;
  ptcrb?: Maybe<Scalars['Int']['output']>;
  releaseDate?: Maybe<Scalars['DateTime']['output']>;
  svn?: Maybe<Scalars['Int']['output']>;
};

export const SupportStatus = {
  /** Globally supported across all providers */
  Global: 'GLOBAL',
  /** Supported only by specific providers */
  ProviderSpecific: 'PROVIDER_SPECIFIC'
} as const;

export type SupportStatus = typeof SupportStatus[keyof typeof SupportStatus];
export const Technology = {
  Gsm: 'GSM',
  Hspa: 'HSPA',
  Lte: 'LTE',
  Nr: 'NR'
} as const;

export type Technology = typeof Technology[keyof typeof Technology];
export type DeviceBasicFragment = { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, marketName?: string | null, releaseDate?: string | null };

export type DeviceWithSoftwareFragment = { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, marketName?: string | null, releaseDate?: string | null, software?: Array<{ __typename?: 'Software', id?: string | null, name?: string | null, platform?: string | null, buildNumber?: string | null, releaseDate?: string | null }> | null };

export type SoftwareBasicFragment = { __typename?: 'Software', id?: string | null, name?: string | null, platform?: string | null, buildNumber?: string | null, releaseDate?: string | null };

export type BandBasicFragment = { __typename?: 'Band', id?: string | null, bandNumber?: string | null, technology?: string | null, dlBandClass?: string | null, ulBandClass?: string | null };

export type ComboBasicFragment = { __typename?: 'Combo', id?: string | null, name?: string | null, technology?: string | null };

export type ComboWithBandsFragment = { __typename?: 'Combo', id?: string | null, name?: string | null, technology?: string | null, bands?: Array<{ __typename?: 'Band', id?: string | null, bandNumber?: string | null, technology?: string | null, dlBandClass?: string | null, ulBandClass?: string | null }> | null };

export type FeatureBasicFragment = { __typename?: 'Feature', id?: string | null, name?: string | null, description?: string | null };

export type ProviderBasicFragment = { __typename?: 'Provider', id?: string | null, name?: string | null, country?: string | null, networkType?: string | null };

export type CapabilityResultFragment = { __typename?: 'DeviceCapabilityResult', supportStatus?: SupportStatus | null, device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, marketName?: string | null, releaseDate?: string | null } | null, software?: Array<{ __typename?: 'Software', id?: string | null, name?: string | null, platform?: string | null, buildNumber?: string | null, releaseDate?: string | null }> | null, provider?: { __typename?: 'Provider', id?: string | null, name?: string | null, country?: string | null, networkType?: string | null } | null };

export type DevicesByBandQueryVariables = Exact<{
  bandId: Scalars['ID']['input'];
  technology?: InputMaybe<Scalars['String']['input']>;
}>;


export type DevicesByBandQuery = { __typename?: 'Query', devicesByBand?: Array<{ __typename?: 'DeviceCapabilityResult', supportStatus?: SupportStatus | null, device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, marketName?: string | null, releaseDate?: string | null } | null, software?: Array<{ __typename?: 'Software', id?: string | null, name?: string | null, buildNumber?: string | null }> | null }> | null };

export type DevicesByBandProviderQueryVariables = Exact<{
  bandId: Scalars['ID']['input'];
  providerId: Scalars['ID']['input'];
  technology?: InputMaybe<Scalars['String']['input']>;
}>;


export type DevicesByBandProviderQuery = { __typename?: 'Query', devicesByBand?: Array<{ __typename?: 'DeviceCapabilityResult', supportStatus?: SupportStatus | null, provider?: { __typename?: 'Provider', id?: string | null, name?: string | null, country?: string | null } | null, device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, marketName?: string | null } | null, software?: Array<{ __typename?: 'Software', id?: string | null, name?: string | null, buildNumber?: string | null }> | null }> | null };

export type DevicesByComboQueryVariables = Exact<{
  comboId: Scalars['ID']['input'];
  technology?: InputMaybe<Scalars['String']['input']>;
}>;


export type DevicesByComboQuery = { __typename?: 'Query', devicesByCombo?: Array<{ __typename?: 'DeviceCapabilityResult', supportStatus?: SupportStatus | null, device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, marketName?: string | null } | null, software?: Array<{ __typename?: 'Software', id?: string | null, name?: string | null, buildNumber?: string | null }> | null }> | null };

export type DevicesByComboProviderQueryVariables = Exact<{
  comboId: Scalars['ID']['input'];
  providerId: Scalars['ID']['input'];
  technology?: InputMaybe<Scalars['String']['input']>;
}>;


export type DevicesByComboProviderQuery = { __typename?: 'Query', devicesByCombo?: Array<{ __typename?: 'DeviceCapabilityResult', supportStatus?: SupportStatus | null, provider?: { __typename?: 'Provider', id?: string | null, name?: string | null } | null, device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, marketName?: string | null } | null, software?: Array<{ __typename?: 'Software', id?: string | null, name?: string | null, buildNumber?: string | null }> | null }> | null };

export type DevicesByFeatureQueryVariables = Exact<{
  featureId: Scalars['ID']['input'];
}>;


export type DevicesByFeatureQuery = { __typename?: 'Query', devicesByFeature?: Array<{ __typename?: 'DeviceCapabilityResult', supportStatus?: SupportStatus | null, device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, marketName?: string | null } | null, software?: Array<{ __typename?: 'Software', id?: string | null, name?: string | null, buildNumber?: string | null }> | null }> | null };

export type DevicesByFeatureProviderQueryVariables = Exact<{
  featureId: Scalars['ID']['input'];
  providerId: Scalars['ID']['input'];
}>;


export type DevicesByFeatureProviderQuery = { __typename?: 'Query', devicesByFeature?: Array<{ __typename?: 'DeviceCapabilityResult', supportStatus?: SupportStatus | null, provider?: { __typename?: 'Provider', id?: string | null, name?: string | null } | null, device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, marketName?: string | null } | null, software?: Array<{ __typename?: 'Software', id?: string | null, name?: string | null, buildNumber?: string | null }> | null }> | null };

export type GetDeviceQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDeviceQuery = { __typename?: 'Query', device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, marketName?: string | null, releaseDate?: string | null, software?: Array<{ __typename?: 'Software', id?: string | null, name?: string | null, platform?: string | null, buildNumber?: string | null, releaseDate?: string | null }> | null } | null };

export type SearchDevicesQueryVariables = Exact<{
  vendor?: InputMaybe<Scalars['String']['input']>;
  modelNum?: InputMaybe<Scalars['String']['input']>;
  marketName?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchDevicesQuery = { __typename?: 'Query', devices?: Array<{ __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, marketName?: string | null, releaseDate?: string | null }> | null };

export type GetDeviceWithBandsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  technology?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetDeviceWithBandsQuery = { __typename?: 'Query', device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, marketName?: string | null, supportedBands?: Array<{ __typename?: 'Band', id?: string | null, bandNumber?: string | null, technology?: string | null, dlBandClass?: string | null, ulBandClass?: string | null }> | null } | null };

export type GetDeviceWithProviderBandsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  providerId: Scalars['ID']['input'];
  technology?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetDeviceWithProviderBandsQuery = { __typename?: 'Query', device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, marketName?: string | null, supportedBandsForProvider?: Array<{ __typename?: 'Band', id?: string | null, bandNumber?: string | null, technology?: string | null, dlBandClass?: string | null, ulBandClass?: string | null }> | null } | null };

export type GetDeviceWithCombosQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  technology?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetDeviceWithCombosQuery = { __typename?: 'Query', device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, supportedCombos?: Array<{ __typename?: 'Combo', id?: string | null, name?: string | null, technology?: string | null, bands?: Array<{ __typename?: 'Band', bandNumber?: string | null }> | null }> | null } | null };

export type GetDeviceWithProviderCombosQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  providerId: Scalars['ID']['input'];
  technology?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetDeviceWithProviderCombosQuery = { __typename?: 'Query', device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, supportedCombosForProvider?: Array<{ __typename?: 'Combo', id?: string | null, name?: string | null, technology?: string | null }> | null } | null };

export type GetDeviceWithFeaturesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDeviceWithFeaturesQuery = { __typename?: 'Query', device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, features?: Array<{ __typename?: 'Feature', id?: string | null, name?: string | null, description?: string | null }> | null } | null };

export type GetDeviceWithProviderFeaturesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  providerId: Scalars['ID']['input'];
}>;


export type GetDeviceWithProviderFeaturesQuery = { __typename?: 'Query', device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, featuresForProvider?: Array<{ __typename?: 'Feature', id?: string | null, name?: string | null, description?: string | null }> | null } | null };

export type GetDeviceCompleteQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  bandTechnology?: InputMaybe<Scalars['String']['input']>;
  comboTechnology?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetDeviceCompleteQuery = { __typename?: 'Query', device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, marketName?: string | null, releaseDate?: string | null, software?: Array<{ __typename?: 'Software', id?: string | null, name?: string | null, platform?: string | null, buildNumber?: string | null, releaseDate?: string | null }> | null, supportedBands?: Array<{ __typename?: 'Band', id?: string | null, bandNumber?: string | null, technology?: string | null, dlBandClass?: string | null, ulBandClass?: string | null }> | null, supportedCombos?: Array<{ __typename?: 'Combo', id?: string | null, name?: string | null, technology?: string | null }> | null, features?: Array<{ __typename?: 'Feature', id?: string | null, name?: string | null, description?: string | null }> | null } | null };

export type GetProviderDeviceCompleteQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  providerId: Scalars['ID']['input'];
  bandTechnology?: InputMaybe<Scalars['String']['input']>;
  comboTechnology?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetProviderDeviceCompleteQuery = { __typename?: 'Query', device?: { __typename?: 'Device', id?: string | null, vendor?: string | null, modelNum?: string | null, marketName?: string | null, releaseDate?: string | null, software?: Array<{ __typename?: 'Software', id?: string | null, name?: string | null, platform?: string | null, buildNumber?: string | null, releaseDate?: string | null }> | null, supportedBandsForProvider?: Array<{ __typename?: 'Band', id?: string | null, bandNumber?: string | null, technology?: string | null, dlBandClass?: string | null, ulBandClass?: string | null }> | null, supportedCombosForProvider?: Array<{ __typename?: 'Combo', id?: string | null, name?: string | null, technology?: string | null }> | null, features?: Array<{ __typename?: 'Feature', id?: string | null, name?: string | null, description?: string | null }> | null } | null };

export type GetProvidersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProvidersQuery = { __typename?: 'Query', providers?: Array<{ __typename?: 'Provider', id?: string | null, name?: string | null, country?: string | null, networkType?: string | null }> | null };

export type SearchBandsQueryVariables = Exact<{
  technology?: InputMaybe<Scalars['String']['input']>;
  bandNumber?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchBandsQuery = { __typename?: 'Query', bands?: Array<{ __typename?: 'Band', id?: string | null, bandNumber?: string | null, technology?: string | null, dlBandClass?: string | null, ulBandClass?: string | null }> | null };

export type GetBandQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetBandQuery = { __typename?: 'Query', band?: { __typename?: 'Band', id?: string | null, bandNumber?: string | null, technology?: string | null, dlBandClass?: string | null, ulBandClass?: string | null } | null };

export type SearchCombosQueryVariables = Exact<{
  technology?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchCombosQuery = { __typename?: 'Query', combos?: Array<{ __typename?: 'Combo', id?: string | null, name?: string | null, technology?: string | null, bands?: Array<{ __typename?: 'Band', id?: string | null, bandNumber?: string | null, technology?: string | null }> | null }> | null };

export type GetComboQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetComboQuery = { __typename?: 'Query', combo?: { __typename?: 'Combo', id?: string | null, name?: string | null, technology?: string | null, bands?: Array<{ __typename?: 'Band', id?: string | null, bandNumber?: string | null, technology?: string | null, dlBandClass?: string | null, ulBandClass?: string | null }> | null } | null };

export type SearchFeaturesQueryVariables = Exact<{
  name?: InputMaybe<Scalars['String']['input']>;
}>;


export type SearchFeaturesQuery = { __typename?: 'Query', features?: Array<{ __typename?: 'Feature', id?: string | null, name?: string | null, description?: string | null }> | null };

export type GetFeatureQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFeatureQuery = { __typename?: 'Query', feature?: { __typename?: 'Feature', id?: string | null, name?: string | null, description?: string | null } | null };

export const DeviceBasicFragmentDoc = gql`
    fragment DeviceBasic on Device {
  id
  vendor
  modelNum
  marketName
  releaseDate
}
    `;
export const DeviceWithSoftwareFragmentDoc = gql`
    fragment DeviceWithSoftware on Device {
  ...DeviceBasic
  software {
    id
    name
    platform
    buildNumber
    releaseDate
  }
}
    ${DeviceBasicFragmentDoc}`;
export const ComboBasicFragmentDoc = gql`
    fragment ComboBasic on Combo {
  id
  name
  technology
}
    `;
export const BandBasicFragmentDoc = gql`
    fragment BandBasic on Band {
  id
  bandNumber
  technology
  dlBandClass
  ulBandClass
}
    `;
export const ComboWithBandsFragmentDoc = gql`
    fragment ComboWithBands on Combo {
  ...ComboBasic
  bands {
    ...BandBasic
  }
}
    ${ComboBasicFragmentDoc}
${BandBasicFragmentDoc}`;
export const FeatureBasicFragmentDoc = gql`
    fragment FeatureBasic on Feature {
  id
  name
  description
}
    `;
export const SoftwareBasicFragmentDoc = gql`
    fragment SoftwareBasic on Software {
  id
  name
  platform
  buildNumber
  releaseDate
}
    `;
export const ProviderBasicFragmentDoc = gql`
    fragment ProviderBasic on Provider {
  id
  name
  country
  networkType
}
    `;
export const CapabilityResultFragmentDoc = gql`
    fragment CapabilityResult on DeviceCapabilityResult {
  supportStatus
  device {
    ...DeviceBasic
  }
  software {
    ...SoftwareBasic
  }
  provider {
    ...ProviderBasic
  }
}
    ${DeviceBasicFragmentDoc}
${SoftwareBasicFragmentDoc}
${ProviderBasicFragmentDoc}`;
export const DevicesByBandDocument = gql`
    query DevicesByBand($bandId: ID!, $technology: String) {
  devicesByBand(bandId: $bandId, technology: $technology) {
    supportStatus
    device {
      id
      vendor
      modelNum
      marketName
      releaseDate
    }
    software {
      id
      name
      buildNumber
    }
  }
}
    `;

/**
 * __useDevicesByBandQuery__
 *
 * To run a query within a React component, call `useDevicesByBandQuery` and pass it any options that fit your needs.
 * When your component renders, `useDevicesByBandQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDevicesByBandQuery({
 *   variables: {
 *      bandId: // value for 'bandId'
 *      technology: // value for 'technology'
 *   },
 * });
 */
export function useDevicesByBandQuery(baseOptions: Apollo.QueryHookOptions<DevicesByBandQuery, DevicesByBandQueryVariables> & ({ variables: DevicesByBandQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DevicesByBandQuery, DevicesByBandQueryVariables>(DevicesByBandDocument, options);
      }
export function useDevicesByBandLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DevicesByBandQuery, DevicesByBandQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DevicesByBandQuery, DevicesByBandQueryVariables>(DevicesByBandDocument, options);
        }
// @ts-ignore
export function useDevicesByBandSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DevicesByBandQuery, DevicesByBandQueryVariables>): Apollo.UseSuspenseQueryResult<DevicesByBandQuery, DevicesByBandQueryVariables>;
export function useDevicesByBandSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DevicesByBandQuery, DevicesByBandQueryVariables>): Apollo.UseSuspenseQueryResult<DevicesByBandQuery | undefined, DevicesByBandQueryVariables>;
export function useDevicesByBandSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DevicesByBandQuery, DevicesByBandQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DevicesByBandQuery, DevicesByBandQueryVariables>(DevicesByBandDocument, options);
        }
export type DevicesByBandQueryHookResult = ReturnType<typeof useDevicesByBandQuery>;
export type DevicesByBandLazyQueryHookResult = ReturnType<typeof useDevicesByBandLazyQuery>;
export type DevicesByBandSuspenseQueryHookResult = ReturnType<typeof useDevicesByBandSuspenseQuery>;
export type DevicesByBandQueryResult = Apollo.QueryResult<DevicesByBandQuery, DevicesByBandQueryVariables>;
export const DevicesByBandProviderDocument = gql`
    query DevicesByBandProvider($bandId: ID!, $providerId: ID!, $technology: String) {
  devicesByBand(bandId: $bandId, providerId: $providerId, technology: $technology) {
    supportStatus
    provider {
      id
      name
      country
    }
    device {
      id
      vendor
      modelNum
      marketName
    }
    software {
      id
      name
      buildNumber
    }
  }
}
    `;

/**
 * __useDevicesByBandProviderQuery__
 *
 * To run a query within a React component, call `useDevicesByBandProviderQuery` and pass it any options that fit your needs.
 * When your component renders, `useDevicesByBandProviderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDevicesByBandProviderQuery({
 *   variables: {
 *      bandId: // value for 'bandId'
 *      providerId: // value for 'providerId'
 *      technology: // value for 'technology'
 *   },
 * });
 */
export function useDevicesByBandProviderQuery(baseOptions: Apollo.QueryHookOptions<DevicesByBandProviderQuery, DevicesByBandProviderQueryVariables> & ({ variables: DevicesByBandProviderQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DevicesByBandProviderQuery, DevicesByBandProviderQueryVariables>(DevicesByBandProviderDocument, options);
      }
export function useDevicesByBandProviderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DevicesByBandProviderQuery, DevicesByBandProviderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DevicesByBandProviderQuery, DevicesByBandProviderQueryVariables>(DevicesByBandProviderDocument, options);
        }
// @ts-ignore
export function useDevicesByBandProviderSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DevicesByBandProviderQuery, DevicesByBandProviderQueryVariables>): Apollo.UseSuspenseQueryResult<DevicesByBandProviderQuery, DevicesByBandProviderQueryVariables>;
export function useDevicesByBandProviderSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DevicesByBandProviderQuery, DevicesByBandProviderQueryVariables>): Apollo.UseSuspenseQueryResult<DevicesByBandProviderQuery | undefined, DevicesByBandProviderQueryVariables>;
export function useDevicesByBandProviderSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DevicesByBandProviderQuery, DevicesByBandProviderQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DevicesByBandProviderQuery, DevicesByBandProviderQueryVariables>(DevicesByBandProviderDocument, options);
        }
export type DevicesByBandProviderQueryHookResult = ReturnType<typeof useDevicesByBandProviderQuery>;
export type DevicesByBandProviderLazyQueryHookResult = ReturnType<typeof useDevicesByBandProviderLazyQuery>;
export type DevicesByBandProviderSuspenseQueryHookResult = ReturnType<typeof useDevicesByBandProviderSuspenseQuery>;
export type DevicesByBandProviderQueryResult = Apollo.QueryResult<DevicesByBandProviderQuery, DevicesByBandProviderQueryVariables>;
export const DevicesByComboDocument = gql`
    query DevicesByCombo($comboId: ID!, $technology: String) {
  devicesByCombo(comboId: $comboId, technology: $technology) {
    supportStatus
    device {
      id
      vendor
      modelNum
      marketName
    }
    software {
      id
      name
      buildNumber
    }
  }
}
    `;

/**
 * __useDevicesByComboQuery__
 *
 * To run a query within a React component, call `useDevicesByComboQuery` and pass it any options that fit your needs.
 * When your component renders, `useDevicesByComboQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDevicesByComboQuery({
 *   variables: {
 *      comboId: // value for 'comboId'
 *      technology: // value for 'technology'
 *   },
 * });
 */
export function useDevicesByComboQuery(baseOptions: Apollo.QueryHookOptions<DevicesByComboQuery, DevicesByComboQueryVariables> & ({ variables: DevicesByComboQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DevicesByComboQuery, DevicesByComboQueryVariables>(DevicesByComboDocument, options);
      }
export function useDevicesByComboLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DevicesByComboQuery, DevicesByComboQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DevicesByComboQuery, DevicesByComboQueryVariables>(DevicesByComboDocument, options);
        }
// @ts-ignore
export function useDevicesByComboSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DevicesByComboQuery, DevicesByComboQueryVariables>): Apollo.UseSuspenseQueryResult<DevicesByComboQuery, DevicesByComboQueryVariables>;
export function useDevicesByComboSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DevicesByComboQuery, DevicesByComboQueryVariables>): Apollo.UseSuspenseQueryResult<DevicesByComboQuery | undefined, DevicesByComboQueryVariables>;
export function useDevicesByComboSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DevicesByComboQuery, DevicesByComboQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DevicesByComboQuery, DevicesByComboQueryVariables>(DevicesByComboDocument, options);
        }
export type DevicesByComboQueryHookResult = ReturnType<typeof useDevicesByComboQuery>;
export type DevicesByComboLazyQueryHookResult = ReturnType<typeof useDevicesByComboLazyQuery>;
export type DevicesByComboSuspenseQueryHookResult = ReturnType<typeof useDevicesByComboSuspenseQuery>;
export type DevicesByComboQueryResult = Apollo.QueryResult<DevicesByComboQuery, DevicesByComboQueryVariables>;
export const DevicesByComboProviderDocument = gql`
    query DevicesByComboProvider($comboId: ID!, $providerId: ID!, $technology: String) {
  devicesByCombo(
    comboId: $comboId
    providerId: $providerId
    technology: $technology
  ) {
    supportStatus
    provider {
      id
      name
    }
    device {
      id
      vendor
      modelNum
      marketName
    }
    software {
      id
      name
      buildNumber
    }
  }
}
    `;

/**
 * __useDevicesByComboProviderQuery__
 *
 * To run a query within a React component, call `useDevicesByComboProviderQuery` and pass it any options that fit your needs.
 * When your component renders, `useDevicesByComboProviderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDevicesByComboProviderQuery({
 *   variables: {
 *      comboId: // value for 'comboId'
 *      providerId: // value for 'providerId'
 *      technology: // value for 'technology'
 *   },
 * });
 */
export function useDevicesByComboProviderQuery(baseOptions: Apollo.QueryHookOptions<DevicesByComboProviderQuery, DevicesByComboProviderQueryVariables> & ({ variables: DevicesByComboProviderQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DevicesByComboProviderQuery, DevicesByComboProviderQueryVariables>(DevicesByComboProviderDocument, options);
      }
export function useDevicesByComboProviderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DevicesByComboProviderQuery, DevicesByComboProviderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DevicesByComboProviderQuery, DevicesByComboProviderQueryVariables>(DevicesByComboProviderDocument, options);
        }
// @ts-ignore
export function useDevicesByComboProviderSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DevicesByComboProviderQuery, DevicesByComboProviderQueryVariables>): Apollo.UseSuspenseQueryResult<DevicesByComboProviderQuery, DevicesByComboProviderQueryVariables>;
export function useDevicesByComboProviderSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DevicesByComboProviderQuery, DevicesByComboProviderQueryVariables>): Apollo.UseSuspenseQueryResult<DevicesByComboProviderQuery | undefined, DevicesByComboProviderQueryVariables>;
export function useDevicesByComboProviderSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DevicesByComboProviderQuery, DevicesByComboProviderQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DevicesByComboProviderQuery, DevicesByComboProviderQueryVariables>(DevicesByComboProviderDocument, options);
        }
export type DevicesByComboProviderQueryHookResult = ReturnType<typeof useDevicesByComboProviderQuery>;
export type DevicesByComboProviderLazyQueryHookResult = ReturnType<typeof useDevicesByComboProviderLazyQuery>;
export type DevicesByComboProviderSuspenseQueryHookResult = ReturnType<typeof useDevicesByComboProviderSuspenseQuery>;
export type DevicesByComboProviderQueryResult = Apollo.QueryResult<DevicesByComboProviderQuery, DevicesByComboProviderQueryVariables>;
export const DevicesByFeatureDocument = gql`
    query DevicesByFeature($featureId: ID!) {
  devicesByFeature(featureId: $featureId) {
    supportStatus
    device {
      id
      vendor
      modelNum
      marketName
    }
    software {
      id
      name
      buildNumber
    }
  }
}
    `;

/**
 * __useDevicesByFeatureQuery__
 *
 * To run a query within a React component, call `useDevicesByFeatureQuery` and pass it any options that fit your needs.
 * When your component renders, `useDevicesByFeatureQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDevicesByFeatureQuery({
 *   variables: {
 *      featureId: // value for 'featureId'
 *   },
 * });
 */
export function useDevicesByFeatureQuery(baseOptions: Apollo.QueryHookOptions<DevicesByFeatureQuery, DevicesByFeatureQueryVariables> & ({ variables: DevicesByFeatureQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DevicesByFeatureQuery, DevicesByFeatureQueryVariables>(DevicesByFeatureDocument, options);
      }
export function useDevicesByFeatureLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DevicesByFeatureQuery, DevicesByFeatureQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DevicesByFeatureQuery, DevicesByFeatureQueryVariables>(DevicesByFeatureDocument, options);
        }
// @ts-ignore
export function useDevicesByFeatureSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DevicesByFeatureQuery, DevicesByFeatureQueryVariables>): Apollo.UseSuspenseQueryResult<DevicesByFeatureQuery, DevicesByFeatureQueryVariables>;
export function useDevicesByFeatureSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DevicesByFeatureQuery, DevicesByFeatureQueryVariables>): Apollo.UseSuspenseQueryResult<DevicesByFeatureQuery | undefined, DevicesByFeatureQueryVariables>;
export function useDevicesByFeatureSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DevicesByFeatureQuery, DevicesByFeatureQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DevicesByFeatureQuery, DevicesByFeatureQueryVariables>(DevicesByFeatureDocument, options);
        }
export type DevicesByFeatureQueryHookResult = ReturnType<typeof useDevicesByFeatureQuery>;
export type DevicesByFeatureLazyQueryHookResult = ReturnType<typeof useDevicesByFeatureLazyQuery>;
export type DevicesByFeatureSuspenseQueryHookResult = ReturnType<typeof useDevicesByFeatureSuspenseQuery>;
export type DevicesByFeatureQueryResult = Apollo.QueryResult<DevicesByFeatureQuery, DevicesByFeatureQueryVariables>;
export const DevicesByFeatureProviderDocument = gql`
    query DevicesByFeatureProvider($featureId: ID!, $providerId: ID!) {
  devicesByFeature(featureId: $featureId, providerId: $providerId) {
    supportStatus
    provider {
      id
      name
    }
    device {
      id
      vendor
      modelNum
      marketName
    }
    software {
      id
      name
      buildNumber
    }
  }
}
    `;

/**
 * __useDevicesByFeatureProviderQuery__
 *
 * To run a query within a React component, call `useDevicesByFeatureProviderQuery` and pass it any options that fit your needs.
 * When your component renders, `useDevicesByFeatureProviderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDevicesByFeatureProviderQuery({
 *   variables: {
 *      featureId: // value for 'featureId'
 *      providerId: // value for 'providerId'
 *   },
 * });
 */
export function useDevicesByFeatureProviderQuery(baseOptions: Apollo.QueryHookOptions<DevicesByFeatureProviderQuery, DevicesByFeatureProviderQueryVariables> & ({ variables: DevicesByFeatureProviderQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DevicesByFeatureProviderQuery, DevicesByFeatureProviderQueryVariables>(DevicesByFeatureProviderDocument, options);
      }
export function useDevicesByFeatureProviderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DevicesByFeatureProviderQuery, DevicesByFeatureProviderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DevicesByFeatureProviderQuery, DevicesByFeatureProviderQueryVariables>(DevicesByFeatureProviderDocument, options);
        }
// @ts-ignore
export function useDevicesByFeatureProviderSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<DevicesByFeatureProviderQuery, DevicesByFeatureProviderQueryVariables>): Apollo.UseSuspenseQueryResult<DevicesByFeatureProviderQuery, DevicesByFeatureProviderQueryVariables>;
export function useDevicesByFeatureProviderSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DevicesByFeatureProviderQuery, DevicesByFeatureProviderQueryVariables>): Apollo.UseSuspenseQueryResult<DevicesByFeatureProviderQuery | undefined, DevicesByFeatureProviderQueryVariables>;
export function useDevicesByFeatureProviderSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DevicesByFeatureProviderQuery, DevicesByFeatureProviderQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DevicesByFeatureProviderQuery, DevicesByFeatureProviderQueryVariables>(DevicesByFeatureProviderDocument, options);
        }
export type DevicesByFeatureProviderQueryHookResult = ReturnType<typeof useDevicesByFeatureProviderQuery>;
export type DevicesByFeatureProviderLazyQueryHookResult = ReturnType<typeof useDevicesByFeatureProviderLazyQuery>;
export type DevicesByFeatureProviderSuspenseQueryHookResult = ReturnType<typeof useDevicesByFeatureProviderSuspenseQuery>;
export type DevicesByFeatureProviderQueryResult = Apollo.QueryResult<DevicesByFeatureProviderQuery, DevicesByFeatureProviderQueryVariables>;
export const GetDeviceDocument = gql`
    query GetDevice($id: ID!) {
  device(id: $id) {
    id
    vendor
    modelNum
    marketName
    releaseDate
    software {
      id
      name
      platform
      buildNumber
      releaseDate
    }
  }
}
    `;

/**
 * __useGetDeviceQuery__
 *
 * To run a query within a React component, call `useGetDeviceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDeviceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDeviceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetDeviceQuery(baseOptions: Apollo.QueryHookOptions<GetDeviceQuery, GetDeviceQueryVariables> & ({ variables: GetDeviceQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDeviceQuery, GetDeviceQueryVariables>(GetDeviceDocument, options);
      }
export function useGetDeviceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDeviceQuery, GetDeviceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDeviceQuery, GetDeviceQueryVariables>(GetDeviceDocument, options);
        }
// @ts-ignore
export function useGetDeviceSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDeviceQuery, GetDeviceQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceQuery, GetDeviceQueryVariables>;
export function useGetDeviceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceQuery, GetDeviceQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceQuery | undefined, GetDeviceQueryVariables>;
export function useGetDeviceSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceQuery, GetDeviceQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDeviceQuery, GetDeviceQueryVariables>(GetDeviceDocument, options);
        }
export type GetDeviceQueryHookResult = ReturnType<typeof useGetDeviceQuery>;
export type GetDeviceLazyQueryHookResult = ReturnType<typeof useGetDeviceLazyQuery>;
export type GetDeviceSuspenseQueryHookResult = ReturnType<typeof useGetDeviceSuspenseQuery>;
export type GetDeviceQueryResult = Apollo.QueryResult<GetDeviceQuery, GetDeviceQueryVariables>;
export const SearchDevicesDocument = gql`
    query SearchDevices($vendor: String, $modelNum: String, $marketName: String, $limit: Int, $offset: Int) {
  devices(
    vendor: $vendor
    modelNum: $modelNum
    marketName: $marketName
    limit: $limit
    offset: $offset
  ) {
    id
    vendor
    modelNum
    marketName
    releaseDate
  }
}
    `;

/**
 * __useSearchDevicesQuery__
 *
 * To run a query within a React component, call `useSearchDevicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchDevicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchDevicesQuery({
 *   variables: {
 *      vendor: // value for 'vendor'
 *      modelNum: // value for 'modelNum'
 *      marketName: // value for 'marketName'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useSearchDevicesQuery(baseOptions?: Apollo.QueryHookOptions<SearchDevicesQuery, SearchDevicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchDevicesQuery, SearchDevicesQueryVariables>(SearchDevicesDocument, options);
      }
export function useSearchDevicesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchDevicesQuery, SearchDevicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchDevicesQuery, SearchDevicesQueryVariables>(SearchDevicesDocument, options);
        }
// @ts-ignore
export function useSearchDevicesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SearchDevicesQuery, SearchDevicesQueryVariables>): Apollo.UseSuspenseQueryResult<SearchDevicesQuery, SearchDevicesQueryVariables>;
export function useSearchDevicesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchDevicesQuery, SearchDevicesQueryVariables>): Apollo.UseSuspenseQueryResult<SearchDevicesQuery | undefined, SearchDevicesQueryVariables>;
export function useSearchDevicesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchDevicesQuery, SearchDevicesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchDevicesQuery, SearchDevicesQueryVariables>(SearchDevicesDocument, options);
        }
export type SearchDevicesQueryHookResult = ReturnType<typeof useSearchDevicesQuery>;
export type SearchDevicesLazyQueryHookResult = ReturnType<typeof useSearchDevicesLazyQuery>;
export type SearchDevicesSuspenseQueryHookResult = ReturnType<typeof useSearchDevicesSuspenseQuery>;
export type SearchDevicesQueryResult = Apollo.QueryResult<SearchDevicesQuery, SearchDevicesQueryVariables>;
export const GetDeviceWithBandsDocument = gql`
    query GetDeviceWithBands($id: ID!, $technology: String) {
  device(id: $id) {
    id
    vendor
    modelNum
    marketName
    supportedBands(technology: $technology) {
      id
      bandNumber
      technology
      dlBandClass
      ulBandClass
    }
  }
}
    `;

/**
 * __useGetDeviceWithBandsQuery__
 *
 * To run a query within a React component, call `useGetDeviceWithBandsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDeviceWithBandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDeviceWithBandsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      technology: // value for 'technology'
 *   },
 * });
 */
export function useGetDeviceWithBandsQuery(baseOptions: Apollo.QueryHookOptions<GetDeviceWithBandsQuery, GetDeviceWithBandsQueryVariables> & ({ variables: GetDeviceWithBandsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDeviceWithBandsQuery, GetDeviceWithBandsQueryVariables>(GetDeviceWithBandsDocument, options);
      }
export function useGetDeviceWithBandsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDeviceWithBandsQuery, GetDeviceWithBandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDeviceWithBandsQuery, GetDeviceWithBandsQueryVariables>(GetDeviceWithBandsDocument, options);
        }
// @ts-ignore
export function useGetDeviceWithBandsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDeviceWithBandsQuery, GetDeviceWithBandsQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceWithBandsQuery, GetDeviceWithBandsQueryVariables>;
export function useGetDeviceWithBandsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceWithBandsQuery, GetDeviceWithBandsQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceWithBandsQuery | undefined, GetDeviceWithBandsQueryVariables>;
export function useGetDeviceWithBandsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceWithBandsQuery, GetDeviceWithBandsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDeviceWithBandsQuery, GetDeviceWithBandsQueryVariables>(GetDeviceWithBandsDocument, options);
        }
export type GetDeviceWithBandsQueryHookResult = ReturnType<typeof useGetDeviceWithBandsQuery>;
export type GetDeviceWithBandsLazyQueryHookResult = ReturnType<typeof useGetDeviceWithBandsLazyQuery>;
export type GetDeviceWithBandsSuspenseQueryHookResult = ReturnType<typeof useGetDeviceWithBandsSuspenseQuery>;
export type GetDeviceWithBandsQueryResult = Apollo.QueryResult<GetDeviceWithBandsQuery, GetDeviceWithBandsQueryVariables>;
export const GetDeviceWithProviderBandsDocument = gql`
    query GetDeviceWithProviderBands($id: ID!, $providerId: ID!, $technology: String) {
  device(id: $id) {
    id
    vendor
    modelNum
    marketName
    supportedBandsForProvider(providerId: $providerId, technology: $technology) {
      id
      bandNumber
      technology
      dlBandClass
      ulBandClass
    }
  }
}
    `;

/**
 * __useGetDeviceWithProviderBandsQuery__
 *
 * To run a query within a React component, call `useGetDeviceWithProviderBandsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDeviceWithProviderBandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDeviceWithProviderBandsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      providerId: // value for 'providerId'
 *      technology: // value for 'technology'
 *   },
 * });
 */
export function useGetDeviceWithProviderBandsQuery(baseOptions: Apollo.QueryHookOptions<GetDeviceWithProviderBandsQuery, GetDeviceWithProviderBandsQueryVariables> & ({ variables: GetDeviceWithProviderBandsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDeviceWithProviderBandsQuery, GetDeviceWithProviderBandsQueryVariables>(GetDeviceWithProviderBandsDocument, options);
      }
export function useGetDeviceWithProviderBandsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDeviceWithProviderBandsQuery, GetDeviceWithProviderBandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDeviceWithProviderBandsQuery, GetDeviceWithProviderBandsQueryVariables>(GetDeviceWithProviderBandsDocument, options);
        }
// @ts-ignore
export function useGetDeviceWithProviderBandsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDeviceWithProviderBandsQuery, GetDeviceWithProviderBandsQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceWithProviderBandsQuery, GetDeviceWithProviderBandsQueryVariables>;
export function useGetDeviceWithProviderBandsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceWithProviderBandsQuery, GetDeviceWithProviderBandsQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceWithProviderBandsQuery | undefined, GetDeviceWithProviderBandsQueryVariables>;
export function useGetDeviceWithProviderBandsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceWithProviderBandsQuery, GetDeviceWithProviderBandsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDeviceWithProviderBandsQuery, GetDeviceWithProviderBandsQueryVariables>(GetDeviceWithProviderBandsDocument, options);
        }
export type GetDeviceWithProviderBandsQueryHookResult = ReturnType<typeof useGetDeviceWithProviderBandsQuery>;
export type GetDeviceWithProviderBandsLazyQueryHookResult = ReturnType<typeof useGetDeviceWithProviderBandsLazyQuery>;
export type GetDeviceWithProviderBandsSuspenseQueryHookResult = ReturnType<typeof useGetDeviceWithProviderBandsSuspenseQuery>;
export type GetDeviceWithProviderBandsQueryResult = Apollo.QueryResult<GetDeviceWithProviderBandsQuery, GetDeviceWithProviderBandsQueryVariables>;
export const GetDeviceWithCombosDocument = gql`
    query GetDeviceWithCombos($id: ID!, $technology: String) {
  device(id: $id) {
    id
    vendor
    modelNum
    supportedCombos(technology: $technology) {
      id
      name
      technology
      bands {
        bandNumber
      }
    }
  }
}
    `;

/**
 * __useGetDeviceWithCombosQuery__
 *
 * To run a query within a React component, call `useGetDeviceWithCombosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDeviceWithCombosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDeviceWithCombosQuery({
 *   variables: {
 *      id: // value for 'id'
 *      technology: // value for 'technology'
 *   },
 * });
 */
export function useGetDeviceWithCombosQuery(baseOptions: Apollo.QueryHookOptions<GetDeviceWithCombosQuery, GetDeviceWithCombosQueryVariables> & ({ variables: GetDeviceWithCombosQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDeviceWithCombosQuery, GetDeviceWithCombosQueryVariables>(GetDeviceWithCombosDocument, options);
      }
export function useGetDeviceWithCombosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDeviceWithCombosQuery, GetDeviceWithCombosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDeviceWithCombosQuery, GetDeviceWithCombosQueryVariables>(GetDeviceWithCombosDocument, options);
        }
// @ts-ignore
export function useGetDeviceWithCombosSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDeviceWithCombosQuery, GetDeviceWithCombosQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceWithCombosQuery, GetDeviceWithCombosQueryVariables>;
export function useGetDeviceWithCombosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceWithCombosQuery, GetDeviceWithCombosQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceWithCombosQuery | undefined, GetDeviceWithCombosQueryVariables>;
export function useGetDeviceWithCombosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceWithCombosQuery, GetDeviceWithCombosQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDeviceWithCombosQuery, GetDeviceWithCombosQueryVariables>(GetDeviceWithCombosDocument, options);
        }
export type GetDeviceWithCombosQueryHookResult = ReturnType<typeof useGetDeviceWithCombosQuery>;
export type GetDeviceWithCombosLazyQueryHookResult = ReturnType<typeof useGetDeviceWithCombosLazyQuery>;
export type GetDeviceWithCombosSuspenseQueryHookResult = ReturnType<typeof useGetDeviceWithCombosSuspenseQuery>;
export type GetDeviceWithCombosQueryResult = Apollo.QueryResult<GetDeviceWithCombosQuery, GetDeviceWithCombosQueryVariables>;
export const GetDeviceWithProviderCombosDocument = gql`
    query GetDeviceWithProviderCombos($id: ID!, $providerId: ID!, $technology: String) {
  device(id: $id) {
    id
    vendor
    modelNum
    supportedCombosForProvider(providerId: $providerId, technology: $technology) {
      id
      name
      technology
    }
  }
}
    `;

/**
 * __useGetDeviceWithProviderCombosQuery__
 *
 * To run a query within a React component, call `useGetDeviceWithProviderCombosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDeviceWithProviderCombosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDeviceWithProviderCombosQuery({
 *   variables: {
 *      id: // value for 'id'
 *      providerId: // value for 'providerId'
 *      technology: // value for 'technology'
 *   },
 * });
 */
export function useGetDeviceWithProviderCombosQuery(baseOptions: Apollo.QueryHookOptions<GetDeviceWithProviderCombosQuery, GetDeviceWithProviderCombosQueryVariables> & ({ variables: GetDeviceWithProviderCombosQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDeviceWithProviderCombosQuery, GetDeviceWithProviderCombosQueryVariables>(GetDeviceWithProviderCombosDocument, options);
      }
export function useGetDeviceWithProviderCombosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDeviceWithProviderCombosQuery, GetDeviceWithProviderCombosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDeviceWithProviderCombosQuery, GetDeviceWithProviderCombosQueryVariables>(GetDeviceWithProviderCombosDocument, options);
        }
// @ts-ignore
export function useGetDeviceWithProviderCombosSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDeviceWithProviderCombosQuery, GetDeviceWithProviderCombosQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceWithProviderCombosQuery, GetDeviceWithProviderCombosQueryVariables>;
export function useGetDeviceWithProviderCombosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceWithProviderCombosQuery, GetDeviceWithProviderCombosQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceWithProviderCombosQuery | undefined, GetDeviceWithProviderCombosQueryVariables>;
export function useGetDeviceWithProviderCombosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceWithProviderCombosQuery, GetDeviceWithProviderCombosQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDeviceWithProviderCombosQuery, GetDeviceWithProviderCombosQueryVariables>(GetDeviceWithProviderCombosDocument, options);
        }
export type GetDeviceWithProviderCombosQueryHookResult = ReturnType<typeof useGetDeviceWithProviderCombosQuery>;
export type GetDeviceWithProviderCombosLazyQueryHookResult = ReturnType<typeof useGetDeviceWithProviderCombosLazyQuery>;
export type GetDeviceWithProviderCombosSuspenseQueryHookResult = ReturnType<typeof useGetDeviceWithProviderCombosSuspenseQuery>;
export type GetDeviceWithProviderCombosQueryResult = Apollo.QueryResult<GetDeviceWithProviderCombosQuery, GetDeviceWithProviderCombosQueryVariables>;
export const GetDeviceWithFeaturesDocument = gql`
    query GetDeviceWithFeatures($id: ID!) {
  device(id: $id) {
    id
    vendor
    modelNum
    features {
      id
      name
      description
    }
  }
}
    `;

/**
 * __useGetDeviceWithFeaturesQuery__
 *
 * To run a query within a React component, call `useGetDeviceWithFeaturesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDeviceWithFeaturesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDeviceWithFeaturesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetDeviceWithFeaturesQuery(baseOptions: Apollo.QueryHookOptions<GetDeviceWithFeaturesQuery, GetDeviceWithFeaturesQueryVariables> & ({ variables: GetDeviceWithFeaturesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDeviceWithFeaturesQuery, GetDeviceWithFeaturesQueryVariables>(GetDeviceWithFeaturesDocument, options);
      }
export function useGetDeviceWithFeaturesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDeviceWithFeaturesQuery, GetDeviceWithFeaturesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDeviceWithFeaturesQuery, GetDeviceWithFeaturesQueryVariables>(GetDeviceWithFeaturesDocument, options);
        }
// @ts-ignore
export function useGetDeviceWithFeaturesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDeviceWithFeaturesQuery, GetDeviceWithFeaturesQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceWithFeaturesQuery, GetDeviceWithFeaturesQueryVariables>;
export function useGetDeviceWithFeaturesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceWithFeaturesQuery, GetDeviceWithFeaturesQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceWithFeaturesQuery | undefined, GetDeviceWithFeaturesQueryVariables>;
export function useGetDeviceWithFeaturesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceWithFeaturesQuery, GetDeviceWithFeaturesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDeviceWithFeaturesQuery, GetDeviceWithFeaturesQueryVariables>(GetDeviceWithFeaturesDocument, options);
        }
export type GetDeviceWithFeaturesQueryHookResult = ReturnType<typeof useGetDeviceWithFeaturesQuery>;
export type GetDeviceWithFeaturesLazyQueryHookResult = ReturnType<typeof useGetDeviceWithFeaturesLazyQuery>;
export type GetDeviceWithFeaturesSuspenseQueryHookResult = ReturnType<typeof useGetDeviceWithFeaturesSuspenseQuery>;
export type GetDeviceWithFeaturesQueryResult = Apollo.QueryResult<GetDeviceWithFeaturesQuery, GetDeviceWithFeaturesQueryVariables>;
export const GetDeviceWithProviderFeaturesDocument = gql`
    query GetDeviceWithProviderFeatures($id: ID!, $providerId: ID!) {
  device(id: $id) {
    id
    vendor
    modelNum
    featuresForProvider(providerId: $providerId) {
      id
      name
      description
    }
  }
}
    `;

/**
 * __useGetDeviceWithProviderFeaturesQuery__
 *
 * To run a query within a React component, call `useGetDeviceWithProviderFeaturesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDeviceWithProviderFeaturesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDeviceWithProviderFeaturesQuery({
 *   variables: {
 *      id: // value for 'id'
 *      providerId: // value for 'providerId'
 *   },
 * });
 */
export function useGetDeviceWithProviderFeaturesQuery(baseOptions: Apollo.QueryHookOptions<GetDeviceWithProviderFeaturesQuery, GetDeviceWithProviderFeaturesQueryVariables> & ({ variables: GetDeviceWithProviderFeaturesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDeviceWithProviderFeaturesQuery, GetDeviceWithProviderFeaturesQueryVariables>(GetDeviceWithProviderFeaturesDocument, options);
      }
export function useGetDeviceWithProviderFeaturesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDeviceWithProviderFeaturesQuery, GetDeviceWithProviderFeaturesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDeviceWithProviderFeaturesQuery, GetDeviceWithProviderFeaturesQueryVariables>(GetDeviceWithProviderFeaturesDocument, options);
        }
// @ts-ignore
export function useGetDeviceWithProviderFeaturesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDeviceWithProviderFeaturesQuery, GetDeviceWithProviderFeaturesQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceWithProviderFeaturesQuery, GetDeviceWithProviderFeaturesQueryVariables>;
export function useGetDeviceWithProviderFeaturesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceWithProviderFeaturesQuery, GetDeviceWithProviderFeaturesQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceWithProviderFeaturesQuery | undefined, GetDeviceWithProviderFeaturesQueryVariables>;
export function useGetDeviceWithProviderFeaturesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceWithProviderFeaturesQuery, GetDeviceWithProviderFeaturesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDeviceWithProviderFeaturesQuery, GetDeviceWithProviderFeaturesQueryVariables>(GetDeviceWithProviderFeaturesDocument, options);
        }
export type GetDeviceWithProviderFeaturesQueryHookResult = ReturnType<typeof useGetDeviceWithProviderFeaturesQuery>;
export type GetDeviceWithProviderFeaturesLazyQueryHookResult = ReturnType<typeof useGetDeviceWithProviderFeaturesLazyQuery>;
export type GetDeviceWithProviderFeaturesSuspenseQueryHookResult = ReturnType<typeof useGetDeviceWithProviderFeaturesSuspenseQuery>;
export type GetDeviceWithProviderFeaturesQueryResult = Apollo.QueryResult<GetDeviceWithProviderFeaturesQuery, GetDeviceWithProviderFeaturesQueryVariables>;
export const GetDeviceCompleteDocument = gql`
    query GetDeviceComplete($id: ID!, $bandTechnology: String, $comboTechnology: String) {
  device(id: $id) {
    id
    vendor
    modelNum
    marketName
    releaseDate
    software {
      id
      name
      platform
      buildNumber
      releaseDate
    }
    supportedBands(technology: $bandTechnology) {
      id
      bandNumber
      technology
      dlBandClass
      ulBandClass
    }
    supportedCombos(technology: $comboTechnology) {
      id
      name
      technology
    }
    features {
      id
      name
      description
    }
  }
}
    `;

/**
 * __useGetDeviceCompleteQuery__
 *
 * To run a query within a React component, call `useGetDeviceCompleteQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDeviceCompleteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDeviceCompleteQuery({
 *   variables: {
 *      id: // value for 'id'
 *      bandTechnology: // value for 'bandTechnology'
 *      comboTechnology: // value for 'comboTechnology'
 *   },
 * });
 */
export function useGetDeviceCompleteQuery(baseOptions: Apollo.QueryHookOptions<GetDeviceCompleteQuery, GetDeviceCompleteQueryVariables> & ({ variables: GetDeviceCompleteQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDeviceCompleteQuery, GetDeviceCompleteQueryVariables>(GetDeviceCompleteDocument, options);
      }
export function useGetDeviceCompleteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDeviceCompleteQuery, GetDeviceCompleteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDeviceCompleteQuery, GetDeviceCompleteQueryVariables>(GetDeviceCompleteDocument, options);
        }
// @ts-ignore
export function useGetDeviceCompleteSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetDeviceCompleteQuery, GetDeviceCompleteQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceCompleteQuery, GetDeviceCompleteQueryVariables>;
export function useGetDeviceCompleteSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceCompleteQuery, GetDeviceCompleteQueryVariables>): Apollo.UseSuspenseQueryResult<GetDeviceCompleteQuery | undefined, GetDeviceCompleteQueryVariables>;
export function useGetDeviceCompleteSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDeviceCompleteQuery, GetDeviceCompleteQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDeviceCompleteQuery, GetDeviceCompleteQueryVariables>(GetDeviceCompleteDocument, options);
        }
export type GetDeviceCompleteQueryHookResult = ReturnType<typeof useGetDeviceCompleteQuery>;
export type GetDeviceCompleteLazyQueryHookResult = ReturnType<typeof useGetDeviceCompleteLazyQuery>;
export type GetDeviceCompleteSuspenseQueryHookResult = ReturnType<typeof useGetDeviceCompleteSuspenseQuery>;
export type GetDeviceCompleteQueryResult = Apollo.QueryResult<GetDeviceCompleteQuery, GetDeviceCompleteQueryVariables>;
export const GetProviderDeviceCompleteDocument = gql`
    query GetProviderDeviceComplete($id: ID!, $providerId: ID!, $bandTechnology: String, $comboTechnology: String) {
  device(id: $id) {
    id
    vendor
    modelNum
    marketName
    releaseDate
    software {
      id
      name
      platform
      buildNumber
      releaseDate
    }
    supportedBandsForProvider(technology: $bandTechnology, providerId: $providerId) {
      id
      bandNumber
      technology
      dlBandClass
      ulBandClass
    }
    supportedCombosForProvider(
      technology: $comboTechnology
      providerId: $providerId
    ) {
      id
      name
      technology
    }
    features {
      id
      name
      description
    }
  }
}
    `;

/**
 * __useGetProviderDeviceCompleteQuery__
 *
 * To run a query within a React component, call `useGetProviderDeviceCompleteQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProviderDeviceCompleteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProviderDeviceCompleteQuery({
 *   variables: {
 *      id: // value for 'id'
 *      providerId: // value for 'providerId'
 *      bandTechnology: // value for 'bandTechnology'
 *      comboTechnology: // value for 'comboTechnology'
 *   },
 * });
 */
export function useGetProviderDeviceCompleteQuery(baseOptions: Apollo.QueryHookOptions<GetProviderDeviceCompleteQuery, GetProviderDeviceCompleteQueryVariables> & ({ variables: GetProviderDeviceCompleteQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProviderDeviceCompleteQuery, GetProviderDeviceCompleteQueryVariables>(GetProviderDeviceCompleteDocument, options);
      }
export function useGetProviderDeviceCompleteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProviderDeviceCompleteQuery, GetProviderDeviceCompleteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProviderDeviceCompleteQuery, GetProviderDeviceCompleteQueryVariables>(GetProviderDeviceCompleteDocument, options);
        }
// @ts-ignore
export function useGetProviderDeviceCompleteSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProviderDeviceCompleteQuery, GetProviderDeviceCompleteQueryVariables>): Apollo.UseSuspenseQueryResult<GetProviderDeviceCompleteQuery, GetProviderDeviceCompleteQueryVariables>;
export function useGetProviderDeviceCompleteSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProviderDeviceCompleteQuery, GetProviderDeviceCompleteQueryVariables>): Apollo.UseSuspenseQueryResult<GetProviderDeviceCompleteQuery | undefined, GetProviderDeviceCompleteQueryVariables>;
export function useGetProviderDeviceCompleteSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProviderDeviceCompleteQuery, GetProviderDeviceCompleteQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProviderDeviceCompleteQuery, GetProviderDeviceCompleteQueryVariables>(GetProviderDeviceCompleteDocument, options);
        }
export type GetProviderDeviceCompleteQueryHookResult = ReturnType<typeof useGetProviderDeviceCompleteQuery>;
export type GetProviderDeviceCompleteLazyQueryHookResult = ReturnType<typeof useGetProviderDeviceCompleteLazyQuery>;
export type GetProviderDeviceCompleteSuspenseQueryHookResult = ReturnType<typeof useGetProviderDeviceCompleteSuspenseQuery>;
export type GetProviderDeviceCompleteQueryResult = Apollo.QueryResult<GetProviderDeviceCompleteQuery, GetProviderDeviceCompleteQueryVariables>;
export const GetProvidersDocument = gql`
    query GetProviders {
  providers {
    id
    name
    country
    networkType
  }
}
    `;

/**
 * __useGetProvidersQuery__
 *
 * To run a query within a React component, call `useGetProvidersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProvidersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProvidersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProvidersQuery(baseOptions?: Apollo.QueryHookOptions<GetProvidersQuery, GetProvidersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProvidersQuery, GetProvidersQueryVariables>(GetProvidersDocument, options);
      }
export function useGetProvidersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProvidersQuery, GetProvidersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProvidersQuery, GetProvidersQueryVariables>(GetProvidersDocument, options);
        }
// @ts-ignore
export function useGetProvidersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProvidersQuery, GetProvidersQueryVariables>): Apollo.UseSuspenseQueryResult<GetProvidersQuery, GetProvidersQueryVariables>;
export function useGetProvidersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProvidersQuery, GetProvidersQueryVariables>): Apollo.UseSuspenseQueryResult<GetProvidersQuery | undefined, GetProvidersQueryVariables>;
export function useGetProvidersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProvidersQuery, GetProvidersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProvidersQuery, GetProvidersQueryVariables>(GetProvidersDocument, options);
        }
export type GetProvidersQueryHookResult = ReturnType<typeof useGetProvidersQuery>;
export type GetProvidersLazyQueryHookResult = ReturnType<typeof useGetProvidersLazyQuery>;
export type GetProvidersSuspenseQueryHookResult = ReturnType<typeof useGetProvidersSuspenseQuery>;
export type GetProvidersQueryResult = Apollo.QueryResult<GetProvidersQuery, GetProvidersQueryVariables>;
export const SearchBandsDocument = gql`
    query SearchBands($technology: String, $bandNumber: String) {
  bands(technology: $technology, bandNumber: $bandNumber) {
    id
    bandNumber
    technology
    dlBandClass
    ulBandClass
  }
}
    `;

/**
 * __useSearchBandsQuery__
 *
 * To run a query within a React component, call `useSearchBandsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchBandsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchBandsQuery({
 *   variables: {
 *      technology: // value for 'technology'
 *      bandNumber: // value for 'bandNumber'
 *   },
 * });
 */
export function useSearchBandsQuery(baseOptions?: Apollo.QueryHookOptions<SearchBandsQuery, SearchBandsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchBandsQuery, SearchBandsQueryVariables>(SearchBandsDocument, options);
      }
export function useSearchBandsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchBandsQuery, SearchBandsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchBandsQuery, SearchBandsQueryVariables>(SearchBandsDocument, options);
        }
// @ts-ignore
export function useSearchBandsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SearchBandsQuery, SearchBandsQueryVariables>): Apollo.UseSuspenseQueryResult<SearchBandsQuery, SearchBandsQueryVariables>;
export function useSearchBandsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchBandsQuery, SearchBandsQueryVariables>): Apollo.UseSuspenseQueryResult<SearchBandsQuery | undefined, SearchBandsQueryVariables>;
export function useSearchBandsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchBandsQuery, SearchBandsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchBandsQuery, SearchBandsQueryVariables>(SearchBandsDocument, options);
        }
export type SearchBandsQueryHookResult = ReturnType<typeof useSearchBandsQuery>;
export type SearchBandsLazyQueryHookResult = ReturnType<typeof useSearchBandsLazyQuery>;
export type SearchBandsSuspenseQueryHookResult = ReturnType<typeof useSearchBandsSuspenseQuery>;
export type SearchBandsQueryResult = Apollo.QueryResult<SearchBandsQuery, SearchBandsQueryVariables>;
export const GetBandDocument = gql`
    query GetBand($id: ID!) {
  band(id: $id) {
    id
    bandNumber
    technology
    dlBandClass
    ulBandClass
  }
}
    `;

/**
 * __useGetBandQuery__
 *
 * To run a query within a React component, call `useGetBandQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBandQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBandQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBandQuery(baseOptions: Apollo.QueryHookOptions<GetBandQuery, GetBandQueryVariables> & ({ variables: GetBandQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBandQuery, GetBandQueryVariables>(GetBandDocument, options);
      }
export function useGetBandLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBandQuery, GetBandQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBandQuery, GetBandQueryVariables>(GetBandDocument, options);
        }
// @ts-ignore
export function useGetBandSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetBandQuery, GetBandQueryVariables>): Apollo.UseSuspenseQueryResult<GetBandQuery, GetBandQueryVariables>;
export function useGetBandSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBandQuery, GetBandQueryVariables>): Apollo.UseSuspenseQueryResult<GetBandQuery | undefined, GetBandQueryVariables>;
export function useGetBandSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBandQuery, GetBandQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBandQuery, GetBandQueryVariables>(GetBandDocument, options);
        }
export type GetBandQueryHookResult = ReturnType<typeof useGetBandQuery>;
export type GetBandLazyQueryHookResult = ReturnType<typeof useGetBandLazyQuery>;
export type GetBandSuspenseQueryHookResult = ReturnType<typeof useGetBandSuspenseQuery>;
export type GetBandQueryResult = Apollo.QueryResult<GetBandQuery, GetBandQueryVariables>;
export const SearchCombosDocument = gql`
    query SearchCombos($technology: String, $name: String) {
  combos(technology: $technology, name: $name) {
    id
    name
    technology
    bands {
      id
      bandNumber
      technology
    }
  }
}
    `;

/**
 * __useSearchCombosQuery__
 *
 * To run a query within a React component, call `useSearchCombosQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCombosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCombosQuery({
 *   variables: {
 *      technology: // value for 'technology'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useSearchCombosQuery(baseOptions?: Apollo.QueryHookOptions<SearchCombosQuery, SearchCombosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchCombosQuery, SearchCombosQueryVariables>(SearchCombosDocument, options);
      }
export function useSearchCombosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchCombosQuery, SearchCombosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchCombosQuery, SearchCombosQueryVariables>(SearchCombosDocument, options);
        }
// @ts-ignore
export function useSearchCombosSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SearchCombosQuery, SearchCombosQueryVariables>): Apollo.UseSuspenseQueryResult<SearchCombosQuery, SearchCombosQueryVariables>;
export function useSearchCombosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchCombosQuery, SearchCombosQueryVariables>): Apollo.UseSuspenseQueryResult<SearchCombosQuery | undefined, SearchCombosQueryVariables>;
export function useSearchCombosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchCombosQuery, SearchCombosQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchCombosQuery, SearchCombosQueryVariables>(SearchCombosDocument, options);
        }
export type SearchCombosQueryHookResult = ReturnType<typeof useSearchCombosQuery>;
export type SearchCombosLazyQueryHookResult = ReturnType<typeof useSearchCombosLazyQuery>;
export type SearchCombosSuspenseQueryHookResult = ReturnType<typeof useSearchCombosSuspenseQuery>;
export type SearchCombosQueryResult = Apollo.QueryResult<SearchCombosQuery, SearchCombosQueryVariables>;
export const GetComboDocument = gql`
    query GetCombo($id: ID!) {
  combo(id: $id) {
    id
    name
    technology
    bands {
      id
      bandNumber
      technology
      dlBandClass
      ulBandClass
    }
  }
}
    `;

/**
 * __useGetComboQuery__
 *
 * To run a query within a React component, call `useGetComboQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetComboQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetComboQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetComboQuery(baseOptions: Apollo.QueryHookOptions<GetComboQuery, GetComboQueryVariables> & ({ variables: GetComboQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetComboQuery, GetComboQueryVariables>(GetComboDocument, options);
      }
export function useGetComboLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetComboQuery, GetComboQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetComboQuery, GetComboQueryVariables>(GetComboDocument, options);
        }
// @ts-ignore
export function useGetComboSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetComboQuery, GetComboQueryVariables>): Apollo.UseSuspenseQueryResult<GetComboQuery, GetComboQueryVariables>;
export function useGetComboSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetComboQuery, GetComboQueryVariables>): Apollo.UseSuspenseQueryResult<GetComboQuery | undefined, GetComboQueryVariables>;
export function useGetComboSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetComboQuery, GetComboQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetComboQuery, GetComboQueryVariables>(GetComboDocument, options);
        }
export type GetComboQueryHookResult = ReturnType<typeof useGetComboQuery>;
export type GetComboLazyQueryHookResult = ReturnType<typeof useGetComboLazyQuery>;
export type GetComboSuspenseQueryHookResult = ReturnType<typeof useGetComboSuspenseQuery>;
export type GetComboQueryResult = Apollo.QueryResult<GetComboQuery, GetComboQueryVariables>;
export const SearchFeaturesDocument = gql`
    query SearchFeatures($name: String) {
  features(name: $name) {
    id
    name
    description
  }
}
    `;

/**
 * __useSearchFeaturesQuery__
 *
 * To run a query within a React component, call `useSearchFeaturesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchFeaturesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchFeaturesQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useSearchFeaturesQuery(baseOptions?: Apollo.QueryHookOptions<SearchFeaturesQuery, SearchFeaturesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchFeaturesQuery, SearchFeaturesQueryVariables>(SearchFeaturesDocument, options);
      }
export function useSearchFeaturesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchFeaturesQuery, SearchFeaturesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchFeaturesQuery, SearchFeaturesQueryVariables>(SearchFeaturesDocument, options);
        }
// @ts-ignore
export function useSearchFeaturesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SearchFeaturesQuery, SearchFeaturesQueryVariables>): Apollo.UseSuspenseQueryResult<SearchFeaturesQuery, SearchFeaturesQueryVariables>;
export function useSearchFeaturesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchFeaturesQuery, SearchFeaturesQueryVariables>): Apollo.UseSuspenseQueryResult<SearchFeaturesQuery | undefined, SearchFeaturesQueryVariables>;
export function useSearchFeaturesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchFeaturesQuery, SearchFeaturesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchFeaturesQuery, SearchFeaturesQueryVariables>(SearchFeaturesDocument, options);
        }
export type SearchFeaturesQueryHookResult = ReturnType<typeof useSearchFeaturesQuery>;
export type SearchFeaturesLazyQueryHookResult = ReturnType<typeof useSearchFeaturesLazyQuery>;
export type SearchFeaturesSuspenseQueryHookResult = ReturnType<typeof useSearchFeaturesSuspenseQuery>;
export type SearchFeaturesQueryResult = Apollo.QueryResult<SearchFeaturesQuery, SearchFeaturesQueryVariables>;
export const GetFeatureDocument = gql`
    query GetFeature($id: ID!) {
  feature(id: $id) {
    id
    name
    description
  }
}
    `;

/**
 * __useGetFeatureQuery__
 *
 * To run a query within a React component, call `useGetFeatureQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFeatureQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFeatureQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFeatureQuery(baseOptions: Apollo.QueryHookOptions<GetFeatureQuery, GetFeatureQueryVariables> & ({ variables: GetFeatureQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFeatureQuery, GetFeatureQueryVariables>(GetFeatureDocument, options);
      }
export function useGetFeatureLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFeatureQuery, GetFeatureQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFeatureQuery, GetFeatureQueryVariables>(GetFeatureDocument, options);
        }
// @ts-ignore
export function useGetFeatureSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetFeatureQuery, GetFeatureQueryVariables>): Apollo.UseSuspenseQueryResult<GetFeatureQuery, GetFeatureQueryVariables>;
export function useGetFeatureSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFeatureQuery, GetFeatureQueryVariables>): Apollo.UseSuspenseQueryResult<GetFeatureQuery | undefined, GetFeatureQueryVariables>;
export function useGetFeatureSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFeatureQuery, GetFeatureQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFeatureQuery, GetFeatureQueryVariables>(GetFeatureDocument, options);
        }
export type GetFeatureQueryHookResult = ReturnType<typeof useGetFeatureQuery>;
export type GetFeatureLazyQueryHookResult = ReturnType<typeof useGetFeatureLazyQuery>;
export type GetFeatureSuspenseQueryHookResult = ReturnType<typeof useGetFeatureSuspenseQuery>;
export type GetFeatureQueryResult = Apollo.QueryResult<GetFeatureQuery, GetFeatureQueryVariables>;