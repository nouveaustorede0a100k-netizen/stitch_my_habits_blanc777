import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FF9F43',
        'primary-soft': '#FFF0E0',
        'primary-dark': '#FF8C2A',
        secondary: '#54A0FF',
        success: '#1DD1A1',
        'background-main': '#FDFDFD',
        'card-bg': '#FFFFFF',
        'text-dark': '#2d3436',
        'text-light': '#636e72',
        'accent-purple': '#a55eea',
        'accent-pink': '#ef5777',
        // Dark mode colors
        'background-dark': '#0f172a',
        'surface-dark': '#1e293b',
        'surface-light': '#ffffff',
      },
      fontFamily: {
        display: ['Fredoka', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        floating: '0 10px 25px -5px rgba(255, 159, 67, 0.4)',
        card: '0 2px 10px rgba(0,0,0,0.03)',
        glow: '0 0 20px rgba(99, 102, 241, 0.5)',
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '2.5rem',
        '3xl': '3rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
export default config

