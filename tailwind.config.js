/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-playfair)'],
      },
      colors: {
        // 여기에 필요한 커스텀 색상을 추가할 수 있습니다
        'obsidian': '#262628',
        'cherry': '#d86072',
        'lime': '#d6dc82',
        'lavender': '#c6c2f2',
        'cream': '#fff6ee'
      },
    },
  },
  plugins: [],
}