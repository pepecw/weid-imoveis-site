/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066FF',    // Neon Blue
        secondary: '#00C853',  // WhatsApp Green
        dark: '#0a0a0a',       // Deep Dark
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // We'll need to import Inter or use system sans
      },
    },
  },
  plugins: [],
}
