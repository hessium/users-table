const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        green: 'var(--color-green)',
        gray: 'var(--color-gray)',
        white: 'var(--color-white)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideIn: {
          from: {
            transform: 'translateY(-50px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
      },
      animation: {
        ...defaultTheme.animation,
        fadeIn: 'fadeIn 0.3s ease forwards',
        slideIn: 'slideIn 0.3s ease forwards',
      },
      boxShadow: {
        ...defaultTheme.boxShadow,
        modal: '0px 10px 15px 0px rgba(66, 71, 77, 0.1)',
      },
      fontSize: {
        ...defaultTheme.fontSize,
        '2xl': ['28px', { lineHeight: '36px' }],
        xl: ['22px', { lineHeight: '28px' }],
      },
    },
  },
  plugins: [],
};
