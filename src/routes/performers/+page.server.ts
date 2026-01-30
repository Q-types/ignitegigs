import type { PageServerLoad } from './$types';
import { safeParseInt, sanitizeForLog } from '$lib/server/security';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	// Get search parameters
	const search = url.searchParams.get('q') ?? '';
	const category = url.searchParams.get('category') ?? '';
	const location = url.searchParams.get('location') ?? '';
	const minPrice = url.searchParams.get('minPrice') ?? '';
	const maxPrice = url.searchParams.get('maxPrice') ?? '';
	const sortBy = url.searchParams.get('sort') ?? 'rating';
	const page = safeParseInt(url.searchParams.get('page'), 1);
	const perPage = 12;

	// New filter parameters
	const minRating = url.searchParams.get('minRating') ?? '';
	const availableDate = url.searchParams.get('availableDate') ?? '';
	const verified = url.searchParams.get('verified') ?? 'all';

	// Geolocation parameters
	const lat = url.searchParams.get('lat') ?? '';
	const lng = url.searchParams.get('lng') ?? '';
	const radius = url.searchParams.get('radius') ?? '25';

	// Handle availability date filter - get unavailable performer IDs first
	let unavailableIds: string[] = [];
	if (availableDate) {
		const { data: unavailable } = await supabase
			.from('availability')
			.select('performer_id')
			.eq('date', availableDate)
			.or('is_available.eq.false,is_booked.eq.true');

		unavailableIds = (unavailable || []).map((a: { performer_id: string }) => a.performer_id);
	}

	// Geolocation search - get nearby performer IDs via PostGIS RPC
	let nearbyPerformerIds: string[] | null = null;
	let nearbyDistances: Record<string, number> = {};
	if (lat && lng) {
		const { data: nearbyIds, error: geoError } = await supabase.rpc('nearby_performers', {
			lat: parseFloat(lat),
			lng: parseFloat(lng),
			radius_miles: parseInt(radius || '25')
		});

		if (geoError) {
			console.error('Geolocation search error:', sanitizeForLog(geoError));
		} else if (nearbyIds?.length) {
			nearbyPerformerIds = nearbyIds.map((n: { performer_id: string }) => n.performer_id);
			// Store distances for client-side display
			nearbyDistances = Object.fromEntries(
				nearbyIds.map((n: { performer_id: string; distance_miles: number }) => [
					n.performer_id,
					Math.round(n.distance_miles * 10) / 10
				])
			);
		} else {
			// No nearby performers found - set to empty to return zero results
			nearbyPerformerIds = [];
		}
	}

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

	// Apply search filter
	if (search) {
		query = query.or(
			`stage_name.ilike.%${search}%,bio.ilike.%${search}%,tagline.ilike.%${search}%`
		);
	}

	// Apply category filter
	if (category && category !== 'all') {
		query = query.contains('performer_category', [category]);
	}

	// Apply location filter - prefer geolocation when lat/lng are provided
	if (nearbyPerformerIds !== null) {
		if (nearbyPerformerIds.length > 0) {
			query = query.in('id', nearbyPerformerIds);
		} else {
			// No nearby performers - force empty result
			query = query.in('id', ['00000000-0000-0000-0000-000000000000']);
		}
	} else if (location) {
		query = query.ilike('location_name', `%${location}%`);
	}

	// Apply price filters
	if (minPrice) {
		query = query.gte('min_rate_pence', safeParseInt(minPrice, 0) * 100);
	}

	if (maxPrice) {
		query = query.lte('min_rate_pence', safeParseInt(maxPrice, 0) * 100);
	}

	// Apply rating filter
	if (minRating) {
		query = query.gte('avg_rating', parseFloat(minRating));
	}

	// Apply availability date filter - exclude unavailable performers
	if (availableDate && unavailableIds.length > 0) {
		query = query.not('id', 'in', `(${unavailableIds.join(',')})`);
	}

	// Apply verification tier filter
	// Only show insured/verified performers by default
	if (!verified || verified === 'all') {
		query = query.in('verification_tier', ['insured', 'verified_pro']);
	} else {
		query = query.eq('verification_tier', verified);
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
		case 'distance':
			// Distance sorting is handled client-side since PostGIS returns ordered results
			// and the query.in() preserves no specific order. We'll sort after fetch.
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
		console.error('Error fetching performers:', sanitizeForLog(error));
	}

	// Process performers to get primary media and attach distance info
	let processedPerformers = (performers ?? []).map((performer) => {
		const primaryMedia = Array.isArray(performer.primary_media)
			? performer.primary_media.find((m: { media_type: string }) => m.media_type === 'video') ||
			  performer.primary_media[0]
			: null;

		return {
			...performer,
			primary_media: primaryMedia,
			distance_miles: nearbyDistances[performer.id] ?? null
		};
	});

	// Sort by distance when geo search is active and sort is 'distance' or default
	if (nearbyPerformerIds !== null && (sortBy === 'distance' || sortBy === 'rating')) {
		processedPerformers.sort((a, b) => {
			const distA = a.distance_miles ?? Infinity;
			const distB = b.distance_miles ?? Infinity;
			return distA - distB;
		});
	}

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
			sortBy,
			minRating,
			availableDate,
			verified,
			lat,
			lng,
			radius
		},
		isGeoSearch: nearbyPerformerIds !== null
	};
};
