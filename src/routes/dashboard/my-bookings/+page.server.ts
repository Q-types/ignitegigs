import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, url, locals: { supabase } }) => {
	const { user, isClient } = await parent();

	if (!user) {
		throw redirect(303, '/auth/login?redirectTo=/dashboard/my-bookings');
	}

	// Get status filter from query params
	const statusFilter = url.searchParams.get('status') || 'all';

	// Build query for client bookings
	let query = supabase
		.from('bookings')
		.select(
			`
			*,
			performer:performer_profiles!bookings_performer_id_fkey(
				id,
				stage_name,
				performer_category,
				avg_rating,
				total_reviews,
				user:users!performer_profiles_user_id_fkey(
					full_name,
					avatar_url
				)
			)
		`
		)
		.eq('client_id', user.id);

	// Apply status filter
	if (statusFilter !== 'all') {
		if (statusFilter === 'active') {
			query = query.in('status', ['inquiry', 'pending', 'accepted', 'confirmed']);
		} else if (statusFilter === 'past') {
			query = query.in('status', ['completed', 'cancelled', 'declined']);
		} else {
			query = query.eq('status', statusFilter);
		}
	}

	// Sort by event_date descending
	const { data: bookings, error } = await query
		.order('event_date', { ascending: false });

	// Get counts for each status tab
	const { data: allBookings } = await supabase
		.from('bookings')
		.select('status')
		.eq('client_id', user.id);

	const statusCounts: Record<string, number> = {
		all: 0,
		active: 0,
		inquiry: 0,
		pending: 0,
		accepted: 0,
		confirmed: 0,
		completed: 0,
		cancelled: 0,
		declined: 0,
		past: 0
	};

	if (allBookings) {
		statusCounts.all = allBookings.length;
		for (const b of allBookings) {
			if (b.status in statusCounts) {
				statusCounts[b.status]++;
			}
			if (['inquiry', 'pending', 'accepted', 'confirmed'].includes(b.status)) {
				statusCounts.active++;
			}
			if (['completed', 'cancelled', 'declined'].includes(b.status)) {
				statusCounts.past++;
			}
		}
	}

	// Check which bookings already have a review from the client
	const bookingIds = (bookings ?? []).map((b) => b.id);
	let reviewedBookingIds: string[] = [];

	if (bookingIds.length > 0) {
		const { data: existingReviews } = await supabase
			.from('reviews')
			.select('booking_id')
			.eq('reviewer_id', user.id)
			.in('booking_id', bookingIds);

		reviewedBookingIds = (existingReviews ?? []).map((r) => r.booking_id);
	}

	return {
		bookings: bookings ?? [],
		statusFilter,
		statusCounts,
		reviewedBookingIds
	};
};
