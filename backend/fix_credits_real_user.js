import { db } from "./src/firebase-admin.js";
import admin from "firebase-admin";

// Script to add credits to the actual logged-in user
const userId = "QiPibOREmfc1VPnEeAIasaU8Fwn1"; // summapannaen@gmail.com
const creditsToAdd = 30;

async function addCreditsToUser() {
    try {
        const creditsRef = db.collection("credits").doc(userId);
        const doc = await creditsRef.get();

        if (!doc.exists()) {
            console.log(`Creating new credits document for user ${userId}...`);
            await creditsRef.set({
                user_id: userId,
                analyze_credits: creditsToAdd,
                last_updated: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log(`✅ Created credits document with ${creditsToAdd} credits`);
        } else {
            const currentCredits = doc.data().analyze_credits || 0;
            const newTotal = currentCredits + creditsToAdd;

            await creditsRef.update({
                analyze_credits: newTotal,
                last_updated: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log(`✅ Updated credits: ${currentCredits} → ${newTotal} (+${creditsToAdd})`);
        }

        // Also add a registration log entry
        const logRef = db.collection("activity_logs").doc();
        await logRef.set({
            user_id: userId,
            type: "First Registration",
            project_name: "—",
            impact: `+${creditsToAdd}`,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`✅ Added registration activity log`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

addCreditsToUser();
