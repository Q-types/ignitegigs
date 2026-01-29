import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { Actions, PageServerLoad } from './$types';
import { getSafeRedirectUrl } from '$lib/server/security';

export const load: PageServerLoad = async ({ url }) => {
	const accountType = url.searchParams.get('type') as 'performer' | 'client' | null;
	const redirectTo = getSafeRedirectUrl(url.searchParams.get('redirectTo'));

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

		// Sign up with Supabase Auth
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
			console.error('Signup error:', error.message, error.status, error);

			if (error.message.includes('already registered') || error.message.includes('already been registered')) {
				return fail(400, {
					error: 'An account with this email already exists. Try logging in instead.',
					email,
					fullName,
					accountType
				});
			}

			if (error.message.includes('password') && error.message.includes('least')) {
				return fail(400, {
					error: error.message,
					email,
					fullName,
					accountType
				});
			}

			if (error.message.includes('valid email') || error.message.includes('invalid')) {
				return fail(400, {
					error: 'Please enter a valid email address.',
					email,
					fullName,
					accountType
				});
			}

			if (error.message.includes('rate limit') || error.status === 429) {
				return fail(429, {
					error: 'Too many signup attempts. Please wait a moment and try again.',
					email,
					fullName,
					accountType
				});
			}

			// In development, show the actual Supabase error for debugging.
			// In production, show a generic message but include the error code.
			const errorMessage = dev
				? `Signup failed: ${error.message} (status: ${error.status})`
				: `Unable to create account. Please try again. (Code: ${error.status || 'unknown'})`;

			return fail(error.status || 500, {
				error: errorMessage,
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

		// After successful auth signup, create the public.users record and
		// performer profile if needed. The auth callback handles this for OAuth,
		// but email/password signup needs it here. The handle_new_user DB trigger
		// also creates this record, so duplicate key errors are expected and safe.
		if (data?.user) {
			try {
				const { error: userInsertError } = await supabase.from('users').insert({
					id: data.user.id,
					email: email,
					full_name: fullName,
					user_type: accountType || 'performer'
				});

				if (userInsertError) {
					// This may fail with a duplicate key error if the DB trigger
					// already created the record -- that is expected and safe.
					console.error('Error creating user record after signup:', userInsertError);
				}

				// If signing up as a performer, create the initial performer profile
				if (!userInsertError && (accountType === 'performer' || !accountType)) {
					const { error: profileError } = await supabase.from('performer_profiles').insert({
						user_id: data.user.id,
						location_name: 'Not set',
						performer_category: [],
						act_types: [],
						is_active: false,
						profile_complete: false
					});

					if (profileError) {
						console.error('Error creating performer profile after signup:', profileError);
					}
				}
			} catch (profileCreationError) {
				// Log but don't block signup for profile creation errors
				console.error('Unexpected error creating user profile:', profileCreationError);
			}
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
		const redirectTo = getSafeRedirectUrl(url.searchParams.get('redirectTo'));
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
			console.error('Google OAuth error:', error.message, error.status, error);
			const errorMessage = dev
				? `Google sign-up failed: ${error.message}`
				: 'Unable to sign up with Google. Please try again.';
			return fail(500, {
				error: errorMessage
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
