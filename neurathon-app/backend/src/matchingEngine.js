import { db } from "./firebase-admin.js";
import { COLLECTIONS } from "./firestore/collections.js";
import { callGemini } from "./aiService.js";

/**
 * Categorizes grants into 'eligible', 'may_be_eligible', and 'ineligible' for a user.
 */
export async function getCategorizedGrants(userId) {
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(userId).get();
    if (!userDoc.exists) {
        throw new Error("User profile not found");
    }
    const user = userDoc.data();

    // Fetch all grants
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

        // Layer 2: AI-Powered Preference Matching
        const preferenceScore = await getAIPreferenceScore(user, grant);

        // Sort into buckets based on AI score
        if (preferenceScore > 0.7) {
            categorized.eligible.push({ ...grant, match_score: preferenceScore });
        } else {
            categorized.may_be_eligible.push({ ...grant, match_score: preferenceScore });
        }
    }

    return categorized;
}

/**
 * Calculates a match score between the user's idea and the grant focus using Gemini.
 */
async function getAIPreferenceScore(user, grant) {
    // Unique cache key for this user/grant pair to save credits
    const cacheKey = `match_${user.id || "test"}_${grant.id}`;

    const prompt = `
    Analyze the alignment between a researcher/startup idea and a grant opportunity.
    
    USER PROFILE:
    - Idea: ${user.idea || "No idea provided"}
    - Domains: ${user.domains?.join(", ") || "None"}
    
    GRANT OPPORTUNITY:
    - Organization: ${grant.org_name}
    - Domains: ${grant.domain?.join(", ") || "None"}
    
    Provide a match score between 0.0 and 1.0 representing how well the user's idea aligns with the grant's focus areas.
    Respond ONLY with the numerical score (e.g., 0.85). No other text.
  `;

    try {
        const response = await callGemini(prompt, cacheKey, "0.75");
        const score = parseFloat(response.trim());
        return isNaN(score) ? 0.5 : Math.max(0, Math.min(1, score));
    } catch (error) {
        console.error(`Preference match failed for grant ${grant.id}:`, error);
        return 0.5; // Fallback to middle ground
    }
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
        if (!user.citizenship || !crit.citizenship.map(c => c.toLowerCase()).includes(user.citizenship.toLowerCase())) {
            return { isEligible: false, reason: "CITIZENSHIP_RESTRICTION" };
        }
    }

    // Gender check
    if (crit.gender && crit.gender !== "any" && user.gender !== crit.gender) {
        return { isEligible: false, reason: "GENDER_RESTRICTION" };
    }

    // Role check
    if (crit.role && Array.isArray(crit.role) && crit.role.length > 0) {
        if (!user.role || !crit.role.map(r => r.toLowerCase()).includes(user.role.toLowerCase())) {
            return { isEligible: false, reason: "ROLE_RESTRICTION" };
        }
    }

    return { isEligible: true };
}
