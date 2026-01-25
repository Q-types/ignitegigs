import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const accountType = url.searchParams.get('type') as 'performer' | 'client' | null;
	const redirectTo = url.searchParams.get('redirectTo') ?? '/dashboard';

	return {
		accountType: accountType ?? 'performer',
		redirectTo
	};
};

export const actions: Actions = {
	// Email/password signup
	signup: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const fullName = formData.get('fullName') as string;
		const accountType = formData.get('accountType') as 'performer' | 'client';
		const redirectTo = formData.get('redirectTo') as string;

		// Validation
		if (!email || !password || !fullName) {
			return fail(400, {
				error: 'All fields are required',
				email,
				fullName,
				accountType
			});
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return fail(400, {
				error: 'Please enter a valid email address',
				email,
				fullName,
				accountType
			});
		}

		// Validate password strength
		if (password.length < 8) {
			return fail(400, {
				error: 'Password must be at least 8 characters long',
				email,
				fullName,
				accountType
			});
		}

		// Validate name
		if (fullName.length < 2) {
			return fail(400, {
				error: 'Please enter your full name',
				email,
				fullName,
				accountType
			});
		}

		// Sign up with Supabase
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					full_name: fullName,
					user_type: accountType
				},
				emailRedirectTo: `${url.origin}/auth/callback?next=${encodeURIComponent(redirectTo || '/dashboard')}`
			}
		});

		if (error) {
			console.error('Signup error:', error);

			if (error.message.includes('already registered')) {
				return fail(400, {
					error: 'An account with this email already exists. Try logging in instead.',
					email,
					fullName,
					accountType
				});
			}

			return fail(500, {
				error: 'Unable to create account. Please try again.',
				email,
				fullName,
				accountType
			});
		}

		// Check if user needs to confirm email
		if (data?.user?.identities?.length === 0) {
			return fail(400, {
				error: 'An account with this email already exists. Try logging in instead.',
				email,
				fullName,
				accountType
			});
		}

		// Check if email confirmation is required
		if (data?.user && !data?.session) {
			return {
				success: true,
				message: 'Check your email to confirm your account!',
				requiresConfirmation: true
			};
		}

		// User is signed in immediately (email confirmation disabled)
		throw redirect(303, redirectTo || '/dashboard');
	},

	// Google OAuth
	google: async ({ locals: { supabase }, url }) => {
		const redirectTo = url.searchParams.get('redirectTo') ?? '/dashboard';
		const accountType = url.searchParams.get('type') ?? 'performer';

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${url.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}&type=${accountType}`,
				queryParams: {
					access_type: 'offline',
					prompt: 'consent'
				}
			}
		});

		if (error) {
			console.error('Google OAuth error:', error);
			return fail(500, {
				error: 'Unable to sign up with Google. Please try again.'
			});
		}

		if (data.url) {
			throw redirect(303, data.url);
		}

		return fail(500, {
			error: 'Unable to initiate Google sign-up'
		});
	}
};
