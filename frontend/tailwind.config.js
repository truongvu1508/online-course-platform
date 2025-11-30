/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#512DA8",
          light: "#7E57C2",
          dark: "#311B92",
          50: "#EDE7F6",
          100: "#D1C4E9",
          200: "#B39DDB",
          300: "#9575CD",
          400: "#7E57C2",
          500: "#512DA8",
          600: "#4527A0",
          700: "#311B92",
          800: "#1a0b2e",
          900: "#0d0620",
        },
        secondary: "#673AB7",
        accent: "#4CAF50",
      },
      backgroundColor: {
        primary: {
          DEFAULT: "#512DA8",
          light: "#7E57C2",
          dark: "#311B92",
          50: "#EDE7F6",
          100: "#D1C4E9",
          200: "#B39DDB",
          300: "#9575CD",
          400: "#7E57C2",
          500: "#512DA8",
          600: "#4527A0",
          700: "#311B92",
          800: "#1a0b2e",
          900: "#0d0620",
        },
        secondary: "#2d1b4e",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        "float-slower": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "float-slow": "float-slow 4s ease-in-out infinite",
        "float-slower": "float-slower 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
