import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "fest-yellow": "#FFE500",
        "fest-yellow-deep": "#EAB308",
        "fest-cobalt": "#1E1B4B",
        "fest-cobalt-light": "#312E81",
        "fest-cobalt-royal": "#4338CA",
        "fest-magenta": "#BE185D",
        "fest-magenta-dark": "#700B36",
        "fest-magenta-plum": "#4A044E",
        "fest-teal": "#0D9488",
        "fest-teal-dark": "#042F2E",
        "fest-teal-mint": "#14B8A6",
        "fest-coral": "#F97316",
        "fest-coral-deep": "#C2410C",
        "fest-gold": "#FFC024",
        "fest-cyan": "#00E5FF",
        "fest-sky": "#38BDF8",
        "fest-pink": "#FF2A85",
        "fest-lime": "#10B981",

        // Stitch Tokens
        surface: "#10141a",
        "surface-dim": "#10141a",
        "surface-bright": "#353940",
        "surface-container-lowest": "#0a0e14",
        "surface-container-low": "#181c22",
        "surface-container": "#1c2026",
        "surface-container-high": "#262a31",
        "surface-container-highest": "#31353c",
        "neon-cyan": "#32C3E2",
        "electric-magenta": "#DBAFE0",
        "emerald-turf": "#00AE99",
        "festoon-gold": "#FFC024",
        "stage-ruby": "#FF3B69",
        "day-sky": "#70D6FF",
        "voxel-black": "#0A0D12",
        "fairground-white": "#F8FAFC",

        obsidian: {
          950: "#06090F",
          900: "#0B0F17",
          850: "#0F1622",
          800: "#161F30",
          750: "#1C273C",
          700: "#223049",
        },
        voxel: {
          stone: "#242D3D",
          border: "#1E2B3E",
          panel: "#101622",
          surface: "#0D131D",
        },
        festival: {
          pink: {
            DEFAULT: "#FF2D78",
            glow: "#FF4D8D",
            dark: "#B0104B",
            light: "#FF85B3",
          },
          cyan: {
            DEFAULT: "#00E5FF",
            glow: "#38BDF8",
            dark: "#0369A1",
            light: "#7DD3FC",
          },
          emerald: {
            DEFAULT: "#00E676",
            glow: "#10B981",
            dark: "#047857",
            light: "#6EE7B7",
          },
          yellow: {
            DEFAULT: "#FFD700",
            glow: "#FBBF24",
            dark: "#B45309",
            light: "#FDE68A",
          },
          orange: {
            DEFAULT: "#FF6B35",
            glow: "#FB5607",
            dark: "#C0392B",
          },
          purple: {
            DEFAULT: "#8338EC",
            glow: "#9D4EDD",
            dark: "#5A189A",
          },
          redstone: {
            DEFAULT: "#FF1744",
            glow: "#F43F5E",
            dark: "#881337",
          },
        },
      },
      fontFamily: {
        anton: ["Anton", "sans-serif"],
        grotesk: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Work Sans'", "sans-serif"],
        pixel: ["'Press Start 2P'", "monospace"],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      boxShadow: {
        "retro-black": "6px 6px 0px #000",
        "retro-lg": "10px 10px 0px #000",
        "retro-cyan": "6px 6px 0px #00E5FF",
        "retro-gold": "8px 8px 0px #FFC024",
        voxel: "0 4px 0 0 rgba(0, 0, 0, 0.7)",
        "voxel-sm": "0 2px 0 0 rgba(0, 0, 0, 0.7)",
        "festival-pink": "0 4px 0 0 #B0104B, 0 0 20px rgba(255, 45, 120, 0.4)",
        "festival-gold": "0 4px 0 0 #78350F, 0 0 25px rgba(255, 215, 0, 0.45)",
        "festival-cyan": "0 4px 0 0 #0C4A6E, 0 0 20px rgba(0, 229, 255, 0.4)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.9", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(1.05)" },
        },
      },
      animation: {
        marquee: "marquee 22s linear infinite",
        float: "float 4s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
