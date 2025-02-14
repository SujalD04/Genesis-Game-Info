const { keyframes } = require("framer-motion");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a', 
        secondary: '#0ea5e9', 
        darkBlue: '#0a192f', 
        blackish: '#0d0d0d', 
      },
      blue: {
        300: '#60A5FA',
        400: '#3B82F6',
        500: '#2563EB',
        600: '#1D4ED8',
        700: '#1E40AF',
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(135deg, #0a192f 0%, #0d0d0d 100%)',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      animation: {
        scroll: 'scroll 60s linear infinite',
      },
    },
  },
  plugins: [],
};
