import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const REQUIRED_ENV_KEYS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

function readEnv() {
  const metaEnv = typeof import.meta !== "undefined" ? import.meta.env ?? {} : {};
  const processEnv = typeof process !== "undefined" ? process.env ?? {} : {};
  return { ...processEnv, ...metaEnv };
}

function getFirebaseConfig() {
  const env = readEnv();
  const missingKeys = REQUIRED_ENV_KEYS.filter((key) => !env[key]);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing Firebase environment variables: ${missingKeys.join(", ")}`
    );
  }

  return {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  };
}

const app = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());
const db = getFirestore(app);
const auth = getAuth(app);

export { app, auth, db };
