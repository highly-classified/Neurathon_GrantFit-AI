import admin from "firebase-admin";
import { db } from "./firebase-admin.js";
import { COLLECTIONS } from "./firestore/collections.js";

const DEFAULT_FREE_CREDITS = {
    analyze_credits: 10,
    improve_credits: 0
};

/**
 * Initializes a user's credit balance.
 */
export async function initializeUserCredits(userId) {
    const creditsRef = db.collection(COLLECTIONS.CREDITS).doc(userId);
    await creditsRef.set({
        user_id: userId,
        ...DEFAULT_FREE_CREDITS,
        last_updated: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { user_id: userId, credits: DEFAULT_FREE_CREDITS };
}

/**
 * Checks if a user has sufficient credits of a certain type.
 */
export async function hasSufficientCredits(userId, creditType) {
    const creditsDoc = await db.collection(COLLECTIONS.CREDITS).doc(userId).get();
    if (!creditsDoc.exists) {
        return false;
    }
    const credits = creditsDoc.data();
    return (credits[creditType] || 0) > 0;
}

/**
 * Deducts a credit from the user's balance.
 */
export async function deductCredits(userId, creditType) {
    const creditsRef = db.collection(COLLECTIONS.CREDITS).doc(userId);

    return db.runTransaction(async (transaction) => {
        const creditsDoc = await transaction.get(creditsRef);
        if (!creditsDoc.exists) {
            throw new Error("User credits not initialized");
        }

        const currentBalance = creditsDoc.data()[creditType] || 0;
        if (currentBalance <= 0) {
            throw new Error("INSUFFICIENT_CREDITS");
        }

        transaction.update(creditsRef, {
            [creditType]: currentBalance - 1,
            last_updated: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: true, remaining: currentBalance - 1 };
    });
}
