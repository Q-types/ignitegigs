import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	// Redirect to login if not authenticated
	if (!session || !user) {
		throw redirect(303, '/auth/login?redirectTo=/dashboard');
	}

	// Get user data from our users table
	const { data: userData, error: userError } = await locals.supabase
		.from('users')
		.select('*')
		.eq('id', user.id)
		.single();

	// Get performer profile if user is a performer
	const { data: performerProfile, error: profileError } = await locals.supabase
		.from('performer_profiles')
		.select('*')
		.eq('user_id', user.id)
		.single();

	// If user has no performer profile and is trying to access dashboard,
	// they might need to complete onboarding
	const hasPerformerProfile = !!performerProfile && !profileError;

	return {
		user: userData,
		authUser: user,
		session,
		performerProfile,
		hasPerformerProfile
	};
};
