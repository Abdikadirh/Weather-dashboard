/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "475px",
        "nav-break": "700px", // custom breakpoint for navigation
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
};
