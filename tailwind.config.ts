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
          silver: {
            DEFAULT: "#CBD5E1",
            glow: "#E2E8F0",
            dark: "#64748B",
          },
          bronze: {
            DEFAULT: "#D97706",
            glow: "#F59E0B",
            dark: "#78350F",
          },
        },
        realm: {
          emerald: {
            DEFAULT: "#00E676",
            glow: "#10B981",
            dark: "#047857",
            light: "#6EE7B7",
          },
          diamond: {
            DEFAULT: "#00E5FF",
            glow: "#38BDF8",
            dark: "#0369A1",
            light: "#7DD3FC",
          },
          redstone: {
            DEFAULT: "#FF1744",
            glow: "#F43F5E",
            dark: "#881337",
            light: "#FDA4AF",
          },
          gold: {
            DEFAULT: "#FFD700",
            glow: "#FBBF24",
            dark: "#B45309",
            light: "#FDE68A",
          },
          silver: {
            DEFAULT: "#CBD5E1",
            glow: "#E2E8F0",
            dark: "#64748B",
          },
          bronze: {
            DEFAULT: "#D97706",
            glow: "#F59E0B",
            dark: "#78350F",
          },
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        pixel: [
          "'Press Start 2P'",
          "ui-monospace",
          "monospace",
        ],
      },
      boxShadow: {
        voxel: "0 4px 0 0 rgba(0, 0, 0, 0.7)",
        "voxel-sm": "0 2px 0 0 rgba(0, 0, 0, 0.7)",
        "festival-pink": "0 4px 0 0 #B0104B, 0 0 20px rgba(255, 45, 120, 0.4)",
        "festival-emerald": "0 4px 0 0 #065F46, 0 0 20px rgba(0, 230, 118, 0.35)",
        "festival-gold": "0 4px 0 0 #78350F, 0 0 25px rgba(255, 215, 0, 0.45)",
        "festival-cyan": "0 4px 0 0 #0C4A6E, 0 0 20px rgba(0, 229, 255, 0.4)",
        "voxel-emerald": "0 4px 0 0 #065F46, 0 0 20px rgba(0, 230, 118, 0.35)",
        "voxel-gold": "0 4px 0 0 #78350F, 0 0 25px rgba(255, 215, 0, 0.4)",
        "voxel-redstone": "0 4px 0 0 #881337, 0 0 20px rgba(255, 23, 68, 0.4)",
        "voxel-diamond": "0 4px 0 0 #0C4A6E, 0 0 20px rgba(0, 229, 255, 0.4)",
        "stage-glow": "0 0 35px rgba(255, 45, 120, 0.25), 0 0 70px rgba(0, 229, 255, 0.15)",
      },
      animation: {
        "pulse-fast": "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-pixel": "float 3s ease-in-out infinite",
        "scanner": "scan 4s linear infinite",
        "bunting-sway": "bunting 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        bunting: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(1.5deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
