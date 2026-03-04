/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f59e0b",
        "primary-dark": "#d97706",
        "surface": "#0f172a",
        "surface-2": "#1e293b",
        "surface-3": "#334155",
        "bdr": "#334155",
        "tx-primary": "#f8fafc",
        "tx-secondary": "#94a3b8",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};