import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";
import { buildUserGrantKey, COLLECTIONS } from "./collections.js";
import {
  ensureSignedInUser,
  normalizeApplicationInput,
} from "./validators.js";

export async function applyToGrant(input) {
  const user = ensureSignedInUser(auth);
  const application = normalizeApplicationInput(input);
  const applicationId = buildUserGrantKey(user.uid, application.grant_id);
  const applicationRef = doc(db, COLLECTIONS.APPLICATIONS, applicationId);

  await setDoc(
    applicationRef,
    {
      user_id: user.uid,
      grant_id: application.grant_id,
      organization_id: application.organization_id,
      eligibility_score: application.eligibility_score,
      status: "applied",
      applied_at: serverTimestamp(),
    },
    { merge: true }
  );

  return { application_id: applicationId };
}
