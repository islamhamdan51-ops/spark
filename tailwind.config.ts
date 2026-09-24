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
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          surface: "#FFFFFF",
          subtle: "#F8F9FA",
          muted: "#64748B",
          dark: "#0F172A",
          flame: "#FF5722",
          amber: "#F59E0B",
          rose: "#F43F5E",
          indigo: "#6366F1",
          emerald: "#10B981",
          950: "#0B0F19",
          900: "#111827",
          850: "#1F2937",
          800: "#374151",
          700: "#4B5563",
          600: "#6B7280",
          500: "#9CA3AF",
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
