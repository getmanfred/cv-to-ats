/*
  Manfred Design System — tailwind-preset.ts
  Copy this file to any Tailwind project and reference it in tailwind.config.

  Usage (tailwind.config.ts):
    import manfredPreset from './design-system/tailwind-preset'
    export default { presets: [manfredPreset], content: [...] }
*/

import type { Config } from 'tailwindcss'

const manfredPreset: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        teal:          '#0DA1A4',
        navy:          '#092c64',
        neon:          '#01FFC6',
        bg:            '#f0ede8',
        accent:        '#7d64d6',
        'purple-dark': '#1a2744',
        'gray-light':  '#e5e0d8',
      },
      fontFamily: {
        // font-display is ONLY for numbers and graphic elements, never for headings
        sans:    ['"Avenir"', '"Montserrat"', 'sans-serif'],
        heading: ['"Source Serif 4"', 'Georgia', 'serif'],
        display: ['"Big Shoulders Display"', 'Impact', 'sans-serif'],
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

export default manfredPreset
