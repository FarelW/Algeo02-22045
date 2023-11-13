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
      keyframes: {
        spin_words: {
          "0%, 16.666%": { transform: "translateY(0)" }, // 1st word and reset
          "16.666%, 33.333%": { transform: "translateY(-100%)" }, // 2nd word
          "33.333%, 50%": { transform: "translateY(-200%)" }, // 3rd word
          "50%, 66.666%": { transform: "translateY(-300%)" }, // 4th word
          "66.666%, 83.3333%": { transform: "translateY(-400%)" }, // 5th word and prepare to loop back to 1st
          "83.3333%, 100%": { transform: "translateY(0%)" }, // 5th word and prepare to loop back to 1st
        },
      },
      animation: {
        spin_words: "spin_words 8s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animated")
  ],
};

