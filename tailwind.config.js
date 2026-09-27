/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Roboto', 'ui-sans-serif', 'sans-serif']
      },
      colors: {
        brand: {
          50: '#e8f0fe', 100: '#d0e1fd', 200: '#a3c3fb', 300: '#76a5f9',
          400: '#4987f7', 500: '#2874f0', 600: '#1e5fc4', 700: '#164a99',
          800: '#0d3573', 900: '#041f47', 950: '#021033'
        },
        accent: {
          50: '#fff8e6', 100: '#ffefb3', 200: '#ffe082', 300: '#ffd24d',
          400: '#ffc31b', 500: '#ff9f00', 600: '#cc7f00', 700: '#995f00',
          800: '#664000', 900: '#332000'
        },
        cyan: { 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2' }
      },
      animation: { floaty: 'floaty 4s ease-in-out infinite' },
      keyframes: { floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } } }
    }
  },
  plugins: []
};
