import admin from "firebase-admin";
import { db } from "./firebase-admin.js";
import { COLLECTIONS, buildUserGrantKey, buildPitchSessionId } from "./firestore/collections.js";

export class PitchLockedError extends Error {
    constructor(message = "PITCH_LOCKED_AT_100") {
        super(message);
        this.name = "PitchLockedError";
        this.code = "PITCH_LOCKED_AT_100";
    }
}

/**
 * Creates a pitch session attempt using the Firebase Admin SDK.
 */
export async function createPitchSessionAdmin(userId, sessionInput) {
    const userGrantKey = buildUserGrantKey(userId, sessionInput.grant_id);
    const counterRef = db.collection(COLLECTIONS.PITCH_ATTEMPT_COUNTERS).doc(userGrantKey);

    return db.runTransaction(async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        const counter = counterDoc.exists
            ? counterDoc.data()
            : { last_attempt: 0, locked: false };

        if (counter.locked) {
            throw new PitchLockedError();
        }

        const attemptNumber = Number(counter.last_attempt || 0) + 1;
        const locked = sessionInput.readiness_score === 100;
        const sessionId = buildPitchSessionId(
            userId,
            sessionInput.grant_id,
            attemptNumber
        );
        const sessionRef = db.collection(COLLECTIONS.PITCH_SESSIONS).doc(sessionId);

        // Update counter
        transaction.set(counterRef, {
            user_id: userId,
            grant_id: sessionInput.grant_id,
            last_attempt: attemptNumber,
            locked,
            updated_at: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        // Create session record
        transaction.set(sessionRef, {
            user_id: userId,
            grant_id: sessionInput.grant_id,
            attempt_number: attemptNumber,
            readiness_score: sessionInput.readiness_score,
            feedback: sessionInput.feedback,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
        });

        return {
            session_id: sessionId,
            attempt_number: attemptNumber,
            locked,
        };
    });
}
