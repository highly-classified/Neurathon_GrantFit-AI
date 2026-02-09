import "dotenv/config";
import { db } from "./firebase-admin.js";
import { upsertProfile, getProfile } from "./profiles.js";
import { getCategorizedGrants } from "./matchingEngine.js";
import { initializeUserCredits, hasSufficientCredits } from "./creditService.js";
import { analyzeAndRecordPitch } from "./pitchAnalysisService.js";

async function runAdminTests() {
    console.log("🚀 Starting Neurathon Admin Backend Verification...\n");

    const testUserId = "test-user-" + Date.now();
    const testGrantId = "test-grant-" + Date.now();

    try {
        // 1. Test Profile Creation
        console.log("👤 Creating User Profile...");
        await upsertProfile(testUserId, {
            role: "startup",
            domains: ["ai", "education"],
            funding_required: 50000,
            gender: "male",
            age: 25,
            citizenship: "india",
            has_idea: true,
            idea: "An AI-powered matching platform for educational grants."
        });
        console.log("✅ Profile created!\n");

        // 2. Test Credits initialization
        console.log("💳 Initializing Credits...");
        await initializeUserCredits(testUserId);
        const hasCredits = await hasSufficientCredits(testUserId, "analyze_credits");
        console.log("✅ Credits initialized! Has analyze credits:", hasCredits, "\n");

        // 3. Test Grant Matching
        console.log("🎯 Running Matching Engine...");
        // First, let's ensure there's at least one grant to match
        await db.collection("grants").doc(testGrantId).set({
            org_name: "Test Org",
            domain: ["ai"],
            deadline: new Date(Date.now() + 86400000), // Tomorrow
            eligibility: {
                min_age: 18,
                citizenship: ["india"],
                role: ["startup"]
            }
        });

        const categories = await getCategorizedGrants(testUserId);
        console.log(`✅ Matching Complete! Found ${categories.eligible.length} eligible grants.\n`);

        // 4. Test Pitch Analysis
        console.log("🎤 Running Pitch Analysis...");
        const pitchText = "We are building a revolutionary AI platform that connects students with the best grants available worldwide using machine learning.";
        const pitchResult = await analyzeAndRecordPitch(testUserId, testGrantId, pitchText);
        console.log(`✅ Pitch Analyzed! Score: ${pitchResult.score}, Feedback length: ${pitchResult.feedback.length}\n`);

        console.log("✨ All backend services verified successfully!");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Verification Failed:");
        console.error(error);
        process.exit(1);
    }
}

runAdminTests();
