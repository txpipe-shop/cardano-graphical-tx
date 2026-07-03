import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
const { heroui } = require("@heroui/react");

export default {
  content: [
    "./app/_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        shadow: "var(--color-shadow)",
        "p-primary": "var(--color-text_primary)",
        "p-secondary": "var(--color-text_secondary)",
        "primary-action": "var(--color-primary_action)",
        "accent-blue": "var(--color-accent_blue)",
        "red-1": "var(--color-bg-red)",
        "red-2": "var(--color-text-red)",
        "red-3": "var(--color-border-red)",
        "green-1": "var(--color-success_bg)",
        "green-3": "var(--color-border-green)",
        "explorer-row": "var(--color-explorer_row)",
        border: "var(--color-border)",
        toploader: "var(--color-toploader)",
      },
      spacing: {
        "section-y": "1.5rem",
        card: "1rem",
        "card-lg": "1.5rem",
        field: "0.625rem 0.75rem",
        "page-x": "1rem",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {},
    }),
  ],
} satisfies Config;
