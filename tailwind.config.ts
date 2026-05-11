import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#EEF4FF",
          100: "#DCE8FF",
          200: "#BFD2FF",
          300: "#91B0FF",
          400: "#6489F5",
          500: "#3563E0",
          600: "#3158D0",
          700: "#3563E0",
          800: "#2848B8",
          900: "#23386F",
          950: "#1F2A4A",
        },
      },
      boxShadow: {
        soft: "0 24px 80px rgba(15, 23, 42, 0.08)",
        card: "0 18px 42px rgba(15, 23, 42, 0.07)",
      },
    },
  },
  plugins: [],
};

export default config;
