/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8a0303',
          light: '#b52828',
          dark: '#6b0202',
        },
        secondary: {
          DEFAULT: '#03588a',
          light: '#2878a8',
          dark: '#023e61',
        },
        // Text colors
        'text-primary': '#FFFFFF',
        'text-secondary': '#F5F5F5',
        'text-dark': '#212121',
        // UI elements
        success: '#2E7D32',
        warning: '#F57F17',
        error: '#8a0303',
        info: '#0277BD',
      },
      backgroundColor: {
        'card-bg': '#F5F5F5',
        'navbar-bg': '#8a0303',
        'footer-bg': '#6b0202',
      },
      boxShadow: {
        'card-hover': '0 10px 20px rgba(139, 3, 3, 0.1)',
        'button-hover': '0 4px 8px rgba(139, 3, 3, 0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}; 