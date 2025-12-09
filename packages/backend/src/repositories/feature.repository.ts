import { eq, and, inArray, like } from "drizzle-orm";
import { db } from "../db/client";
import {
  feature,
  device,
  software,
  deviceSoftwareProviderFeature,
} from "../db/schema";
import type {
  FindDevicesByFeatureParams,
  DeviceCapabilityResult,
} from "./types";

export class FeatureRepository {
  /**
   * Find feature by ID
   */
  async findById(id: number) {
    const result = await db
      .select()
      .from(feature)
      .where(eq(feature.id, id))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Find multiple features by IDs
   */
  async findByIds(ids: number[]) {
    if (ids.length === 0) return [];

    return db.select().from(feature).where(inArray(feature.id, ids));
  }

  /**
   * Search features by name
   */
  async search(filters?: { name?: string }) {
    let query = db.select().from(feature);

    if (filters?.name) {
      query = query.where(like(feature.name, `%${filters.name}%`)) as any;
    }

    return query.orderBy(feature.name);
  }

  /**
   * Find all features
   */
  async findAll() {
    return db.select().from(feature).orderBy(feature.name);
  }

  /**
   * Find devices that support a specific feature
   * KEY METHOD for capability queries
   */
  async findDevicesSupportingFeature(
    params: FindDevicesByFeatureParams
  ): Promise<DeviceCapabilityResult[]> {
    const { featureId, providerId } = params;

    const conditions = [eq(deviceSoftwareProviderFeature.featureId, featureId)];

    if (providerId) {
      conditions.push(eq(deviceSoftwareProviderFeature.providerId, providerId));
    }

    const results = await db
      .selectDistinct({
        device,
        software,
        providerId: deviceSoftwareProviderFeature.providerId,
      })
      .from(deviceSoftwareProviderFeature)
      .innerJoin(device, eq(deviceSoftwareProviderFeature.deviceId, device.id))
      .innerJoin(
        software,
        eq(deviceSoftwareProviderFeature.softwareId, software.id)
      )
      .where(and(...conditions))
      .orderBy(device.vendor, device.modelNum);

    // Group by device
    const deviceMap = new Map<number, DeviceCapabilityResult>();

    for (const row of results) {
      if (!deviceMap.has(row.device.id)) {
        deviceMap.set(row.device.id, {
          device: row.device,
          software: [],
          supportStatus: providerId ? "provider-specific" : "global",
          provider: providerId ? { providerId: row.providerId } : null,
        });
      }

      const entry = deviceMap.get(row.device.id)!;
      if (!entry.software.find((s) => s.id === row.software.id)) {
        entry.software.push(row.software);
      }
    }

    return Array.from(deviceMap.values());
  }

  /**
   * Find features for a specific device/software/provider
   */
  async findByDeviceSoftwareProvider(
    deviceId: number,
    softwareId: number,
    providerId?: number
  ) {
    const conditions = [
      eq(deviceSoftwareProviderFeature.deviceId, deviceId),
      eq(deviceSoftwareProviderFeature.softwareId, softwareId),
    ];

    if (providerId) {
      conditions.push(eq(deviceSoftwareProviderFeature.providerId, providerId));
    }

    return db
      .selectDistinct({ feature })
      .from(deviceSoftwareProviderFeature)
      .innerJoin(
        feature,
        eq(deviceSoftwareProviderFeature.featureId, feature.id)
      )
      .where(and(...conditions))
      .then((results) => results.map((r) => r.feature));
  }
}

export const featureRepository = new FeatureRepository();
