import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sections/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050509",
        champagne: "#F2D28B",
        ivory: "#F6F3F0",
        grey: "#9E9EAE",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        sans: ['"Inter"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
