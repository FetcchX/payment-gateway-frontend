module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        urban: ['Urbanist', 'sans-serif'],
        eds: ['Eds', 'sans-serif'],
        edds: ['Edds', 'sans-serif'],
        jakarta: ['Jakarta', 'sans-serif'],
        holtz: ['Holtz', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
