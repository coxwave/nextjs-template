module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/frontend/components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        // 'Inter' fontFamily was imported in _document.tsx
        inter: "'Inter'",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
