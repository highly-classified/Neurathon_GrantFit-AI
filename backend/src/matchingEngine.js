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

    // Fetch all organizers (grants)
    const organizersSnapshot = await db.collection(COLLECTIONS.ORGANIZERS).get();
    const organizers = organizersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const categorized = {
        eligible: [],
        may_be_eligible: [],
        ineligible: []
    };

    for (const org of organizers) {
        const eligibilityResult = checkHardEligibility(user, org);

        if (!eligibilityResult.isEligible) {
            categorized.ineligible.push({
                ...org,
                reason: eligibilityResult.reason
            });
            continue;
        }

        // Layer 2: AI-Powered Preference Matching
        const preferenceScore = await getAIPreferenceScore(user, org);

        // Sort into buckets based on AI score
        if (preferenceScore > 0.7) {
            categorized.eligible.push({ ...org, match_score: preferenceScore });
        } else {
            categorized.may_be_eligible.push({ ...org, match_score: preferenceScore });
        }
    }

    return categorized;
}

/**
 * Calculates a match score between the user's idea and the grant focus using Gemini.
 */
async function getAIPreferenceScore(user, org) {
    const cacheKey = `match_${user.email || "test"}_${org.id}`;

    const prompt = `
    Analyze the alignment between a researcher/startup idea and a funding opportunity.
    
    USER PROFILE:
    - Idea: ${user.idea || "No idea provided"}
    - Domain: ${user.domain || "None"}
    - Role: ${user.role || "None"}
    
    FUNDING OPPORTUNITY:
    - Organization: ${org.org_name}
    - Event: ${org.event_name}
    - Domain: ${org.domain || "None"}
    - Tags: ${org.tags?.join(", ") || "None"}
    
    Provide a match score between 0.0 and 1.0 representing how well the user's idea aligns with the opportunity's focus areas.
    Respond ONLY with the numerical score (e.g., 0.85). No other text.
  `;

    try {
        const response = await callGemini(prompt, cacheKey, "0.75");
        const score = parseFloat(response.trim());
        return isNaN(score) ? 0.5 : Math.max(0, Math.min(1, score));
    } catch (error) {
        console.error(`Preference match failed for org ${org.id}:`, error);
        return 0.5;
    }
}

/**
 * Layer 1: Hard Eligibility Filter
 */
function checkHardEligibility(user, org) {
    const crit = org.eligibility_criteria || {};
    const funding = org.funding_profile || {};

    // Citizenship check
    if (crit.citizenship && Array.isArray(crit.citizenship) && crit.citizenship.length > 0) {
        const userCit = (user.citizenship || "").toLowerCase();
        // Simple mapping for common terms
        const normalizedCit = userCit === "india" ? ["india", "indian"] : [userCit];
        const match = crit.citizenship.some(c => normalizedCit.includes(c.toLowerCase()) || c.toLowerCase().includes("resident"));
        if (!match && !crit.citizenship.map(c => c.toLowerCase()).includes("any")) {
            // return { isEligible: false, reason: "CITIZENSHIP_RESTRICTION" };
            // Note: Keeping it loose for now since "india" vs "US_citizen"
        }
    }

    // Role / Career Stage check
    if (crit.career_stage && Array.isArray(crit.career_stage) && crit.career_stage.length > 0) {
        const userRole = (user.role || "").toLowerCase();
        // Map "Founder" to potential career stages if needed
        const isMatch = crit.career_stage.some(s => s.toLowerCase().includes(userRole) || s.toLowerCase() === "any");
        // if (!isMatch) return { isEligible: false, reason: "ROLE_RESTRICTION" };
    }

    // Funding check
    const userReq = parseFloat(user.fundingRequirement || "0");
    if (funding.max_amt && userReq > funding.max_amt) {
        // Optional: return { isEligible: false, reason: "FUNDING_EXCEEDED" };
    }

    return { isEligible: true };
}
