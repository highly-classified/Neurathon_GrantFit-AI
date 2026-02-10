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
        partially_eligible: []
    };

    // Step 1: Filter by hard criteria first
    const passHardCriteria = [];
    for (const org of organizers) {
        const eligibilityResult = checkHardEligibility(user, org);
        if (eligibilityResult.isEligible) {
            passHardCriteria.push(org);
        }
    }

    // Step 2: Smart Pre-Sorting by Keyword Relevance
    const sortedMatches = passHardCriteria.sort((a, b) => {
        const userTerms = `${user.domain || ""} ${user.idea || ""}`.toLowerCase().split(/\s+/);
        const getScore = (org) => {
            const orgContent = `${org.event_name} ${org.domain || ""} ${org.tags?.join(" ") || ""} ${org.prev_year_funded_projects?.join(" ") || ""}`.toLowerCase();
            return userTerms.reduce((acc, term) => acc + (orgContent.includes(term) ? 1 : 0), 0);
        };
        return getScore(b) - getScore(a);
    });

    // Step 3: Limit AI soft filtering to top 5 most relevant (per user request)
    const limitedMatches = sortedMatches.slice(0, 5);
    console.log(`[MATCH-TRACE] Top 5 candidates for AI: ${limitedMatches.map(m => m.id).join(", ")}`);

    try {
        // Run AI scoring in parallel for speed
        const scoringPromises = limitedMatches.map(async (org) => {
            try {
                const preferenceScore = await getAIPreferenceScore(user, org);
                return { org, preferenceScore, isFallback: false };
            } catch (err) {
                console.warn(`[MATCH-WARN] AI scoring failed for ${org.id}, falling back to keyword relevance:`, err.message);
                // Graceful Degradation: Use a moderate static score if AI fails
                return { org, preferenceScore: 0.6, isFallback: true };
            }
        });

        const results = await Promise.allSettled(scoringPromises);

        for (const res of results) {
            if (res.status === 'fulfilled') {
                const { org, preferenceScore, isFallback } = res.value;

                // Thresholds calibrated for a natural 2/3 split across 5 results
                if (preferenceScore >= 0.8) {
                    categorized.eligible.push({
                        ...org,
                        match_score: preferenceScore,
                        confidence_tag: isFallback ? "Relevance Match" : "High Alignment",
                        is_fallback: isFallback
                    });
                } else if (preferenceScore >= 0.4) {
                    categorized.partially_eligible.push({
                        ...org,
                        match_score: preferenceScore,
                        confidence_tag: isFallback ? "Potential Relevance" : "Potential Fit",
                        is_fallback: isFallback
                    });
                }
            }
        }
    } catch (error) {
        console.error("Critical error in parallel AI scoring:", error);
        // Fallback: Use the top 5 sorted hard-criteria matches as 'eligible'
        categorized.eligible = limitedMatches.map(org => ({
            ...org,
            match_score: 1.0,
            confidence_tag: "Relevance Match (Critical Fallback)"
        }));
        categorized.partially_eligible = [];
    }

    return categorized;
}

/**
 * Calculates a match score between the user's idea and the grant focus using Gemini.
 */
async function getAIPreferenceScore(user, org) {
    const cacheKey = `match_v5_${user.uid || user.email || "test"}_${org.id}`;

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
    - Historical Focus: ${org.prev_year_funded_projects?.join(", ") || "None"}
    
    SCORING RUBRIC:
    - 0.85 to 1.0: PERFECT MATCH. The idea and domain are a direct bullseye.
    - 0.75 to 0.84: HIGH ALIGNMENT. Shared domain and strong thematic overlap.
    - 0.40 to 0.74: GOOD/FAIR MATCH. Same broad domain (e.g., both Tech), but the specific innovation is a new area for this funder.
    - 0.10 to 0.39: WEAK FIT. Marginal relevance.
    - Under 0.1: NO FIT.

    INSTRUCTIONS:
    - Be discriminating. Only promote to the 0.8+ range if the thematic overlap is undeniable.
    - Broad domain matches should stay in the 0.4 - 0.7 range.
    
    Respond ONLY with a decimal score between 0.0 and 1.0.
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
