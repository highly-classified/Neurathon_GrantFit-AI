import express from "express";
import cors from "cors";
import "dotenv/config";
import { db } from "./src/firebase-admin.js";
import { COLLECTIONS } from "./src/firestore/collections.js";
import { analyzeAndRecordPitch, improvePitchWithAI } from "./src/pitchAnalysisService.js";
import { initializeUserCredits, checkInUser } from "./src/creditService.js";
import { getCategorizedGrants } from "./src/matchingEngine.js";

const app = express();
app.use(cors());
app.use(express.json());

// ... (rest of the top part)

/**
 * POST /api/pitch/start
 * Marks that a user has started their first pitch practice.
 */
app.post("/api/pitch/start", async (req, res) => {
    const { userId, grantId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    try {
        const docRef = db.collection(COLLECTIONS.USER_PITCHES).doc(userId);
        const doc = await docRef.get();

        // Only create if it doesn't exist yet to avoid overwriting real data with a placeholder
        if (!doc.exists) {
            await docRef.set({
                userId,
                grantId: grantId || "initial",
                pitchContent: "",
                overallScore: 0,
                hasStarted: true,
                updatedAt: new Date().toISOString()
            });
        }
        res.json({ success: true });
    } catch (error) {
        console.error("Start Pitch Error:", error);
        res.status(500).json({ error: error.message });
    }
});

process.on('uncaughtException', (err) => {
    console.error('💥 [CRITICAL] Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 [CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

console.log("📍 [DEBUG] Server script started...");
const PORT = process.env.PORT || 5001;
console.log(`📍 [DEBUG] Attempting to listen on port ${PORT}...`);

// Root check
app.get("/", (req, res) => {
    res.json({ message: "Neurathon Backend API is running" });
});

/**
 * GET /api/users
 * Returns a list of all user IDs in the system for testing
 */
app.get("/api/users", async (req, res) => {
    try {
        const usersSnapshot = await db.collection("users").get();
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/credits/initialize
 * Body: { "userId": "..." }
 */
app.post("/api/credits/initialize", async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    try {
        const result = await initializeUserCredits(userId);
        res.json({ message: "Credits initialized with registration reward (+10)", ...result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/credits/check-in
 * Body: { "userId": "..." }
 */
app.post("/api/credits/check-in", async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    try {
        const result = await checkInUser(userId);
        res.json(result);
    } catch (error) {
        console.error("Check-in Error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/grants/:userId
 * Returns soft-filtered grants categorized as 'eligible' or 'partially_eligible'
 */
app.get("/api/grants/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await getCategorizedGrants(userId);
        res.json(result);
    } catch (error) {
        console.error("Matching Error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/pitch/analyze
 * Body: { "userId": "...", "grantId": "...", "pitchText": "..." }
 */
app.post("/api/pitch/analyze", async (req, res) => {
    const { userId, grantId, pitchText } = req.body;
    if (!userId || !grantId || !pitchText) {
        return res.status(400).json({ error: "Missing required fields: userId, grantId, pitchText" });
    }

    try {
        // Auto-init credits for any user if they don't have them yet (Development convenience)
        try {
            await initializeUserCredits(userId);
        } catch (e) {
            // This will fail if already exists but that's fine
        }

        const result = await analyzeAndRecordPitch(userId, grantId, pitchText);
        res.json(result);
    } catch (error) {
        console.error("Analysis Error:", error);
        // Provide more detail to the user for debugging
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message,
            tip: error.message.includes("doc") ? "Check if grantId exists in Firestore" : "Check server logs"
        });
    }
});

/**
 * POST /api/pitch/improve
 * Body: { "userId": "...", "grantId": "...", "pitchText": "...", "previousAnalysis": { "score": ... } }
 */
app.post("/api/pitch/improve", async (req, res) => {
    const { userId, grantId, pitchText, previousAnalysis } = req.body;
    if (!userId || !grantId || !pitchText || !previousAnalysis) {
        return res.status(400).json({ error: "Missing required fields: userId, grantId, pitchText, previousAnalysis" });
    }

    try {
        const result = await improvePitchWithAI(userId, grantId, pitchText, previousAnalysis);
        res.json(result);
    } catch (error) {
        console.error("Improvement Error:", error);
        res.status(500).json({
            error: "Internal Server Error",
            message: error.message
        });
    }
});

/**
 * GET /api/pitch/:userId
 * Returns the latest stored pitch and evaluation for a user
 */
app.get("/api/pitch/:userId", async (req, res) => {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    try {
        const pitchDoc = await db.collection(COLLECTIONS.USER_PITCHES).doc(userId).get();
        if (!pitchDoc.exists) {
            return res.json(null);
        }
        const data = pitchDoc.data();

        // Convert Firestore Timestamps to ISO strings for the frontend
        if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
            data.updatedAt = data.updatedAt.toDate().toISOString();
        }
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            data.createdAt = data.createdAt.toDate().toISOString();
        }

        res.json(data);
    } catch (error) {
        console.error("Fetch Pitch Error:", error);
        res.status(500).json({ error: error.message });
    }
});

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please use a different port or kill the existing process.`);
    } else {
        console.error(`❌ Server failed to start:`, error);
    }
    process.exit(1);
});
