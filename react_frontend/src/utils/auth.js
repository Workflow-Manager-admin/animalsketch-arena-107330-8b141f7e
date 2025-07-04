import { auth } from "./firebase";
import {
  signInAnonymously,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

// PUBLIC_INTERFACE
export async function loginAnonymously(username) {
  /**
   * Login anonymously, then set the displayName to username.
   * Returns the Firebase user object.
   *
   * Note: Using modular SDK methods imported directly from 'firebase/auth'.
   */
  console.log("[auth.js] loginAnonymously called. username=", username);
  await signInAnonymously(auth);
  // Assign displayName only if provided
  if (username) {
    await updateProfile(auth.currentUser, { displayName: username });
    console.log("[auth.js] Updated anonymous user profile with displayName:", username);
  }
  console.log("[auth.js] Anonymous login after signIn: ", auth.currentUser);
  return auth.currentUser;
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
  await signOut(auth);
}
