/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{svelte,html,js,ts}', './svelte.config.js'],
	theme: {
		extend: {
			colors: {
				// arena at night
				ink: '#0a1120',
				panel: '#111b30',
				raised: '#17243f',
				line: '#26365a',
				rail: '#1f45c7',
				'rail-hi': '#3460f0',
				chalk: '#eef2fb',
				muted: '#9aa8c7',
				// scoreboard digits
				amber: '#ffb627',
				'amber-hi': '#ffc95c',
				// difficulty team colours
				easy: '#2fd1c0',
				medium: '#ffb627',
				hard: '#ff6159'
			},
			fontFamily: {
				display: ['"Big Shoulders Display"', 'Barlow', 'sans-serif'],
				sans: ['Barlow', 'system-ui', 'sans-serif']
			},
			fontSize: {
				sm: 'clamp(0.85rem, 0.17vi + 0.8rem, 0.92rem)',
				base: 'clamp(1rem, 0.34vi + 0.91rem, 1.12rem)',
				lg: 'clamp(1.2rem, 0.5vi + 1.1rem, 1.4rem)',
				xl: 'clamp(1.5rem, 1vi + 1.25rem, 2rem)',
				'2xl': 'clamp(1.9rem, 1.5vi + 1.5rem, 2.75rem)',
				'3xl': 'clamp(2.4rem, 2.4vi + 1.8rem, 3.75rem)',
				'4xl': 'clamp(3rem, 3.5vi + 2.1rem, 5rem)'
			},
			borderRadius: {
				DEFAULT: '6px'
			}
		}
	}
};
