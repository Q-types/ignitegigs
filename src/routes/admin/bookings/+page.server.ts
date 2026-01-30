import type { PageServerLoad } from './$types';
import { createAdminClient } from '$lib/server/admin';

const PAGE_SIZE = 25;

export const load: PageServerLoad = async ({ url }) => {
	const supabaseAdmin = createAdminClient();

	const statusFilter = url.searchParams.get('status') ?? 'all';
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
	const offset = (page - 1) * PAGE_SIZE;

	// Build query
	let query = supabaseAdmin
		.from('bookings')
		.select('*', { count: 'exact' })
		.order('created_at', { ascending: false })
		.range(offset, offset + PAGE_SIZE - 1);

	// Filter by status
	if (statusFilter !== 'all') {
		query = query.eq('status', statusFilter);
	}

	const { data: bookings, count, error } = await query;

	if (error) {
		console.error('Admin bookings query error:', error);
	}

	const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);
	const bookingsList = bookings ?? [];

	// Get performer and client names
	const performerIds = [...new Set(bookingsList.map((b) => b.performer_id))];
	const clientIds = [...new Set(bookingsList.map((b) => b.client_id))];
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

	const enrichedBookings = bookingsList.map((b) => ({
		id: b.id,
		status: b.status,
		event_date: b.event_date,
		event_time: b.event_time,
		event_location: b.event_location,
		event_type: b.event_type,
		quoted_price_pence: b.quoted_price_pence,
		agreed_price_pence: b.agreed_price_pence,
		platform_fee_pence: b.platform_fee_pence,
		deposit_paid: b.deposit_paid,
		final_paid: b.final_paid,
		created_at: b.created_at,
		clientName: userMap[b.client_id] ?? 'Unknown Client',
		performerName: performerMap[b.performer_id] || userMap[b.performer_id] || 'Unknown Performer'
	}));

	// Count by status for tabs
	const statusCounts = await Promise.all([
		supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }),
		supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).in('status', ['inquiry', 'pending', 'accepted']),
		supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
		supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
		supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
		supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'disputed')
	]);

	return {
		bookings: enrichedBookings,
		totalCount: count ?? 0,
		currentPage: page,
		totalPages,
		statusFilter,
		statusCounts: {
			all: statusCounts[0].count ?? 0,
			pending: statusCounts[1].count ?? 0,
			confirmed: statusCounts[2].count ?? 0,
			completed: statusCounts[3].count ?? 0,
			cancelled: statusCounts[4].count ?? 0,
			disputed: statusCounts[5].count ?? 0
		}
	};
};
