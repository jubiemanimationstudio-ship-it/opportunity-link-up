import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0B2545",
          50: "#E8EEF7",
          100: "#C7D5E9",
          200: "#8BAACE",
          300: "#5481B3",
          400: "#2E5A8A",
          500: "#0B2545",
          600: "#091D38",
          700: "#07172B",
          800: "#04101E",
          900: "#020812"
        },
        accent: {
          DEFAULT: "#FFD60A",
          50: "#FFFBE5",
          100: "#FFF5B8",
          200: "#FFEC75",
          300: "#FFE13D",
          400: "#FFD60A",
          500: "#E0BB00",
          600: "#AD9000",
          700: "#7A6600",
          800: "#473C00",
          900: "#141100"
        },
        ink: {
          DEFAULT: "#0F172A",
          soft: "#1E293B",
          mute: "#475569"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 4px 24px -8px rgba(11, 37, 69, 0.12)",
        glow: "0 0 0 4px rgba(255, 214, 10, 0.25)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out both",
        shimmer: "shimmer 2s linear infinite"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      }
    }
  },
  plugins: []
};

export default config;
