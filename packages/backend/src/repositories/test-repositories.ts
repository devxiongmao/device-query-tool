import {
  deviceRepository,
  softwareRepository,
  bandRepository,
  comboRepository,
  featureRepository,
  providerRepository,
} from "./index";

async function testRepositories() {
  console.log("🧪 Testing Repositories\n");

  // Test 1: Device Repository
  console.log("1. Testing Device Repository...");
  const devices = await deviceRepository.search({ vendor: "Apple" });
  console.log(`   Found ${devices.length} Apple devices`);
  if (devices.length > 0) {
    console.log(`   First device: ${devices[0].vendor} ${devices[0].modelNum}`);
  }

  // Test 2: Software Repository
  console.log("\n2. Testing Software Repository...");
  if (devices.length > 0) {
    const deviceSoftware = await softwareRepository.findByDevice(devices[0].id);
    console.log(
      `   Found ${deviceSoftware.length} software versions for ${devices[0].marketName}`
    );
  }

  // Test 3: Band Repository - Global
  console.log("\n3. Testing Band Repository (Global)...");
  const bands = await bandRepository.search({ technology: "NR" });
  console.log(`   Found ${bands.length} NR bands`);
  if (bands.length > 0) {
    const bandDevices = await bandRepository.findDevicesSupportingBand({
      bandId: bands[0].id,
    });
    console.log(
      `   Band ${bands[0].bandNumber}: supported by ${bandDevices.length} devices globally`
    );
  }

  // Test 4: Band Repository - Provider-Specific
  console.log("\n4. Testing Band Repository (Provider-Specific)...");
  const providers = await providerRepository.findAll();
  if (bands.length > 0 && providers.length > 0) {
    const providerBandDevices = await bandRepository.findDevicesSupportingBand({
      bandId: bands[0].id,
      providerId: providers[0].id,
    });
    console.log(
      `   Band ${bands[0].bandNumber} on ${providers[0].name}: supported by ${providerBandDevices.length} devices`
    );
    if (providerBandDevices.length > 0) {
      console.log(
        `   First device: ${providerBandDevices[0].device.vendor} ${providerBandDevices[0].device.modelNum}`
      );
      console.log(`   Support status: ${providerBandDevices[0].supportStatus}`);
    }
  }

  // Test 5: Combo Repository
  console.log("\n5. Testing Combo Repository...");
  const combos = await comboRepository.search({ technology: "EN-DC" });
  console.log(`   Found ${combos.length} EN-DC combos`);
  if (combos.length > 0) {
    const comboDevices = await comboRepository.findDevicesSupportingCombo({
      comboId: combos[0].id,
    });
    console.log(
      `   Combo ${combos[0].name}: supported by ${comboDevices.length} devices`
    );
  }

  // Test 6: Feature Repository
  console.log("\n6. Testing Feature Repository...");
  const features = await featureRepository.findAll();
  console.log(`   Found ${features.length} features`);
  if (features.length > 0) {
    const featureDevices = await featureRepository.findDevicesSupportingFeature(
      {
        featureId: features[0].id,
      }
    );
    console.log(
      `   Feature "${features[0].name}": supported by ${featureDevices.length} devices`
    );
  }

  // Test 7: Provider Repository
  console.log("\n7. Testing Provider Repository...");
  console.log(`   Found ${providers.length} providers`);
  providers.forEach((p) => {
    console.log(`   - ${p.name} (${p.country})`);
  });

  console.log("\n✅ All repository tests completed!");
}

testRepositories()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
