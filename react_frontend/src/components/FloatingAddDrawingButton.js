import React from "react";
import { motion } from "framer-motion";
import LucideIcon from "./LucideIcon";

// PUBLIC_INTERFACE
function FloatingAddDrawingButton({ onClick, className }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ rotate: 27, scale: 1.2, background: "#ffb5e0" }}
      whileTap={{ scale: 0.95 }}
      className={`fixed z-50 right-6 bottom-6 flex items-center justify-center w-16 h-16 bg-accentPink hover:bg-yellow rounded-full shadow-lg transition-all border-4 border-pastelPurple hover:border-accentPurple cursor-pointer group ${className}`}
      title="Add Your Drawing"
      style={{ boxShadow: "0 4px 30px -2px #ff99ec77" }}
    >
      <span className="inline-block transition-transform animate-wiggle group-hover:animate-none">
        <LucideIcon name="pencil" className="w-9 h-9 text-white" />
      </span>
    </motion.button>
  );
}

export default FloatingAddDrawingButton;
