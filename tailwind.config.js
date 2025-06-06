/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue,svelte}",
  ],
  theme: {
    extend: {
      colors: {
        'main': 'var(--main-color)',
        'secondary': 'var(--secondary-color)',
        'accent': 'var(--accent-color)',
        'text': 'var(--text-color)',
        'text-light': 'var(--text-light-color)',
        'text-on-accent': 'var(--text-on-accent-color)',
        'border': 'var(--border-color)',
        'tertiary': 'var(--tertiary-color)',
        'background': 'var(--background-color)',
        'info': 'var(--info-color)',
        'warning': 'var(--warning-color)',
        'danger': 'var(--danger-color)',
        'success': 'var(--success-color)',
        gray: {
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
        },
      }
    },
  },
  plugins: [],
} 