import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoMascot from "../components/LogoMascot";
import PlayfulButton from "../components/PlayfulButton";
import LucideIcon from "../components/LucideIcon";
import { loginAnonymously, onUserAuthStateChanged } from "../utils/auth";

// Picks a random animal emoji-style name for the placeholder
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
  const [username, setUsername] = useState("");
  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ensures side-effect-free user state reset for rare repeated visits (defensive)
  React.useEffect(() => {
    setError(null);
    setLoading(false);
  }, []);

  // Handles the login and feedback state
  const handleStart = async () => {
    setError(null);
    console.log("[LoginPage] Start button clicked, username:", username);
    if (!username.trim()) {
      setError("Please enter a username!");
      console.warn("[LoginPage] No username provided.");
      return;
    }
    setLoading(true);

    try {
      const user = await loginAnonymously(username.trim());
      console.log("[LoginPage] loginAnonymously resolved. FB User:", user);

      // Capture the response of loginAnonymously for diagnostic
      if (!user) {
        setLoading(false);
        setError("Login failed: No user returned from Firebase. Check your connection and configuration.");
        console.error("[LoginPage] loginAnonymously returned no user object.");
        return;
      }

      // One-time auth state listener (should fire nearly instantly)
      let unsub = null;
      let routed = false;
      unsub = onUserAuthStateChanged((fbUser) => {
        console.log("[LoginPage] onUserAuthStateChanged callback fired. user:", fbUser);
        if (!fbUser) {
          setError("Authentication error: No user is signed in after login. Please check your Firebase setup.");
          setLoading(false);
          unsub && unsub();
          return;
        }
        if (fbUser && !routed) {
          routed = true;
          unsub && unsub();
          setLoading(false);
          console.log("[LoginPage] User is now logged in, navigating to /dashboard");
          navigate("/dashboard", { replace: true });
        }
      });
      // Fallback in case onUserAuthStateChanged does not fire (shouldn't, but async bugs may happen)
      setTimeout(() => {
        if (!routed) {
          setLoading(false);
          setError(
            "Login succeeded, but navigation to dashboard failed. This is likely a networking or Firebase state error. Try reloading the page, check your internet connection, or verify the Firebase config."
          );
          unsub && unsub();
        }
      }, 6000); // 6 seconds, ample for Firebase

    } catch (e) {
      let errMsg =
        (e && e.message) ||
        (typeof e === "string" ? e : null) ||
        "Unknown error";
      // Try to surface some Firebase error codes
      if (e && e.code) {
        errMsg += " (code: " + e.code + ")";
      }
      setError("Login failed: " + errMsg);
      console.error("[LoginPage] Login failed!", e);
      setLoading(false);
    }
  };

  // Handler for pressing Enter or button click
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleStart();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4">
      <div className="w-full max-w-sm bg-white/70 rounded-2xl shadow-fun py-10 px-5 mb-8 relative backdrop-blur-md">
        <LogoMascot className="mb-5" />
        <form
          className="flex flex-col gap-6"
          onSubmit={handleFormSubmit}
        >
          <input
            type="text"
            value={username}
            placeholder={"Username (e.g. " + randomAnimalName() + ")"}
            onChange={e => {
              setUsername(e.target.value);
              setError(null);
            }}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            className={`rounded-xl border bg-bgDoodle py-3 px-5 w-full font-heading text-lg transition-all duration-200 focus:ring-2 focus:ring-primary outline-none shadow ${focus ? "animate-wiggle border-accentPink" : "border-pastelPurple"}`}
            maxLength={18}
            autoFocus
            disabled={loading}
            aria-invalid={!!error}
            aria-describedby={error ? "login-error-msg" : undefined}
          />
          {error && (
            <div id="login-error-msg" className="text-accentPink text-center font-heading text-sm -mt-3">
              <LucideIcon name="bird" className="inline-block w-5 h-5 mr-1 -mt-1 align-middle" />
              {error}
            </div>
          )}
          <PlayfulButton
            type="submit"
            className="mt-2 flex items-center justify-center gap-2"
            aria-label="Start"
            disabled={!username || loading}
            tabIndex={0}
            onClick={handleStart}
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
