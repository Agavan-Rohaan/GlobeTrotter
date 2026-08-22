/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pistachio: {
          50: '#f4f7f1',
          100: '#e5ede0',
          200: '#ccdec3',
          300: '#aac89d',
          400: '#84ad74',
          500: '#649353',
          600: '#4e773f',
          700: '#3f5e33',
          800: '#354c2b',
          900: '#2c3f25',
          950: '#152311',
        },
        sage: {
          50: '#f5f7f5',
          100: '#e7ebe6',
          200: '#d1dbcf',
          300: '#b1c3ae',
          400: '#8ca688',
          500: '#6d8a69',
          600: '#556f51',
          700: '#445842',
          800: '#384737',
          900: '#2f3b2e',
        },
        cream: {
          50: '#fdfcf9',
          100: '#fafaf7',
          200: '#f3f1ea',
          300: '#e7e3d6',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Kaushan Script"', '"Caveat"', 'cursive'],
        hand: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(63, 94, 51, 0.08)',
        'lifted': '0 12px 30px -4px rgba(44, 63, 37, 0.15)',
      }
    },
  },
  plugins: [],
}
