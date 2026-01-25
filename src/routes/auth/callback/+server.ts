import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSafeRedirectUrl, sanitizeForLog } from '$lib/server/security';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const next = getSafeRedirectUrl(url.searchParams.get('next'));
	const accountType = url.searchParams.get('type') as 'performer' | 'client' | null;

	if (code) {
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error && data.user) {
			// Check if user exists in our users table
			const { data: existingUser } = await supabase
				.from('users')
				.select('id')
				.eq('id', data.user.id)
				.single();

			if (!existingUser) {
				// Create user record
				const { error: insertError } = await supabase.from('users').insert({
					id: data.user.id,
					email: data.user.email!,
					full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
					avatar_url: data.user.user_metadata?.avatar_url || null,
					user_type: accountType || 'performer'
				});

				if (insertError) {
					console.error('Error creating user record:', sanitizeForLog(insertError));
				}

				// If signing up as a performer, create initial performer profile
				if (accountType === 'performer' || !accountType) {
					const { error: profileError } = await supabase.from('performer_profiles').insert({
						user_id: data.user.id,
						location_name: 'Not set',
						performer_category: [],
						act_types: [],
						is_active: false,
						profile_complete: false
					});

					if (profileError) {
						console.error('Error creating performer profile:', sanitizeForLog(profileError));
					}
				}
			}

			throw redirect(303, next);
		}
	}

	// Auth failed, redirect to login with error
	throw redirect(303, '/auth/login?error=auth_failed');
};
