/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        vortice: {
          black: '#000000',
          dark: '#0a0a0a',
          gray: '#111111',
          card: '#161616',
          border: '#222222',
          red: '#FF0033',
          'red-dim': '#CC0028',
          blue: '#0066FF',
          'blue-dim': '#0044CC',
          silver: '#C0C0C0',
          white: '#F0F0F0',
        }
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'cursive'],
        body: ['"Barlow Condensed"', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
      animation: {
        'pulse-red': 'pulse-red 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        'glow': {
          from: { textShadow: '0 0 10px #FF0033, 0 0 20px #FF0033' },
          to: { textShadow: '0 0 20px #FF0033, 0 0 40px #FF0033, 0 0 60px #FF0033' },
        },
        'slideUp': {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        'slideIn': {
          from: { transform: 'translateX(-10px)', opacity: 0 },
          to: { transform: 'translateX(0)', opacity: 1 },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
        'vortex-gradient': 'radial-gradient(ellipse at center, #111 0%, #000 70%)',
        'red-glow': 'radial-gradient(ellipse at top, rgba(255,0,51,0.15) 0%, transparent 60%)',
        'blue-glow': 'radial-gradient(ellipse at bottom, rgba(0,102,255,0.1) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
