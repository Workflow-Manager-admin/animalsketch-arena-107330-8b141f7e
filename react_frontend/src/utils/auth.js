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

// PUBLIC_INTERFACE
export async function loginAnonymously(username) {
  /**
   * Login anonymously, then set the displayName to username.
   * Returns the Firebase user object.
   *
   * Note: Using modular SDK methods imported directly from 'firebase/auth'.
   * Throws an error if login fails.
   */
  try {
    console.log("[auth.js] loginAnonymously called. username=", username);
    await signInAnonymously(auth);
    // Assign displayName only if provided
    if (username) {
      await updateProfile(auth.currentUser, { displayName: username });
      console.log("[auth.js] Updated anonymous user profile with displayName:", username);
    }
    console.log("[auth.js] Anonymous login after signIn: ", auth.currentUser);
    // Defensive: check returned user object
    if (!auth.currentUser) {
      throw new Error("No user returned by Firebase anonymous login");
    }
    return auth.currentUser;
  } catch (e) {
    console.error("[auth.js] loginAnonymously error:", e);
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
