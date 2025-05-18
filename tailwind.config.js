/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0A0F24',
        primary: '#B026FF',
        secondary: '#9A4DFF',
        accent: '#D11EFF',
      },
      animation: {
        float: 'float 3s infinite',
        glow: 'glow 2s infinite',
      },
    },
  },
  plugins: [],
};