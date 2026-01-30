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

	// Determine role booleans based on user_type and performer profile existence
	const userType = userData?.user_type || 'client';
	const isPerformer = userType === 'performer' || userType === 'both' || hasPerformerProfile;
	const isClient = userType === 'client' || userType === 'both' || !hasPerformerProfile;

	// Fetch client bookings count for nav badge (if user is a client)
	let clientBookingsCount = 0;
	if (isClient && userData) {
		const { count } = await locals.supabase
			.from('bookings')
			.select('*', { count: 'exact', head: true })
			.eq('client_id', userData.id)
			.in('status', ['inquiry', 'pending', 'accepted', 'confirmed']);

		clientBookingsCount = count ?? 0;
	}

	// Check if performer needs onboarding
	// Only flag if they are a performer (or 'both') without a profile, and not already on the onboarding page
	const needsOnboarding =
		(userType === 'performer' || userType === 'both') && !hasPerformerProfile;

	return {
		user: userData,
		authUser: user,
		session,
		performerProfile,
		hasPerformerProfile,
		isClient,
		isPerformer,
		clientBookingsCount,
		needsOnboarding
	};
};
