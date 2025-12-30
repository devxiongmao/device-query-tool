import DataLoader from "dataloader";
import {
  deviceRepository,
  softwareRepository,
  bandRepository,
  comboRepository,
  featureRepository,
  providerRepository,
} from "../repositories";

/**
 * Create all DataLoaders for a GraphQL request
 * Each request gets a fresh set of loaders with their own cache
 */
export function createLoaders() {
  return {
    // ==================
    // SIMPLE ENTITY LOADERS
    // ==================

    /**
     * Load devices by ID
     * Usage: ctx.loaders.deviceById.load(1)
     */
    deviceById: new DataLoader(async (ids: readonly number[]) => {
      const devices = await deviceRepository.findByIds([...ids]);
      const deviceMap = new Map(devices.map((d) => [d.id, d]));
      return ids.map((id) => deviceMap.get(id) || null);
    }),

    /**
     * Load software by ID
     */
    softwareById: new DataLoader(async (ids: readonly number[]) => {
      const softwares = await softwareRepository.findByIds([...ids]);
      const softwareMap = new Map(softwares.map((s) => [s.id, s]));
      return ids.map((id) => softwareMap.get(id) || null);
    }),

    /**
     * Load bands by ID
     */
    bandById: new DataLoader(async (ids: readonly number[]) => {
      const bands = await bandRepository.findByIds([...ids]);
      const bandMap = new Map(bands.map((b) => [b.id, b]));
      return ids.map((id) => bandMap.get(id) || null);
    }),

    /**
     * Load combos by ID
     */
    comboById: new DataLoader(async (ids: readonly number[]) => {
      const combos = await comboRepository.findByIds([...ids]);
      const comboMap = new Map(combos.map((c) => [c.id, c]));
      return ids.map((id) => comboMap.get(id) || null);
    }),

    /**
     * Load features by ID
     */
    featureById: new DataLoader(async (ids: readonly number[]) => {
      const features = await featureRepository.findByIds([...ids]);
      const featureMap = new Map(features.map((f) => [f.id, f]));
      return ids.map((id) => featureMap.get(id) || null);
    }),

    /**
     * Load providers by ID
     */
    providerById: new DataLoader(async (ids: readonly number[]) => {
      const providers = await providerRepository.findByIds([...ids]);
      const providerMap = new Map(providers.map((p) => [p.id, p]));
      return ids.map((id) => providerMap.get(id) || null);
    }),

    // ==================
    // RELATIONSHIP LOADERS
    // ==================

    /**
     * Load software for devices
     * Key: deviceId
     * Returns: Software[]
     */
    softwareByDevice: new DataLoader(
      async (
        keys: readonly {
          deviceId: number;
          platform?: string;
          releasedAfter?: Date;
        }[]
      ) => {
        // Get unique device IDs
        const deviceIds = [...new Set(keys.map((k) => k.deviceId))];

        // Fetch all software for these devices
        const allSoftware = await softwareRepository.findByDevices(deviceIds);

        // Group by device ID
        const softwareByDeviceMap = new Map<number, typeof allSoftware>();
        for (const sw of allSoftware) {
          const existing = softwareByDeviceMap.get(sw.deviceId);
          if (existing) {
            existing.push(sw);
          } else {
            softwareByDeviceMap.set(sw.deviceId, [sw]);
          }
        }

        // Return software for each key, applying filters
        return keys.map((key) => {
          let software = softwareByDeviceMap.get(key.deviceId) || [];

          // Apply filters
          if (key.platform) {
            software = software.filter((s) => s.platform === key.platform);
          }

          if (key.releasedAfter) {
            const dateStr = key.releasedAfter.toISOString();
            software = software.filter((s) => s.releaseDate >= dateStr);
          }

          return software;
        });
      },
      {
        // Custom cache key that includes filters
        cacheKeyFn: (key) => {
          const dateKey = key.releasedAfter?.toISOString() || "any";
          return `${key.deviceId}-${key.platform || "all"}-${dateKey}`;
        },
      }
    ),

    /**
     * Load bands for device/software combinations (global)
     * Key: { deviceId, softwareId, technology? }
     * Returns: Band[]
     */
    bandsByDeviceSoftware: new DataLoader(
      async (
        keys: readonly {
          deviceId: number;
          softwareId: number;
          technology?: string;
        }[]
      ) => {
        // For simplicity, we'll make individual queries
        // In production, you might want to optimize this further
        const results = await Promise.all(
          keys.map((key) =>
            bandRepository.findByDeviceSoftware(
              key.deviceId,
              key.softwareId,
              key.technology
            )
          )
        );

        return results;
      },
      {
        cacheKeyFn: (key) =>
          `${key.deviceId}-${key.softwareId}-${key.technology || "all"}`,
      }
    ),

    /**
     * Load bands for device/software/provider combinations (provider-specific)
     * Key: { deviceId, softwareId, providerId, technology? }
     * Returns: Band[]
     */
    bandsByDeviceSoftwareProvider: new DataLoader(
      async (
        keys: readonly {
          deviceId: number;
          softwareId: number;
          providerId: number;
          technology?: string;
        }[]
      ) => {
        const results = await Promise.all(
          keys.map((key) =>
            bandRepository.findByDeviceSoftwareProvider(
              key.deviceId,
              key.softwareId,
              key.providerId,
              key.technology
            )
          )
        );

        return results;
      },
      {
        cacheKeyFn: (key) =>
          `${key.deviceId}-${key.softwareId}-${key.providerId}-${
            key.technology || "all"
          }`,
      }
    ),

    /**
     * Load combos for device/software combinations (global)
     * Key: { deviceId, softwareId, technology? }
     * Returns: Combo[]
     */
    combosByDeviceSoftware: new DataLoader(
      async (
        keys: readonly {
          deviceId: number;
          softwareId: number;
          technology?: string;
        }[]
      ) => {
        const results = await Promise.all(
          keys.map((key) =>
            comboRepository.findByDeviceSoftware(
              key.deviceId,
              key.softwareId,
              key.technology
            )
          )
        );

        return results;
      },
      {
        cacheKeyFn: (key) =>
          `${key.deviceId}-${key.softwareId}-${key.technology || "all"}`,
      }
    ),

    /**
     * Load combos for device/software/provider combinations (provider-specific)
     * Key: { deviceId, softwareId, providerId, technology? }
     * Returns: Combo[]
     */
    combosByDeviceSoftwareProvider: new DataLoader(
      async (
        keys: readonly {
          deviceId: number;
          softwareId: number;
          providerId: number;
          technology?: string;
        }[]
      ) => {
        const results = await Promise.all(
          keys.map((key) =>
            comboRepository.findByDeviceSoftwareProvider(
              key.deviceId,
              key.softwareId,
              key.providerId,
              key.technology
            )
          )
        );

        return results;
      },
      {
        cacheKeyFn: (key) =>
          `${key.deviceId}-${key.softwareId}-${key.providerId}-${
            key.technology || "all"
          }`,
      }
    ),

    /**
     * Load features for device/software/provider combinations
     * Key: { deviceId, softwareId, providerId? }
     * Returns: Feature[]
     */
    featuresByDeviceSoftwareProvider: new DataLoader(
      async (
        keys: readonly {
          deviceId: number;
          softwareId: number;
          providerId?: number;
        }[]
      ) => {
        const results = await Promise.all(
          keys.map((key) =>
            featureRepository.findByDeviceSoftwareProvider(
              key.deviceId,
              key.softwareId,
              key.providerId
            )
          )
        );

        return results;
      },
      {
        cacheKeyFn: (key) =>
          `${key.deviceId}-${key.softwareId}-${key.providerId || "any"}`,
      }
    ),

    /**
     * Load bands that make up a combo
     * Key: comboId
     * Returns: Band[]
     */
    bandsByCombo: new DataLoader(async (comboIds: readonly number[]) => {
      const allResults = await comboRepository.findBandsByCombos([...comboIds]);

      // Group by combo ID
      const bandsByComboMap = new Map<number, typeof allResults>();
      for (const result of allResults) {
        const existing = bandsByComboMap.get(result.comboId);
        if (existing) {
          existing.push(result);
        } else {
          bandsByComboMap.set(result.comboId, [result]);
        }
      }

      // Return bands for each combo
      return comboIds.map((comboId) => {
        const results = bandsByComboMap.get(comboId) || [];
        return results.map((r) => r.band);
      });
    }),

    // ==================
    // REVERSE LOOKUP LOADERS
    // (These are less commonly used but included for completeness)
    // ==================

    /**
     * Find devices by band (global or provider-specific)
     * Note: This is typically called directly from resolvers, not via DataLoader,
     * because the filtering logic is complex. But we can still provide a loader
     * for simple cases.
     */
    devicesByBand: new DataLoader(
      async (
        keys: readonly {
          bandId: number;
          providerId?: number;
          technology?: string;
        }[]
      ) => {
        const results = await Promise.all(
          keys.map((key) =>
            bandRepository.findDevicesSupportingBand({
              bandId: key.bandId,
              providerId: key.providerId,
              technology: key.technology,
            })
          )
        );

        return results;
      },
      {
        cacheKeyFn: (key) =>
          `${key.bandId}-${key.providerId || "all"}-${key.technology || "all"}`,
      }
    ),

    /**
     * Find devices by combo
     */
    devicesByCombo: new DataLoader(
      async (
        keys: readonly {
          comboId: number;
          providerId?: number;
          technology?: string;
        }[]
      ) => {
        const results = await Promise.all(
          keys.map((key) =>
            comboRepository.findDevicesSupportingCombo({
              comboId: key.comboId,
              providerId: key.providerId,
              technology: key.technology,
            })
          )
        );

        return results;
      },
      {
        cacheKeyFn: (key) =>
          `${key.comboId}-${key.providerId || "all"}-${
            key.technology || "all"
          }`,
      }
    ),

    /**
     * Find devices by feature
     */
    devicesByFeature: new DataLoader(
      async (keys: readonly { featureId: number; providerId?: number }[]) => {
        const results = await Promise.all(
          keys.map((key) =>
            featureRepository.findDevicesSupportingFeature({
              featureId: key.featureId,
              providerId: key.providerId,
            })
          )
        );

        return results;
      },
      {
        cacheKeyFn: (key) => `${key.featureId}-${key.providerId || "all"}`,
      }
    ),
  };
}

// Export type for TypeScript
export type Loaders = ReturnType<typeof createLoaders>;
