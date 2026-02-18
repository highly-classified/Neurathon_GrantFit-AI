import { db } from "./src/firebase-admin.js";
import admin from "firebase-admin";

// Script to list all users and their credits
async function listAllUsers() {
    try {
        console.log("\n📋 Listing all users in the system:\n");

        // Get all users from Firebase Auth
        const listUsersResult = await admin.auth().listUsers();

        console.log(`Found ${listUsersResult.users.length} users in Firebase Auth:\n`);

        for (const userRecord of listUsersResult.users) {
            console.log(`👤 User: ${userRecord.email || 'No email'}`);
            console.log(`   UID: ${userRecord.uid}`);

            // Check if they have credits
            const creditsDoc = await db.collection("credits").doc(userRecord.uid).get();
            if (creditsDoc.exists()) {
                const credits = creditsDoc.data();
                console.log(`   ✅ Credits: ${credits.analyze_credits || 0}`);
            } else {
                console.log(`   ❌ No credits document`);
            }
            console.log("");
        }

        // Also check the credits collection for any orphaned records
        console.log("\n📋 All credits documents:\n");
        const creditsSnapshot = await db.collection("credits").get();
        creditsSnapshot.forEach(doc => {
            const data = doc.data();
            console.log(`💳 Credits Doc ID: ${doc.id}`);
            console.log(`   Credits: ${data.analyze_credits || 0}`);
            console.log("");
        });

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

listAllUsers();
