import { eq, and, inArray, like } from "drizzle-orm";
import { db } from "../db/client";
import {
  combo,
  comboBand,
  band,
  device,
  software,
  deviceSoftwareCombo,
  providerDeviceSoftwareCombo,
} from "../db/schema";
import type { FindDevicesByComboParams, DeviceCapabilityResult } from "./types";

export class ComboRepository {
  /**
   * Find combo by ID
   */
  async findById(id: number) {
    const result = await db
      .select()
      .from(combo)
      .where(eq(combo.id, id))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Find multiple combos by IDs
   */
  async findByIds(ids: number[]) {
    if (ids.length === 0) return [];

    return db.select().from(combo).where(inArray(combo.id, ids));
  }

  /**
   * Search combos
   */
  async search(filters?: { technology?: string; name?: string }) {
    const conditions = [];

    if (filters?.technology) {
      conditions.push(eq(combo.technology, filters.technology));
    }

    if (filters?.name) {
      conditions.push(like(combo.name, `%${filters.name}%`));
    }

    let query = db.select().from(combo);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    return query.orderBy(combo.technology, combo.name);
  }

  /**
   * Find all combos
   */
  async findAll() {
    return db.select().from(combo).orderBy(combo.technology, combo.name);
  }

  /**
   * Find bands that make up a combo
   */
  async findBandsByCombo(comboId: number) {
    return db
      .select({
        band,
      })
      .from(comboBand)
      .innerJoin(band, eq(comboBand.bandId, band.id))
      .where(eq(comboBand.comboId, comboId));
  }

  /**
   * Find bands for multiple combos (for batching)
   */
  async findBandsByCombos(comboIds: number[]) {
    if (comboIds.length === 0) return [];

    return db
      .select({
        comboId: comboBand.comboId,
        band,
      })
      .from(comboBand)
      .innerJoin(band, eq(comboBand.bandId, band.id))
      .where(inArray(comboBand.comboId, comboIds))
      .orderBy(comboBand.comboId);
  }

  /**
   * Find devices that support a specific combo
   * KEY METHOD for capability queries
   */
  async findDevicesSupportingCombo(
    params: FindDevicesByComboParams
  ): Promise<DeviceCapabilityResult[]> {
    const { comboId, providerId, technology } = params;

    if (providerId) {
      // Provider-specific query
      const results = await db
        .selectDistinct({
          device,
          software,
          providerId: providerDeviceSoftwareCombo.providerId,
        })
        .from(providerDeviceSoftwareCombo)
        .innerJoin(device, eq(providerDeviceSoftwareCombo.deviceId, device.id))
        .innerJoin(
          software,
          eq(providerDeviceSoftwareCombo.softwareId, software.id)
        )
        .innerJoin(combo, eq(providerDeviceSoftwareCombo.comboId, combo.id))
        .where(
          and(
            eq(providerDeviceSoftwareCombo.comboId, comboId),
            eq(providerDeviceSoftwareCombo.providerId, providerId),
            technology ? eq(combo.technology, technology) : undefined
          )
        )
        .orderBy(device.vendor, device.modelNum);

      // Group by device
      const deviceMap = new Map<number, DeviceCapabilityResult>();

      for (const row of results) {
        if (!deviceMap.has(row.device.id)) {
          deviceMap.set(row.device.id, {
            device: row.device,
            software: [],
            supportStatus: "provider-specific",
            provider: { providerId: row.providerId },
          });
        }

        const entry = deviceMap.get(row.device.id)!;
        if (!entry.software.find((s) => s.id === row.software.id)) {
          entry.software.push(row.software);
        }
      }

      return Array.from(deviceMap.values());
    } else {
      // Global capability query
      const results = await db
        .selectDistinct({
          device,
          software,
        })
        .from(deviceSoftwareCombo)
        .innerJoin(device, eq(deviceSoftwareCombo.deviceId, device.id))
        .innerJoin(software, eq(deviceSoftwareCombo.softwareId, software.id))
        .innerJoin(combo, eq(deviceSoftwareCombo.comboId, combo.id))
        .where(
          and(
            eq(deviceSoftwareCombo.comboId, comboId),
            technology ? eq(combo.technology, technology) : undefined
          )
        )
        .orderBy(device.vendor, device.modelNum);

      // Group by device
      const deviceMap = new Map<number, DeviceCapabilityResult>();

      for (const row of results) {
        if (!deviceMap.has(row.device.id)) {
          deviceMap.set(row.device.id, {
            device: row.device,
            software: [],
            supportStatus: "global",
            provider: null,
          });
        }

        const entry = deviceMap.get(row.device.id)!;
        if (!entry.software.find((s) => s.id === row.software.id)) {
          entry.software.push(row.software);
        }
      }

      return Array.from(deviceMap.values());
    }
  }

  /**
   * Find combos for a specific device/software (global)
   */
  async findByDeviceSoftware(
    deviceId: number,
    softwareId: number,
    technology?: string
  ) {
    const conditions = [
      eq(deviceSoftwareCombo.deviceId, deviceId),
      eq(deviceSoftwareCombo.softwareId, softwareId),
    ];

    if (technology) {
      conditions.push(eq(combo.technology, technology));
    }

    return db
      .select({ combo })
      .from(deviceSoftwareCombo)
      .innerJoin(combo, eq(deviceSoftwareCombo.comboId, combo.id))
      .where(and(...conditions))
      .then((results) => results.map((r) => r.combo));
  }

  /**
   * Find combos for a specific device/software/provider
   */
  async findByDeviceSoftwareProvider(
    deviceId: number,
    softwareId: number,
    providerId: number,
    technology?: string
  ) {
    const conditions = [
      eq(providerDeviceSoftwareCombo.deviceId, deviceId),
      eq(providerDeviceSoftwareCombo.softwareId, softwareId),
      eq(providerDeviceSoftwareCombo.providerId, providerId),
    ];

    if (technology) {
      conditions.push(eq(combo.technology, technology));
    }

    return db
      .select({ combo })
      .from(providerDeviceSoftwareCombo)
      .innerJoin(combo, eq(providerDeviceSoftwareCombo.comboId, combo.id))
      .where(and(...conditions))
      .then((results) => results.map((r) => r.combo));
  }
}

export const comboRepository = new ComboRepository();
