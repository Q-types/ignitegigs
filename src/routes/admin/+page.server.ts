import type { PageServerLoad } from './$types';
import { createAdminClient } from '$lib/server/admin';

export const load: PageServerLoad = async () => {
	const supabaseAdmin = createAdminClient();

	// Run all stats queries in parallel
	const [
		{ count: totalUsers },
		{ count: totalPerformers },
		{ count: totalBookings },
		{ count: pendingBookings },
		{ count: confirmedBookings },
		{ count: completedBookings },
		{ count: cancelledBookings },
		{ count: disputedBookings },
		{ count: pendingVerifications },
		revenueResult,
		recentBookingsResult
	] = await Promise.all([
		supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
		supabaseAdmin.from('performer_profiles').select('*', { count: 'exact', head: true }),
		supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }),
		supabaseAdmin
			.from('bookings')
			.select('*', { count: 'exact', head: true })
			.in('status', ['inquiry', 'pending', 'accepted']),
		supabaseAdmin
			.from('bookings')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'confirmed'),
		supabaseAdmin
			.from('bookings')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'completed'),
		supabaseAdmin
			.from('bookings')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'cancelled'),
		supabaseAdmin
			.from('bookings')
			.select('*', { count: 'exact', head: true })
			.eq('status', 'disputed'),
		supabaseAdmin
			.from('performer_profiles')
			.select('*', { count: 'exact', head: true })
			.eq('is_verified', false)
			.eq('profile_complete', true),
		// Sum platform fees for revenue
		supabaseAdmin
			.from('bookings')
			.select('platform_fee_pence')
			.not('platform_fee_pence', 'is', null),
		// Recent bookings with performer and client info
		supabaseAdmin
			.from('bookings')
			.select('id, status, event_date, event_location, quoted_price_pence, agreed_price_pence, platform_fee_pence, created_at, performer_id, client_id')
			.order('created_at', { ascending: false })
			.limit(10)
	]);

	// Calculate total revenue from platform fees
	let totalRevenuePence = 0;
	if (revenueResult.data) {
		totalRevenuePence = revenueResult.data.reduce(
			(sum, row) => sum + (row.platform_fee_pence ?? 0),
			0
		);
	}

	// Get performer and client names for recent bookings
	const recentBookings = recentBookingsResult.data ?? [];
	const performerIds = [...new Set(recentBookings.map((b) => b.performer_id))];
	const clientIds = [...new Set(recentBookings.map((b) => b.client_id))];
	const allUserIds = [...new Set([...performerIds, ...clientIds])];

	let userMap: Record<string, string> = {};
	let performerMap: Record<string, string> = {};

	if (allUserIds.length > 0) {
		const { data: users } = await supabaseAdmin
			.from('users')
			.select('id, full_name')
			.in('id', allUserIds);

		if (users) {
			userMap = Object.fromEntries(users.map((u) => [u.id, u.full_name]));
		}
	}

	if (performerIds.length > 0) {
		const { data: performers } = await supabaseAdmin
			.from('performer_profiles')
			.select('user_id, stage_name')
			.in('user_id', performerIds);

		if (performers) {
			performerMap = Object.fromEntries(
				performers.map((p) => [p.user_id, p.stage_name ?? ''])
			);
		}
	}

	const enrichedBookings = recentBookings.map((b) => ({
		...b,
		clientName: userMap[b.client_id] ?? 'Unknown Client',
		performerName: performerMap[b.performer_id] || userMap[b.performer_id] || 'Unknown Performer'
	}));

	return {
		stats: {
			totalUsers: totalUsers ?? 0,
			totalPerformers: totalPerformers ?? 0,
			totalBookings: totalBookings ?? 0,
			pendingBookings: pendingBookings ?? 0,
			confirmedBookings: confirmedBookings ?? 0,
			completedBookings: completedBookings ?? 0,
			cancelledBookings: cancelledBookings ?? 0,
			disputedBookings: disputedBookings ?? 0,
			pendingVerifications: pendingVerifications ?? 0,
			totalRevenuePence
		},
		recentBookings: enrichedBookings
	};
};
