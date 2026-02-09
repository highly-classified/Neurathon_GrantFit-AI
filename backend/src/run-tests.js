import "dotenv/config";
import { signInAnonymously } from "firebase/auth";
import { auth } from "./firebase.js";
import {
  testGrantWrite,
  testGrantQuery,
  testEligibilityRead
} from "./firestore/grantIngestion.service.js";

async function runTests() {
  console.log("🚀 Starting Neurathon Backend Tests...\n");

  try {
    console.log("🔐 Signing in anonymously...");
    console.debug("Firebase Project ID:", auth.app.options.projectId);
    const userCredential = await signInAnonymously(auth);
    console.log("✅ Signed in as UID:", userCredential.user.uid, "\n");

    console.log("📝 Testing Grant Write...");

    const writeResult = await testGrantWrite();
    console.log("✅ Grant Write Success:", writeResult.action, writeResult.external_id);

    console.log("\n🔍 Testing Grant Query (domain: ai)...");
    const queryResults = await testGrantQuery({ domain: "ai" });
    console.log(`✅ Grant Query Success: Found ${queryResults.length} matches`);

    console.log("\n📋 Testing Eligibility Read...");
    const eligibilityResult = await testEligibilityRead();
    console.log(`✅ Eligibility Read Success: Checked ${eligibilityResult.checked} grants`);

    console.log("\n✨ All tests completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Test Failed:");
    console.error(error);
    process.exit(1);
  }
}

runTests();
