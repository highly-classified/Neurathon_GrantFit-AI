import admin from "firebase-admin";
import { db } from "./firebase-admin.js";
import { COLLECTIONS } from "./firestore/collections.js";

const DEFAULT_REGISTRATION_CREDITS = 10;
const PITCH_ANALYSIS_COST = 1;
const GRANT_MATCHING_COST = 5;

/**
 * Helper to log credit activity.
 */
async function logActivity(transaction, userId, type, impact, projectName = "—") {
    const logRef = db.collection(COLLECTIONS.ACTIVITY_LOGS).doc();
    transaction.set(logRef, {
        user_id: userId,
        type: type, // 'Daily Check-in', 'First Registration', 'Pitch Practice'
        project_name: projectName,
        impact: impact > 0 ? `+${impact}` : `${impact}`,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
}

/**
 * Initializes a user's credit balance (First Registration).
 */
export async function initializeUserCredits(userId) {
    const creditsRef = db.collection(COLLECTIONS.CREDITS).doc(userId);

    return db.runTransaction(async (transaction) => {
        const doc = await transaction.get(creditsRef);
        if (doc.exists) return { success: false, message: "Already initialized" };

        transaction.set(creditsRef, {
            user_id: userId,
            analyze_credits: DEFAULT_REGISTRATION_CREDITS,
            last_updated: admin.firestore.FieldValue.serverTimestamp(),
        });

        await logActivity(transaction, userId, "First Registration", DEFAULT_REGISTRATION_CREDITS);

        return { user_id: userId, credits: { analyze_credits: DEFAULT_REGISTRATION_CREDITS } };
    });
}

/**
 * Adds credits to a user's balance (e.g., Daily Check-in).
 */
export async function addCredits(userId, type, amount, projectName = "—") {
    const creditsRef = db.collection(COLLECTIONS.CREDITS).doc(userId);

    return db.runTransaction(async (transaction) => {
        const creditsDoc = await transaction.get(creditsRef);
        const currentBalance = creditsDoc.exists ? (creditsDoc.data().analyze_credits || 0) : 0;

        transaction.set(creditsRef, {
            user_id: userId,
            analyze_credits: currentBalance + amount,
            last_updated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        await logActivity(transaction, userId, type, amount, projectName);

        return { success: true, new_balance: currentBalance + amount };
    });
}

/**
 * Deducts credits from the user's balance (e.g., Pitch Practice).
 */
export async function deductCredits(userId, amount = PITCH_ANALYSIS_COST, projectName = "—") {
    const creditsRef = db.collection(COLLECTIONS.CREDITS).doc(userId);

    return db.runTransaction(async (transaction) => {
        const creditsDoc = await transaction.get(creditsRef);
        if (!creditsDoc.exists) {
            throw new Error("User credits not initialized");
        }

        const currentBalance = creditsDoc.data().analyze_credits || 0;
        if (currentBalance < amount) {
            throw new Error("INSUFFICIENT_CREDITS");
        }

        transaction.update(creditsRef, {
            analyze_credits: currentBalance - amount,
            last_updated: admin.firestore.FieldValue.serverTimestamp()
        });

        await logActivity(transaction, userId, "Pitch Practice", -amount, projectName);

        return { success: true, remaining: currentBalance - amount };
    });
}

/**
 * Deducts credits for grant matching/filtering.
 */
export async function deductCreditsForMatching(userId) {
    const creditsRef = db.collection(COLLECTIONS.CREDITS).doc(userId);

    return db.runTransaction(async (transaction) => {
        const creditsDoc = await transaction.get(creditsRef);
        if (!creditsDoc.exists) {
            throw new Error("User credits not initialized");
        }

        const currentBalance = creditsDoc.data().analyze_credits || 0;
        if (currentBalance < GRANT_MATCHING_COST) {
            throw new Error("INSUFFICIENT_CREDITS");
        }

        transaction.update(creditsRef, {
            analyze_credits: currentBalance - GRANT_MATCHING_COST,
            last_updated: admin.firestore.FieldValue.serverTimestamp()
        });

        await logActivity(transaction, userId, "Grant Discovery", -GRANT_MATCHING_COST, "—");

        return { success: true, remaining: currentBalance - GRANT_MATCHING_COST };
    });
}

/**
 * Performs a daily check-in for the user.
 * Gives +1 credit only once per calendar day (UTC).
 */
export async function checkInUser(userId) {
    const creditsRef = db.collection(COLLECTIONS.CREDITS).doc(userId);

    return db.runTransaction(async (transaction) => {
        const creditsDoc = await transaction.get(creditsRef);

        if (!creditsDoc.exists) {
            // If user somehow doesn't have credits doc, initialize first
            // Registration already gives 10, so we count that as the check-in for day 1
            await initializeUserCredits(userId);
            return { success: true, message: "Initialized with registration credits", checkInAwarded: false };
        }

        const data = creditsDoc.data();
        const lastCheckIn = data.last_check_in?.toDate();
        const now = new Date();

        // Reset to start of day for comparison
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const lastDate = lastCheckIn ? new Date(Date.UTC(lastCheckIn.getUTCFullYear(), lastCheckIn.getUTCMonth(), lastCheckIn.getUTCDate())) : null;

        if (lastDate && lastDate.getTime() === today.getTime()) {
            return { success: false, message: "Already checked in today", checkInAwarded: false };
        }

        const newBalance = (data.analyze_credits || 0) + 1;
        transaction.update(creditsRef, {
            analyze_credits: newBalance,
            last_check_in: admin.firestore.FieldValue.serverTimestamp(),
            last_updated: admin.firestore.FieldValue.serverTimestamp()
        });

        await logActivity(transaction, userId, "Daily Check-in", 1);

        return { success: true, message: "Check-in successful! +1 credit added.", checkInAwarded: true, new_balance: newBalance };
    });
}

/**
 * Checks if a user has sufficient credits.
 */
export async function hasSufficientCredits(userId, amount = PITCH_ANALYSIS_COST) {
    const creditsDoc = await db.collection(COLLECTIONS.CREDITS).doc(userId).get();
    if (!creditsDoc.exists) return false;
    return (creditsDoc.data().analyze_credits || 0) >= amount;
}
