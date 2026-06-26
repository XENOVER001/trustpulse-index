import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import config from "../../firebase-applet-config.json";

// We use Vite environment variables as primary configuration (perfect for Vercel)
// and fall back to the AI Studio auto-generated config during development inside AI Studio.
const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || config.apiKey,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || config.authDomain,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || config.projectId,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || config.storageBucket,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || config.messagingSenderId,
  appId: metaEnv.VITE_FIREBASE_APP_ID || config.appId
};

if (!firebaseConfig.apiKey) {
  console.warn("Firebase configuration API key is missing. Please make sure config is loaded or environment variables are set.");
}

const app = initializeApp(firebaseConfig);

// Use the custom firestoreDatabaseId if provided, else fallback to standard
export const db = config?.firestoreDatabaseId 
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);
