import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoMascot from "../components/LogoMascot";
import PlayfulButton from "../components/PlayfulButton";
import LucideIcon from "../components/LucideIcon";
import { loginAnonymously } from "../utils/auth";

function randomAnimalName() {
  const animals = ["Panda", "Otter", "Penguin", "Parrot", "Cat", "Dog", "Frog", "Bunny"];
  const adjectives = ["Wiggly", "Jumpy", "Sunny", "Happy", "Fluffy", "Quick", "Chill", "Bouncy"];
  return (
    adjectives[Math.floor(Math.random() * adjectives.length)] +
    animals[Math.floor(Math.random() * animals.length)]
  );
}

// PUBLIC_INTERFACE
function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(() => "");
  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    console.log("[LoginPage] Start button clicked, username:", username);
    if (!username.trim()) {
      console.warn("[LoginPage] No username provided.");
      return;
    }
    setLoading(true);
    try {
      const user = await loginAnonymously(username.trim());
      console.log("[LoginPage] loginAnonymously resolved. FB User:", user);
      // Wait for Firebase to confirm user is logged in before navigating
      const unsub = require("../utils/auth").onUserAuthStateChanged((user) => {
        console.log("[LoginPage] onUserAuthStateChanged callback fired. user:", user);
        if (user) {
          unsub(); // Clean up
          setLoading(false);
          console.log("[LoginPage] User is now logged in, navigating to /dashboard");
          navigate("/dashboard");
        }
      });
    } catch (e) {
      // Display error to user (optional)
      alert("Login failed: " + e.message);
      console.error("[LoginPage] Login failed!", e);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4">
      <div className="w-full max-w-sm bg-white/70 rounded-2xl shadow-fun py-10 px-5 mb-8 relative backdrop-blur-md">
        <LogoMascot className="mb-5" />
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleStart();
          }}
        >
          <input
            type="text"
            value={username}
            placeholder={"Username (e.g. " + randomAnimalName() + ")"}
            onChange={e => setUsername(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className={`rounded-xl border bg-bgDoodle py-3 px-5 w-full font-heading text-lg transition-all duration-200 focus:ring-2 focus:ring-primary outline-none shadow ${focus ? "animate-wiggle border-accentPink" : "border-pastelPurple"}`}
            maxLength={18}
            autoFocus
          />
          <PlayfulButton
            type="submit"
            className="mt-2 flex items-center justify-center gap-2"
            aria-label="Start"
            disabled={!username}
          >
            <LucideIcon name="bird" className="w-6 h-6 -ml-2" />
            {loading ? "Starting..." : "Start"}
            <LucideIcon name="pencil" className="w-6 h-6" />
          </PlayfulButton>
        </form>
      </div>
      {/* Animated doodle mascots on BG - just show spinning bird icons */}
      <div className="fixed left-2 bottom-6 flex gap-2 opacity-40 -z-10">
        <span className="animate-spin-slow"><LucideIcon name="bird" className="w-12 h-12" /></span>
        <span className="animate-bounce-slow"><LucideIcon name="pencil" className="w-10 h-10" /></span>
      </div>
    </div>
  );
}

export default LoginPage;
