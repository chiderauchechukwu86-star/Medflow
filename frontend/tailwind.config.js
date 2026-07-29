/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark-mode surfaces: near-true-black, like Apple's dark mode, not navy.
        navy: {
          950: "#0A0B0D",
          900: "#17181B",
          800: "#1F2023",
        },
        // Primary/brand interactive color — "Clinical Blue". Key kept as
        // `teal` so existing bg-teal-500 / text-teal-500 usage across the
        // app didn't need touching file-by-file; it is not visually teal.
        teal: {
          50: "#EAF1FF",
          100: "#D2E3FF",
          400: "#5B93F5",
          500: "#2F6FE4",
          600: "#2557B8",
          700: "#1D4494",
        },
        // Secondary informational blue (badges, secondary accents).
        sky: {
          400: "#7FB7FF",
          500: "#4C9FE8",
        },
        // Light-mode canvas — cool off-white, not warm cream.
        mint: {
          50: "#F7F8FA",
        },
        // Semantic + signature colors. `coral` is the "Pulse Red" signature
        // accent (echoes the Apple Health icon) — used sparingly for the
        // logo mark, the hero pulse-line, and destructive actions.
        vital: {
          green: "#34C759",
          amber: "#FF9F0A",
          coral: "#E0483E",
        },
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      backgroundImage: {
        "pulse-line": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='40' viewBox='0 0 200 40'%3E%3Cpath d='M0 20 H70 L80 5 L90 35 L100 20 H200' fill='none' stroke='%23E0483E' stroke-width='2'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        // Soft, layered elevation — replaces the old blur-based "glass" card.
        card: "0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px -4px rgba(16, 24, 40, 0.08)",
        "card-hover": "0 2px 4px rgba(16, 24, 40, 0.05), 0 16px 32px -8px rgba(16, 24, 40, 0.12)",
        glow: "0 0 0 1px rgba(47, 111, 228, 0.12), 0 8px 24px rgba(47, 111, 228, 0.16)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};
