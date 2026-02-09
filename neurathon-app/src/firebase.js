import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-iN9-F0QLHlQln3mHBziTPvzf1VCxQFI",
  authDomain: "grantfit-ai.firebaseapp.com",
  databaseURL: "https://grantfit-ai-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "grantfit-ai",
  storageBucket: "grantfit-ai.firebasestorage.app",
  messagingSenderId: "495359929788",
  appId: "1:495359929788:web:1bd3c458e48bf59b5b4fb9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };
