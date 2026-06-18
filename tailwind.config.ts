import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d1117',
        card: '#161b22',
        border: '#30363d',
        'text-primary': '#e6edf3',
        'text-secondary': '#8b949e',
        accent: '#00d26a',
        negative: '#ff4757',
        'accent-blue': '#58a6ff',
      },
    },
  },
  plugins: [],
};

export default config;
