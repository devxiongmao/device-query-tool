import { createLoaders } from "./loaders";

async function testLoaders() {
  console.log("🧪 Testing DataLoaders\n");

  const loaders = createLoaders();

  // Test 1: Load single device
  console.log("1. Testing deviceById loader...");
  const device1 = await loaders.deviceById.load(1);
  console.log(`   Loaded device: ${device1?.vendor} ${device1?.modelNum}`);

  // Test 2: Load multiple devices (should batch)
  console.log("\n2. Testing deviceById batch loading...");
  const [device2, device3] = await Promise.all([
    loaders.deviceById.load(2),
    loaders.deviceById.load(3),
  ]);

  console.log(`   Loaded devices: ${device2?.vendor}, ${device3?.vendor}`);

  // Test 3: Load software for device
  console.log("\n3. Testing softwareByDevice loader...");
  if (device1) {
    const software = await loaders.softwareByDevice.load({
      deviceId: device1.id,
    });
    console.log(`   Found ${software.length} software versions`);
  }

  // Test 4: Load bands for device/software
  console.log("\n4. Testing bandsByDeviceSoftware loader...");
  if (device1) {
    const software = await loaders.softwareByDevice.load({
      deviceId: device1.id,
    });
    if (software.length > 0) {
      const bands = await loaders.bandsByDeviceSoftware.load({
        deviceId: device1.id,
        softwareId: software[0].id,
      });
      console.log(`   Found ${bands.length} bands`);
    }
  }

  // Test 5: Load bands by combo
  console.log("\n5. Testing bandsByCombo loader...");
  const bands = await loaders.bandsByCombo.load(1);
  console.log(`   Found ${bands.length} bands in combo`);

  console.log("\n✅ DataLoader tests completed!");
}

testLoaders()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
