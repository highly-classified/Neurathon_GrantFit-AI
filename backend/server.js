import express from "express";
import cors from "cors";
import "dotenv/config";
import { db } from "./src/firebase-admin.js";
import { analyzeAndRecordPitch, improvePitchWithAI } from "./src/pitchAnalysisService.js";
import { initializeUserCredits } from "./src/creditService.js";
import { getCategorizedGrants } from "./src/matchingEngine.js";
import { db, auth } from "./src/firebase-admin.js";

const app = express();
app.use(cors());
app.use(express.json());

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
        res.json({ message: "Credits initialized successfully", ...result });
    } catch (error) {
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

// Authentication Middleware
const checkAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized: Missing token" });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = await auth.verifyIdToken(token);

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};

/**
 * POST /api/pitch/analyze
 * Body: { "grantId": "...", "pitchText": "..." }
 * Header: Authorization: Bearer <token>
 */
app.post("/api/pitch/analyze", checkAuth, async (req, res) => {
    const { grantId, pitchText } = req.body;
    const userId = req.user.uid;

    if (!grantId || !pitchText) {
        return res.status(400).json({ error: "Missing required fields: grantId, pitchText" });
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
