/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          green: '#075E54',
          light: '#25D366',
          teal: '#128C7E',
          bg: '#ece5dd',
          bubble: '#dcf8c6'
        }
      }
    },
  },
  plugins: [],
}