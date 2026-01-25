import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, parent, locals: { supabase } }) => {
	const { user, performerProfile } = await parent();

	if (!user) {
		return { bookings: [], filter: 'all' };
	}

	const filter = url.searchParams.get('filter') ?? 'all';
	const performerId = performerProfile?.id;

	let query = supabase
		.from('bookings')
		.select(
			`
			*,
			performer:performer_profiles!bookings_performer_id_fkey(
				id, stage_name, location_name,
				user:users!performer_profiles_user_id_fkey(full_name, avatar_url)
			),
			client:users!bookings_client_id_fkey(id, full_name, avatar_url, email)
		`
		)
		.or(performerId ? `performer_id.eq.${performerId},client_id.eq.${user.id}` : `client_id.eq.${user.id}`)
		.order('created_at', { ascending: false });

	// Apply status filter
	switch (filter) {
		case 'pending':
			query = query.in('status', ['inquiry', 'pending']);
			break;
		case 'upcoming':
			query = query.in('status', ['accepted', 'confirmed']);
			break;
		case 'completed':
			query = query.eq('status', 'completed');
			break;
		case 'cancelled':
			query = query.in('status', ['cancelled', 'declined']);
			break;
	}

	const { data: bookings, error } = await query;

	if (error) {
		console.error('Error fetching bookings:', error);
	}

	return {
		bookings: bookings ?? [],
		filter,
		isPerformer: !!performerId
	};
};
