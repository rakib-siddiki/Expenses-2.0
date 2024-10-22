import type { Config } from 'tailwindcss';

const config = {
    darkMode: ['class'],
    content: ['./src/**/*.{ts,tsx}'],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
            },
            screens: {
                // sm: '640px',
                lg: ' 1120px',
                '2xl': '1400px',
            },
        },
        extend: {
            screens: {
                xs: '480px',
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
                '2xl': '1536px',
            },
            colors: {
                gray: {
                    50: '#E8E8E9',
                    100: '#D0D1D4',
                    200: '#B9BABE',
                    300: '#A1A3A8',
                    400: '#8A8C93',
                    500: '#73747D',
                    600: '#5B5D67',
                    700: '#444651',
                    800: '#2C2F3C',
                    900: '#151826',
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            backgroundImage: {
                'background-grid': 'url(/grid.svg)',
            },
            fontFamily: {
                poppins: ['var(--font-poppins-sans)'],
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'slide-in-once': {
                    '0%': { left: '-100%', opacity: '25%' },
                    '100%': { left: '100%', opacity: '100%' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                quiet: {
                    '25%': { transform: 'scaleY(0.6)' },
                    '50%': { transform: 'scaleY(0.4)' },
                    '75%': { transform: 'scaleY(0.8)' },
                },
                normal: {
                    '25%': { transform: 'scaleY(1)' },
                    '50%': { transform: 'scaleY(0.4)' },
                    '75%': { transform: 'scaleY(0.6)' },
                },
                loud: {
                    '25%': { transform: 'scaleY(1)' },
                    '50%': { transform: 'scaleY(0.4)' },
                    '75%': { transform: 'scaleY(1.2)' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'slide-in-once': 'slide-in-once .7s ease-out forwards',
                quiet: 'quiet 1.2s ease-in-out infinite',
                normal: 'normal 1.2s ease-in-out infinite',
                loud: 'loud 1.2s ease-in-out infinite',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
