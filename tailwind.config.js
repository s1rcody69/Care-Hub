/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Sora', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef5ff',
          100: '#d9e8ff',
          200: '#bcd5ff',
          300: '#8eb8ff',
          400: '#598eff',
          500: '#3366ff',
          600: '#1a4af0',
          700: '#1338dc',
          800: '#152eb2',
          900: '#172c8c',
          950: '#111c55',
        },
        surface: {
          DEFAULT: '#f8f9fc',
          card:    '#ffffff',
          border:  '#e8ecf4',
          muted:   '#f1f4fb',
        },
        ink: {
          DEFAULT:   '#0f1623',
          secondary: '#4a5568',
          muted:     '#8896ab',
        },
      },
      boxShadow: {
        card:  '0 2px 12px 0 rgba(15,22,35,0.07)',
        float: '0 8px 32px 0 rgba(51,102,255,0.18)',
        input: '0 0 0 3px rgba(51,102,255,0.15)',
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.5rem',
      },
      // Enable arbitrary opacity values like bg-white/[0.08]
      backgroundOpacity: ['hover', 'focus'],
    },
  },
  plugins: [
    // line-clamp utilities (built-in since Tailwind v3.3)
  ],
}