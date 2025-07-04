module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      heading: ["Fredoka", "Poppins", "Nunito", "sans-serif"],
      body: ["Inter", "Open Sans", "Quicksand", "sans-serif"],
      title: ["Bungee", "Press Start 2P", "Fredoka", "sans-serif"]
    },
    extend: {
      colors: {
        pastelBlue: "#8ecae6",
        pastelYellow: "#ffefa0",
        pastelPink: "#ffb5e0",
        pastelPurple: "#dac4fc",
        pastelGreen: "#b2f7ef",
        primary: "#338fee",
        yellow: "#ffee60",
        accentPink: "#ff99ec",
        accentGreen: "#8bffb3",
        accentPurple: "#a585f5",
        bgPaper: "#fffef7",
        bgDoodle: "#f4f0f1"
      },
      borderRadius: {
        xl: "2rem",
        "card": "1.5rem"
      },
      boxShadow: {
        fun: "0 4px 30px 0 #ffe5fe60",
        card: "0 2px 18px 4px #fdeaff60"
      },
      keyframes: {
        wiggle: { "0%, 100%": { transform: "rotate(-3deg)" }, "50%": { transform: "rotate(3deg)" }},
        shine: {
          "0%": { backgroundPosition: "200%" },
          "100%": { backgroundPosition: "-200%" }
        }
      },
      animation: {
        wiggle: "wiggle 0.3s ease-in-out",
        shine: "shine 1.3s linear infinite"
      }
    }
  },
  plugins: [require('daisyui')]
}
