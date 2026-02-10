import "dotenv/config";
import { db } from "./src/firebase-admin.js";
import { COLLECTIONS } from "./src/firestore/collections.js";

async function setupTestData() {
    const testGrantId = "postman-test-grant";

    console.log("🛠️ Setting up test grant in Firestore...");

    await db.collection(COLLECTIONS.ORGANIZERS).doc(testGrantId).set({
        org_name: "Postman Test Labs",
        event_name: "AI Innovation Challenge 2026",
        domain: "Technology",
        tags: ["AI", "Innovation"],
        prev_year_funded_projects: ["Neural Networks for SEO", "LLM Quantization"],
        created_at: new Date()
    });

    console.log(`✅ Setup complete! Use 'grantId': '${testGrantId}' in Postman.`);
    process.exit(0);
}

setupTestData();
