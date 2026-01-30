import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { Actions, PageServerLoad } from './$types';
import { getSafeRedirectUrl } from '$lib/server/security';
import {
	checkFormRateLimit,
	getRateLimitKey,
	recordFailedAttempt,
	clearFailedAttempts
} from '$lib/server/rateLimit';

export const load: PageServerLoad = async ({ url }) => {
	const redirectTo = getSafeRedirectUrl(url.searchParams.get('redirectTo'));
	const message = url.searchParams.get('message');
	const error = url.searchParams.get('error');

	return {
		redirectTo,
		message,
		error
	};
};

export const actions: Actions = {
	// Magic link login
	magicLink: async ({ request, locals: { supabase }, url }) => {
		// Rate limit: 5 magic link requests per minute per IP
		const blocked = checkFormRateLimit(request, 'login');
		if (blocked) return blocked;

		const formData = await request.formData();
		const email = formData.get('email') as string;
		const redirectTo = formData.get('redirectTo') as string;

		if (!email) {
			return fail(400, {
				error: 'Email is required',
				email
			});
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: 'Please enter a valid email address',
				email
			});
		}

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${url.origin}/auth/callback?next=${encodeURIComponent(redirectTo || '/dashboard')}`
			}
		});

		if (error) {
			console.error('Magic link error:', error.message, error.status, error);

			if (error.message.includes('rate limit') || error.status === 429) {
				return fail(429, {
					error: 'Too many attempts. Please wait a moment and try again.',
					email
				});
			}

			const errorMessage = dev
				? `Magic link failed: ${error.message} (status: ${error.status})`
				: 'Unable to send magic link. Please try again.';
			return fail(error.status || 500, {
				error: errorMessage,
				email
			});
		}

		return {
			success: true,
			message: 'Check your email for the magic link!'
		};
	},

	// Password login
	password: async ({ request, locals: { supabase } }) => {
		// Rate limit: 5 password attempts per minute per IP
		const blocked = checkFormRateLimit(request, 'login');
		if (blocked) return blocked;

		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const redirectTo = formData.get('redirectTo') as string;

		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required',
				email
			});
		}

		const rateLimitKey = getRateLimitKey(request, 'login');

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			// Track failed attempt for brute-force lockout
			recordFailedAttempt(rateLimitKey);

			console.error('Password login error:', error.message, error.status, error);

			if (error.message.includes('Email not confirmed')) {
				return fail(400, {
					error: 'Please confirm your email address before logging in. Check your inbox for the confirmation link.',
					email
				});
			}

			if (error.message.includes('rate limit') || error.status === 429) {
				return fail(429, {
					error: 'Too many login attempts. Please wait a moment and try again.',
					email
				});
			}

			// For invalid credentials, show a generic message (security best practice)
			// but in dev, show the real error
			const errorMessage = dev
				? `Login failed: ${error.message} (status: ${error.status})`
				: 'Invalid email or password';
			return fail(400, {
				error: errorMessage,
				email
			});
		}

		// Successful login — clear any brute-force tracking
		clearFailedAttempts(rateLimitKey);

		throw redirect(303, redirectTo || '/dashboard');
	},

	// Google OAuth
	google: async ({ locals: { supabase }, url }) => {
		const redirectTo = getSafeRedirectUrl(url.searchParams.get('redirectTo'));

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${url.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
			}
		});

		if (error) {
			console.error('Google OAuth error:', error.message, error.status, error);
			const errorMessage = dev
				? `Google sign-in failed: ${error.message}`
				: 'Unable to sign in with Google. Please try again.';
			return fail(500, {
				error: errorMessage
			});
		}

		if (data.url) {
			throw redirect(303, data.url);
		}

		return fail(500, {
			error: 'Unable to initiate Google sign-in'
		});
	}
};
