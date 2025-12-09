import { eq, and, inArray, like } from "drizzle-orm";
import { db } from "../db/client";
import {
  band,
  device,
  software,
  deviceSoftwareBand,
  providerDeviceSoftwareBand,
} from "../db/schema";
import type { FindDevicesByBandParams, DeviceCapabilityResult } from "./types";

export class BandRepository {
  /**
   * Find band by ID
   */
  async findById(id: number) {
    const result = await db.select().from(band).where(eq(band.id, id)).limit(1);

    return result[0] || null;
  }

  /**
   * Find multiple bands by IDs
   */
  async findByIds(ids: number[]) {
    if (ids.length === 0) return [];

    return db.select().from(band).where(inArray(band.id, ids));
  }

  /**
   * Search bands by technology and/or band number
   */
  async search(filters?: { technology?: string; bandNumber?: string }) {
    const conditions = [];

    if (filters?.technology) {
      conditions.push(eq(band.technology, filters.technology));
    }

    if (filters?.bandNumber) {
      conditions.push(like(band.bandNumber, `%${filters.bandNumber}%`));
    }

    let query = db.select().from(band);

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return query.orderBy(band.technology, band.bandNumber);
  }

  /**
   * Find all bands
   */
  async findAll() {
    return db.select().from(band).orderBy(band.technology, band.bandNumber);
  }

  /**
   * Find devices that support a specific band
   * This is a KEY METHOD for capability queries
   */
  async findDevicesSupportingBand(
    params: FindDevicesByBandParams
  ): Promise<DeviceCapabilityResult[]> {
    const { bandId, providerId, technology } = params;

    if (providerId) {
      // Provider-specific query
      const results = await db
        .selectDistinct({
          device,
          software,
          providerId: providerDeviceSoftwareBand.providerId,
        })
        .from(providerDeviceSoftwareBand)
        .innerJoin(device, eq(providerDeviceSoftwareBand.deviceId, device.id))
        .innerJoin(
          software,
          eq(providerDeviceSoftwareBand.softwareId, software.id)
        )
        .innerJoin(band, eq(providerDeviceSoftwareBand.bandId, band.id))
        .where(
          and(
            eq(providerDeviceSoftwareBand.bandId, bandId),
            eq(providerDeviceSoftwareBand.providerId, providerId),
            technology ? eq(band.technology, technology) : undefined
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
            provider: { providerId: row.providerId }, // Will be populated by DataLoader
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
        .from(deviceSoftwareBand)
        .innerJoin(device, eq(deviceSoftwareBand.deviceId, device.id))
        .innerJoin(software, eq(deviceSoftwareBand.softwareId, software.id))
        .innerJoin(band, eq(deviceSoftwareBand.bandId, band.id))
        .where(
          and(
            eq(deviceSoftwareBand.bandId, bandId),
            technology ? eq(band.technology, technology) : undefined
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
   * Find bands for a specific device/software (global)
   */
  async findByDeviceSoftware(
    deviceId: number,
    softwareId: number,
    technology?: string
  ) {
    const conditions = [
      eq(deviceSoftwareBand.deviceId, deviceId),
      eq(deviceSoftwareBand.softwareId, softwareId),
    ];

    if (technology) {
      conditions.push(eq(band.technology, technology));
    }

    return db
      .select({ band })
      .from(deviceSoftwareBand)
      .innerJoin(band, eq(deviceSoftwareBand.bandId, band.id))
      .where(and(...conditions))
      .then((results) => results.map((r) => r.band));
  }

  /**
   * Find bands for a specific device/software/provider
   */
  async findByDeviceSoftwareProvider(
    deviceId: number,
    softwareId: number,
    providerId: number,
    technology?: string
  ) {
    const conditions = [
      eq(providerDeviceSoftwareBand.deviceId, deviceId),
      eq(providerDeviceSoftwareBand.softwareId, softwareId),
      eq(providerDeviceSoftwareBand.providerId, providerId),
    ];

    if (technology) {
      conditions.push(eq(band.technology, technology));
    }

    return db
      .select({ band })
      .from(providerDeviceSoftwareBand)
      .innerJoin(band, eq(providerDeviceSoftwareBand.bandId, band.id))
      .where(and(...conditions))
      .then((results) => results.map((r) => r.band));
  }
}

export const bandRepository = new BandRepository();
