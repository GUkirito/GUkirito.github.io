import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "oklch(65% 0.12 210)",
          hover: "oklch(72% 0.12 210)",
          muted: "oklch(25% 0.03 210)",
        },
        surface: {
          bg: "oklch(17% 0.005 210)",
          card: "oklch(22% 0.006 210)",
          elevated: "oklch(24% 0.006 210)",
          border: "oklch(28% 0.005 210)",
          light: "oklch(23% 0.005 210)",
        },
        ink: {
          heading: "oklch(92% 0.002 210)",
          body: "oklch(82% 0.003 210)",
          muted: "oklch(65% 0.005 210)",
          faint: "oklch(50% 0.005 210)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "system-ui",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          '"SF Mono"',
          '"Cascadia Code"',
          "Consolas",
          '"Courier New"',
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;