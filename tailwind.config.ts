import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // AINative Design System Colors
                'dark-1': '#131726',
                'dark-2': '#22263c',
                'dark-3': '#31395a',
                'brand-primary': '#5867EF',

                // Semantic Surface Colors
                'surface-primary': '#131726',
                'surface-secondary': '#22263c',
                'surface-accent': '#31395a',

                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: '#4B6FED',
                    dark: '#3955B8',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: '#338585',
                    dark: '#1A7575',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                accent: {
                    DEFAULT: '#FCAE39',
                    secondary: '#22BCDE',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                border: 'hsl(var(--border))',
            },
            fontFamily: {
                sans: ['Poppins', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'gradient-shift': 'gradient-shift 8s ease infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
                'fade-in': 'fade-in 0.5s ease-out',
                'slide-up': 'slide-up 0.5s ease-out',
                'typewriter': 'typewriter 0.05s steps(1) forwards',
                'shimmer': 'shimmer 2s infinite',
            },
            keyframes: {
                'gradient-shift': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'pulse-glow': {
                    '0%, 100%': {
                        opacity: '1',
                        boxShadow: '0 0 20px rgba(88, 103, 239, 0.3)'
                    },
                    '50%': {
                        opacity: '0.8',
                        boxShadow: '0 0 40px rgba(88, 103, 239, 0.6)'
                    },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'shimmer': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            backgroundSize: {
                '400%': '400% 400%',
            },
            boxShadow: {
                'ds-sm': '0 2px 4px rgba(19, 23, 38, 0.1), 0 1px 2px rgba(19, 23, 38, 0.06)',
                'ds-md': '0 4px 8px rgba(19, 23, 38, 0.12), 0 2px 4px rgba(19, 23, 38, 0.08)',
                'ds-lg': '0 12px 24px rgba(19, 23, 38, 0.15), 0 4px 8px rgba(19, 23, 38, 0.1)',
            },
        },
    },
    plugins: [],
};

export default config;
