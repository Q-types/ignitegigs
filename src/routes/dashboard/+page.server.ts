import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
	const { user, performerProfile, isPerformer, isClient } = await parent();

	if (!user) {
		return {
			stats: null,
			clientStats: null,
			recentBookings: [],
			upcomingEvents: []
		};
	}

	// Fetch stats based on user type
	const performerId = performerProfile?.id;

	// Performer stats
	let bookingStats = {
		pending: 0,
		upcoming: 0,
		completed: 0,
		totalEarnings: 0
	};

	if (isPerformer && performerId) {
		const { data: bookings } = await supabase
			.from('bookings')
			.select('status, agreed_price_pence, performer_payout_pence')
			.eq('performer_id', performerId);

		if (bookings) {
			bookingStats.pending = bookings.filter((b) => ['inquiry', 'pending'].includes(b.status)).length;
			bookingStats.upcoming = bookings.filter((b) => ['accepted', 'confirmed'].includes(b.status)).length;
			bookingStats.completed = bookings.filter((b) => b.status === 'completed').length;
			bookingStats.totalEarnings = bookings
				.filter((b) => b.status === 'completed')
				.reduce((sum, b) => sum + (b.performer_payout_pence || 0), 0);
		}
	}

	// Client stats
	let clientStats = {
		pending: 0,
		upcoming: 0,
		completed: 0,
		totalSpent: 0
	};

	if (isClient) {
		const { data: clientBookings } = await supabase
			.from('bookings')
			.select('status, quoted_price_pence, agreed_price_pence, deposit_paid')
			.eq('client_id', user.id);

		if (clientBookings) {
			clientStats.pending = clientBookings.filter((b) => ['inquiry', 'pending'].includes(b.status)).length;
			clientStats.upcoming = clientBookings.filter((b) => ['accepted', 'confirmed'].includes(b.status)).length;
			clientStats.completed = clientBookings.filter((b) => b.status === 'completed').length;
			clientStats.totalSpent = clientBookings
				.filter((b) => b.status === 'completed')
				.reduce((sum, b) => sum + (b.agreed_price_pence || b.quoted_price_pence || 0), 0);
		}
	}

	// Get recent bookings - show performer or client bookings depending on role
	let recentBookingsQuery = supabase
		.from('bookings')
		.select(
			`
			*,
			performer:performer_profiles!bookings_performer_id_fkey(
				id, stage_name, user:users!performer_profiles_user_id_fkey(full_name)
			),
			client:users!bookings_client_id_fkey(id, full_name, avatar_url)
		`
		);

	if (isPerformer && performerId) {
		recentBookingsQuery = recentBookingsQuery.or(
			`performer_id.eq.${performerId},client_id.eq.${user.id}`
		);
	} else {
		recentBookingsQuery = recentBookingsQuery.eq('client_id', user.id);
	}

	const { data: recentBookings } = await recentBookingsQuery
		.order('created_at', { ascending: false })
		.limit(5);

	// Get upcoming events (next 30 days)
	const today = new Date().toISOString().split('T')[0];
	const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

	let upcomingQuery = supabase
		.from('bookings')
		.select(
			`
			*,
			performer:performer_profiles!bookings_performer_id_fkey(
				id, stage_name, user:users!performer_profiles_user_id_fkey(full_name)
			),
			client:users!bookings_client_id_fkey(id, full_name)
		`
		);

	if (isPerformer && performerId) {
		upcomingQuery = upcomingQuery.or(
			`performer_id.eq.${performerId},client_id.eq.${user.id}`
		);
	} else {
		upcomingQuery = upcomingQuery.eq('client_id', user.id);
	}

	const { data: upcomingEvents } = await upcomingQuery
		.in('status', ['accepted', 'confirmed'])
		.gte('event_date', today)
		.lte('event_date', thirtyDaysLater)
		.order('event_date', { ascending: true })
		.limit(5);

	// Get unread messages count
	const { count: unreadMessages } = await supabase
		.from('messages')
		.select('*', { count: 'exact', head: true })
		.eq('read_at', null)
		.neq('sender_id', user.id);

	return {
		stats: bookingStats,
		clientStats,
		recentBookings: recentBookings ?? [],
		upcomingEvents: upcomingEvents ?? [],
		unreadMessages: unreadMessages ?? 0
	};
};
