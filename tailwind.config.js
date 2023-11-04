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
          "10%": { transform: "translateY(-112%)" },
          "25%": { transform: "translateY(-100%)" },
          "35%": { transform: "translateY(-212%)" },
          "50%": { transform: "translateY(-200%)" },
          "60%": { transform: "translateY(-312%)" },
          "75%": { transform: "translateY(-300%)" },
          "85%": { transform: "translateY(-412%)" },
          "100%": { transform: "translateY(-400%)" },
        },
      },
      animation: {
        spin_words: "spin_words 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

