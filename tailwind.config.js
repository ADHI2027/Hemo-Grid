/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "state-normal": "var(--state-normal)",
        "state-watch": "var(--state-watch)",
        "state-rescue": "var(--state-rescue)",
        "state-critical": "var(--state-critical)",
        accent: "var(--accent)",
        ink: "var(--ink)",
        "ink-mid": "var(--ink-mid)",
        rule: "var(--rule)",
        surface: "var(--surface)",
        paper: "var(--paper)",
      },
    },
  },
  plugins: [],
};
