import admin from "firebase-admin";
import "dotenv/config";

const projectId = process.env.VITE_FIREBASE_PROJECT_ID;

if (!admin.apps.length) {
    try {
        // In a real production environment, you would use a service account key JSON.
        // For now, we'll try to initialize with the project ID.
        // NOTE: This requires the machine to be authenticated via Google Cloud CLI 
        // or have GOOGLE_APPLICATION_CREDENTIALS set.
        admin.initializeApp({
            credential: admin.credential.cert("./service-account.json"),
            projectId: projectId
        });
    } catch (error) {
        console.error("Firebase Admin initialization failed:", error);
    }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
