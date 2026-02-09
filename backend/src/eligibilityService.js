import { db } from "./firebase-admin.js";
import admin from "firebase-admin";

/**
 * Runs a deterministic hard eligibility filter for a user.
 * 
 * @param {string} uid - The unique ID of the user.
 * @returns {Promise<{success: boolean, count: number}>}
 */
export async function runHardEligibilityFilter(uid) {
  console.log(`Starting hard eligibility filtering for user: ${uid}`);

  try {
    // 1. Fetch user profile
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      throw new Error(`User ${uid} not found`);
    }
    const user = userDoc.data();

    // Required user fields for filtering
    const userDomains = Array.isArray(user.domain) ? user.domain : [];
    const userCareerStage = user.career_stage;
    const userCitizenship = user.citizenship;

    if (!userCareerStage || !userCitizenship) {
      console.warn(`User ${uid} profile incomplete (missing career_stage or citizenship). Skipping filter.`);
      return { success: false, count: 0 };
    }

    // 2. Fetch all organisers
    const organisersSnapshot = await db.collection("organisers").get();
    const eligibleIds = [];

    organisersSnapshot.forEach(doc => {
      const org = doc.data();
      const criteria = org.eligibility_criteria;

      if (!criteria) return;

      // --- FILTER 1: Citizenship ---
      const allowedCitizenships = criteria.citizenship || [];
      const passesCitizenship = allowedCitizenships.includes("any") || allowedCitizenships.includes(userCitizenship);
      if (!passesCitizenship) return;

      // --- FILTER 2: Career Stage ---
      const allowedStages = criteria.career_stage || [];
      const passesCareerStage = allowedStages.includes(userCareerStage);
      if (!passesCareerStage) return;

      // --- FILTER 3: Domain ---
      const orgDomain = org.domain;
      const passesDomain = orgDomain === "General" || userDomains.includes(orgDomain);
      if (!passesDomain) return;

      // All checks passed
      eligibleIds.push(doc.id);
    });

    console.log(`User ${uid} is eligible for ${eligibleIds.length} organisers.`);

    // 3. Update User Document
    await db.collection("users").doc(uid).set({
      hard_eligible_organiser_ids: eligibleIds,
      hard_eligibility: {
        completed: true,
        filtered_at: admin.firestore.FieldValue.serverTimestamp(),
        criteria_version: "v1"
      }
    }, { merge: true });

    return { success: true, count: eligibleIds.length };

  } catch (error) {
    console.error(`Hard eligibility filter failed for user ${uid}:`, error);
    throw error;
  }
}
