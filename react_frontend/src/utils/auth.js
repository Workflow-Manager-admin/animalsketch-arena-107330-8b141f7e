import { auth, signInAnonymously, updateProfile, onAuthStateChanged, signOut } from "./firebase";

// PUBLIC_INTERFACE
export async function loginAnonymously(username) {
  /**
   * Login anonymously, then set the displayName to username.
   * Returns the Firebase user object.
   */
  const cred = await signInAnonymously(auth);
  // Assign displayName only if provided
  if (username) {
    await updateProfile(auth.currentUser, { displayName: username });
  }
  return auth.currentUser;
}

// PUBLIC_INTERFACE
export function onUserAuthStateChanged(callback) {
  /**
   * Subscribe to auth state changes. Returns unsubscribe function.
   */
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
   */
  await signOut(auth);
}
