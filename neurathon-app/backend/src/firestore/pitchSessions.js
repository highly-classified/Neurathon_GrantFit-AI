import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase.js";
import {
  buildPitchSessionId,
  buildUserGrantKey,
  COLLECTIONS,
} from "./collections.js";
import {
  ensureSignedInUser,
  normalizePitchSessionInput,
  ValidationError,
} from "./validators.js";

export class PitchLockedError extends Error {
  constructor(message = "PITCH_LOCKED_AT_100") {
    super(message);
    this.name = "PitchLockedError";
    this.code = "PITCH_LOCKED_AT_100";
  }
}

export async function createPitchSession(input) {
  const user = ensureSignedInUser(auth);
  const sessionInput = normalizePitchSessionInput(input);
  const userGrantKey = buildUserGrantKey(user.uid, sessionInput.grant_id);
  const counterRef = doc(db, COLLECTIONS.PITCH_ATTEMPT_COUNTERS, userGrantKey);

  return runTransaction(db, async (transaction) => {
    const counterSnapshot = await transaction.get(counterRef);
    const counter = counterSnapshot.exists()
      ? counterSnapshot.data()
      : { last_attempt: 0, locked: false };

    if (counter.locked) {
      throw new PitchLockedError();
    }

    const attemptNumber = Number(counter.last_attempt || 0) + 1;
    const locked = sessionInput.readiness_score === 100;
    const sessionId = buildPitchSessionId(
      user.uid,
      sessionInput.grant_id,
      attemptNumber
    );
    const sessionRef = doc(db, COLLECTIONS.PITCH_SESSIONS, sessionId);

    if (!Number.isInteger(attemptNumber) || attemptNumber <= 0) {
      throw new ValidationError("attempt_number must be a positive integer");
    }

    transaction.set(
      counterRef,
      {
        user_id: user.uid,
        grant_id: sessionInput.grant_id,
        last_attempt: attemptNumber,
        locked,
        updated_at: serverTimestamp(),
      },
      { merge: true }
    );

    transaction.set(sessionRef, {
      user_id: user.uid,
      grant_id: sessionInput.grant_id,
      attempt_number: attemptNumber,
      readiness_score: sessionInput.readiness_score,
      feedback: sessionInput.feedback,
      created_at: serverTimestamp(),
    });

    return {
      session_id: sessionId,
      attempt_number: attemptNumber,
      locked,
    };
  });
}
