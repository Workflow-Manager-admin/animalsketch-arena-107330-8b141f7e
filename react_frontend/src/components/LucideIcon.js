import React from "react";

// PUBLIC_INTERFACE
function LucideIcon({ name, className, ...props }) {
  // This is a stub for demo: show different SVG by name if desired, fallback to pencil/plus icons.
  // Replace logic with `react-lucide` or similar in real app.
  return (
    name === "bird" ? (
      <svg className={className} width="32" height="32" viewBox="0 0 40 40" {...props}><circle cx="20" cy="20" r="18" fill="#8ecae6"/><ellipse cx="24" cy="12" rx="6" ry="8" fill="#fff"/><ellipse cx="18" cy="23" rx="10" ry="10" fill="#fff"/><circle cx="24" cy="11" r="1.8" fill="#222"/><polygon points="31,12 37,16 30,16" fill="#ffe200"/></svg>
    ) : name === "plus" ? (
      <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fd4091" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    ) : (
      // pencil
      <svg className={className} width="32" height="32" viewBox="0 0 40 40" {...props}><rect x="6" y="28" width="28" height="6" rx="2" fill="#ffee60"/><rect x="8" y="6" width="24" height="19" rx="5" fill="#ffb5e0" stroke="#a585f5" strokeWidth="2"/><rect x="18" y="3" width="4" height="8" rx="2" fill="#dac4fc"/><polygon points="20,35 23,34 20,32 17,34" fill="#ff99ec"/><rect x="18.5" y="25" width="3" height="7" fill="#338fee"/></svg>
    )
  );
}

export default LucideIcon;
