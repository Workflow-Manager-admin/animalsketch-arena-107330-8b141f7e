import React from "react";
import LucideIcon from "./LucideIcon";

// PUBLIC_INTERFACE
function LogoMascot({ size = 72, className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-0 ${className}`}>
      <div className="flex items-center gap-2 relative">
        <LucideIcon name="pencil" className="w-14 h-14 drop-shadow-lg" />
        <span className="absolute left-10 top-0 animate-bounce">
          <LucideIcon name="bird" className="w-8 h-8" />
        </span>
      </div>
      <span className="font-title text-3xl md:text-5xl mt-2 tracking-widest text-primary select-none">
        AnimalSketch Arena
      </span>
    </div>
  );
}
export default LogoMascot;
