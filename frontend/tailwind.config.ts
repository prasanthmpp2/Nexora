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
        'nexora-teal': '#14b8a6',
        'nexora-blue': '#3b82f6',
        'nexora-dark': '#0f172a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'nexora-gradient': 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
export default config
