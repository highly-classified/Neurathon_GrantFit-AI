import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";
import { COLLECTIONS } from "./collections.js";
import { normalizeGrantInput } from "./validators.js";

export async function createGrant(input) {
  const grant = normalizeGrantInput(input);
  const grantsRef = collection(db, COLLECTIONS.GRANTS);
  const created = await addDoc(grantsRef, {
    ...grant,
    created_at: serverTimestamp(),
  });

  return { grant_id: created.id };
}
