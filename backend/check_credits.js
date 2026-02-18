import { db } from "./src/firebase-admin.js";

// Quick script to check user credits
const userId = process.argv[2] || "user_postman_01";

async function checkCredits() {
    try {
        const creditsRef = db.collection("credits").doc(userId);
        const doc = await creditsRef.get();

        if (!doc.exists) {
            console.log(`❌ User ${userId} does not have a credits document.`);
        } else {
            const data = doc.data();
            console.log(`✅ User ${userId} credits:`);
            console.log(`   - analyze_credits: ${data.analyze_credits || 0}`);
            console.log(`   - last_updated: ${data.last_updated?.toDate() || 'N/A'}`);
            console.log(`   - last_check_in: ${data.last_check_in?.toDate() || 'N/A'}`);
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error checking credits:", error);
        process.exit(1);
    }
}

checkCredits();
