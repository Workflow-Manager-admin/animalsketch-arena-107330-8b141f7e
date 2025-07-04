import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * Firebase configuration is loaded from environment.
 * Add the following keys to your .env file:
 * REACT_APP_FIREBASE_API_KEY=
 * REACT_APP_FIREBASE_AUTH_DOMAIN=
 * REACT_APP_FIREBASE_PROJECT_ID=
 * REACT_APP_FIREBASE_STORAGE_BUCKET=
 * REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
 * REACT_APP_FIREBASE_APP_ID=
 */

// PUBLIC_INTERFACE
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// PUBLIC_INTERFACE
const app = initializeApp(firebaseConfig);

// PUBLIC_INTERFACE
export const db = getFirestore(app);
// PUBLIC_INTERFACE
export const auth = getAuth(app);
// Note: DO NOT export or re-export signInAnonymously, updateProfile, onAuthStateChanged, signOut, etc. from this file.
// Import these directly where needed using: import { signInAnonymously, ... } from "firebase/auth";
