import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#FF6B35',
					hover: '#E85A2A',
					active: '#D14D20',
					light: '#FFF0EB'
				},
				secondary: {
					DEFAULT: '#1E1E2E',
					light: '#2D2D3D'
				},
				surface: {
					DEFAULT: '#FFFFFF',
					dark: '#1E1E2E'
				},
				success: {
					DEFAULT: '#10B981',
					light: '#D1FAE5'
				},
				error: {
					DEFAULT: '#EF4444',
					light: '#FEE2E2'
				},
				warning: {
					DEFAULT: '#F59E0B',
					light: '#FEF3C7'
				}
			},
			fontFamily: {
				display: ['Sora', ...defaultTheme.fontFamily.sans],
				sans: ['Inter', ...defaultTheme.fontFamily.sans]
			},
			borderRadius: {
				button: '0.5rem',
				card: '0.75rem',
				input: '0.5rem',
				badge: '9999px'
			},
			boxShadow: {
				card: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
				'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
				search: '0 4px 20px rgb(0 0 0 / 0.1)'
			},
			animation: {
				'fade-in': 'fadeIn 0.3s ease-out',
				'slide-up': 'slideUp 0.3s ease-out'
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideUp: {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			}
		}
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography')
	]
};
