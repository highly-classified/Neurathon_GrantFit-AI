import "dotenv/config";
import { db } from "./firebase-admin.js";
import { upsertProfile, getProfile } from "./profiles.js";
import { getCategorizedGrants } from "./matchingEngine.js";
import { initializeUserCredits, hasSufficientCredits } from "./creditService.js";
import { analyzeAndRecordPitch, improvePitchWithAI } from "./pitchAnalysisService.js";

async function runAdminTests() {
    console.log("🚀 Starting Neurathon Admin Backend Verification...\n");

    const testUserId = "test-user-" + Date.now();
    const testGrantId = "test-grant-" + Date.now();

    try {
        // 1. Test Profile Creation (New Schema)
        console.log("👤 Creating User Profile...");
        await upsertProfile(testUserId, {
            role: "Founder",
            domain: "FinTech",
            fundingRequirement: "100000",
            gender: "Female",
            age: "20",
            citizenship: "india",
            displayName: "swathi",
            email: "swathigandhi2006@gmail.com",
            idea: "An AI-powered matching platform for educational grants."
        });
        console.log("✅ Profile created!\n");

        // 2. Test Credits initialization
        console.log("💳 Initializing Credits...");
        await initializeUserCredits(testUserId);
        const hasCredits = await hasSufficientCredits(testUserId, "analyze_credits");
        console.log("✅ Credits initialized! Has analyze credits:", hasCredits, "\n");

        // 3. Test Grant Matching (New Organizer Schema)
        console.log("🎯 Running Matching Engine...");
        await db.collection("organizers").doc(testGrantId).set({
            org_name: "Department of Commerce",
            domain: "Climate",
            event_name: "Climate Program Office for FY 2012",
            org_id: "DOC",
            source: "grants.gov_api",
            reg_start_date: "07/06/2011",
            eligibility_criteria: {
                career_stage: ["mid_career", "faculty", "postdoctoral"],
                citizenship: ["US_citizen", "permanent_resident"],
                confidence: "medium",
                source: "synthetic_policy_v1"
            },
            funding_profile: {
                basis: "synthetic_domain_model",
                confidence: "medium",
                max_amt: 2440000,
                max_amt_estimated: 2440000,
                min_amt_estimated: 518000
            },
            tags: ["climate", "synthetic"],
            created_at: new Date()
        });

        const categories = await getCategorizedGrants(testUserId);
        console.log(`✅ Matching Complete! Found ${categories.eligible.length} eligible grants.\n`);

        // 4. Test Pitch Analysis (Structured Feedback)
        console.log("🎤 Running Structured Pitch Analysis...");
        const pitchText = "Building a scaleable climate research platform.";
        const evaluation = await analyzeAndRecordPitch(testUserId, testGrantId, pitchText);
        console.log(`✅ Initial Analysis! Score: ${evaluation.score}`);
        console.log(`   Best Part: ${evaluation.best_part}`);
        console.log(`   Needs Improvement: ${evaluation.improvement_needed}`);
        console.log(`   Worse Part: ${evaluation.worse_part}\n`);

        // 5. Test Pitch Improvement (Manual Refinement Simulation)
        console.log("🛠️ Running Pitch Improvement (Manual Refinement)...");
        const manualEdit = pitchText + " Our platform now includes a specific module for NOAA grant compliance.";
        const improvement = await improvePitchWithAI(testUserId, testGrantId, manualEdit, evaluation);
        console.log(`✅ Pitch Re-evaluated! New Score: ${improvement.score}`);
        console.log(`   Best Part: ${improvement.best_part.substring(0, 50)}...`);
        console.log(`   Next Area for Development: ${improvement.improvement_needed.substring(0, 50)}...\n`);

        if (improvement.score <= evaluation.score) {
            throw new Error("Improvement did not increase score!");
        }

        console.log("✨ All backend services verified successfully!");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Verification Failed:");
        console.error(error);
        process.exit(1);
    }
}

runAdminTests();
