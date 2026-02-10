import { db } from "./src/firebase-admin.js";
import admin from "firebase-admin";

// Find user by email and add credits
async function findAndAddCredits() {
    try {
        // Get user by email
        const userRecord = await admin.auth().getUserByEmail("shruthikarthikeyan2006@gmail.com");
        console.log(`✅ Found user: ${userRecord.email}`);
        console.log(`   UID: ${userRecord.uid}`);

        // Add credits to this UID
        const creditsRef = db.collection("credits").doc(userRecord.uid);
        const doc = await creditsRef.get();

        if (!doc.exists()) {
            await creditsRef.set({
                user_id: userRecord.uid,
                analyze_credits: 30,
                last_updated: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`✅ Created credits document with 30 credits`);

            // Add registration log
            await db.collection("activity_logs").add({
                user_id: userRecord.uid,
                type: "First Registration",
                project_name: "—",
                impact: "+30",
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`✅ Added registration log`);
        } else {
            const current = doc.data().analyze_credits || 0;
            await creditsRef.update({
                analyze_credits: current + 30,
                last_updated: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`✅ Updated credits: ${current} → ${current + 30}`);
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

findAndAddCredits();
