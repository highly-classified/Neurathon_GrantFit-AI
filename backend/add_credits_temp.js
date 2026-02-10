import { db } from "./src/firebase-admin.js";
import admin from "firebase-admin";

// Quick script to add credits to a user for testing
const userId = process.argv[2] || "user_postman_01";
const creditsToAdd = parseInt(process.argv[3]) || 20;

async function addCredits() {
    try {
        const creditsRef = db.collection("credits").doc(userId);
        const doc = await creditsRef.get();

        if (!doc.exists) {
            console.log(`❌ User ${userId} does not have a credits document. Creating one...`);
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

        process.exit(0);
    } catch (error) {
        console.error("❌ Error adding credits:", error);
        process.exit(1);
    }
}

addCredits();
