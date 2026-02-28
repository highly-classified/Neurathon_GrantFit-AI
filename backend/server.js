import express from "express";
import cors from "cors";
import "dotenv/config";
import { db } from "./src/firebase-admin.js";
import { COLLECTIONS, buildUserGrantKey } from "./src/firestore/collections.js";
import { analyzeAndRecordPitch, improvePitchWithAI } from "./src/pitchAnalysisService.js";
import { initializeUserCredits, checkInUser, upgradeUserPlan } from "./src/creditService.js";
import Stripe from "stripe";
import { getCategorizedGrants } from "./src/matchingEngine.js";

const app = express();
app.use(cors());

// --- STRIPE WEBHOOK ---
// Must be raw body for signature verification
app.post("/api/webhook/stripe", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
        if (endpointSecret) {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } else {
            // Local testing fallback if no webhook secret is provided
            event = JSON.parse(req.body);
        }
    } catch (err) {
        console.error(`⚠️ Webhook signature verification failed:`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const userId = session.client_reference_id;

        // Retrieve line items to know what plan they bought
        try {
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
            if (lineItems && lineItems.data && lineItems.data.length > 0) {
                const priceId = lineItems.data[0].price.id;

                let planType = null;
                if (priceId === process.env.STRIPE_PRICE_ID_PRO) {
                    planType = 'pro';
                } else if (priceId === process.env.STRIPE_PRICE_ID_PLUS) {
                    planType = 'plus';
                }

                if (planType && userId) {
                    await upgradeUserPlan(userId, planType);
                    console.log(`✅ Granted ${planType} credits to user ${userId}`);
                } else {
                    console.error(`⚠️ Could not determine plan type or userId. priceId: ${priceId}, userId: ${userId}`);
                }
            }
        } catch (err) {
            console.error(`💥 Error processing completed checkout session:`, err.message);
        }
    }

    res.status(200).end();
});

app.use(express.json());

// ... (rest of the top part)

/**
 * POST /api/pitch/start
 * Marks that a user has started their first pitch practice.
 */
app.post("/api/pitch/start", async (req, res) => {
    const { userId, grantId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });
    if (!grantId) return res.status(400).json({ error: "grantId is required" });

    try {
        const pitchId = buildUserGrantKey(userId, grantId);
        const docRef = db.collection(COLLECTIONS.USER_PITCHES).doc(pitchId);
        const doc = await docRef.get();

        // Only create if it doesn't exist yet to avoid overwriting real data with a placeholder
        if (!doc.exists) {
            await docRef.set({
                userId,
                grantId,
                pitchContent: "",
                overallScore: 0,
                hasStarted: true,
                updatedAt: new Date().toISOString()
            });
        }
        res.json({ success: true, pitchId });
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
 * Accepts ?forceRefresh=true to bypass DB cache
 */
app.get("/api/grants/:userId", async (req, res) => {
    const { userId } = req.params;
    const forceRefresh = req.query.forceRefresh === 'true';
    try {
        const result = await getCategorizedGrants(userId, forceRefresh);
        res.json(result);
    } catch (error) {
        console.error("Matching Error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/users/:userId/invalidate-cache
 * Clears the user's grant cache in Firestore (used when profile idea/domain changes)
 */
app.post("/api/users/:userId/invalidate-cache", async (req, res) => {
    const { userId } = req.params;
    try {
        await db.collection(COLLECTIONS.USER_GRANTS_CACHE).doc(userId).delete();
        console.log(`[CACHE] Invalidated grant cache for user: ${userId}`);
        res.json({ success: true, message: "Cache invalidated successfully" });
    } catch (error) {
        console.error("Cache Invalidation Error:", error);
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
 * POST /api/create-checkout-session
 * Body: { "planType": "pro" | "plus", "userId": "...", "userEmail": "..." }
 */
app.post("/api/create-checkout-session", async (req, res) => {
    const { planType, userId, userEmail } = req.body;

    if (!planType || !userId) {
        return res.status(400).json({ error: "Missing required fields: planType, userId" });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ error: "Stripe secret key not configured on server" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Choose the price ID based on planType
    // The user needs to set these in their backend .env file
    const priceId = planType === 'pro'
        ? process.env.STRIPE_PRICE_ID_PRO
        : process.env.STRIPE_PRICE_ID_PLUS;

    if (!priceId) {
        return res.status(500).json({ error: `Stripe price ID not configured for plan: ${planType}` });
    }

    const frontendUrl = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${frontendUrl}/credits?session_id={CHECKOUT_SESSION_ID}&success=true`,
            cancel_url: `${frontendUrl}/credits?canceled=true`,
            client_reference_id: userId,
            customer_email: userEmail || undefined,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Session Error:", error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/pitch/:userId/:grantId
 * Returns the latest stored pitch and evaluation for a specific user and grant
 */
app.get("/api/pitch/:userId/:grantId", async (req, res) => {
    const { userId, grantId } = req.params;
    if (!userId || !grantId) return res.status(400).json({ error: "userId and grantId are required" });

    try {
        const pitchId = buildUserGrantKey(userId, grantId);
        const pitchDoc = await db.collection(COLLECTIONS.USER_PITCHES).doc(pitchId).get();
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
