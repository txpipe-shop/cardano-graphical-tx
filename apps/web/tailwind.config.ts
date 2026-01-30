import { type Config } from "tailwindcss";
const { heroui } = require("@heroui/react");

export default {
  content: [
    "./app/_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        "dashed-border": "var(--color-dashed-border)",
        "example-bg": "var(--color-example-bg)",
        "p-main": "var(--color-p-main)",
        "p-secondary": "var(--color-p-secondary)",
        "input": "var(--color-input)",
      }
    }
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#090909",
          },
        },
      },
    }),
  ],
} satisfies Config;
