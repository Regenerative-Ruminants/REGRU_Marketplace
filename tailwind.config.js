/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue,svelte}",
  ],
  theme: {
    extend: {
      fontSize: {
        'size-h1': '1.833rem',      // 22pt
        'size-h2': '1.611rem',      // ~19.33pt
        'size-h3': '1.389rem',      // ~16.67pt
        'size-h4': '1.167rem',      // 14pt
        'size-body': '1.333rem',    // 16pt
        'size-caption': '1rem',     // 12pt (Tailwind's default text-base)
      },
      colors: {
        brand: {
          DEFAULT: '#0d324a', // Your --main-color
          // Add shades like 'light' or 'dark' here if needed later
        },
        accent: {
          DEFAULT: '#28a745', // Your --accent-color
        },
        background: {
          primary: '#ffffff',   // Your --secondary-color (used as primary page background)
          secondary: '#f8f9fa', // Your --tertiary-color (used for panels, lighter backgrounds)
        },
        text: {
          primary: '#0d324a',     // Using brand color for primary text, as per current body style
          secondary: '#374151',   // A standard dark gray (like Tailwind's gray-700) for less emphasis
          inverted: '#ffffff',    // For text on dark backgrounds (e.g., on brand color buttons)
          accent: '#28a745',      // For text that needs accent color
        },
        border: {
          DEFAULT: '#dee2e6', // Your --border-color
        },
        // You can also directly map your old variable names if preferred
        // 'main-color': 'var(--main-color)', // etc. - but direct hex is usually better for Tailwind processing
      }
    },
  },
  plugins: [],
} 