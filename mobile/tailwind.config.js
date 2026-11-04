/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#101B35",
        accent: "#3478F6",
        teal: "#19B9A5",
        purple: "#7956F5",
        bgLight: "#F5F7FB",
        cardLight: "#FFFFFF",
      },
      borderRadius: {
        '20': '20px',
        '14': '14px',
      }
    },
  },
  plugins: [],
};
