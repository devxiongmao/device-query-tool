import { eq, and, like, gte, lte, sql, inArray } from "drizzle-orm";
import { db } from "../db/client";
import { device } from "../db/schema";
import type { SearchDevicesParams } from "./types";

export class DeviceRepository {
  /**
   * Find device by ID
   */
  async findById(id: number) {
    const result = await db
      .select()
      .from(device)
      .where(eq(device.id, id))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Find multiple devices by IDs
   */
  async findByIds(ids: number[]) {
    if (ids.length === 0) return [];

    return db.select().from(device).where(inArray(device.id, ids));
  }

  /**
   * Search devices with filters
   */
  async search(params: SearchDevicesParams) {
    const {
      vendor,
      modelNum,
      marketName,
      releasedAfter,
      releasedBefore,
      limit = 50,
      offset = 0,
    } = params;

    let query = db.select().from(device);

    // Build WHERE conditions
    const conditions = [];

    if (vendor) {
      conditions.push(like(device.vendor, `%${vendor}%`));
    }

    if (modelNum) {
      conditions.push(like(device.modelNum, `%${modelNum}%`));
    }

    if (marketName) {
      conditions.push(like(device.marketName, `%${marketName}%`));
    }

    if (releasedAfter) {
      conditions.push(gte(device.releaseDate, releasedAfter));
    }

    if (releasedBefore) {
      conditions.push(lte(device.releaseDate, releasedBefore));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    return query.limit(limit).offset(offset).orderBy(device.releaseDate);
  }

  /**
   * Get all devices (for seeding/testing)
   */
  async findAll() {
    return db.select().from(device).orderBy(device.vendor, device.modelNum);
  }

  /**
   * Count total devices
   */
  async count() {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(device);

    return Number(result[0].count);
  }
}

export const deviceRepository = new DeviceRepository();
