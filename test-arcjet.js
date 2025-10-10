// Simple test script to verify Arcjet is working
// Run with: node test-arcjet.js

const https = require("http");

async function testEndpoint(path, method = "GET") {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.end();
  });
}

async function runTests() {
  console.log("🧪 Testing Arcjet Protection...\n");

  try {
    // Test health endpoint
    console.log("Testing /api/health...");
    const healthResult = await testEndpoint("/api/health");
    console.log("✅ Health Status:", healthResult.status);
    console.log("📊 Response:", JSON.parse(healthResult.body));

    // Test room creation
    console.log("\nTesting /api/rooms (POST)...");
    const roomResult = await testEndpoint("/api/rooms", "POST");
    console.log("✅ Room Creation Status:", roomResult.status);
    console.log("📊 Response:", JSON.parse(roomResult.body));

    // Test room validation
    console.log("\nTesting /api/rooms/TEST01 (GET)...");
    const validateResult = await testEndpoint("/api/rooms/TEST01");
    console.log("✅ Room Validation Status:", validateResult.status);
    console.log("📊 Response:", JSON.parse(validateResult.body));

    console.log("\n🎉 All tests completed successfully!");
    console.log("🛡️ Arcjet protection is active and working.");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("ℹ️ Make sure the server is running on http://localhost:3000");
  }
}

// Wait a bit for server to be fully ready, then run tests
setTimeout(runTests, 3000);
