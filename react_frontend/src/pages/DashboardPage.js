import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlayfulButton from "../components/PlayfulButton";
import LucideIcon from "../components/LucideIcon";
import FloatingAddDrawingButton from "../components/FloatingAddDrawingButton";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeDrawings, submitGuess, subscribeLeaderboard } from "../utils/firestore";
import { getCurrentUser } from "../utils/auth";

// DrawingCard displays individual drawings and allows guess.
function DrawingCard({ drawing, onGuess }) {
  const [guess, setGuess] = useState("");
  const [wrongShow, setWrongShow] = useState(false);
  const [shake, setShake] = useState(false);
  // Only allow one guess per user
  const user = getCurrentUser();
  const alreadyGuessed = drawing.guesses && user && drawing.guesses.some(g => g.userId === user.uid);

  // Handler for guess submission
  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in.");
      return;
    }
    if (alreadyGuessed) {
      setWrongShow(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    const isCorrect = guess.trim().toLowerCase() === drawing.prompt?.trim().toLowerCase();
    try {
      await onGuess(drawing.id, {
        userId: user.uid,
        username: user.displayName,
        guess,
        isCorrect
      });
      if (!isCorrect) {
        setWrongShow(true);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      setGuess("");
    } catch (err) {
      setWrongShow(true);
      setGuess("");
      setShake(true);
      setTimeout(() => setShake(false), 480);
    }
  };

  let lastWrong = null;
  if (drawing.guesses && drawing.guesses.length > 0 && user) {
    const last = drawing.guesses.find(g => g.userId === user.uid);
    if (last && !last.correct) {
      lastWrong = last.guess;
    }
  }

  return (
    <motion.div
      layout
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.39, type: "spring" }}
      className={`rounded-card bg-white/90 p-5 shadow-card relative flex flex-col items-center mb-4 transition-all select-none ${shake ? "animate-wiggle" : ""}`}
      style={{ minWidth: "200px" }}
    >
      <div className="absolute top-0 left-0 w-full flex justify-end pr-2 pt-2">
        {drawing.isTop && (
          <motion.div
            animate={{ scale: [1, 1.13, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "mirror" }}
          >
            <span className="px-2 py-1 rounded-2xl font-heading font-semibold text-yellow bg-primary mr-2 shadow-fun">
              🏆 Top Drawing
            </span>
          </motion.div>
        )}
        <span className="text-pastelPurple font-heading font-bold">
          {drawing.guesses ? drawing.guesses.length : 0} guesses
        </span>
      </div>
      <div className="my-4">
        <LucideIcon name="pencil" className="w-10 h-10 text-accentPurple" />
      </div>
      <span className="font-heading text-lg text-primary mb-2">{drawing.prompt}</span>
      <form className="flex gap-2 w-full" onSubmit={handleSubmit}>
        <input
          value={guess}
          disabled={alreadyGuessed}
          onChange={e => setGuess(e.target.value)}
          placeholder="Your guess"
          maxLength={30}
          className={`flex-1 rounded-lg border border-accentPurple px-3 py-2 font-body text-base focus:ring-2 ring-yellow transition-all ${shake ? "animate-wiggle border-accentPink" : ""}`}
        />
        <PlayfulButton type="submit" variant="yellow" className="px-3 py-2 text-base" disabled={!guess || alreadyGuessed}>
          {alreadyGuessed ? "Guessed" : "Guess"}
        </PlayfulButton>
      </form>
      <AnimatePresence>
        {wrongShow && lastWrong && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-2 text-xs text-accentPink font-heading"
          >
            Wrong: {lastWrong}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// PUBLIC_INTERFACE
function DashboardPage() {
  const navigate = useNavigate();
  const [drawings, setDrawings] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // Real-time drawings feed
  useEffect(() => {
    const unsub = subscribeDrawings((list) => setDrawings(list));
    const unsub2 = subscribeLeaderboard((topList) => setLeaderboard(topList), 1);
    return () => {
      unsub();
      unsub2();
    };
  }, []);

  const handleAddDrawing = () => navigate("/drawing");

  // Guess handler
  const handleGuess = async (drawingId, guessObj) => {
    await submitGuess(drawingId, guessObj);
    // UI automatically updates from real-time subscription
  };

  const top = leaderboard && leaderboard[0];
  return (
    <div className="min-h-screen flex flex-col items-center pt-6 px-3">
      <div className="w-full max-w-3xl mb-6">
        {/* sticky highlight */}
        <div className="sticky top-3 z-20 w-full flex flex-col items-center">
          <motion.div
            className="rounded-3xl bg-yellow shadow-fun w-full flex flex-col items-center py-4 px-3 border-2 border-primary"
            animate={{ scale: [1, 1.02, 1], boxShadow: [
              "0 2px 16px 1px #ff99ec55",
              "0 12px 40px 0 #ffe5fe60",
              "0 2px 20px 2px #ff99ec66"
            ] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ filter: "drop-shadow(0 2px 10px #ff99ec40)" }}
          >
            <span className="text-primary font-title text-2xl md:text-3xl text-center mb-1 tracking-wider">Top Drawing</span>
            <span className="font-heading text-primary text-xl">
              {top ? top.prompt : "..."}
            </span>
            <span className="font-body text-base opacity-80">
              Guesses: {top ? (top.guesses?.length ?? 0) : "?"}
            </span>
          </motion.div>
        </div>
      </div>
      {/* Drawing grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-24 pt-2">
        <AnimatePresence>
          {drawings.map(dr => (
            <DrawingCard key={dr.id} drawing={dr} onGuess={handleGuess} />
          ))}
        </AnimatePresence>
      </div>
      <FloatingAddDrawingButton onClick={handleAddDrawing} />
    </div>
  );
}
export default DashboardPage;
