import { db } from './client';
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
} from './schema';

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log('🧹 Clearing existing data...');
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
    console.log('✅ Cleared existing data\n');

    // 1. PROVIDERS (Canadian carriers)
    console.log('📡 Seeding providers...');
    const providers = await db.insert(provider).values([
      { name: 'Telus', country: 'Canada', networkType: '5G' },
      { name: 'Rogers', country: 'Canada', networkType: '5G' },
      { name: 'Bell', country: 'Canada', networkType: '5G' },
      { name: 'Freedom Mobile', country: 'Canada', networkType: '5G' },
    ]).returning();
    console.log(`✅ Created ${providers.length} providers\n`);

    // 2. BANDS (GSM, HSPA, LTE, NR)
    console.log('📻 Seeding bands...');
    const bands = await db.insert(band).values([
      // GSM Bands
      { bandNumber: '2', technology: 'GSM', frequencyRange: '1850-1910 MHz', bandClass: 'PCS' },
      { bandNumber: '5', technology: 'GSM', frequencyRange: '824-894 MHz', bandClass: 'CLR' },
      
      // HSPA/UMTS Bands
      { bandNumber: '1', technology: 'HSPA', frequencyRange: '1920-2170 MHz', bandClass: 'IMT' },
      { bandNumber: '2', technology: 'HSPA', frequencyRange: '1850-1990 MHz', bandClass: 'PCS' },
      { bandNumber: '4', technology: 'HSPA', frequencyRange: '1710-2155 MHz', bandClass: 'AWS' },
      { bandNumber: '5', technology: 'HSPA', frequencyRange: '824-894 MHz', bandClass: 'CLR' },
      
      // LTE Bands (Canadian carriers)
      { bandNumber: '2', technology: 'LTE', frequencyRange: '1850-1990 MHz', bandClass: 'PCS' },
      { bandNumber: '4', technology: 'LTE', frequencyRange: '1710-2155 MHz', bandClass: 'AWS' },
      { bandNumber: '5', technology: 'LTE', frequencyRange: '824-894 MHz', bandClass: 'CLR' },
      { bandNumber: '7', technology: 'LTE', frequencyRange: '2500-2690 MHz', bandClass: 'IMT-E' },
      { bandNumber: '12', technology: 'LTE', frequencyRange: '698-746 MHz', bandClass: 'Lower 700 MHz' },
      { bandNumber: '13', technology: 'LTE', frequencyRange: '777-787 MHz', bandClass: 'Upper 700 MHz' },
      { bandNumber: '17', technology: 'LTE', frequencyRange: '704-746 MHz', bandClass: 'Lower 700 MHz' },
      { bandNumber: '29', technology: 'LTE', frequencyRange: '717-728 MHz', bandClass: 'Lower 700 MHz' },
      { bandNumber: '30', technology: 'LTE', frequencyRange: '2305-2315 MHz', bandClass: 'WCS' },
      { bandNumber: '66', technology: 'LTE', frequencyRange: '1710-2200 MHz', bandClass: 'AWS Extended' },
      { bandNumber: '71', technology: 'LTE', frequencyRange: '663-698 MHz', bandClass: '600 MHz' },
      
      // 5G NR Bands (Canadian carriers)
      { bandNumber: 'n2', technology: 'NR', frequencyRange: '1850-1990 MHz', bandClass: 'PCS' },
      { bandNumber: 'n5', technology: 'NR', frequencyRange: '824-894 MHz', bandClass: 'CLR' },
      { bandNumber: 'n7', technology: 'NR', frequencyRange: '2500-2690 MHz', bandClass: 'IMT-E' },
      { bandNumber: 'n12', technology: 'NR', frequencyRange: '698-746 MHz', bandClass: 'Lower 700 MHz' },
      { bandNumber: 'n25', technology: 'NR', frequencyRange: '1850-1995 MHz', bandClass: 'Extended PCS' },
      { bandNumber: 'n41', technology: 'NR', frequencyRange: '2496-2690 MHz', bandClass: 'TDD 2.5 GHz' },
      { bandNumber: 'n66', technology: 'NR', frequencyRange: '1710-2200 MHz', bandClass: 'AWS Extended' },
      { bandNumber: 'n71', technology: 'NR', frequencyRange: '663-698 MHz', bandClass: '600 MHz' },
      { bandNumber: 'n77', technology: 'NR', frequencyRange: '3300-4200 MHz', bandClass: 'C-Band' },
      { bandNumber: 'n78', technology: 'NR', frequencyRange: '3300-3800 MHz', bandClass: 'C-Band' },
    ]).returning();
    console.log(`✅ Created ${bands.length} bands\n`);

    // 3. FEATURES
    console.log('⚡ Seeding features...');
    const features = await db.insert(feature).values([
      { name: 'VoLTE', description: 'Voice over LTE - HD voice calls over 4G' },
      { name: 'VoWiFi', description: 'Voice over WiFi - WiFi calling support' },
      { name: 'VoNR', description: 'Voice over NR - Native 5G voice calls' },
      { name: '5G SA', description: '5G Standalone - True 5G without LTE anchor' },
      { name: '5G NSA', description: '5G Non-Standalone - 5G with LTE anchor (EN-DC)' },
      { name: 'Carrier Aggregation', description: 'Combine multiple LTE bands for faster speeds' },
      { name: 'MIMO 4x4', description: 'Four antenna streams for improved throughput' },
      { name: 'LAA', description: 'Licensed Assisted Access - Use unlicensed 5GHz spectrum' },
    ]).returning();
    console.log(`✅ Created ${features.length} features\n`);

    // 4. COMBOS (LTE CA, EN-DC, NR CA)
    console.log('🔗 Seeding combos...');
    const combos = await db.insert(combo).values([
      // LTE Carrier Aggregation Combos
      { name: '2A-4A', technology: 'LTE CA' },
      { name: '2A-5A-7A', technology: 'LTE CA' },
      { name: '2A-12A', technology: 'LTE CA' },
      { name: '4A-7A', technology: 'LTE CA' },
      { name: '4A-12A', technology: 'LTE CA' },
      { name: '66A-66A', technology: 'LTE CA' },
      
      // EN-DC (LTE + NR) Combos
      { name: 'B2-n66', technology: 'EN-DC' },
      { name: 'B2-n71', technology: 'EN-DC' },
      { name: 'B4-n66', technology: 'EN-DC' },
      { name: 'B4-n71', technology: 'EN-DC' },
      { name: 'B66-n77', technology: 'EN-DC' },
      { name: 'B7-n78', technology: 'EN-DC' },
      
      // NR Carrier Aggregation
      { name: 'n66A-n77A', technology: 'NR CA' },
      { name: 'n71A-n77A', technology: 'NR CA' },
      { name: 'n77A-n78A', technology: 'NR CA' },
    ]).returning();
    console.log(`✅ Created ${combos.length} combos\n`);

    // 5. COMBO_BAND mappings (which bands make up each combo)
    console.log('🔗 Mapping combo bands...');
    const comboMappings = [
      // LTE CA combos
      { comboName: '2A-4A', bandNumbers: [{ tech: 'LTE', num: '2' }, { tech: 'LTE', num: '4' }] },
      { comboName: '2A-5A-7A', bandNumbers: [{ tech: 'LTE', num: '2' }, { tech: 'LTE', num: '5' }, { tech: 'LTE', num: '7' }] },
      { comboName: '2A-12A', bandNumbers: [{ tech: 'LTE', num: '2' }, { tech: 'LTE', num: '12' }] },
      { comboName: '4A-7A', bandNumbers: [{ tech: 'LTE', num: '4' }, { tech: 'LTE', num: '7' }] },
      { comboName: '4A-12A', bandNumbers: [{ tech: 'LTE', num: '4' }, { tech: 'LTE', num: '12' }] },
      { comboName: '66A-66A', bandNumbers: [{ tech: 'LTE', num: '66' }] },
      
      // EN-DC combos
      { comboName: 'B2-n66', bandNumbers: [{ tech: 'LTE', num: '2' }, { tech: 'NR', num: 'n66' }] },
      { comboName: 'B2-n71', bandNumbers: [{ tech: 'LTE', num: '2' }, { tech: 'NR', num: 'n71' }] },
      { comboName: 'B4-n66', bandNumbers: [{ tech: 'LTE', num: '4' }, { tech: 'NR', num: 'n66' }] },
      { comboName: 'B4-n71', bandNumbers: [{ tech: 'LTE', num: '4' }, { tech: 'NR', num: 'n71' }] },
      { comboName: 'B66-n77', bandNumbers: [{ tech: 'LTE', num: '66' }, { tech: 'NR', num: 'n77' }] },
      { comboName: 'B7-n78', bandNumbers: [{ tech: 'LTE', num: '7' }, { tech: 'NR', num: 'n78' }] },
      
      // NR CA combos
      { comboName: 'n66A-n77A', bandNumbers: [{ tech: 'NR', num: 'n66' }, { tech: 'NR', num: 'n77' }] },
      { comboName: 'n71A-n77A', bandNumbers: [{ tech: 'NR', num: 'n71' }, { tech: 'NR', num: 'n77' }] },
      { comboName: 'n77A-n78A', bandNumbers: [{ tech: 'NR', num: 'n77' }, { tech: 'NR', num: 'n78' }] },
    ];

    for (const mapping of comboMappings) {
      const comboRecord = combos.find(c => c.name === mapping.comboName);
      if (!comboRecord) continue;

      for (let i = 0; i < mapping.bandNumbers.length; i++) {
        const { tech, num } = mapping.bandNumbers[i];
        const bandRecord = bands.find(b => b.technology === tech && b.bandNumber === num);
        if (bandRecord) {
          await db.insert(comboBand).values({
            comboId: comboRecord.comboId,
            bandId: bandRecord.bandId,
            position: i + 1,
          });
        }
      }
    }
    console.log('✅ Mapped combo bands\n');

    // 6. DEVICES
    console.log('📱 Seeding devices...');
    const devices = await db.insert(device).values([
      // Apple devices
      { vendor: 'Apple', modelNum: 'A2893', marketName: 'iPhone 15 Pro Max', releaseDate: '2023-09-22' },
      { vendor: 'Apple', modelNum: 'A2894', marketName: 'iPhone 15 Pro', releaseDate: '2023-09-22' },
      { vendor: 'Apple', modelNum: 'A2846', marketName: 'iPhone 14 Pro', releaseDate: '2022-09-16' },
      
      // Samsung devices
      { vendor: 'Samsung', modelNum: 'SM-S928W', marketName: 'Galaxy S24 Ultra', releaseDate: '2024-01-24' },
      { vendor: 'Samsung', modelNum: 'SM-S926W', marketName: 'Galaxy S24+', releaseDate: '2024-01-24' },
      { vendor: 'Samsung', modelNum: 'SM-S918W', marketName: 'Galaxy S23 Ultra', releaseDate: '2023-02-17' },
      { vendor: 'Samsung', modelNum: 'SM-S916W', marketName: 'Galaxy S23+', releaseDate: '2023-02-17' },
      { vendor: 'Samsung', modelNum: 'SM-A546W', marketName: 'Galaxy A54 5G', releaseDate: '2023-03-24' },
      
      // Google devices
      { vendor: 'Google', modelNum: 'GF5KQ', marketName: 'Pixel 8 Pro', releaseDate: '2023-10-12' },
      { vendor: 'Google', modelNum: 'G9BQD', marketName: 'Pixel 8', releaseDate: '2023-10-12' },
      { vendor: 'Google', modelNum: 'GE9DP', marketName: 'Pixel 7 Pro', releaseDate: '2022-10-13' },
      
      // OnePlus devices
      { vendor: 'OnePlus', modelNum: 'CPH2583', marketName: 'OnePlus 12', releaseDate: '2024-01-23' },
      { vendor: 'OnePlus', modelNum: 'CPH2449', marketName: 'OnePlus 11', releaseDate: '2023-02-16' },
      
      // Motorola devices
      { vendor: 'Motorola', modelNum: 'XT2341-1', marketName: 'Moto G Power 5G', releaseDate: '2023-04-13' },
      { vendor: 'Motorola', modelNum: 'XT2321-1', marketName: 'Edge 40', releaseDate: '2023-05-04' },
    ]).returning();
    console.log(`✅ Created ${devices.length} devices\n`);

    // 7. SOFTWARE (3-5 versions per device)
    console.log('💿 Seeding software versions...');
    const softwareVersions = [];
    
    for (const dev of devices) {
      const numVersions = Math.floor(Math.random() * 3) + 3; // 3-5 versions
      const platform = dev.vendor === 'Apple' ? 'iOS' : 'Android';
      
      for (let i = 0; i < numVersions; i++) {
        const version = platform === 'iOS' 
          ? `${17 - i}.${Math.floor(Math.random() * 6)}`
          : `${14 - i}.0`;
        
        const buildDate = new Date(dev.releaseDate);
        buildDate.setMonth(buildDate.getMonth() + (i * 3));
        
        softwareVersions.push({
          name: `${platform} ${version}`,
          platform,
          ptcrb: 20000 + Math.floor(Math.random() * 10000),
          svn: Math.floor(Math.random() * 100),
          buildNumber: `${version}.${Math.floor(Math.random() * 1000)}`,
          releaseDate: buildDate.toISOString().split('T')[0],
          deviceId: dev.id,
        });
      }
    }
    
    const softwares = await db.insert(software).values(softwareVersions).returning();
    console.log(`✅ Created ${softwares.length} software versions\n`);

    // 8. DEVICE_SOFTWARE_BAND (global capabilities)
    console.log('📡 Mapping device/software/band global capabilities...');
    
    // Helper function to get bands by technology
    const getBandsByTech = (tech: string) => bands.filter(b => b.technology === tech);
    
    for (const sw of softwares) {
      const dev = devices.find(d => d.id === sw.deviceId)!;
      const isApple = dev.vendor === 'Apple';
      const isFlagship = dev.marketName?.includes('Pro') || dev.marketName?.includes('Ultra');
      
      // All devices support basic LTE bands 2, 4, 5, 12
      const basicLteBands = bands.filter(b => 
        b.technology === 'LTE' && ['2', '4', '5', '12'].includes(b.bandNumber)
      );
      
      // Flagship devices support more bands
      const lteBands = isFlagship 
        ? bands.filter(b => b.technology === 'LTE')
        : basicLteBands;
      
      // 5G support (newer devices and flagships)
      const deviceYear = parseInt(dev.releaseDate.split('-')[0]);
      const has5G = deviceYear >= 2023 || isFlagship;
      
      const nrBands = has5G 
        ? bands.filter(b => b.technology === 'NR' && 
            (isFlagship ? true : ['n66', 'n71', 'n77'].includes(b.bandNumber)))
        : [];
      
      // HSPA bands (all devices)
      const hspaBands = bands.filter(b => 
        b.technology === 'HSPA' && ['1', '2', '4', '5'].includes(b.bandNumber)
      );
      
      // Insert band mappings
      for (const band of [...hspaBands, ...lteBands, ...nrBands]) {
        await db.insert(deviceSoftwareBand).values({
          deviceId: dev.id,
          softwareId: sw.id,
          bandId: band.bandId,
        });
      }
    }
    console.log('✅ Mapped global band capabilities\n');

    // 9. DEVICE_SOFTWARE_COMBO (global combo support)
    console.log('🔗 Mapping device/software/combo global capabilities...');
    
    for (const sw of softwares) {
      const dev = devices.find(d => d.id === sw.deviceId)!;
      const isFlagship = dev.marketName?.includes('Pro') || dev.marketName?.includes('Ultra');
      const deviceYear = parseInt(dev.releaseDate.split('-')[0]);
      const has5G = deviceYear >= 2023 || isFlagship;
      
      // LTE CA combos (all modern devices)
      const lteCombos = combos.filter(c => c.technology === 'LTE CA');
      const supportedLteCombos = isFlagship ? lteCombos : lteCombos.slice(0, 3);
      
      for (const combo of supportedLteCombos) {
        await db.insert(deviceSoftwareCombo).values({
          deviceId: dev.id,
          softwareId: sw.id,
          comboId: combo.comboId,
        });
      }
      
      // EN-DC combos (5G devices)
      if (has5G) {
        const endcCombos = combos.filter(c => c.technology === 'EN-DC');
        const supportedEndc = isFlagship ? endcCombos : endcCombos.slice(0, 3);
        
        for (const combo of supportedEndc) {
          await db.insert(deviceSoftwareCombo).values({
            deviceId: dev.id,
            softwareId: sw.id,
            comboId: combo.comboId,
          });
        }
      }
      
      // NR CA combos (flagship 5G devices only)
      if (has5G && isFlagship) {
        const nrCombos = combos.filter(c => c.technology === 'NR CA');
        
        for (const combo of nrCombos) {
          await db.insert(deviceSoftwareCombo).values({
            deviceId: dev.id,
            softwareId: sw.id,
            comboId: combo.comboId,
          });
        }
      }
    }
    console.log('✅ Mapped global combo capabilities\n');

    // 10. PROVIDER-SPECIFIC BAND RESTRICTIONS
    console.log('📡 Mapping provider-specific band capabilities...');
    
    // Telus: Supports most bands, n77 restricted
    // Rogers: Full n77 support, limited n71
    // Bell: Similar to Telus
    // Freedom: Limited to basic bands
    
    for (const sw of softwares) {
      const dev = devices.find(d => d.id === sw.deviceId)!;
      
      // Get all global bands for this device/software
      const globalBands = await db
        .select()
        .from(deviceSoftwareBand)
        .where(sql => sql.and(
          sql.eq(deviceSoftwareBand.deviceId, dev.id),
          sql.eq(deviceSoftwareBand.softwareId, sw.id)
        ));
      
      for (const prov of providers) {
        for (const globalBand of globalBands) {
          const bandInfo = bands.find(b => b.bandId === globalBand.bandId)!;
          
          // Provider-specific restrictions
          let supported = true;
          
          if (prov.name === 'Telus' && bandInfo.bandNumber === 'n77') {
            supported = Math.random() > 0.5; // 50% of devices certified
          } else if (prov.name === 'Rogers' && bandInfo.bandNumber === 'n71') {
            supported = Math.random() > 0.3; // 70% of devices certified
          } else if (prov.name === 'Freedom Mobile' && bandInfo.technology === 'NR' && bandInfo.bandNumber === 'n78') {
            supported = false; // Freedom doesn't use n78
          } else if (prov.name === 'Freedom Mobile' && ['n77', 'n41'].includes(bandInfo.bandNumber)) {
            supported = Math.random() > 0.4; // Limited C-band
          }
          
          if (supported) {
            await db.insert(providerDeviceSoftwareBand).values({
              providerId: prov.providerId,
              deviceId: dev.id,
              softwareId: sw.id,
              bandId: bandInfo.bandId,
            });
          }
        }
      }
    }
    console.log('✅ Mapped provider-specific band restrictions\n');

    // 11. PROVIDER-SPECIFIC COMBO RESTRICTIONS
    console.log('🔗 Mapping provider-specific combo capabilities...');
    
    for (const sw of softwares) {
      const dev = devices.find(d => d.id === sw.deviceId)!;
      
      // Get all global combos for this device/software
      const globalCombos = await db
        .select()
        .from(deviceSoftwareCombo)
        .where(sql => sql.and(
          sql.eq(deviceSoftwareCombo.deviceId, dev.id),
          sql.eq(deviceSoftwareCombo.softwareId, sw.id)
        ));
      
      for (const prov of providers) {
        for (const globalCombo of globalCombos) {
          const comboInfo = combos.find(c => c.comboId === globalCombo.comboId)!;
          
          // Provider-specific combo restrictions
          let supported = true;
          
          if (prov.name === 'Freedom Mobile' && comboInfo.name.includes('n77')) {
            supported = Math.random() > 0.5; // Limited C-band CA
          } else if (prov.name === 'Telus' && comboInfo.name === 'B66-n77') {
            supported = Math.random() > 0.4; // Needs certification
          }
          
          if (supported) {
            await db.insert(providerDeviceSoftwareCombo).values({
              providerId: prov.providerId,
              deviceId: dev.id,
              softwareId: sw.id,
              comboId: comboInfo.comboId,
            });
          }
        }
      }
    }
    console.log('✅ Mapped provider-specific combo restrictions\n');

    // 12. DEVICE_SOFTWARE_PROVIDER_FEATURE
    console.log('⚡ Mapping device/software/provider/feature capabilities...');
    
    for (const sw of softwares) {
      const dev = devices.find(d => d.id === sw.deviceId)!;
      const deviceYear = parseInt(dev.releaseDate.split('-')[0]);
      const isFlagship = dev.marketName?.includes('Pro') || dev.marketName?.includes('Ultra');
      
      for (const prov of providers) {
        // VoLTE - almost all devices, all providers
        const volteFeature = features.find(f => f.name === 'VoLTE')!;
        await db.insert(deviceSoftwareProviderFeature).values({
          deviceId: dev.id,
          softwareId: sw.id,
          providerId: prov.providerId,
          featureId: volteFeature.id,
        });
        
        // VoWiFi - most devices, most providers
        if (Math.random() > 0.2) {
          const vowifiFeature = features.find(f => f.name === 'VoWiFi')!;
          await db.insert(deviceSoftwareProviderFeature).values({
            deviceId: dev.id,
            softwareId: sw.id,
            providerId: prov.providerId,
            featureId: vowifiFeature.id,
          });
        }
        
        // 5G NSA - devices from 2023+
        if (deviceYear >= 2023) {
          const nsaFeature = features.find(f => f.name === '5G NSA')!;
          await db.insert(deviceSoftwareProviderFeature).values({
            deviceId: dev.id,
            softwareId: sw.id,
            providerId: prov.providerId,
            featureId: nsaFeature.id,
          });
        }
        
        // 5G SA - flagship devices, not Freedom Mobile
        if (isFlagship && deviceYear >= 2023 && prov.name !== 'Freedom Mobile') {
          const saFeature = features.find(f => f.name === '5G SA')!;
          await db.insert(deviceSoftwareProviderFeature).values({
            deviceId: dev.id,
            softwareId: sw.id,
            providerId: prov.providerId,
            featureId: saFeature.id,
          });
        }
        
        // VoNR - flagship devices, limited providers
        if (isFlagship && deviceYear >= 2024 && ['Telus', 'Rogers'].includes(prov.name)) {
          const vonrFeature = features.find(f => f.name === 'VoNR')!;
          await db.insert(deviceSoftwareProviderFeature).values({
            deviceId: dev.id,
            softwareId: sw.id,
            providerId: prov.providerId,
            featureId: vonrFeature.id,
          });
        }
        
        // Carrier Aggregation - modern devices
        if (deviceYear >= 2022) {
          const caFeature = features.find(f => f.name === 'Carrier Aggregation')!;
          await db.insert(deviceSoftwareProviderFeature).values({
            deviceId: dev.id,
            softwareId: sw.id,
            providerId: prov.providerId,
            featureId: caFeature.id,
          });
        }
        
        // MIMO 4x4 - flagship devices
        if (isFlagship) {
          const mimoFeature = features.find(f => f.name === 'MIMO 4x4')!;
          await db.insert(deviceSoftwareProviderFeature).values({
            deviceId: dev.id,
            softwareId: sw.id,
            providerId: prov.providerId,
            featureId: mimoFeature.id,
          });
        }
      }
    }
    console.log('✅ Mapped feature capabilities\n');

    // Summary
    console.log('📊 Seed Summary:');
    console.log(`   Devices: ${devices.length}`);
    console.log(`   Software Versions: ${softwares.length}`);
    console.log(`   Bands: ${bands.length}`);
    console.log(`   Combos: ${combos.length}`);
    console.log(`   Features: ${features.length}`);
    console.log(`   Providers: ${providers.length}`);
    console.log('\n✅ Database seeded successfully!\n');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

// Run seed
seed()
  .then(() => {
    console.log('🎉 Seed completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seed error:', error);
    process.exit(1);
  });