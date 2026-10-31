export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#114B3E',
          dark: '#114B3E',
          darker: '#0c382e',
          accent: '#E67E22',
          greenCover: '#165B4C',
          slateCover: '#333D4B',
          brownCover: '#9A501B',
          bgLight: '#EDF5F2',
          teal: '#164e43',
          'teal-dark': '#0f3830',
          'teal-light': '#e8f3f0',
          slate: '#374151'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}

