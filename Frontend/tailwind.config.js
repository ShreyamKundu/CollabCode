import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Ensures dark mode is applied based on a specific class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Default font
        heading: ["Montserrat", "sans-serif"], // Heading font
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(15deg)" }, // Adjusted waving
        },
        forward: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(8px)" }, // Slightly smoother transition
        },
      },
      animation: {
        "text-wave": "wave 2s ease-in-out infinite",
        "text-forward": "forward 5s ease-in-out infinite",
      },
      colors: {
        "primary-dark": "#0b6a7a",
        "secondary-dark": "#FF1493",
        "accent-dark": "#194d33",
        "info-dark": "#116a84",
      },
    },
  },
  plugins: [typography, daisyui],
  daisyui: {
    themes: ["dark"], // Restrict DaisyUI to dark mode only
  },
};
