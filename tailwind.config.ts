import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#18333c", moss: "#176b5b", paper: "#f7f8f4" },
      boxShadow: { soft: "0 10px 30px rgba(20, 54, 60, .08)" }
    }
  },
  plugins: []
};

export default config;
