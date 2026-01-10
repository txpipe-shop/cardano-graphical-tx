import { type Config } from "tailwindcss";
const { heroui } = require("@heroui/react");

export default {
  content: [
    "./app/_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {},
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
