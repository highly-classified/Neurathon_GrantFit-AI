import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";
import { COLLECTIONS } from "./collections.js";
import { normalizeOrganizerInput } from "./validators.js";

export async function createOrganizer(input) {
  const organizer = normalizeOrganizerInput(input);
  const organizersRef = collection(db, COLLECTIONS.ORGANIZERS);
  const created = await addDoc(organizersRef, {
    ...organizer,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  return { organizer_id: created.id };
}
