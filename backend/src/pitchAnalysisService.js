import { db } from "./firebase-admin.js";
import { COLLECTIONS } from "./firestore/collections.js";
import { createPitchSessionAdmin } from "./pitchSessionService.js";
import { deductCredits, hasSufficientCredits } from "./creditService.js";
import { callGemini } from "./aiService.js";

/**
 * Analyzes a user's pitch text against a grant's requirements using real AI.
 */
export async function analyzeAndRecordPitch(userId, grantId, pitchText) {
    const hasCredits = await hasSufficientCredits(userId, "analyze_credits");
    if (!hasCredits) throw new Error("INSUFFICIENT_ANALYZE_CREDITS");

    const grantDoc = await db.collection(COLLECTIONS.ORGANIZERS).doc(grantId).get();
    const grantData = grantDoc.exists ? grantDoc.data() : { org_name: "Target Grant" };

    const analysis = await analyzePitchWithAI(pitchText, grantData);
    await deductCredits(userId, "analyze_credits");

    const result = await createPitchSessionAdmin(userId, {
        grant_id: grantId,
        readiness_score: analysis.score,
        feedback: analysis.best_part, // Store best part as main feedback summary
    });

    return {
        ...result,
        ...analysis
    };
}

/**
 * Re-evaluates a pitch after user manual improvements.
 * AI identifies specific sentences or sections that still need work.
 */
export async function improvePitchWithAI(userId, grantId, pitchText, previousAnalysis) {
    const hasCredits = await hasSufficientCredits(userId, "analyze_credits");
    if (!hasCredits) throw new Error("INSUFFICIENT_ANALYZE_CREDITS");

    const grantDoc = await db.collection(COLLECTIONS.ORGANIZERS).doc(grantId).get();
    const grantData = grantDoc.exists ? grantDoc.data() : { org_name: "Target Grant" };

    const prompt = `
    You are an AI Pitch Evaluator. The user has manually edited their pitch based on your previous feedback.
    Analyze the CURRENT PITCH and determine if it has improved.
    
    CURRENT PITCH:
    "${pitchText}"
    
    PREVIOUS EVALUATION:
    - Previous Score: ${previousAnalysis.score}
    
    GRANT CONTEXT:
    - Organization: ${grantData.org_name}
    - Event: ${grantData.event_name}
    
    INSTRUCTIONS:
    1. Re-analyze the pitch for impact, clarity, and alignment.
    2. Provide a NEW score based ON THE CURRENT TEXT.
    3. Identify the BEST PART of the current text.
    4. Highlight specific SENTENCES or AREAS that still need development (be very precise).
    5. Identify the WORSE PART (remaining critical weakness).
    6. Respond ONLY in valid JSON:
       { "new_score": 75, "best_part": "...", "improvement_needed": "In the paragraph about X, the sentence '...' is still vague; try adding Y.", "worse_part": "..." }
    `;

    // Use a unique cache key based on the new text to avoid returning the old AI-rewritten cached values
    const textHash = pitchText.substring(0, 30).replace(/[^a-zA-Z]/g, "");
    const cacheKey = `manual_v1_${grantId}_${textHash}`;

    const response = await callGemini(prompt, cacheKey);
    const cleanResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanResponse);

    await deductCredits(userId, "analyze_credits");

    return {
        score: result.new_score,
        best_part: result.best_part,
        improvement_needed: result.improvement_needed,
        worse_part: result.worse_part
    };
}

/**
 * Core AI logic for analyzing pitch content.
 */
async function analyzePitchWithAI(pitchText, grant) {
    const textHash = pitchText.substring(0, 50).replace(/[^a-zA-Z0-9]/g, "_");
    const cacheKey = `pitch_v2_${grant.id || "general"}_${textHash}`;

    const prompt = `
    Analyze the following pitch against the "${grant.org_name}" requirements.
    
    PITCH TEXT:
    "${pitchText}"
    
    INSTRUCTIONS:
    1. Calculate a Score from 0 to 100.
    2. Identify the BEST PART of the pitch.
    3. Identify what NEEDS IMPROVEMENT.
    4. Identify the WORSE PART (most critical weakness).
    5. Respond ONLY in JSON:
       { "score": 75, "best_part": "...", "improvement_needed": "...", "worse_part": "..." }
  `;

    try {
        const response = await callGemini(prompt, cacheKey);
        const cleanResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
        const result = JSON.parse(cleanResponse);

        return {
            score: Math.max(0, Math.min(100, result.score || 50)),
            best_part: result.best_part || "Strong mission intent.",
            improvement_needed: result.improvement_needed || "Add more technical details.",
            worse_part: result.worse_part || "Lack of specific outcome metrics."
        };
    } catch (error) {
        console.error("AI Analysis failed:", error);
        return { score: 50, best_part: "Analysis error", improvement_needed: "Try again", worse_part: "API error" };
    }
}
