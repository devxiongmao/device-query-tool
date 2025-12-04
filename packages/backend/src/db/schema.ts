import { pgTable, bigint, varchar, date, timestamp, integer, primaryKey, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// DEVICE table
export const device = pgTable('DEVICE', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  vendor: varchar('vendor', { length: 100 }).notNull(),
  modelNum: varchar('model_num', { length: 100 }).notNull(),
  marketName: varchar('market_name', { length: 200 }),
  releaseDate: date('release_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// SOFTWARE table with foreign key index
export const software = pgTable('SOFTWARE', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 100 }).notNull(),
  platform: varchar('platform', { length: 50 }).notNull(),
  ptcrb: integer('ptcrb'),
  svn: integer('svn'),
  buildNumber: varchar('build_number', { length: 100 }),
  releaseDate: date('release_date').notNull(),
  deviceId: bigint('device_id', { mode: 'number' }).notNull().references(() => device.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Foreign key index for joins
  deviceIdx: index('idx_software_device').on(table.deviceId),
}));

// PROVIDER table
export const provider = pgTable('PROVIDER', {
  providerId: integer('provider_id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  networkType: varchar('network_type', { length: 50 }).notNull(),
});

// BAND table
export const band = pgTable('BAND', {
  bandId: integer('band_id').primaryKey().generatedAlwaysAsIdentity(),
  bandNumber: varchar('band_number', { length: 20 }).notNull(),
  technology: varchar('technology', { length: 20 }).notNull(),
  frequencyRange: varchar('frequency_range', { length: 100 }).notNull(),
  bandClass: varchar('band_class', { length: 50 }),
});

// FEATURE table
export const feature = pgTable('FEATURE', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 100 }).notNull(),
  description: varchar('description', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// COMBO table
export const combo = pgTable('COMBO', {
  comboId: integer('combo_id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 200 }).notNull(),
  technology: varchar('technology', { length: 20 }).notNull(),
});

// Junction Tables

// DEVICE_SOFTWARE_BAND with indexes
export const deviceSoftwareBand = pgTable('DEVICE_SOFTWARE_BAND', {
  deviceId: bigint('device_id', { mode: 'number' }).notNull().references(() => device.id, { onDelete: 'cascade' }),
  softwareId: bigint('software_id', { mode: 'number' }).notNull().references(() => software.id, { onDelete: 'cascade' }),
  bandId: integer('band_id').notNull().references(() => band.bandId, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.deviceId, table.softwareId, table.bandId] }),
  // Indexes
  deviceSoftwareIdx: index('idx_dsb_device_software').on(table.deviceId, table.softwareId),
  bandLookupIdx: index('idx_dsb_band_lookup').on(table.bandId),
}));

// DEVICE_SOFTWARE_COMBO with indexes
export const deviceSoftwareCombo = pgTable('DEVICE_SOFTWARE_COMBO', {
  deviceId: bigint('device_id', { mode: 'number' }).notNull().references(() => device.id, { onDelete: 'cascade' }),
  softwareId: bigint('software_id', { mode: 'number' }).notNull().references(() => software.id, { onDelete: 'cascade' }),
  comboId: integer('combo_id').notNull().references(() => combo.comboId, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.deviceId, table.softwareId, table.comboId] }),
  // Indexes
  deviceSoftwareIdx: index('idx_dsc_device_software').on(table.deviceId, table.softwareId),
  comboLookupIdx: index('idx_dsc_combo_lookup').on(table.comboId),
}));

// COMBO_BAND
export const comboBand = pgTable('COMBO_BAND', {
  comboId: integer('combo_id').notNull().references(() => combo.comboId, { onDelete: 'cascade' }),
  bandId: integer('band_id').notNull().references(() => band.bandId, { onDelete: 'cascade' }),
  position: integer('position').notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.comboId, table.bandId] }),
}));

// PROVIDER_DEVICE_SOFTWARE_BAND with indexes
export const providerDeviceSoftwareBand = pgTable('PROVIDER_DEVICE_SOFTWARE_BAND', {
  providerId: integer('provider_id').notNull().references(() => provider.providerId, { onDelete: 'cascade' }),
  deviceId: bigint('device_id', { mode: 'number' }).notNull().references(() => device.id, { onDelete: 'cascade' }),
  softwareId: bigint('software_id', { mode: 'number' }).notNull().references(() => software.id, { onDelete: 'cascade' }),
  bandId: integer('band_id').notNull().references(() => band.bandId, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.providerId, table.deviceId, table.softwareId, table.bandId] }),
  // Indexes
  providerLookupIdx: index('idx_pdsb_provider_lookup').on(table.providerId, table.bandId),
  deviceSoftwareIdx: index('idx_pdsb_device_software').on(table.deviceId, table.softwareId),
}));

// PROVIDER_DEVICE_SOFTWARE_COMBO with indexes
export const providerDeviceSoftwareCombo = pgTable('PROVIDER_DEVICE_SOFTWARE_COMBO', {
  providerId: integer('provider_id').notNull().references(() => provider.providerId, { onDelete: 'cascade' }),
  deviceId: bigint('device_id', { mode: 'number' }).notNull().references(() => device.id, { onDelete: 'cascade' }),
  softwareId: bigint('software_id', { mode: 'number' }).notNull().references(() => software.id, { onDelete: 'cascade' }),
  comboId: integer('combo_id').notNull().references(() => combo.comboId, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.providerId, table.deviceId, table.softwareId, table.comboId] }),
  // Indexes
  providerLookupIdx: index('idx_pdsc_provider_lookup').on(table.providerId, table.comboId),
  deviceSoftwareIdx: index('idx_pdsc_device_software').on(table.deviceId, table.softwareId),
}));

// DEVICE_SOFTWARE_PROVIDER_FEATURE with indexes
export const deviceSoftwareProviderFeature = pgTable('DEVICE_SOFTWARE_PROVIDER_FEATURE', {
  deviceId: bigint('device_id', { mode: 'number' }).notNull().references(() => device.id, { onDelete: 'cascade' }),
  softwareId: bigint('software_id', { mode: 'number' }).notNull().references(() => software.id, { onDelete: 'cascade' }),
  providerId: integer('provider_id').notNull().references(() => provider.providerId, { onDelete: 'cascade' }),
  featureId: bigint('feature_id', { mode: 'number' }).notNull().references(() => feature.id, { onDelete: 'cascade' }),
}, (table) => ({
  pk: primaryKey({ columns: [table.deviceId, table.softwareId, table.providerId, table.featureId] }),
  // Indexes
  lookupIdx: index('idx_dspf_lookup').on(table.deviceId, table.softwareId, table.providerId, table.featureId),
  featureLookupIdx: index('idx_dspf_feature_lookup').on(table.featureId),
}));

// Relations (for Drizzle's relational queries - optional but helpful)

export const deviceRelations = relations(device, ({ many }) => ({
  software: many(software),
  deviceSoftwareBands: many(deviceSoftwareBand),
  deviceSoftwareCombos: many(deviceSoftwareCombo),
}));

export const softwareRelations = relations(software, ({ one, many }) => ({
  device: one(device, {
    fields: [software.deviceId],
    references: [device.id],
  }),
  deviceSoftwareBands: many(deviceSoftwareBand),
  deviceSoftwareCombos: many(deviceSoftwareCombo),
}));

export const bandRelations = relations(band, ({ many }) => ({
  deviceSoftwareBands: many(deviceSoftwareBand),
  comboBands: many(comboBand),
}));

export const comboRelations = relations(combo, ({ many }) => ({
  deviceSoftwareCombos: many(deviceSoftwareCombo),
  comboBands: many(comboBand),
}));

export const featureRelations = relations(feature, ({ many }) => ({
  deviceSoftwareProviderFeatures: many(deviceSoftwareProviderFeature),
}));