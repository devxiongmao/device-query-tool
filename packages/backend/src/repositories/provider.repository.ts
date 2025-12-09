import { eq, inArray } from "drizzle-orm";
import { db } from "../db/client";
import { provider } from "../db/schema";

export class ProviderRepository {
  /**
   * Find provider by ID
   */
  async findById(id: number) {
    const result = await db
      .select()
      .from(provider)
      .where(eq(provider.id, id))
      .limit(1);

    return result[0] || null;
  }

  /**
   * Find multiple providers by IDs
   */
  async findByIds(ids: number[]) {
    if (ids.length === 0) return [];

    return db.select().from(provider).where(inArray(provider.id, ids));
  }

  /**
   * Find all providers
   */
  async findAll() {
    return db.select().from(provider).orderBy(provider.name);
  }
}

export const providerRepository = new ProviderRepository();
