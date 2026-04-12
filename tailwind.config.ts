import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal:          '#0DA1A4',
        navy:          '#092c64',
        'purple-dark': '#353241',
        'gray-light':  '#dedce4',
        'bg-light':    '#faf9ff',
        accent:        '#7d64d6',
        neon:          '#01FFC6',
      },
      fontFamily: {
        sans:    ['var(--font-sans)', 'Avenir', 'Montserrat', 'sans-serif'],
        heading: ['var(--font-heading)', '"Source Serif 4"', 'Georgia', 'serif'],
        display: ['var(--font-display)', '"Big Shoulders Display"', 'Impact', 'sans-serif'],
      },
      maxWidth: {
        container: '87.5rem',
      },
      boxShadow: {
        card: '0px 7.57px 11.35px rgba(0,0,0,0.07)',
      },
    },
  },
  plugins: [],
}

export default config
