/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.ts'],
  theme: {
    extend: {
      colors: {
        obs: '#0a0a0c',
        char: '#111115',
        graph: '#18181d',
        line: '#2a2a31',
        ash: '#8b8b96',
        bone: '#ececE7',
        ember: { DEFAULT: '#ff3b1f', hi: '#ff5a40' },
        scope: '#5ce1ff',
      },
      fontFamily: {
        display: ['"Inter Tight Variable"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
      },
      transitionTimingFunction: {
        cut: 'cubic-bezier(0.16, 1, 0.3, 1)',
        micro: 'cubic-bezier(0.16, 1, 0.3, 1)',
        reveal: 'cubic-bezier(0.22, 1, 0.36, 1)',
        snap: 'cubic-bezier(0.7, 0, 0.2, 1)',
      },
      maxWidth: { shell: '1440px' },
    },
  },
  plugins: [],
};
