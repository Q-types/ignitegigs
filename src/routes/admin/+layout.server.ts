import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { createAdminClient, isAdminEmail } from '$lib/server/admin';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	// Must be authenticated
	if (!session || !user) {
		throw redirect(303, '/auth/login?redirectTo=/admin');
	}

	// Must be an admin (email in ADMIN_EMAILS env var)
	if (!user.email || !isAdminEmail(user.email)) {
		throw redirect(303, '/dashboard');
	}

	// Use service role client for admin-level queries
	const supabaseAdmin = createAdminClient();

	// Fetch high-level platform stats for the sidebar / header
	const [
		{ count: totalUsers },
		{ count: totalPerformers },
		{ count: totalBookings },
		{ count: pendingVerifications },
		{ count: openDisputes }
	] = await Promise.all([
		supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
		supabaseAdmin.from('performer_profiles').select('*', { count: 'exact', head: true }),
		supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }),
		supabaseAdmin
			.from('performer_profiles')
			.select('*', { count: 'exact', head: true })
			.eq('is_verified', false)
			.eq('profile_complete', true),
		supabaseAdmin
			.from('bookings')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'disputed')
	]);

	return {
		session,
		adminUser: user,
		platformStats: {
			totalUsers: totalUsers ?? 0,
			totalPerformers: totalPerformers ?? 0,
			totalBookings: totalBookings ?? 0,
			pendingVerifications: pendingVerifications ?? 0,
			openDisputes: openDisputes ?? 0
		}
	};
};
