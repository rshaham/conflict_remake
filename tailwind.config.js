/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Relationship level colors from GDD
        relationship: {
          'military-pact': '#22c55e',
          'profitable': '#86efac',
          'beneficial': '#bbf7d0',
          'favourable': '#fef9c3',
          'satisfactory': '#fef08a',
          'cool': '#fed7aa',
          'lamentable': '#fdba74',
          'hostile': '#fca5a5',
          'war': '#ef4444',
        },
        // Game UI colors
        game: {
          'bg-dark': '#1a1a2e',
          'bg-card': '#16213e',
          'accent': '#e94560',
          'text-primary': '#eaeaea',
          'text-secondary': '#a0a0a0',
        },
      },
      fontFamily: {
        'game': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
