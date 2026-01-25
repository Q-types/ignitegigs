import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { supabase, session } }) => {
	const { id } = params;

	// Fetch performer profile with related data
	const { data: performer, error: performerError } = await supabase
		.from('performer_profiles')
		.select(
			`
			*,
			user:users!performer_profiles_user_id_fkey(id, full_name, avatar_url, email)
		`
		)
		.eq('id', id)
		.eq('is_active', true)
		.single();

	if (performerError || !performer) {
		throw error(404, 'Performer not found');
	}

	// Fetch performer media
	const { data: media } = await supabase
		.from('performer_media')
		.select('*')
		.eq('performer_id', id)
		.order('is_primary', { ascending: false })
		.order('sort_order', { ascending: true });

	// Fetch reviews
	const { data: reviews } = await supabase
		.from('reviews')
		.select(
			`
			*,
			reviewer:users!reviews_reviewer_id_fkey(id, full_name, avatar_url)
		`
		)
		.eq('reviewee_id', performer.user_id)
		.eq('is_public', true)
		.order('created_at', { ascending: false })
		.limit(10);

	// Fetch availability (next 60 days)
	const today = new Date().toISOString().split('T')[0];
	const sixtyDaysLater = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

	const { data: availability } = await supabase
		.from('availability')
		.select('*')
		.eq('performer_id', id)
		.gte('date', today)
		.lte('date', sixtyDaysLater)
		.order('date', { ascending: true });

	// Check if current user has saved this performer
	let isSaved = false;
	if (session?.user) {
		const { data: savedData } = await supabase
			.from('saved_performers')
			.select('id')
			.eq('user_id', session.user.id)
			.eq('performer_id', id)
			.single();

		isSaved = !!savedData;
	}

	return {
		performer,
		media: media ?? [],
		reviews: reviews ?? [],
		availability: availability ?? [],
		isSaved,
		isOwnProfile: session?.user?.id === performer.user_id
	};
};
