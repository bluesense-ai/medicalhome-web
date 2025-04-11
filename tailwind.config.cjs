/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      colors: {
        'primary-blue': {
          dark: '#004F62',
          DEFAULT: '#016C9D',
        },
        'secondary-green': {
          dark: '#33C213',
          DEFAULT: '#5BE548',
        },
        'background': {
          blue: '#F2F8FF',
          green: '#F2FFF3',
        }
      },
      animation: {
        'typing': 'typing 1s steps(5, end) infinite',
      },
      keyframes: {
        typing: {
          '0%': { width: '0.15em' },
          '100%': { width: '1em' },
        },
      },
    },
  },
  plugins: [],
}
