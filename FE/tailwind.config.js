/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#194d75',
        secondary: '#dadfe3',
        accent: '#657786',
        background: '#F5F8FA',
        text: '#14171A',
      },
    },
  },
  plugins: [],
};
// background: #194D75;
// background: linear-gradient(90deg, rgba(25, 77, 117, 1) 0%, rgba(218, 223, 227, 1) 54%);