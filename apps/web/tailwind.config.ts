import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
        }
      },
      fontFamily: {
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'blue': '0 4px 24px rgba(27,79,216,0.12)',
      }
    },
  },
  plugins: [],
};
export default config;
