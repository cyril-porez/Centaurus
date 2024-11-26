/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
        colors: {
            'homa-brown': "#92502C",
            'homa-blue': "#219BD0",
            'homa-black': '#312E2D',
            'homa-beige': '#C6A77C',
            'homa-white': '#FFF6EA'
        }
    },
  },
  plugins: [],
};
