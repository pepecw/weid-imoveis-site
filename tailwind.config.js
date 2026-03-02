/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C9A96E',    // Gold
        secondary: '#25D366',  // WhatsApp Green
        dark: '#0A1628',       // Custom Dark
        gold: '#C9A96E',
      },
      fontFamily: {
        sans: ["'Outfit'", 'system-ui', 'sans-serif'], // Sync with CSS
      },
    },
  },
  plugins: [],
}
