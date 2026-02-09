import admin from "firebase-admin";
import "dotenv/config";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!admin.apps.length) {
    try {
        const serviceAccountPath = path.join(__dirname, "../service-account.json");
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("Firebase Admin initialized for project:", serviceAccount.project_id);
    } catch (error) {
        console.error("Firebase Admin initialization failed:", error);
    }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
