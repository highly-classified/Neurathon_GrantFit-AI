import { db } from "./firebase-admin.js";
import { createPitchSessionAdmin } from "./pitchSessionService.js";
import { deductCredits, hasSufficientCredits } from "./creditService.js";

/**
 * Analyzes a user's pitch text and returns a score and feedback.
 * This function integrates with the credit system and records the attempt.
 */
export async function analyzeAndRecordPitch(userId, grantId, pitchText) {
    // 1. Check for credits
    const hasCredits = await hasSufficientCredits(userId, "analyze_credits");
    if (!hasCredits) {
        throw new Error("INSUFFICIENT_ANALYZE_CREDITS");
    }

    // 2. Perform AI Analysis (Simulated)
    // In production, this would call an LLM with a specialized prompt.
    const analysis = simulateAIAnalysis(pitchText);

    // 3. Deduct Credits
    await deductCredits(userId, "analyze_credits");

    // 4. Record the session using Admin SDK
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

function simulateAIAnalysis(text) {
    const wordCount = (text || "").split(/\s+/).length;

    if (wordCount < 10) {
        return {
            score: 10,
            feedback: "Your pitch is extremely short. Try to include more details about your project goals and methodology."
        };
    }

    // Simulated score based on text length and some keywords
    const score = Math.min(95, 30 + (wordCount / 5));

    return {
        score: Math.floor(score),
        feedback: "Good start! You have covered the basic concepts well. To reach 100%, try to focus more on the 'impact' and 'scalability' sections of your proposal."
    };
}
