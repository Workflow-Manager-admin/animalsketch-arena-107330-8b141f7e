import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  arrayUnion,
  increment
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Drawings collection layout:
 *  - drawings: {
 *    id,
 *    prompt,
 *    authorId,
 *    authorName,
 *    createdAt,
 *    guesses: [{userId, username, guess, correct}]
 *    correctGuessCount: number,
 *    image: base64 or downloadURL
 *  }
 */

/**
 * PUBLIC_INTERFACE
 * Upload a new drawing with prompt and image data.
 */
export async function uploadDrawing({ prompt, image, authorId, authorName, createdAt }) {
  return addDoc(collection(db, "drawings"), {
    prompt,
    authorId,
    authorName,
    image, // base64 or URL if prefer storage
    createdAt,
    guesses: [],
    correctGuessCount: 0
  });
}

/**
 * PUBLIC_INTERFACE
 * Listen to all drawings (or just top-N), calls callback(drawingList)
 */
export function subscribeDrawings(callback, options = {}) {
  let q = collection(db, "drawings");
  if (options.top) {
    q = query(q, orderBy("correctGuessCount", "desc"), limit(options.top));
  }
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
}

/**
 * PUBLIC_INTERFACE
 * Add a guess for this drawing. If correct, increments correctGuessCount.
 */
export async function submitGuess(drawingId, { userId, username, guess, isCorrect }) {
  const dref = doc(db, "drawings", drawingId);
  const docSnap = await getDoc(dref);

  if (!docSnap.exists()) throw new Error("Drawing does not exist");

  // Only allow one guess per user per drawing
  const drawingData = docSnap.data();
  if (
    drawingData.guesses &&
    drawingData.guesses.find((g) => g.userId === userId)
  ) {
    throw new Error("Already guessed");
  }

  // Add guess and increment if correct
  await updateDoc(dref, {
    guesses: arrayUnion({
      userId,
      username,
      guess,
      correct: isCorrect
    }),
    correctGuessCount: isCorrect ? increment(1) : drawingData.correctGuessCount
  });
}

/**
 * PUBLIC_INTERFACE
 * Listen to leaderboard (top drawings)
 */
export function subscribeLeaderboard(callback, topN = 1) {
  return subscribeDrawings(callback, { top: topN });
}
