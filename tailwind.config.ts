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
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "var(--font-mono)",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace"
        ]
      },
      colors: {
        background: "rgb(var(--brand-bg-rgb) / <alpha-value>)",
        surface: "rgb(var(--brand-surface-rgb) / <alpha-value>)",
        soft: "rgb(var(--brand-soft-card-rgb) / <alpha-value>)",
        primary: "rgb(var(--brand-yellow-rgb) / <alpha-value>)",
        "primary-hover": "rgb(var(--brand-yellow-hover-rgb) / <alpha-value>)",
        "primary-soft": "rgb(var(--brand-yellow-soft-rgb) / <alpha-value>)",
        "primary-pale": "rgb(var(--brand-yellow-pale-rgb) / <alpha-value>)",
        "primary-deep": "rgb(var(--brand-yellow-deep-rgb) / <alpha-value>)",
        ink: "rgb(var(--brand-ink-rgb) / <alpha-value>)",
        black: "rgb(var(--brand-black-rgb) / <alpha-value>)",
        charcoal: "rgb(var(--brand-charcoal-rgb) / <alpha-value>)",
        "muted-dark": "rgb(var(--brand-muted-dark-rgb) / <alpha-value>)",
        warning: "rgb(var(--brand-yellow-rgb) / <alpha-value>)",
        danger: "rgb(var(--danger-rgb) / <alpha-value>)",
        success: "rgb(var(--success-rgb) / <alpha-value>)",
        info: "rgb(var(--info-rgb) / <alpha-value>)",
        border: "rgb(var(--brand-border-rgb) / <alpha-value>)",
        muted: "rgb(var(--brand-muted-text-rgb) / <alpha-value>)",
        "dark-muted": "rgb(var(--brand-dark-muted-text-rgb) / <alpha-value>)"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,216,0,0.35), 0 20px 60px rgba(255,216,0,0.12)",
        warm: "0 24px 80px rgba(17,16,11,0.12)",
        insetVault: "inset 0 1px 0 rgba(255,216,0,0.12), inset 0 -1px 0 rgba(255,255,255,0.03)"
      },
      backgroundImage: {
        "vault-grid":
          "linear-gradient(rgba(17,16,11,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(17,16,11,0.05) 1px, transparent 1px)",
        "vault-dark-grid":
          "linear-gradient(rgba(255,216,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,216,0,0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
