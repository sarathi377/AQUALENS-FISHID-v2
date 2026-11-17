/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alpha: {
          cyan: '#22d3ee',
          success: '#10b981',
          muted: '#94a3b8',
          light: '#f8fafc',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      }
    },
  },
  plugins: [],
}


