import React from "react";

// PUBLIC_INTERFACE
function BackgroundDoodle({className = ""}) {
  // Wavy SVG + pastel shapes, animate with a gentle spin if needed
  return (
    <svg
      className={`absolute left-0 right-0 top-0 -z-10 opacity-30 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "blur(2px)" }}
    >
      <ellipse cx="400" cy="120" rx="300" ry="80" fill="#ffb5e0" />
      <ellipse cx="650" cy="500" rx="160" ry="70" fill="#dac4fc" />
      <ellipse cx="120" cy="400" rx="120" ry="38" fill="#b2f7ef" />
      <ellipse cx="300" cy="500" rx="110" ry="33" fill="#ffee60" />
      <ellipse cx="710" cy="160" rx="70" ry="25" fill="#8ecae6" />
      <ellipse cx="80" cy="160" rx="60" ry="17" fill="#fd4091" opacity="0.18"/>
    </svg>
  );
}
export default BackgroundDoodle;
