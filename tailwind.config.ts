import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
    "./*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        aqua: "#33d6d2",
        "aqua-deep": "#008c95",
        ink: "#071013",
        slate: "#516268",
        pearl: "#f7faf9"
      },
      boxShadow: {
        glass: "0 24px 70px rgba(7, 16, 19, 0.1)"
      }
    }
  },
  plugins: []
};

export default config;
