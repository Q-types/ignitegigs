import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	// Get search parameters
	const search = url.searchParams.get('q') ?? '';
	const category = url.searchParams.get('category') ?? '';
	const location = url.searchParams.get('location') ?? '';
	const minPrice = url.searchParams.get('minPrice') ?? '';
	const maxPrice = url.searchParams.get('maxPrice') ?? '';
	const sortBy = url.searchParams.get('sort') ?? 'rating';
	const page = parseInt(url.searchParams.get('page') ?? '1');
	const perPage = 12;

	// Build query
	let query = supabase
		.from('performer_profiles')
		.select(
			`
			*,
			user:users!performer_profiles_user_id_fkey(id, full_name, avatar_url),
			primary_media:performer_media!performer_media_performer_id_fkey(
				id, url, thumbnail_url, media_type
			)
		`,
			{ count: 'exact' }
		)
		.eq('is_active', true);

	// Apply filters
	if (search) {
		query = query.or(
			`stage_name.ilike.%${search}%,bio.ilike.%${search}%,tagline.ilike.%${search}%`
		);
	}

	if (category && category !== 'all') {
		query = query.contains('performer_category', [category]);
	}

	if (location) {
		query = query.ilike('location_name', `%${location}%`);
	}

	if (minPrice) {
		query = query.gte('min_rate_pence', parseInt(minPrice) * 100);
	}

	if (maxPrice) {
		query = query.lte('min_rate_pence', parseInt(maxPrice) * 100);
	}

	// Apply sorting
	switch (sortBy) {
		case 'rating':
			query = query.order('avg_rating', { ascending: false }).order('total_reviews', { ascending: false });
			break;
		case 'price-low':
			query = query.order('min_rate_pence', { ascending: true, nullsFirst: false });
			break;
		case 'price-high':
			query = query.order('min_rate_pence', { ascending: false });
			break;
		case 'bookings':
			query = query.order('total_bookings', { ascending: false });
			break;
		case 'newest':
			query = query.order('created_at', { ascending: false });
			break;
		default:
			query = query.order('is_featured', { ascending: false }).order('avg_rating', { ascending: false });
	}

	// Pagination
	const from = (page - 1) * perPage;
	const to = from + perPage - 1;
	query = query.range(from, to);

	const { data: performers, error, count } = await query;

	if (error) {
		console.error('Error fetching performers:', error);
	}

	// Process performers to get primary media
	const processedPerformers = (performers ?? []).map((performer) => {
		const primaryMedia = Array.isArray(performer.primary_media)
			? performer.primary_media.find((m: { media_type: string }) => m.media_type === 'video') ||
			  performer.primary_media[0]
			: null;

		return {
			...performer,
			primary_media: primaryMedia
		};
	});

	return {
		performers: processedPerformers,
		totalCount: count ?? 0,
		page,
		perPage,
		totalPages: Math.ceil((count ?? 0) / perPage),
		filters: {
			search,
			category,
			location,
			minPrice,
			maxPrice,
			sortBy
		}
	};
};
