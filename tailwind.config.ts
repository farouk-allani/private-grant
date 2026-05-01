import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#070A12",
        surface: "#101624",
        primary: "#7CFFB2",
        secondary: "#8B5CF6",
        warning: "#FBBF24",
        danger: "#EF4444",
        border: "rgba(255,255,255,0.1)",
        muted: "rgba(226,232,240,0.68)"
      },
      boxShadow: {
        glow: "0 0 45px rgba(124,255,178,0.14)",
        violet: "0 0 45px rgba(139,92,246,0.18)"
      },
      backgroundImage: {
        "vault-grid":
          "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
