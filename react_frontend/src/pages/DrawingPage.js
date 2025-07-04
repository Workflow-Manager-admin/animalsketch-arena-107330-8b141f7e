import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PlayfulButton from "../components/PlayfulButton";
import LucideIcon from "../components/LucideIcon";
import { motion, AnimatePresence } from "framer-motion";
import { uploadDrawing } from "../utils/firestore";
import { getCurrentUser } from "../utils/auth";

const prompts = [
  "Dancing Panda", "Rocket Bird", "Magical Axolotl", "Running Pig", "Skateboard Cat"
];

// PUBLIC_INTERFACE
function DrawingPage() {
  const navigate = useNavigate();
  const [time, setTime] = useState(45);
  const [prompt, setPrompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);
  const [showPrompt, setShowPrompt] = useState(true);
  const [drawingData, setDrawingData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (time === 0) return;
    const tid = setTimeout(() => setTime(t => t - 1), 1000);
    return () => clearTimeout(tid);
  }, [time]);

  const handleReset = () => {
    setDrawingData(null); // clear canvas stub
    setTime(45);
    setShowPrompt(false);
    setTimeout(() => setPrompt(prompts[Math.floor(Math.random() * prompts.length)]), 400);
    setTimeout(() => setShowPrompt(true), 600);
  };

  // Would take canvas data (here just null/stub), prompt, and send to Firestore
  const handleSubmit = async () => {
    setSubmitting(true);
    const user = getCurrentUser();
    if (!user) {
      alert("You must be logged in!");
      setSubmitting(false);
      return;
    }
    try {
      const image = drawingData || ""; // TODO: wire to canvas as base64, here stub as empty
      await uploadDrawing({
        prompt,
        image,
        authorId: user.uid,
        authorName: user.displayName || "",
        createdAt: new Date().toISOString()
      });
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to upload drawing: " + err.message);
      setSubmitting(false);
    }
  };

  // Canvas is a stub here
  return (
    <div className="min-h-screen flex flex-col items-center gap-4 pt-10 px-2 relative">
      <div className="w-full max-w-lg flex flex-col items-center">
        {/* Prompt */}
        <AnimatePresence>
          {showPrompt && (
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ type: "spring", duration: 0.7 }}
              className="mb-3 px-6 py-3 rounded-2xl text-xl text-primary font-heading bg-yellow border border-primary shadow-fun cursor-pointer group relative"
              title="Click to randomize prompt"
              onClick={handleReset}
            >
              <span className="mr-2">Prompt:</span>
              <motion.span
                whileHover={{ scale: 1.08, rotate: 5 }}
                className="font-title tracking-wider px-1"
              >
                {prompt}
              </motion.span>
              <span className="ml-1 text-base text-accentPurple">(click to reroll)</span>
              <motion.span
                animate={{ scale: [1, 1.18, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="absolute -left-8 top-0 text-3xl"
                role="img"
              >🎨</motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timer */}
        <motion.div
          className={`my-4 px-4 py-2 rounded-xl font-heading text-lg bg-pastelPurple text-primary border-2 border-accentPink relative`}
        >
          <span>
            {time > 9 ? (
              <motion.span>{time}</motion.span>
            ) : (
              <motion.span
                animate={{
                  scale: [1, 1.17, 1],
                  color: ["#e94444", "#ff0000", "#e94444"]
                }}
                transition={{ repeat: Infinity, duration: 0.55 }}
                className="font-bold"
                style={{ color: "#e94444" }}
              >
                {time}
              </motion.span>
            )}
            {" "}seconds left
          </span>
          {/* Red animated border "flash" for <10s */}
          {time < 10 && (
            <motion.span
              layoutId="timerWarn"
              className="absolute -inset-2 rounded-2xl border-4 border-red-300 animate-pulse"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            />
          )}
        </motion.div>
        {/* Drawing Canvas section - stub */}
        <div className="w-full bg-gradient-to-tr from-pastelYellow via-white to-pastelPink rounded-3xl border-4 border-accentPurple shadow-fun flex items-center justify-center aspect-square max-w-lg">
          <div className="font-title text-3xl text-primary opacity-30 select-none">[Canvas here]</div>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex flex-row gap-6 mt-5">
        <PlayfulButton variant="pink" onClick={handleReset}>
          <LucideIcon name="plus" className="w-5 h-5 mr-2" />
          Reset
        </PlayfulButton>
        <PlayfulButton variant="primary" onClick={handleSubmit} disabled={submitting}>
          <LucideIcon name="pencil" className="w-5 h-5 mr-2" />
          {submitting ? "Submitting..." : "Submit Drawing"}
        </PlayfulButton>
      </div>
    </div>
  );
}
export default DrawingPage;
