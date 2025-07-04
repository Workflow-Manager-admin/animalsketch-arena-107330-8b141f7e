import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlayfulButton from "../components/PlayfulButton";
import LucideIcon from "../components/LucideIcon";
import FloatingAddDrawingButton from "../components/FloatingAddDrawingButton";
import { motion, AnimatePresence } from "framer-motion";

const demoDrawings = [
  {
    id: 1,
    name: "Unicorn Cat",
    img: null,
    guesses: 7,
    wrong: ["Bear", "Dog"],
    top: true
  },
  {
    id: 2,
    name: "Slippery Frog",
    img: null,
    guesses: 4,
    wrong: [],
    top: false
  },
  { id: 3, name: "Waddling Penguin", img: null, guesses: 3, wrong: ["Fish"], top: false },
  { id: 4, name: "Little Axolotl", img: null, guesses: 2, wrong: [], top: false },
  { id: 5, name: "Jump Fox", img: null, guesses: 1, wrong: ["Cat"], top: false },
];

// Usually from backend.

function DrawingCard({ drawing, onGuess }) {
  const [guess, setGuess] = useState("");
  const [wrongShow, setWrongShow] = useState(false);
  const [shake, setShake] = useState(false);
  // Animation shake/wobble when wrong guess
  const handleSubmit = e => {
    e.preventDefault();
    if (guess.toLowerCase() !== drawing.name.toLowerCase()) {
      setWrongShow(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setGuess("");
      return;
    }
    onGuess(drawing.id, guess);
  };
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
        {drawing.top && (
          <motion.div
            animate={{ scale: [1, 1.13, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "mirror" }}
          >
            <span className="px-2 py-1 rounded-2xl font-heading font-semibold text-yellow bg-primary mr-2 shadow-fun">
              🏆 Top Drawing
            </span>
          </motion.div>
        )}
        <span className="text-pastelPurple font-heading font-bold">{drawing.guesses} guesses</span>
      </div>
      <div className="my-4">
        <LucideIcon name="pencil" className="w-10 h-10 text-accentPurple" />
      </div>
      <span className="font-heading text-lg text-primary mb-2">{drawing.name}</span>
      <form className="flex gap-2 w-full" onSubmit={handleSubmit}>
        <input
          value={guess}
          onChange={e => setGuess(e.target.value)}
          placeholder="Your guess"
          maxLength={30}
          className={`flex-1 rounded-lg border border-accentPurple px-3 py-2 font-body text-base focus:ring-2 ring-yellow transition-all ${shake ? "animate-wiggle border-accentPink" : ""}`}
        />
        <PlayfulButton type="submit" variant="yellow" className="px-3 py-2 text-base" disabled={!guess}>
          Guess
        </PlayfulButton>
      </form>
      <AnimatePresence>
        {wrongShow && drawing.wrong.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-2 text-xs text-accentPink font-heading"
          >
            Wrong: {drawing.wrong.join(", ")}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// PUBLIC_INTERFACE
function DashboardPage() {
  const navigate = useNavigate();
  const [drawings, setDrawings] = useState(demoDrawings);

  // For demo, just navigate
  const handleAddDrawing = () => {
    navigate("/drawing");
  };

  // For demo, "guesses" just update guesses count
  const handleGuess = (id, g) => {
    setDrawings(ds =>
      ds.map(d =>
        d.id === id
          ? { ...d, guesses: d.guesses + 1, wrong: [] }
          : d
      )
    );
  };

  const topDrawing = drawings.find(d => d.top);

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
            <span className="font-heading text-primary text-xl">{topDrawing ? topDrawing.name : "..."}</span>
            <span className="font-body text-base opacity-80">Guesses: {topDrawing ? topDrawing.guesses : "?"}</span>
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
