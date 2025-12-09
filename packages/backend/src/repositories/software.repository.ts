import { eq, and, inArray, gte } from "drizzle-orm";
import { db } from "../db/client";
import { software } from "../db/schema";

export class SoftwareRepository {
  /**
   * Find software by ID
   */
  async findById(id: number) {
    const result = await db
      .select()
      .from(software)
      .where(eq(software.id, id))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Find multiple software by IDs
   */
  async findByIds(ids: number[]) {
    if (ids.length === 0) return [];

    return db.select().from(software).where(inArray(software.id, ids));
  }

  /**
   * Find all software for a device
   */
  async findByDevice(
    deviceId: number,
    filters?: {
      platform?: string;
      releasedAfter?: string;
    }
  ) {
    const conditions = [eq(software.deviceId, deviceId)];

    if (filters?.platform) {
      conditions.push(eq(software.platform, filters.platform));
    }

    if (filters?.releasedAfter) {
      conditions.push(gte(software.releaseDate, filters.releasedAfter));
    }

    return db
      .select()
      .from(software)
      .where(and(...conditions))
      .orderBy(software.releaseDate);
  }

  /**
   * Find software for multiple devices (for batching)
   */
  async findByDevices(deviceIds: number[]) {
    if (deviceIds.length === 0) return [];

    return db
      .select()
      .from(software)
      .where(inArray(software.deviceId, deviceIds))
      .orderBy(software.deviceId, software.releaseDate);
  }
}

export const softwareRepository = new SoftwareRepository();
