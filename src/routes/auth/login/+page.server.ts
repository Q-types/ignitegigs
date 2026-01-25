import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const redirectTo = url.searchParams.get('redirectTo') ?? '/dashboard';
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
			console.error('Magic link error:', error);
			return fail(500, {
				error: 'Unable to send magic link. Please try again.',
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

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			console.error('Password login error:', error);
			return fail(400, {
				error: 'Invalid email or password',
				email
			});
		}

		throw redirect(303, redirectTo || '/dashboard');
	},

	// Google OAuth
	google: async ({ locals: { supabase }, url }) => {
		const redirectTo = url.searchParams.get('redirectTo') ?? '/dashboard';

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${url.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
			}
		});

		if (error) {
			console.error('Google OAuth error:', error);
			return fail(500, {
				error: 'Unable to sign in with Google. Please try again.'
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
