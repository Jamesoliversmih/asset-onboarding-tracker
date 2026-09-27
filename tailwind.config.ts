import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F7F8FA",
        surface: "#FFFFFF",
        ink: "#141821",
        muted: "#5B6472",
        line: "#E2E5EA",
        accent: {
          DEFAULT: "#3452B4",
          dark: "#28408F",
          light: "#5A75D0",
        },
        status: {
          onboarding: "#B7791F",
          active: "#1E6F63",
          offboarding: "#B33A3A",
          offboarded: "#6B7280",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "80rem",
      },
    },
  },
  plugins: [],
};

export default config;
