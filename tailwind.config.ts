import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      dark: "#111111",
      light: "#f6f6f6",
      accent: "#ffcb74",
      "accent-100": "#f4c77f",
      "accent-200": "#f7a218",
      secondary: "#2f2f2f",
      transparent: "transparent"
    }
  },
};
export default config;
