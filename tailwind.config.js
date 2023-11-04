/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        aenonikbold: ["aenonik-bold", "sans-serif"],
        aenonikbolditalic: ["aenonik-bold-italic", "sans-serif"],
        aenoniklight: ["aenonik-light", "sans-serif"],
        aenoniklightitalic: ["aenonik-light-italic", "sans-serif"],
        aenonikregular: ["aenonik-regular", "sans-serif"],
        aenonikregularitalic: ["aenonik-regular-italic", "sans-serif"],
      },
      animation: {
        typing: "typing 4s steps(40, end), blinkCursor .75s step-end infinite",
      },
      keyframes: {
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        blinkCursor: {
          "from, to": { "border-right-color": "transparent" },
          "50%": { "border-right-color": "black" },
        },
      },
    },
  },
  plugins: [],
};

