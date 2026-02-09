import { db } from "./firebase-admin.js";
import { createPitchSessionAdmin } from "./pitchSessionService.js";
import { deductCredits, hasSufficientCredits } from "./creditService.js";
import { callGemini } from "./aiService.js";

/**
 * Analyzes a user's pitch text against a grant's requirements using real AI.
 */
export async function analyzeAndRecordPitch(userId, grantId, pitchText) {
    // 1. Check for sufficient 'analyze_credits'
    const hasCredits = await hasSufficientCredits(userId, "analyze_credits");
    if (!hasCredits) {
        throw new Error("INSUFFICIENT_ANALYZE_CREDITS");
    }

    // Fetch grant details for better AI context
    const grantDoc = await db.collection("grants").doc(grantId).get();
    const grantData = grantDoc.exists ? grantDoc.data() : { org_name: "Target Grant" };

    // 2. Perform AI Analysis (Real Gemini Call)
    const analysis = await analyzePitchWithAI(pitchText, grantData);

    // 3. Deduct Credits
    await deductCredits(userId, "analyze_credits");

    // 4. Record the session
    const result = await createPitchSessionAdmin(userId, {
        grant_id: grantId,
        readiness_score: analysis.score,
        feedback: analysis.feedback,
    });

    return {
        ...result,
        score: analysis.score,
        feedback: analysis.feedback
    };
}

/**
 * Core AI logic for analyzing pitch content.
 */
async function analyzePitchWithAI(pitchText, grant) {
    // Generate a unique cache key based on the pitch content (first 50 chars) and the grant ID
    const textHash = pitchText.substring(0, 50).replace(/[^a-zA-Z0-9]/g, "_");
    const cacheKey = `pitch_${grant.id || "general"}_${textHash}`;

    const prompt = `
    You are an expert grant reviewer. Analyze the following pitch text against the requirements for the "${grant.org_name}" grant.
    
    PITCH TEXT:
    "${pitchText}"
    
    INSTRUCTIONS:
    1. Calculate a "Readiness Score" from 0 to 100.
    2. Provide constructive, actionable feedback (max 3 sentences).
    3. Respond ONLY in a valid JSON format like this:
       { "score": 85, "feedback": "Your mission alignment is strong, but you need to include more details about your financial sustainability plan." }
  `;

    try {
        const response = await callGemini(prompt, cacheKey, JSON.stringify({
            score: 75,
            feedback: "Good draft. Focus more on impact metrics to improve."
        }));

        // Attempt to parse JSON from the AI response
        const cleanResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
        const result = JSON.parse(cleanResponse);

        return {
            score: Math.max(0, Math.min(100, result.score || 50)),
            feedback: result.feedback || "AI analysis completed. Please refine your details."
        };
    } catch (error) {
        console.error("AI Pitch Analysis failed, using fallback:", error);
        return {
            score: 50,
            feedback: "We encountered an issue during AI analysis. Your credit has been reserved or deducted as per the attempt, but please try again with a more detailed text."
        };
    }
}
