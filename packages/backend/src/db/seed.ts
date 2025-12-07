import { and, eq } from "drizzle-orm";
import { db } from "./client";
import {
  device,
  software,
  provider,
  band,
  feature,
  combo,
  deviceSoftwareBand,
  deviceSoftwareCombo,
  comboBand,
  providerDeviceSoftwareBand,
  providerDeviceSoftwareCombo,
  deviceSoftwareProviderFeature,
} from "./schema";

async function seed() {
  console.log("🌱 Starting database seed...\n");

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log("🧹 Clearing existing data...");
    await db.delete(deviceSoftwareProviderFeature);
    await db.delete(providerDeviceSoftwareCombo);
    await db.delete(providerDeviceSoftwareBand);
    await db.delete(comboBand);
    await db.delete(deviceSoftwareCombo);
    await db.delete(deviceSoftwareBand);
    await db.delete(software);
    await db.delete(device);
    await db.delete(combo);
    await db.delete(band);
    await db.delete(feature);
    await db.delete(provider);
    console.log("✅ Cleared existing data\n");

    // 1. PROVIDERS (Canadian carriers)
    console.log("📡 Seeding providers...");
    const providers = await db
      .insert(provider)
      .values([
        { name: "Telus", country: "Canada", networkType: "5G" },
        { name: "Rogers", country: "Canada", networkType: "5G" },
        { name: "Bell", country: "Canada", networkType: "5G" },
        { name: "Freedom Mobile", country: "Canada", networkType: "5G" },
      ])
      .returning();
    console.log(`✅ Created ${providers.length} providers\n`);

    // 2. FEATURES
    console.log("⚡ Seeding features...");
    const features = await db
      .insert(feature)
      .values([
        {
          name: "VoLTE",
          description: "Voice over LTE - HD voice calls over 4G",
        },
        {
          name: "VoWiFi",
          description: "Voice over WiFi - WiFi calling support",
        },
        { name: "VoNR", description: "Voice over NR - Native 5G voice calls" },
        {
          name: "5G SA",
          description: "5G Standalone - True 5G without LTE anchor",
        },
        {
          name: "5G NSA",
          description: "5G Non-Standalone - 5G with LTE anchor (EN-DC)",
        },
        {
          name: "Carrier Aggregation",
          description: "Combine multiple LTE bands for faster speeds",
        },
        {
          name: "MIMO 4x4",
          description: "Four antenna streams for improved throughput",
        },
        {
          name: "LAA",
          description:
            "Licensed Assisted Access - Use unlicensed 5GHz spectrum",
        },
      ])
      .returning();
    console.log(`✅ Created ${features.length} features\n`);

    // 3. BANDS (GSM, HSPA, LTE, NR)
    console.log("📻 Seeding bands...");
    const bands = await db
      .insert(band)
      .values([
        // GSM Bands
        {
          bandNumber: "850",
          technology: "GSM",
          dlBandClass: null,
          ulBandClass: null,
        },
        {
          bandNumber: "900",
          technology: "GSM",
          dlBandClass: null,
          ulBandClass: null,
        },
        {
          bandNumber: "1800",
          technology: "GSM",
          dlBandClass: null,
          ulBandClass: null,
        },
        {
          bandNumber: "1900",
          technology: "GSM",
          dlBandClass: null,
          ulBandClass: null,
        },

        // HSPA/UMTS Bands
        {
          bandNumber: "I",
          technology: "HSPA",
          dlBandClass: null,
          ulBandClass: null,
        },
        {
          bandNumber: "II",
          technology: "HSPA",
          dlBandClass: null,
          ulBandClass: null,
        },
        {
          bandNumber: "IV",
          technology: "HSPA",
          dlBandClass: null,
          ulBandClass: null,
        },
        {
          bandNumber: "V",
          technology: "HSPA",
          dlBandClass: null,
          ulBandClass: null,
        },

        // LTE Bands (Canadian carriers)
        // Band 2 - All DL/UL class combinations
        {
          bandNumber: "2",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "2",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: null,
        },
        {
          bandNumber: "2",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: null,
        },
        {
          bandNumber: "2",
          technology: "LTE",
          dlBandClass: "D",
          ulBandClass: null,
        },
        {
          bandNumber: "2",
          technology: "LTE",
          dlBandClass: "E",
          ulBandClass: null,
        },
        {
          bandNumber: "2",
          technology: "LTE",
          dlBandClass: "F",
          ulBandClass: null,
        },
        {
          bandNumber: "2",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "2",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: "A",
        },
        {
          bandNumber: "2",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: "A",
        },
        {
          bandNumber: "2",
          technology: "LTE",
          dlBandClass: "D",
          ulBandClass: "A",
        },
        {
          bandNumber: "2",
          technology: "LTE",
          dlBandClass: "E",
          ulBandClass: "A",
        },
        {
          bandNumber: "2",
          technology: "LTE",
          dlBandClass: "F",
          ulBandClass: "A",
        },

        // Band 4 - All DL/UL class combinations
        {
          bandNumber: "4",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "4",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: null,
        },
        {
          bandNumber: "4",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: null,
        },
        {
          bandNumber: "4",
          technology: "LTE",
          dlBandClass: "D",
          ulBandClass: null,
        },
        {
          bandNumber: "4",
          technology: "LTE",
          dlBandClass: "E",
          ulBandClass: null,
        },
        {
          bandNumber: "4",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "4",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: "A",
        },
        {
          bandNumber: "4",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: "A",
        },
        {
          bandNumber: "4",
          technology: "LTE",
          dlBandClass: "D",
          ulBandClass: "A",
        },
        {
          bandNumber: "4",
          technology: "LTE",
          dlBandClass: "E",
          ulBandClass: "A",
        },

        // Band 5 - All DL/UL class combinations
        {
          bandNumber: "5",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "5",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: null,
        },
        {
          bandNumber: "5",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: null,
        },
        {
          bandNumber: "5",
          technology: "LTE",
          dlBandClass: "D",
          ulBandClass: null,
        },
        {
          bandNumber: "5",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "5",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: "A",
        },
        {
          bandNumber: "5",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: "A",
        },
        {
          bandNumber: "5",
          technology: "LTE",
          dlBandClass: "D",
          ulBandClass: "A",
        },

        // Band 7 - All DL/UL class combinations
        {
          bandNumber: "7",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "7",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: null,
        },
        {
          bandNumber: "7",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: null,
        },
        {
          bandNumber: "7",
          technology: "LTE",
          dlBandClass: "D",
          ulBandClass: null,
        },
        {
          bandNumber: "7",
          technology: "LTE",
          dlBandClass: "E",
          ulBandClass: null,
        },
        {
          bandNumber: "7",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "7",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: "A",
        },
        {
          bandNumber: "7",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: "A",
        },
        {
          bandNumber: "7",
          technology: "LTE",
          dlBandClass: "D",
          ulBandClass: "A",
        },
        {
          bandNumber: "7",
          technology: "LTE",
          dlBandClass: "E",
          ulBandClass: "A",
        },

        // Band 12 - All DL/UL class combinations
        {
          bandNumber: "12",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "12",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: null,
        },
        {
          bandNumber: "12",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: null,
        },
        {
          bandNumber: "12",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "12",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: "A",
        },
        {
          bandNumber: "12",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: "A",
        },

        // Band 13 - All DL/UL class combinations
        {
          bandNumber: "13",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "13",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: null,
        },
        {
          bandNumber: "13",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "13",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: "A",
        },

        // Band 17 - All DL/UL class combinations
        {
          bandNumber: "17",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "17",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: null,
        },
        {
          bandNumber: "17",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: null,
        },
        {
          bandNumber: "17",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "17",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: "A",
        },
        {
          bandNumber: "17",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: "A",
        },

        // Band 29 - All DL/UL class combinations (DL only band)
        {
          bandNumber: "29",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "29",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: null,
        },
        {
          bandNumber: "29",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: null,
        },
        {
          bandNumber: "29",
          technology: "LTE",
          dlBandClass: "D",
          ulBandClass: null,
        },

        // Band 30 - All DL/UL class combinations
        {
          bandNumber: "30",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "30",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: null,
        },
        {
          bandNumber: "30",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: null,
        },
        {
          bandNumber: "30",
          technology: "LTE",
          dlBandClass: "D",
          ulBandClass: null,
        },
        {
          bandNumber: "30",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "30",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: "A",
        },
        {
          bandNumber: "30",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: "A",
        },
        {
          bandNumber: "30",
          technology: "LTE",
          dlBandClass: "D",
          ulBandClass: "A",
        },

        // Band 66 - All DL/UL class combinations
        {
          bandNumber: "66",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "66",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: null,
        },
        {
          bandNumber: "66",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: null,
        },
        {
          bandNumber: "66",
          technology: "LTE",
          dlBandClass: "D",
          ulBandClass: null,
        },
        {
          bandNumber: "66",
          technology: "LTE",
          dlBandClass: "E",
          ulBandClass: null,
        },
        {
          bandNumber: "66",
          technology: "LTE",
          dlBandClass: "F",
          ulBandClass: null,
        },
        {
          bandNumber: "66",
          technology: "LTE",
          dlBandClass: "G",
          ulBandClass: null,
        },
        {
          bandNumber: "66",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "66",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: "A",
        },
        {
          bandNumber: "66",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: "A",
        },
        {
          bandNumber: "66",
          technology: "LTE",
          dlBandClass: "D",
          ulBandClass: "A",
        },
        {
          bandNumber: "66",
          technology: "LTE",
          dlBandClass: "E",
          ulBandClass: "A",
        },
        {
          bandNumber: "66",
          technology: "LTE",
          dlBandClass: "F",
          ulBandClass: "A",
        },
        {
          bandNumber: "66",
          technology: "LTE",
          dlBandClass: "G",
          ulBandClass: "A",
        },

        // Band 71 - All DL/UL class combinations
        {
          bandNumber: "71",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "71",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: null,
        },
        {
          bandNumber: "71",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: null,
        },
        {
          bandNumber: "71",
          technology: "LTE",
          dlBandClass: "D",
          ulBandClass: null,
        },
        {
          bandNumber: "71",
          technology: "LTE",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "71",
          technology: "LTE",
          dlBandClass: "B",
          ulBandClass: "A",
        },
        {
          bandNumber: "71",
          technology: "LTE",
          dlBandClass: "C",
          ulBandClass: "A",
        },
        {
          bandNumber: "71",
          technology: "LTE",
          dlBandClass: "D",
          ulBandClass: "A",
        },

        // 5G NR Bands (Canadian carriers)
        // Band n2 - Single carrier + Intra-band CA configurations
        {
          bandNumber: "n2",
          technology: "NR",
          dlBandClass: null,
          ulBandClass: null,
        }, // Single carrier with UL
        {
          bandNumber: "n2",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "n2",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "n2",
          technology: "NR",
          dlBandClass: "B",
          ulBandClass: null,
        }, // CA_n2B - DL only CA
        {
          bandNumber: "n2",
          technology: "NR",
          dlBandClass: "2A",
          ulBandClass: null,
        }, // CA_n2(2A) - DL only CA

        // Band n5 - Single carrier + Intra-band CA configurations
        {
          bandNumber: "n5",
          technology: "NR",
          dlBandClass: null,
          ulBandClass: null,
        }, // Single carrier with UL
        {
          bandNumber: "n5",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "n5",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "n5",
          technology: "NR",
          dlBandClass: "B",
          ulBandClass: null,
        }, // CA_n5B - DL only CA
        {
          bandNumber: "n5",
          technology: "NR",
          dlBandClass: "2A",
          ulBandClass: null,
        }, // CA_n5(2A) - DL only CA

        // Band n7 - Single carrier + Intra-band CA configurations
        {
          bandNumber: "n7",
          technology: "NR",
          dlBandClass: null,
          ulBandClass: null,
        }, // Single carrier with UL
        {
          bandNumber: "n7",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "n7",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "n7",
          technology: "NR",
          dlBandClass: "B",
          ulBandClass: null,
        }, // CA_n7B - DL only CA
        {
          bandNumber: "n7",
          technology: "NR",
          dlBandClass: "2A",
          ulBandClass: null,
        }, // CA_n7(2A) - DL only CA

        // Band n12 - Single carrier + Intra-band CA configurations
        {
          bandNumber: "n12",
          technology: "NR",
          dlBandClass: null,
          ulBandClass: null,
        }, // Single carrier with UL
        {
          bandNumber: "n12",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "n12",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "n12",
          technology: "NR",
          dlBandClass: "2A",
          ulBandClass: null,
        }, // CA_n12(2A) - DL only CA

        // Band n25 - Single carrier + Intra-band CA configurations
        {
          bandNumber: "n25",
          technology: "NR",
          dlBandClass: null,
          ulBandClass: null,
        }, // Single carrier with UL
        {
          bandNumber: "n25",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "n25",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "n25",
          technology: "NR",
          dlBandClass: "B",
          ulBandClass: null,
        }, // CA_n25B - DL only CA
        {
          bandNumber: "n25",
          technology: "NR",
          dlBandClass: "2A",
          ulBandClass: null,
        }, // CA_n25(2A) - DL only CA
        {
          bandNumber: "n25",
          technology: "NR",
          dlBandClass: "3A",
          ulBandClass: null,
        }, // CA_n25(3A) - DL only CA

        // Band n41 - Single carrier + Intra-band CA configurations
        {
          bandNumber: "n41",
          technology: "NR",
          dlBandClass: null,
          ulBandClass: null,
        }, // Single carrier with UL
        {
          bandNumber: "n41",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "n41",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "n41",
          technology: "NR",
          dlBandClass: "B",
          ulBandClass: null,
        }, // CA_n41B - DL only CA
        {
          bandNumber: "n41",
          technology: "NR",
          dlBandClass: "C",
          ulBandClass: null,
        }, // CA_n41C - DL only CA
        {
          bandNumber: "n41",
          technology: "NR",
          dlBandClass: "2A",
          ulBandClass: null,
        }, // CA_n41(2A) - DL only CA
        {
          bandNumber: "n41",
          technology: "NR",
          dlBandClass: "3A",
          ulBandClass: null,
        }, // CA_n41(3A) - DL only CA
        {
          bandNumber: "n41",
          technology: "NR",
          dlBandClass: "A-C",
          ulBandClass: null,
        }, // CA_n41(A-C) - Mixed CA, DL only

        // Band n66 - Single carrier + Intra-band CA configurations
        {
          bandNumber: "n66",
          technology: "NR",
          dlBandClass: null,
          ulBandClass: null,
        }, // Single carrier with UL
        {
          bandNumber: "n66",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "n66",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "n66",
          technology: "NR",
          dlBandClass: "B",
          ulBandClass: null,
        }, // CA_n66B - DL only CA
        {
          bandNumber: "n66",
          technology: "NR",
          dlBandClass: "2A",
          ulBandClass: null,
        }, // CA_n66(2A) - DL only CA
        {
          bandNumber: "n66",
          technology: "NR",
          dlBandClass: "3A",
          ulBandClass: null,
        }, // CA_n66(3A) - DL only CA

        // Band n71 - Single carrier + Intra-band CA configurations
        {
          bandNumber: "n71",
          technology: "NR",
          dlBandClass: null,
          ulBandClass: null,
        }, // Single carrier with UL
        {
          bandNumber: "n71",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "n71",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "n71",
          technology: "NR",
          dlBandClass: "B",
          ulBandClass: null,
        }, // CA_n71B - DL only CA
        {
          bandNumber: "n71",
          technology: "NR",
          dlBandClass: "2A",
          ulBandClass: null,
        }, // CA_n71(2A) - DL only CA

        // Band n77 - Single carrier + Intra-band CA configurations (INCLUDING UL CA support)
        {
          bandNumber: "n77",
          technology: "NR",
          dlBandClass: null,
          ulBandClass: null,
        }, // Single carrier with UL
        {
          bandNumber: "n77",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "n77",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "n77",
          technology: "NR",
          dlBandClass: "B",
          ulBandClass: null,
        }, // CA_n77B - DL only CA
        {
          bandNumber: "n77",
          technology: "NR",
          dlBandClass: "C",
          ulBandClass: null,
        }, // CA_n77C - DL only CA
        {
          bandNumber: "n77",
          technology: "NR",
          dlBandClass: "D",
          ulBandClass: null,
        }, // CA_n77D - DL only CA
        {
          bandNumber: "n77",
          technology: "NR",
          dlBandClass: "2A",
          ulBandClass: null,
        }, // CA_n77(2A) - DL only CA
        {
          bandNumber: "n77",
          technology: "NR",
          dlBandClass: "2A",
          ulBandClass: "2A",
        }, // CA_n77(2A) - With UL CA (n77 is one of the few bands supporting UL CA)
        {
          bandNumber: "n77",
          technology: "NR",
          dlBandClass: "3A",
          ulBandClass: null,
        }, // CA_n77(3A) - DL only CA
        {
          bandNumber: "n77",
          technology: "NR",
          dlBandClass: "3A",
          ulBandClass: "3A",
        }, // CA_n77(3A) - With UL CA

        // Band n78 - Single carrier + Intra-band CA configurations
        {
          bandNumber: "n78",
          technology: "NR",
          dlBandClass: null,
          ulBandClass: null,
        }, // Single carrier with UL
        {
          bandNumber: "n78",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: null,
        },
        {
          bandNumber: "n78",
          technology: "NR",
          dlBandClass: "A",
          ulBandClass: "A",
        },
        {
          bandNumber: "n78",
          technology: "NR",
          dlBandClass: "B",
          ulBandClass: null,
        }, // CA_n78B - DL only CA
        {
          bandNumber: "n78",
          technology: "NR",
          dlBandClass: "C",
          ulBandClass: null,
        }, // CA_n78C - DL only CA
        {
          bandNumber: "n78",
          technology: "NR",
          dlBandClass: "D",
          ulBandClass: null,
        }, // CA_n78D - DL only CA
        {
          bandNumber: "n78",
          technology: "NR",
          dlBandClass: "2A",
          ulBandClass: null,
        }, // CA_n78(2A) - DL only CA
      ])
      .returning();
    console.log(`✅ Created ${bands.length} bands\n`);

    // 4. COMBOS (LTE CA, EN-DC, NR CA)
    console.log("🔗 Seeding combos...");
    const combos = await db
      .insert(combo)
      .values([
        // LTE Carrier Aggregation Combos
        { name: "2A-4A", technology: "LTE CA" },
        { name: "2A-5A-7A", technology: "LTE CA" },
        { name: "2A-12A", technology: "LTE CA" },
        { name: "4A-7A", technology: "LTE CA" },
        { name: "4A-12A", technology: "LTE CA" },
        { name: "66A-66A", technology: "LTE CA" },
        { name: "2A-4A-7A", technology: "LTE CA" },
        { name: "2A-4A-12A", technology: "LTE CA" },
        { name: "4A-5A-7A", technology: "LTE CA" },
        { name: "66A-71A", technology: "LTE CA" },

        // EN-DC (LTE + NR) Combos
        { name: "2A-n66A", technology: "EN-DC" },
        { name: "2A-n71A", technology: "EN-DC" },
        { name: "4A-n66A", technology: "EN-DC" },
        { name: "4A-n71A", technology: "EN-DC" },
        { name: "66A-n77A", technology: "EN-DC" },
        { name: "7A-n78A", technology: "EN-DC" },
        { name: "2A-4A-n71A", technology: "EN-DC" },
        { name: "66A-n41A", technology: "EN-DC" },
        { name: "7A-n77A", technology: "EN-DC" },

        // NR Carrier Aggregation
        { name: "n66A-n77A", technology: "NR CA" },
        { name: "n71A-n77A", technology: "NR CA" },
        { name: "n77A-n78A", technology: "NR CA" },
        { name: "n41A-n66A-n77A", technology: "NR CA" },
      ])
      .returning();
    console.log(`✅ Created ${combos.length} combos\n`);

    // 5. DEVICES
    console.log("📱 Seeding devices...");
    const devices = await db
      .insert(device)
      .values([
        // Apple devices
        {
          vendor: "Apple",
          modelNum: "A2893",
          marketName: "iPhone 15 Pro Max",
          releaseDate: "2023-09-22",
        },
        {
          vendor: "Apple",
          modelNum: "A2894",
          marketName: "iPhone 15 Pro",
          releaseDate: "2023-09-22",
        },
        {
          vendor: "Apple",
          modelNum: "A2846",
          marketName: "iPhone 14 Pro",
          releaseDate: "2022-09-16",
        },

        // Samsung devices
        {
          vendor: "Samsung",
          modelNum: "SM-S928W",
          marketName: "Galaxy S24 Ultra",
          releaseDate: "2024-01-24",
        },
        {
          vendor: "Samsung",
          modelNum: "SM-S926W",
          marketName: "Galaxy S24+",
          releaseDate: "2024-01-24",
        },
        {
          vendor: "Samsung",
          modelNum: "SM-S918W",
          marketName: "Galaxy S23 Ultra",
          releaseDate: "2023-02-17",
        },
        {
          vendor: "Samsung",
          modelNum: "SM-S916W",
          marketName: "Galaxy S23+",
          releaseDate: "2023-02-17",
        },
        {
          vendor: "Samsung",
          modelNum: "SM-A546W",
          marketName: "Galaxy A54 5G",
          releaseDate: "2023-03-24",
        },

        // Google devices
        {
          vendor: "Google",
          modelNum: "GF5KQ",
          marketName: "Pixel 8 Pro",
          releaseDate: "2023-10-12",
        },
        {
          vendor: "Google",
          modelNum: "G9BQD",
          marketName: "Pixel 8",
          releaseDate: "2023-10-12",
        },
        {
          vendor: "Google",
          modelNum: "GE9DP",
          marketName: "Pixel 7 Pro",
          releaseDate: "2022-10-13",
        },

        // OnePlus devices
        {
          vendor: "OnePlus",
          modelNum: "CPH2583",
          marketName: "OnePlus 12",
          releaseDate: "2024-01-23",
        },
        {
          vendor: "OnePlus",
          modelNum: "CPH2449",
          marketName: "OnePlus 11",
          releaseDate: "2023-02-16",
        },

        // Motorola devices
        {
          vendor: "Motorola",
          modelNum: "XT2341-1",
          marketName: "Moto G Power 5G",
          releaseDate: "2023-04-13",
        },
        {
          vendor: "Motorola",
          modelNum: "XT2321-1",
          marketName: "Edge 40",
          releaseDate: "2023-05-04",
        },
      ])
      .returning();
    console.log(`✅ Created ${devices.length} devices\n`);

    // 6. SOFTWARE (3-5 versions per device)
    console.log("💿 Seeding software versions...");
    const softwareVersions = [];

    for (const dev of devices) {
      const numVersions = Math.floor(Math.random() * 3) + 3; // 3-5 versions
      const platform = dev.vendor === "Apple" ? "iOS" : "Android";

      for (let i = 0; i < numVersions; i++) {
        const version =
          platform === "iOS"
            ? `${Math.max(15, 17 - i)}.${Math.floor(
                Math.random() * 6
              )}.${Math.floor(Math.random() * 3)}`
            : `${Math.max(11, 14 - i)}.0`;

        const buildDate = new Date(dev.releaseDate);
        buildDate.setMonth(buildDate.getMonth() + i * 3);

        softwareVersions.push({
          name: `${platform} ${version}`,
          platform,
          ptcrb: 20000 + Math.floor(Math.random() * 10000),
          svn: Math.floor(Math.random() * 100),
          buildNumber: `${version}.${Math.floor(Math.random() * 1000)}`,
          releaseDate: buildDate.toISOString().split("T")[0],
          deviceId: dev.id,
        });
      }
    }

    const softwares = await db
      .insert(software)
      .values(softwareVersions)
      .returning();
    console.log(`✅ Created ${softwares.length} software versions\n`);

    // 7. DEVICE_SOFTWARE_BAND (global capabilities)
    console.log("📡 Mapping device/software/band global capabilities...");

    // Helper function to get bands by technology
    // const getBandsByTech = (tech: string) => bands.filter(b => b.technology === tech);

    for (const sw of softwares) {
      const dev = devices.find((d) => d.id === sw.deviceId)!;
      // const isApple = dev.vendor === 'Apple';
      const isFlagship =
        dev.marketName?.includes("Pro") || dev.marketName?.includes("Ultra");

      // All devices support basic LTE bands 2, 4, 5, 12
      const basicLteBands = bands.filter(
        (b) =>
          b.technology === "LTE" && ["2", "4", "5", "12"].includes(b.bandNumber)
      );

      // Flagship devices support more bands
      const lteBands = isFlagship
        ? bands.filter((b) => b.technology === "LTE")
        : basicLteBands;

      // 5G support (newer devices and flagships)
      const deviceYear = parseInt(dev.releaseDate.split("-")[0]);
      const has5G = deviceYear >= 2023 || isFlagship;

      const nrBands = has5G
        ? bands.filter(
            (b) =>
              b.technology === "NR" &&
              (isFlagship ? true : ["n66", "n71", "n77"].includes(b.bandNumber))
          )
        : [];

      // HSPA bands (all devices)
      const hspaBands = bands.filter(
        (b) =>
          b.technology === "HSPA" &&
          ["I", "II", "IV", "V"].includes(b.bandNumber)
      );

      // GSM bands (all devices)
      const gsmBands = bands.filter(
        (b) =>
          b.technology === "GSM" &&
          ["850", "900", "1800", "1900"].includes(b.bandNumber)
      );

      // Insert band mappings
      for (const band of [...gsmBands, ...hspaBands, ...lteBands, ...nrBands]) {
        await db.insert(deviceSoftwareBand).values({
          deviceId: dev.id,
          softwareId: sw.id,
          bandId: band.id,
        });
      }
    }
    console.log("✅ Mapped global band capabilities\n");

    // 8. DEVICE_SOFTWARE_COMBO (global combo support)
    console.log("🔗 Mapping device/software/combo global capabilities...");

    for (const sw of softwares) {
      const dev = devices.find((d) => d.id === sw.deviceId)!;
      const isFlagship =
        dev.marketName?.includes("Pro") || dev.marketName?.includes("Ultra");
      const deviceYear = parseInt(dev.releaseDate.split("-")[0]);
      const has5G = deviceYear >= 2023 || isFlagship;

      // LTE CA combos (all modern devices)
      const lteCombos = combos.filter((c) => c.technology === "LTE CA");
      const supportedLteCombos = isFlagship ? lteCombos : lteCombos.slice(0, 3);

      for (const combo of supportedLteCombos) {
        await db.insert(deviceSoftwareCombo).values({
          deviceId: dev.id,
          softwareId: sw.id,
          comboId: combo.id,
        });
      }

      // EN-DC combos (5G devices)
      if (has5G) {
        const endcCombos = combos.filter((c) => c.technology === "EN-DC");
        const supportedEndc = isFlagship ? endcCombos : endcCombos.slice(0, 3);

        for (const combo of supportedEndc) {
          await db.insert(deviceSoftwareCombo).values({
            deviceId: dev.id,
            softwareId: sw.id,
            comboId: combo.id,
          });
        }
      }

      // NR CA combos (flagship 5G devices only)
      if (has5G && isFlagship) {
        const nrCombos = combos.filter((c) => c.technology === "NR CA");

        for (const combo of nrCombos) {
          await db.insert(deviceSoftwareCombo).values({
            deviceId: dev.id,
            softwareId: sw.id,
            comboId: combo.id,
          });
        }
      }
    }
    console.log("✅ Mapped global combo capabilities\n");

    // 9. COMBO_BAND mappings (which bands make up each combo)
    console.log("🔗 Mapping combo bands...");
    const comboMappings = [
      // LTE CA combos
      {
        comboName: "2A-4A",
        bandNumbers: [
          { tech: "LTE", num: "2", dlBandClass: "A", ulBandClass: "A" },
          { tech: "LTE", num: "4", dlBandClass: "A", ulBandClass: null },
        ],
      },
      {
        comboName: "2A-5A-7A",
        bandNumbers: [
          { tech: "LTE", num: "2", dlBandClass: "A", ulBandClass: "A" },
          { tech: "LTE", num: "5", dlBandClass: "A", ulBandClass: null },
          { tech: "LTE", num: "7", dlBandClass: "A", ulBandClass: null },
        ],
      },
      {
        comboName: "2A-12A",
        bandNumbers: [
          { tech: "LTE", num: "2", dlBandClass: "A", ulBandClass: "A" },
          { tech: "LTE", num: "12", dlBandClass: "A", ulBandClass: null },
        ],
      },
      {
        comboName: "4A-7A",
        bandNumbers: [
          { tech: "LTE", num: "4", dlBandClass: "A", ulBandClass: "A" },
          { tech: "LTE", num: "7", dlBandClass: "A", ulBandClass: null },
        ],
      },
      {
        comboName: "4A-12A",
        bandNumbers: [
          { tech: "LTE", num: "4", dlBandClass: "A", ulBandClass: "A" },
          { tech: "LTE", num: "12", dlBandClass: "A", ulBandClass: null },
        ],
      },
      {
        comboName: "66A-66A",
        bandNumbers: [
          { tech: "LTE", num: "66", dlBandClass: "A", ulBandClass: "A" },
          { tech: "LTE", num: "66", dlBandClass: "A", ulBandClass: null },
        ],
      },

      // EN-DC combos (LTE anchor, NR secondary)
      {
        comboName: "2A-n66A",
        bandNumbers: [
          { tech: "LTE", num: "2", dlBandClass: "A", ulBandClass: "A" },
          { tech: "NR", num: "n66", dlBandClass: "A", ulBandClass: "A" },
        ],
      },
      {
        comboName: "2A-n71A",
        bandNumbers: [
          { tech: "LTE", num: "2", dlBandClass: "A", ulBandClass: "A" },
          { tech: "NR", num: "n71", dlBandClass: "A", ulBandClass: "A" },
        ],
      },
      {
        comboName: "4A-n66A",
        bandNumbers: [
          { tech: "LTE", num: "4", dlBandClass: "A", ulBandClass: "A" },
          { tech: "NR", num: "n66", dlBandClass: "A", ulBandClass: "A" },
        ],
      },
      {
        comboName: "4A-n71A",
        bandNumbers: [
          { tech: "LTE", num: "4", dlBandClass: "A", ulBandClass: "A" },
          { tech: "NR", num: "n71", dlBandClass: "A", ulBandClass: "A" },
        ],
      },
      {
        comboName: "66A-n77A",
        bandNumbers: [
          { tech: "LTE", num: "66", dlBandClass: "A", ulBandClass: "A" },
          { tech: "NR", num: "n77", dlBandClass: "A", ulBandClass: "A" },
        ],
      },
      {
        comboName: "7A-n78A",
        bandNumbers: [
          { tech: "LTE", num: "7", dlBandClass: "A", ulBandClass: "A" },
          { tech: "NR", num: "n78", dlBandClass: "A", ulBandClass: "A" },
        ],
      },

      // NR CA combos (both UL and DL capable in SA mode)
      {
        comboName: "n66A-n77A",
        bandNumbers: [
          { tech: "NR", num: "n66", dlBandClass: "A", ulBandClass: "A" },
          { tech: "NR", num: "n77", dlBandClass: "A", ulBandClass: null },
        ],
      },
      {
        comboName: "n71A-n77A",
        bandNumbers: [
          { tech: "NR", num: "n71", dlBandClass: "A", ulBandClass: "A" },
          { tech: "NR", num: "n77", dlBandClass: "A", ulBandClass: null },
        ],
      },
      {
        comboName: "n77A-n78A",
        bandNumbers: [
          { tech: "NR", num: "n77", dlBandClass: "A", ulBandClass: "A" },
          { tech: "NR", num: "n78", dlBandClass: "A", ulBandClass: null },
        ],
      },
    ];

    for (const mapping of comboMappings) {
      const comboRecord = combos.find((c) => c.name === mapping.comboName);
      if (!comboRecord) continue;

      for (let i = 0; i < mapping.bandNumbers.length; i++) {
        const { tech, num, dlBandClass, ulBandClass } = mapping.bandNumbers[i];
        const bandRecord = bands.find(
          (b) =>
            b.technology === tech &&
            b.bandNumber === num &&
            b.dlBandClass === dlBandClass &&
            b.ulBandClass === ulBandClass
        );
        if (bandRecord) {
          await db.insert(comboBand).values({
            comboId: comboRecord.id,
            bandId: bandRecord.id,
          });
        }
      }
    }
    console.log("✅ Mapped combo bands\n");

    // 10. PROVIDER-SPECIFIC BAND RESTRICTIONS
    console.log("📡 Mapping provider-specific band capabilities...");

    // Telus: Supports most bands, n77 restricted
    // Rogers: Full n77 support, limited n71
    // Bell: Similar to Telus
    // Freedom: Limited to basic bands

    for (const sw of softwares) {
      const dev = devices.find((d) => d.id === sw.deviceId)!;

      // Get all global bands for this device/software
      const globalBands = await db
        .select()
        .from(deviceSoftwareBand)
        .where(
          and(
            eq(deviceSoftwareBand.deviceId, dev.id),
            eq(deviceSoftwareBand.softwareId, sw.id)
          )
        );

      for (const prov of providers) {
        for (const globalBand of globalBands) {
          const bandInfo = bands.find((b) => b.id === globalBand.bandId)!;

          // Provider-specific restrictions
          let supported = true;

          if (prov.name === "Telus" && bandInfo.bandNumber === "n77") {
            supported = Math.random() > 0.5; // 50% of devices certified
          } else if (prov.name === "Rogers" && bandInfo.bandNumber === "n71") {
            supported = Math.random() > 0.3; // 70% of devices certified
          } else if (
            prov.name === "Freedom Mobile" &&
            bandInfo.technology === "NR" &&
            bandInfo.bandNumber === "n78"
          ) {
            supported = false; // Freedom doesn't use n78
          } else if (
            prov.name === "Freedom Mobile" &&
            ["n77", "n41"].includes(bandInfo.bandNumber)
          ) {
            supported = Math.random() > 0.4; // Limited C-band
          }

          if (supported) {
            await db.insert(providerDeviceSoftwareBand).values({
              providerId: prov.id,
              deviceId: dev.id,
              softwareId: sw.id,
              bandId: bandInfo.id,
            });
          }
        }
      }
    }
    console.log("✅ Mapped provider-specific band restrictions\n");

    // 11. PROVIDER-SPECIFIC COMBO RESTRICTIONS
    console.log("🔗 Mapping provider-specific combo capabilities...");

    for (const sw of softwares) {
      const dev = devices.find((d) => d.id === sw.deviceId)!;

      // Get all global combos for this device/software
      const globalCombos = await db
        .select()
        .from(deviceSoftwareCombo)
        .where(
          and(
            eq(deviceSoftwareCombo.deviceId, dev.id),
            eq(deviceSoftwareCombo.softwareId, sw.id)
          )
        );

      for (const prov of providers) {
        for (const globalCombo of globalCombos) {
          const comboInfo = combos.find((c) => c.id === globalCombo.comboId)!;

          // Provider-specific combo restrictions
          let supported = true;

          if (
            prov.name === "Freedom Mobile" &&
            comboInfo.name.includes("n77")
          ) {
            supported = Math.random() > 0.5; // Limited C-band CA
          } else if (prov.name === "Telus" && comboInfo.name === "66A-n77A") {
            supported = Math.random() > 0.4; // Needs certification
          }

          if (supported) {
            await db.insert(providerDeviceSoftwareCombo).values({
              providerId: prov.id,
              deviceId: dev.id,
              softwareId: sw.id,
              comboId: comboInfo.id,
            });
          }
        }
      }
    }
    console.log("✅ Mapped provider-specific combo restrictions\n");

    // 12. DEVICE_SOFTWARE_PROVIDER_FEATURE
    console.log("⚡ Mapping device/software/provider/feature capabilities...");

    for (const sw of softwares) {
      const dev = devices.find((d) => d.id === sw.deviceId)!;
      const deviceYear = parseInt(dev.releaseDate.split("-")[0]);
      const isFlagship =
        dev.marketName?.includes("Pro") || dev.marketName?.includes("Ultra");

      for (const prov of providers) {
        // VoLTE - almost all devices, all providers
        const volteFeature = features.find((f) => f.name === "VoLTE")!;
        await db.insert(deviceSoftwareProviderFeature).values({
          deviceId: dev.id,
          softwareId: sw.id,
          providerId: prov.id,
          featureId: volteFeature.id,
        });

        // VoWiFi - most devices, most providers
        if (Math.random() > 0.2) {
          const vowifiFeature = features.find((f) => f.name === "VoWiFi")!;
          await db.insert(deviceSoftwareProviderFeature).values({
            deviceId: dev.id,
            softwareId: sw.id,
            providerId: prov.id,
            featureId: vowifiFeature.id,
          });
        }

        // 5G NSA - devices from 2023+
        if (deviceYear >= 2023) {
          const nsaFeature = features.find((f) => f.name === "5G NSA")!;
          await db.insert(deviceSoftwareProviderFeature).values({
            deviceId: dev.id,
            softwareId: sw.id,
            providerId: prov.id,
            featureId: nsaFeature.id,
          });
        }

        // 5G SA - flagship devices, not Freedom Mobile
        if (
          isFlagship &&
          deviceYear >= 2023 &&
          prov.name !== "Freedom Mobile"
        ) {
          const saFeature = features.find((f) => f.name === "5G SA")!;
          await db.insert(deviceSoftwareProviderFeature).values({
            deviceId: dev.id,
            softwareId: sw.id,
            providerId: prov.id,
            featureId: saFeature.id,
          });
        }

        // VoNR - flagship devices, limited providers
        if (
          isFlagship &&
          deviceYear >= 2024 &&
          ["Telus", "Rogers"].includes(prov.name)
        ) {
          const vonrFeature = features.find((f) => f.name === "VoNR")!;
          await db.insert(deviceSoftwareProviderFeature).values({
            deviceId: dev.id,
            softwareId: sw.id,
            providerId: prov.id,
            featureId: vonrFeature.id,
          });
        }

        // Carrier Aggregation - modern devices
        if (deviceYear >= 2022) {
          const caFeature = features.find(
            (f) => f.name === "Carrier Aggregation"
          )!;
          await db.insert(deviceSoftwareProviderFeature).values({
            deviceId: dev.id,
            softwareId: sw.id,
            providerId: prov.id,
            featureId: caFeature.id,
          });
        }

        // MIMO 4x4 - flagship devices
        if (isFlagship) {
          const mimoFeature = features.find((f) => f.name === "MIMO 4x4")!;
          await db.insert(deviceSoftwareProviderFeature).values({
            deviceId: dev.id,
            softwareId: sw.id,
            providerId: prov.id,
            featureId: mimoFeature.id,
          });
        }
      }
    }
    console.log("✅ Mapped feature capabilities\n");

    // Summary
    console.log("📊 Seed Summary:");
    console.log(`   Devices: ${devices.length}`);
    console.log(`   Software Versions: ${softwares.length}`);
    console.log(`   Bands: ${bands.length}`);
    console.log(`   Combos: ${combos.length}`);
    console.log(`   Features: ${features.length}`);
    console.log(`   Providers: ${providers.length}`);
    console.log("\n✅ Database seeded successfully!\n");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  }
}

// Run seed
seed()
  .then(() => {
    console.log("🎉 Seed completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seed error:", error);
    process.exit(1);
  });
