import { auth } from "./firebase";
import {
  signInAnonymously,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

/**
 * Ensures Firebase config loaded from .env.local (or .env) is present.
 * Will log error if any value is missing.
 */
function validateFirebaseEnv() {
  const keys = [
    "REACT_APP_FIREBASE_API_KEY",
    "REACT_APP_FIREBASE_AUTH_DOMAIN",
    "REACT_APP_FIREBASE_PROJECT_ID",
    "REACT_APP_FIREBASE_STORAGE_BUCKET",
    "REACT_APP_FIREBASE_MESSAGING_SENDER_ID",
    "REACT_APP_FIREBASE_APP_ID",
  ];
  const missing = keys.filter((k) => !process.env[k]);
  if (missing.length) {
    // This will show in the browser console
    // Note: In create-react-app, .env* files must use REACT_APP_ prefixes
    // and be in project root! (.env.local preferred for secrets)
    // The "firebaseConfig" will still be constructed, but missing fields = runtime error
    // Users should check .env.local or .env.example for expected keys.
    // We warn here to help debugging typical integration issues.
    // It will print on every import, which is fine for debugging.
    // A missing key in prod will break login.
    // See src/utils/firebase.js for details.
    // (This is a non-fatal warn, but login will fail if config is incomplete)
    // eslint-disable-next-line no-console
    console.error(
      "[auth.js] WARNING: Missing Firebase .env key(s):",
      missing,
      "Check your .env.local or .env file!"
    );
  }
}
validateFirebaseEnv();

/**
 * PUBLIC_INTERFACE
 * Login anonymously, then set displayName. Returns Firebase user object.
 */
export async function loginAnonymously(username) {
  try {
    console.log("[auth.js] loginAnonymously called. username=", username);

    // Clear any previous user to avoid collision (very rare)
    // Note: Sign out (optional/safe, can uncomment if you want strict stateless login attempts)
    // try { await signOut(auth); } catch (e) {}

    // Defensive: Pre-login Firebase env checks
    if (!auth) {
      console.error("[auth.js] CRITICAL: Firebase 'auth' not initialized. Check firebase.js.");
      throw new Error("App auth not initialized. Please check your Firebase config/environment.");
    }

    // Begin anonymous sign-in flow
    const credResult = await signInAnonymously(auth);
    // credResult.user or use auth.currentUser for latest
    let currentUser = auth.currentUser;
    if (!currentUser && credResult && credResult.user) {
      currentUser = credResult.user;
    }
    if (!currentUser) {
      throw new Error("No user returned by Firebase anonymous login (credResult/user is missing)");
    }

    // Assign displayName if provided
    if (username) {
      await updateProfile(currentUser, { displayName: username });
      console.log("[auth.js] Updated anonymous user profile with displayName:", username);
    }
    console.log("[auth.js] Anonymous login after signIn: ", currentUser);

    return currentUser;
  } catch (e) {
    console.error("[auth.js] loginAnonymously error:", e);
    // Surface more details with Firebase errors (e.code, e.customData, etc.)
    if (e && e.code) {
      console.error("[auth.js] Firebase error code:", e.code);
    }
    throw e;
  }
}

// PUBLIC_INTERFACE
export function onUserAuthStateChanged(callback) {
  /**
   * Subscribe to auth state changes. Returns unsubscribe function.
   * Note: Uses onAuthStateChanged imported directly.
   */
  console.log("[auth.js] Subscribing to auth state changes");
  return onAuthStateChanged(auth, callback);
}

// PUBLIC_INTERFACE
export function getCurrentUser() {
  /**
   * Gets the current Firebase user. Returns null if not logged in.
   */
  return auth.currentUser;
}

// PUBLIC_INTERFACE
export async function logout() {
  /**
   * Logs out the current user.
   * Note: Uses modular signOut imported directly.
   */
  try {
    await signOut(auth);
  } catch (e) {
    console.error("[auth.js] logout error:", e);
    throw e;
  }
}
