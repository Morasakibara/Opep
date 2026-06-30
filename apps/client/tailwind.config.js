/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4FD8',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F97316',
          foreground: '#FFFFFF',
        },
        success: '#16A34A',
        danger: '#DC2626',
        accent: '#FBBF24',
        background: '#F3F6FF',
        surface: '#FFFFFF',
        neutre: {
          dark: '#0F1723',
          mid: '#374151',
          light: '#F3F6FF',
        },
      },
      fontFamily: {
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'blue': '0 4px 24px rgba(27,79,216,0.12)',
      },
    },
  },
  plugins: [],
}
