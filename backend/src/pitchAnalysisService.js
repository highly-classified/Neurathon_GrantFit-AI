import admin from "firebase-admin";
import { db } from "./firebase-admin.js";
import { COLLECTIONS, buildUserGrantKey } from "./firestore/collections.js";
import { createPitchSessionAdmin } from "./pitchSessionService.js";
import { deductCredits, hasSufficientCredits, COSTS } from "./creditService.js";
import { callGemini } from "./aiService.js";

/**
 * Analyzes a user's pitch text against a grant's requirements using real AI.
 */
export async function analyzeAndRecordPitch(userId, grantId, pitchText) {
    // 1. Check credits first
    const hasCredits = await hasSufficientCredits(userId, COSTS.PITCH_ANALYSIS);
    if (!hasCredits) throw new Error("INSUFFICIENT_ANALYZE_CREDITS"); // Custom error code for frontend

    const grantDoc = await db.collection(COLLECTIONS.ORGANIZERS).doc(grantId).get();
    const grantData = grantDoc.exists ? grantDoc.data() : { org_name: "Target Grant" };
    const orgName = grantData.org_name || "Target Grant";

    // 2. Deduct credits BEFORE the expensive operation (Optimistic Locking)
    // This prevents race conditions where a user spams the button
    await deductCredits(userId, COSTS.PITCH_ANALYSIS, orgName);

    try {
        // 3. Perform the AI Analysis
        const analysis = await analyzePitchWithAI(pitchText, grantData);

        // 4. Save the latest pitch and results to user_pitches
        const pitchData = {
            userId,
            grantId,
            pitchContent: pitchText,
            overallScore: analysis.score,
            clarityScore: analysis.clarityScore || 0,
            confidenceScore: analysis.confidenceScore || 0,
            structureScore: analysis.structureScore || 0,
            feedback: analysis.feedback || "Good progress!",
            strengths: analysis.strengths || [],
            improvements: analysis.improvements || [],
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const pitchId = buildUserGrantKey(userId, grantId);
        const docRef = db.collection(COLLECTIONS.USER_PITCHES).doc(pitchId);
        await docRef.set(pitchData, { merge: false });

        return {
            ...analysis
        };
    } catch (error) {
        // 5. ROLLBACK / REFUND on failure
        console.error("AI Analysis failed, refunding credits:", error);
        // We refund by adding the credits back
        // In a real production system, you might want a specific 'refund' transaction to track this
        const { addCredits } = await import("./creditService.js"); // Dynamic import to avoid circular dependency if any
        await addCredits(userId, "System Refund (Error)", COSTS.PITCH_ANALYSIS, orgName);
        throw error; // Re-throw so frontend knows it failed
    }
}

/**
 * Re-evaluates a pitch after user manual improvements.
 * AI identifies specific sentences or sections that still need work.
 */
export async function improvePitchWithAI(userId, grantId, pitchText, previousAnalysis) {
    // 1. Check credits first
    const hasCredits = await hasSufficientCredits(userId, COSTS.PITCH_IMPROVE);
    if (!hasCredits) throw new Error("INSUFFICIENT_ANALYZE_CREDITS");

    const grantDoc = await db.collection(COLLECTIONS.ORGANIZERS).doc(grantId).get();
    const grantData = grantDoc.exists ? grantDoc.data() : { org_name: "Target Grant" };
    const orgName = grantData.org_name || "Target Grant";

    // 2. Deduct credits BEFORE AI work
    await deductCredits(userId, COSTS.PITCH_IMPROVE, orgName);

    try {
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

        const response = await callGemini(prompt, cacheKey, JSON.stringify({
            new_score: previousAnalysis.score + 5,
            best_part: "Improved methodology.",
            improvement_needed: "Work on budget.",
            worse_part: "None"
        }));
        const cleanResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
        const result = JSON.parse(cleanResponse);

        // Save the latest pitch and results to user_pitches
        const pitchData = {
            userId,
            grantId,
            pitchContent: pitchText,
            overallScore: result.new_score,
            clarityScore: previousAnalysis.clarityScore || 0, // We keep the other scores or could re-estimate, but stay consistent
            confidenceScore: previousAnalysis.confidenceScore || 0,
            structureScore: previousAnalysis.structureScore || 0,
            feedback: result.improvement_needed || "Progress made.",
            strengths: [result.best_part],
            improvements: [result.improvement_needed],
            best_part: result.best_part,
            worse_part: result.worse_part,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const pitchId = buildUserGrantKey(userId, grantId);
        const docRef = db.collection(COLLECTIONS.USER_PITCHES).doc(pitchId);
        await docRef.set(pitchData, { merge: true }); // Use merge: true for improvements if we want to keep some metadata

        return {
            score: result.new_score,
            best_part: result.best_part,
            improvement_needed: result.improvement_needed,
            worse_part: result.worse_part,
            updatedAt: new Date().toISOString()
        };
    } catch (error) {
        // 3. ROLLBACK / REFUND on failure
        console.error("Improvement Analysis failed, refunding credits:", error);
        const { addCredits } = await import("./creditService.js");
        await addCredits(userId, "System Refund (Error)", COSTS.PITCH_IMPROVE, orgName);
        throw error;
    }
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
    2. Provide specialized scores (0-100) for Clarity, Confidence, and Structure.
    3. Identify the BEST PART of the pitch as a string.
    4. Provide a list of STRENGTHS as an array of strings.
    5. Provide a list of IMPROVEMENTS as an array of strings.
    6. Provide overall feedback as a summary string.
    7. Identify the WORSE PART (most critical weakness) as a string.
    8. Respond ONLY in JSON:
       { 
         "score": 75, 
         "clarityScore": 80,
         "confidenceScore": 70,
         "structureScore": 75,
         "best_part": "...", 
         "strengths": ["...", "..."],
         "improvements": ["...", "..."],
         "feedback": "...",
         "worse_part": "..." 
       }
  `;

    try {
        const response = await callGemini(prompt, cacheKey, JSON.stringify({
            score: 75,
            best_part: "Clear mission.",
            improvement_needed: "Add data.",
            worse_part: "Weak metrics."
        }));
        const cleanResponse = response.replace(/```json/g, "").replace(/```/g, "").trim();
        const result = JSON.parse(cleanResponse);

        return {
            score: Math.max(0, Math.min(100, result.score || 50)),
            clarityScore: Math.max(0, Math.min(100, result.clarityScore || 50)),
            confidenceScore: Math.max(0, Math.min(100, result.confidenceScore || 50)),
            structureScore: Math.max(0, Math.min(100, result.structureScore || 50)),
            best_part: result.best_part || "Strong mission intent.",
            strengths: result.strengths || (result.best_part ? [result.best_part] : []),
            improvements: result.improvements || (result.improvement_needed ? [result.improvement_needed] : []),
            feedback: result.feedback || result.improvement_needed || "Add more technical details.",
            worse_part: result.worse_part || "Lack of specific outcome metrics."
        };
    } catch (error) {
        console.error("AI Analysis failed:", error);
        return { score: 50, best_part: "Analysis error", improvement_needed: "Try again", worse_part: "API error" };
    }
}
