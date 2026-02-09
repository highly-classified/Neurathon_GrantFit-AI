import { db } from "./firebase-admin.js";
import { COLLECTIONS } from "./firestore/collections.js";

/**
 * Categorizes grants into 'eligible', 'may_be_eligible', and 'ineligible' for a user.
 */
export async function getCategorizedGrants(userId) {
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(userId).get();
    if (!userDoc.exists) {
        throw new Error("User profile not found");
    }
    const user = userDoc.data();

    // Fetch all grants (in a real app, you'd filter by status or paginate)
    const grantsSnapshot = await db.collection(COLLECTIONS.GRANTS).get();
    const grants = grantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const categorized = {
        eligible: [],
        may_be_eligible: [],
        ineligible: []
    };

    for (const grant of grants) {
        const eligibilityResult = checkHardEligibility(user, grant);

        if (!eligibilityResult.isEligible) {
            categorized.ineligible.push({
                ...grant,
                reason: eligibilityResult.reason
            });
            continue;
        }

        // Layer 2: Preference Matching (Simulated for now)
        // In a full implementation, this would use an LLM/Embedding to compare 'user.idea' with 'grant.topics'
        const preferenceScore = simulatePreferenceMatch(user, grant);

        if (preferenceScore > 0.7) {
            categorized.eligible.push({ ...grant, match_score: preferenceScore });
        } else {
            categorized.may_be_eligible.push({ ...grant, match_score: preferenceScore });
        }
    }

    return categorized;
}

/**
 * Layer 1: Hard Eligibility Filter
 * Checks strict binary criteria like citizenship, age, gender, and role.
 */
function checkHardEligibility(user, grant) {
    const crit = grant.eligibility || {};

    // Age check
    if (crit.min_age !== undefined && user.age < crit.min_age) {
        return { isEligible: false, reason: "AGE_RESTRICTION" };
    }

    // Citizenship check
    if (crit.citizenship && Array.isArray(crit.citizenship) && crit.citizenship.length > 0) {
        if (!user.citizenship || !crit.citizenship.includes(user.citizenship.toLowerCase())) {
            return { isEligible: false, reason: "CITIZENSHIP_RESTRICTION" };
        }
    }

    // Gender check
    if (crit.gender && crit.gender !== "any" && user.gender !== crit.gender) {
        return { isEligible: false, reason: "GENDER_RESTRICTION" };
    }

    // Role check
    if (crit.role && Array.isArray(crit.role) && crit.role.length > 0) {
        if (!user.role || !crit.role.includes(user.role.toLowerCase())) {
            return { isEligible: false, reason: "ROLE_RESTRICTION" };
        }
    }

    return { isEligible: true };
}

function simulatePreferenceMatch(user, grant) {
    // Simple keyword overlap for simulation
    const userDomains = user.domains || [];
    const grantDomains = grant.domain || [];
    const overlap = userDomains.filter(d => grantDomains.includes(d)).length;

    // Return a score between 0.4 and 1.0
    return Math.min(1.0, 0.4 + (overlap * 0.2));
}
