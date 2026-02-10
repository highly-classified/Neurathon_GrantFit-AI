import "dotenv/config";
import { db } from "./src/firebase-admin.js";
import { COLLECTIONS } from "./src/firestore/collections.js";

async function setupTestData() {
    const testGrantId = "postman-test-grant";
    const testUserId = "user_postman_01";

    console.log("🛠️ Setting up test grant in Firestore...");
    await db.collection(COLLECTIONS.ORGANIZERS).doc(testGrantId).set({
        org_name: "Postman Test Labs",
        event_name: "AI Innovation Challenge 2026",
        domain: "Technology",
        tags: ["AI", "Innovation"],
        prev_year_funded_projects: ["Neural Networks for SEO", "LLM Quantization"],
        created_at: new Date()
    });

    console.log(`🛠️ Setting up test user profile for '${testUserId}'...`);
    await db.collection(COLLECTIONS.USERS).doc(testUserId).set({
        displayName: "Postman Test User",
        email: "postman@test.com",
        role: "Founder",
        domain: "Technology",
        idea: "Scaling AI for educational grants",
        fundingRequirement: "50000",
        citizenship: "india",
        created_at: new Date()
    });

    console.log(`✅ Setup complete! Test user '${testUserId}' and grant ready.`);
    process.exit(0);
}

setupTestData();
