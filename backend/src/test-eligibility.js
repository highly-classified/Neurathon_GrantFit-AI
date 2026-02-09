import { db } from "./firebase-admin.js";
import { runHardEligibilityFilter } from "./eligibilityService.js";

async function testEligibility() {
  console.log("Setting up mock user for testing...");
  const testUid = "test-user-999";

  // Create a mock user
  const mockUser = {
    name: "Test User",
    email: "test@example.com",
    domain: ["Health", "AI"],
    career_stage: "early_career",
    citizenship: "US_citizen",
    onboarding_completed: true
  };

  await db.collection("users").doc(testUid).set(mockUser);
  console.log("Mock user created.");

  try {
    const result = await runHardEligibilityFilter(testUid);
    console.log("Filtering Result:", result);

    // Verify the update
    const updatedDoc = await db.collection("users").doc(testUid).get();
    const updatedData = updatedDoc.data();

    console.log("--- DOCUMENT VERIFICATION ---");
    const ids = updatedData.hard_eligible_organiser_ids || [];
    console.log(`Hard Eligible IDs count: ${ids.length}`);
    console.log(`Eligible IDs: ${ids.join(", ")}`);
    console.log("Metadata:", JSON.stringify(updatedData.hard_eligibility, null, 2));

    if (result.success && ids.length > 0) {
      console.log("\nTEST SUCCESSFUL: User document updated with eligible organiser IDs.");
    } else if (result.success && ids.length === 0) {
      console.log("\nTEST PARTIAL: Logic ran but zero eligible organisers found (check data).");
    } else {
      console.error("\nTEST FAILED: Verification failed.");
    }

  } catch (error) {
    console.error("Test failed with error:", error);
  } finally {
    // Clean up or keep for manual inspection
    // await db.collection("users").doc(testUid).delete();
  }
}

testEligibility();
