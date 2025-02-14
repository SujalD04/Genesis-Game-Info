module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a', // Deep blue
        secondary: '#0ea5e9', // Cyan
        darkBlue: '#0a192f', // Very dark blue shade
        blackish: '#0d0d0d', // Almost black shade
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(135deg, #0a192f 0%, #0d0d0d 100%)',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
