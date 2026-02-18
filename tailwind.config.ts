import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        aea: {
          navy: '#0a0e1a',
          dark: '#111827',
          card: '#1a2236',
          border: '#222d44',
          gold: '#d4a844',
          'gold-dark': '#b8922e',
          'gold-light': '#f0c85a',
        },
      },
    },
  },
  plugins: [],
}
export default config
