/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        crimson: "#c41e3a",
        "deep-crimson": "#8b1629",
        charcoal: "#2d2d2d",
        titanium: "#c4cdbe",
        mist: "#8b8b8b",
        platinum: "#e8e8e8",
        teal: "#0d7377",
        gold: "#b8860b",
        slate: "#4a5568",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        crimson: ["Crimson Text", "Georgia", "serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
