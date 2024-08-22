import { type Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./app/_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {},
  darkMode: "class",
  plugins: [
    nextui({
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
