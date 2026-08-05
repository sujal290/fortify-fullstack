/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fortify brand tokens — from the logo pack, the single source of truth.
        navy: '#0F1B2A',
        gold: '#B7844A',
        'gold-light': '#D6A96F',
        ink: '#111111',
        cream: '#F2F2F2',
        muted: '#7A7A7A',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
