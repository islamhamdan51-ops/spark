import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        spark: {
          50: "#F4F9FD",
          100: "#EAF7FF",
          200: "#DDF2FF",
          300: "#C9ECFF",
          400: "#A9DFFF",
          500: "#78C7F5",
          primary: "#2F8FD8",
          primaryHover: "#1F7EC7",
          surface: "#FFFFFF",
          bg: "#F4F9FD",
          border: "#E2EEF8",
          borderHover: "#C3E1F7",
          text: "#17324D",
          muted: "#60788C",
          // Mapped to blue system for consistent brand identity
          flame: "#2F8FD8",
          amber: "#3B82F6",
          dark: "#17324D",
          success: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
      },
      fontFamily: {
        arabic: ["Cairo", "Tajawal", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounce 2s infinite",
        "scale-in": "scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
