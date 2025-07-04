import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

// PUBLIC_INTERFACE
const PlayfulButton = ({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
  ...props
}) => {
  let color =
    variant === "yellow"
      ? "bg-yellow text-primary hover:shadow-fun "
      : variant === "pink"
      ? "bg-accentPink text-white"
      : "bg-primary text-white";
  return (
    <motion.button
      whileHover={{ scale: 1.08, rotate: [0, 4, -4, 0] }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 16 }}
      className={clsx(
        "font-heading px-6 py-3 rounded-xl focus:outline-none font-semibold text-lg shadow-card relative transition-all cursor-pointer",
        color,
        "hover:opacity-90 hover:animate-shine", // tailwind animation
        disabled && "opacity-60 pointer-events-none",
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default PlayfulButton;
