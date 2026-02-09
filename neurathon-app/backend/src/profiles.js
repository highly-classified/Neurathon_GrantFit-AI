import admin from "firebase-admin";
import { db } from "./firebase-admin.js";
import { COLLECTIONS } from "./firestore/collections.js";

/**
 * Upserts a user profile with the structured data required by Neurathon.
 */
export async function upsertProfile(userId, profileData) {
    const profileRef = db.collection(COLLECTIONS.USERS).doc(userId);

    const normalizedProfile = {
        ...profileData,
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    await profileRef.set(normalizedProfile, { merge: true });
    return { user_id: userId, success: true };
}

/**
 * Fetches a user profile by ID.
 */
export async function getProfile(userId) {
    const profileDoc = await db.collection(COLLECTIONS.USERS).doc(userId).get();
    if (!profileDoc.exists) {
        return null;
    }
    return { id: profileDoc.id, ...profileDoc.data() };
}
