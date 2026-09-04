/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: {
            DEFAULT: '#0B2545',
            dark: '#06152B',
            deep: '#031429',
            light: '#133B68',
            surface: '#1A497E',
          },
          saffron: {
            DEFAULT: '#EA580C',
            light: '#F97316',
            dark: '#C2410C',
            gold: '#D97706',
            subtle: '#FFF7ED',
          },
          green: {
            DEFAULT: '#15803D',
            light: '#16A34A',
            dark: '#166534',
            subtle: '#F0FDF4',
          },
          ivory: {
            DEFAULT: '#F8FAFC',
            warm: '#FDFBF7',
            border: '#E2E8F0',
          },
          red: {
            DEFAULT: '#DC2626',
            dark: '#991B1B',
            subtle: '#FEF2F2',
          },
          charcoal: {
            DEFAULT: '#1E293B',
            muted: '#64748B',
            dark: '#0F172A',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'gov': '0 1px 3px 0 rgba(11, 37, 69, 0.08), 0 1px 2px -1px rgba(11, 37, 69, 0.08)',
        'gov-md': '0 4px 6px -1px rgba(11, 37, 69, 0.1), 0 2px 4px -2px rgba(11, 37, 69, 0.08)',
        'gov-lg': '0 10px 15px -3px rgba(11, 37, 69, 0.12), 0 4px 6px -4px rgba(11, 37, 69, 0.08)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 12px 30px -4px rgba(15, 23, 42, 0.1), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
        'glow-saffron': '0 0 25px -3px rgba(249, 115, 22, 0.3)',
        'glow-indigo': '0 0 25px -3px rgba(99, 102, 241, 0.3)',
      },
      animation: {
        'spin-slow': 'spin 16s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
