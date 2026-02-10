import admin from "firebase-admin";
import "dotenv/config";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!admin.apps.length) {
    try {
        let serviceAccount;

        // Priority 1: Environment Variable (Recommended for Render)
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            console.log("📍 [INFO] FIREBASE_SERVICE_ACCOUNT found in environment.");
            const rawConfig = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
            console.log(`📍 [DEBUG] Config string length: ${rawConfig.length} characters.`);

            try {
                serviceAccount = JSON.parse(rawConfig);
                console.log("📍 [INFO] Successfully parsed FIREBASE_SERVICE_ACCOUNT JSON.");
            } catch (parseError) {
                console.error("� [ERROR] Failed to parse FIREBASE_SERVICE_ACCOUNT JSON string.");
                console.error("Make sure it is a valid JSON object, not a file path.");
                throw parseError;
            }
        }
        // Priority 2: Local File (Fallback for Local Development)
        else {
            console.log("📍 [INFO] FIREBASE_SERVICE_ACCOUNT not found. Checking local service-account.json...");
            const serviceAccountPath = path.join(__dirname, "../service-account.json");

            if (fs.existsSync(serviceAccountPath)) {
                serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
                console.log("📍 [INFO] Loaded service account from local file.");
            } else {
                throw new Error("No Firebase credentials found! Set FIREBASE_SERVICE_ACCOUNT env var or add service-account.json locally.");
            }
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ [SUCCESS] Firebase Admin initialized for project:", serviceAccount.project_id);
    } catch (error) {
        console.error("💥 [FATAL] Firebase Admin initialization failed:");
        console.error(error.message);
        // On Render, we want the process to crash immediately so we can see the error in the logs
        process.exit(1);
    }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
