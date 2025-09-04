/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'selector',  // This enables the class-based dark mode
  theme: {
    extend: {
      colors: {
        customSidebar: '#2d3748',  // Sidebar color in dark mode
        customDetail: '#edf2f7',   // Detail content color in light mode
        customText: '#2d3748',     // Text color
        // Add more custom colors if needed
      },
    },
  },
  plugins: [],
};
