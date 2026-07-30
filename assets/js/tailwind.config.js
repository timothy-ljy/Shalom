/* =========================================================
Tailwind (Play CDN) theme config
Maps the app's original design tokens (was: CSS custom
properties in app.css) onto Tailwind's color/animation scale
so components can use plain utility classes like `bg-surface`
or `text-accent` instead of `var(--surface)` / `var(--accent)`.
========================================================= */
tailwind.config = {
    theme: {
        extend: {
            colors: {
                bg: '#141413',
                surface: '#201f1c',
                raised: '#2b2a25',
                field: '#1a1917',
                line: '#3a382f',
                ink: '#faf9f5',
                muted: '#b0aea5',
                primary: '#f8d968',
                primarysoft: '#1f2b33',
                accent: '#d97757',
                accentsoft: '#35261d',
                danger: '#e36d6d',
                lyrics: '#e3e1d8',
                faint: '#6f6d64',
                sheetbg: '#24221e',
                track: '#423f36',
            },
            fontFamily: {
                sans: ['Lato', '"Noto Sans SC"', 'Georgia', 'serif'],
            },
            keyframes: {
                blink: { '50%': { opacity: 0.25 } },
            },
            animation: {
                blink: 'blink 1s steps(2) infinite',
                spin: 'spin 0.7s linear infinite',
            },
        },
    },
};
