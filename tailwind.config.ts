import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "oklch(65% 0.14 255)",
          hover: "oklch(72% 0.13 255)",
          muted: "oklch(25% 0.06 255)",
        },
        surface: {
          bg: "oklch(18% 0.003 250)",
          card: "oklch(24% 0.004 250)",
          elevated: "oklch(26% 0.005 250)",
          border: "oklch(30% 0.005 250)",
          light: "oklch(20% 0.003 250)",
        },
        ink: {
          heading: "oklch(92% 0.002 250)",
          body: "oklch(82% 0.003 250)",
          muted: "oklch(50% 0.004 250)",
          faint: "oklch(40% 0.004 250)",
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