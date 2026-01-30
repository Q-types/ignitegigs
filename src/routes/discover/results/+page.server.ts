import type { PageServerLoad } from './$types';
import { sanitizeForLog } from '$lib/server/security';

// Map occasion to suggested performer categories
function getOccasionCategories(occasion: string): string[] {
	switch (occasion) {
		case 'wedding':
			return ['fire', 'led', 'circus', 'aerial', 'dance', 'magic', 'stilt', 'walkabout'];
		case 'corporate':
			return ['magic', 'comedy', 'led', 'caricature', 'walkabout', 'circus'];
		case 'birthday':
			return ['fire', 'led', 'magic', 'comedy', 'circus', 'juggling', 'dance'];
		case 'festival':
			return ['fire', 'led', 'stilt', 'circus', 'juggling', 'acrobatics', 'walkabout'];
		case 'private':
			return ['fire', 'led', 'magic', 'comedy', 'dance', 'circus'];
		case 'bar_club':
			return ['fire', 'led', 'dance', 'circus', 'acrobatics'];
		case 'charity':
			return ['fire', 'led', 'magic', 'comedy', 'circus', 'aerial', 'walkabout'];
		default:
			return []; // 'other' or unknown - no category filter
	}
}

// Map vibe to category preferences (ordered by relevance)
function getVibePreferences(vibe: string): { categories: string[]; sortByRating: boolean } {
	switch (vibe) {
		case 'elegant':
			return { categories: ['aerial', 'led', 'dance', 'magic', 'stilt'], sortByRating: true };
		case 'fun':
			return { categories: ['magic', 'comedy', 'juggling', 'caricature', 'walkabout', 'circus'], sortByRating: false };
		case 'wild':
			return { categories: ['fire', 'led', 'circus', 'acrobatics', 'aerial'], sortByRating: false };
		case 'mysterious':
			return { categories: ['fire', 'led', 'magic', 'stilt', 'aerial'], sortByRating: true };
		default:
			return { categories: [], sortByRating: false };
	}
}

// Map venue to preferred act types
function getVenueActTypes(venue: string): string[] {
	switch (venue) {
		case 'indoor':
			return ['stage_show', 'close_up', 'ambient'];
		case 'outdoor':
			return ['walkabout', 'stage_show', 'fire_show', 'led_show'];
		case 'marquee':
			return ['stage_show', 'walkabout', 'ambient'];
		case 'stage':
			return ['stage_show', 'fire_show', 'led_show', 'aerial_show'];
		case 'roaming':
			return ['walkabout', 'close_up', 'roaming'];
		case 'multiple':
			return ['walkabout', 'roaming', 'stage_show', 'ambient'];
		default:
			return [];
	}
}

// Map budget to price range in pence
function getBudgetRange(budget: string): { min: number | null; max: number | null } {
	switch (budget) {
		case 'under200':
			return { min: null, max: 20000 };
		case '200to500':
			return { min: 20000, max: 50000 };
		case '500to1000':
			return { min: 50000, max: 100000 };
		case '1000to2000':
			return { min: 100000, max: 200000 };
		case 'over2000':
			return { min: 200000, max: null };
		default:
			return { min: null, max: null };
	}
}

// Generate match reason based on quiz answers and performer attributes
function getMatchReason(
	performer: {
		performer_category: string[];
		act_types: string[];
		avg_rating: number;
		total_reviews: number;
		min_rate_pence: number | null;
	},
	answers: {
		occasion: string;
		vibe: string;
		venue: string;
		guestCount: string;
		budget: string;
	}
): string {
	const reasons: string[] = [];

	// Category match
	const vibePrefs = getVibePreferences(answers.vibe);
	const matchedCategories = (performer.performer_category || []).filter(
		(c: string) => vibePrefs.categories.includes(c)
	);
	if (matchedCategories.length > 0) {
		const categoryLabel = matchedCategories[0].charAt(0).toUpperCase() + matchedCategories[0].slice(1);
		const vibeLabels: Record<string, string> = {
			elegant: 'elegant',
			fun: 'fun & lively',
			wild: 'high-energy',
			mysterious: 'enchanting'
		};
		reasons.push(`${categoryLabel} performer -- perfect for ${vibeLabels[answers.vibe] || 'your'} vibe`);
	}

	// Venue compatibility
	const venueActTypes = getVenueActTypes(answers.venue);
	const matchedActTypes = (performer.act_types || []).filter(
		(a: string) => venueActTypes.includes(a)
	);
	if (matchedActTypes.length > 0) {
		const venueLabels: Record<string, string> = {
			indoor: 'indoor venues',
			outdoor: 'outdoor events',
			marquee: 'marquee events',
			stage: 'stage shows',
			roaming: 'walkabout entertainment',
			multiple: 'multi-area events'
		};
		reasons.push(`Great for ${venueLabels[answers.venue] || 'your venue'}`);
	}

	// Rating
	if (performer.avg_rating >= 4.5 && performer.total_reviews > 3) {
		reasons.push(`Highly rated (${performer.avg_rating.toFixed(1)} stars)`);
	}

	// Budget fit
	if (performer.min_rate_pence) {
		const budgetRange = getBudgetRange(answers.budget);
		if (budgetRange.max && performer.min_rate_pence <= budgetRange.max) {
			reasons.push('Within your budget');
		}
	}

	if (reasons.length === 0) {
		const occasionLabels: Record<string, string> = {
			wedding: 'weddings',
			corporate: 'corporate events',
			birthday: 'birthday parties',
			festival: 'festivals',
			private: 'private events',
			bar_club: 'venue nights',
			charity: 'charity events',
			other: 'events like yours'
		};
		reasons.push(`Experienced with ${occasionLabels[answers.occasion] || 'events like yours'}`);
	}

	return reasons.slice(0, 2).join('. ') + '.';
}

// Human-readable labels for summary
const occasionLabels: Record<string, string> = {
	wedding: 'Wedding',
	corporate: 'Corporate Event',
	birthday: 'Birthday Party',
	festival: 'Festival',
	private: 'Private Party',
	bar_club: 'Bar/Club Night',
	charity: 'Charity Event',
	other: 'Event'
};

const vibeLabels: Record<string, string> = {
	elegant: 'elegant & sophisticated',
	fun: 'fun & lively',
	wild: 'high energy & wild',
	mysterious: 'mysterious & enchanting'
};

const guestLabels: Record<string, string> = {
	intimate: '1-30',
	medium: '30-100',
	large: '100-300',
	festival: '300+'
};

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	// Parse quiz answers from query params
	const occasion = url.searchParams.get('occasion') ?? '';
	const vibe = url.searchParams.get('vibe') ?? '';
	const venue = url.searchParams.get('venue') ?? '';
	const guestCount = url.searchParams.get('guestCount') ?? '';
	const budget = url.searchParams.get('budget') ?? '';

	// Build combined category filter from occasion + vibe
	const occasionCategories = getOccasionCategories(occasion);
	const vibePrefs = getVibePreferences(vibe);

	// Intersect occasion and vibe categories for relevance, fallback to union
	let targetCategories: string[];
	if (occasionCategories.length > 0 && vibePrefs.categories.length > 0) {
		const intersection = occasionCategories.filter((c) => vibePrefs.categories.includes(c));
		targetCategories = intersection.length > 0 ? intersection : [...new Set([...vibePrefs.categories, ...occasionCategories])];
	} else {
		targetCategories = [...new Set([...occasionCategories, ...vibePrefs.categories])];
	}

	// Get budget range
	const budgetRange = getBudgetRange(budget);

	// Get preferred act types for venue
	const venueActTypes = getVenueActTypes(venue);

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

	// Only show insured/verified performers
	query = query.in('verification_tier', ['insured', 'verified_pro']);

	// Apply category filter - use overlaps for array intersection
	if (targetCategories.length > 0) {
		query = query.overlaps('performer_category', targetCategories);
	}

	// Apply budget filter
	if (budgetRange.max) {
		query = query.lte('min_rate_pence', budgetRange.max);
	}
	if (budgetRange.min) {
		query = query.gte('min_rate_pence', budgetRange.min);
	}

	// Sort by rating for elegant/mysterious vibes, otherwise by bookings (popularity)
	if (vibePrefs.sortByRating) {
		query = query.order('avg_rating', { ascending: false }).order('total_reviews', { ascending: false });
	} else {
		query = query.order('total_bookings', { ascending: false }).order('avg_rating', { ascending: false });
	}

	// Limit results
	query = query.range(0, 11); // Get up to 12 results

	const { data: performers, error, count } = await query;

	if (error) {
		console.error('Error fetching quiz results:', sanitizeForLog(error));
	}

	const answers = { occasion, vibe, venue, guestCount, budget };

	// Process performers and add match reasons
	const processedPerformers = (performers ?? []).map((performer) => {
		const primaryMedia = Array.isArray(performer.primary_media)
			? performer.primary_media.find((m: { media_type: string }) => m.media_type === 'video') ||
			  performer.primary_media[0]
			: null;

		return {
			...performer,
			primary_media: primaryMedia,
			match_reason: getMatchReason(
				{
					performer_category: performer.performer_category,
					act_types: performer.act_types,
					avg_rating: performer.avg_rating,
					total_reviews: performer.total_reviews,
					min_rate_pence: performer.min_rate_pence
				},
				answers
			)
		};
	});

	// Build summary text
	const summaryParts: string[] = [];
	if (occasion && occasionLabels[occasion]) {
		summaryParts.push(occasionLabels[occasion]);
	}
	if (vibe && vibeLabels[vibe]) {
		summaryParts.push(`a ${vibeLabels[vibe]} vibe`);
	}
	if (guestCount && guestLabels[guestCount]) {
		summaryParts.push(`${guestLabels[guestCount]} guests`);
	}

	return {
		performers: processedPerformers,
		totalCount: count ?? 0,
		quizAnswers: answers,
		summary: {
			occasion: occasionLabels[occasion] || 'Event',
			vibe: vibeLabels[vibe] || '',
			guestCount: guestLabels[guestCount] || '',
			budget: budget,
			text: summaryParts.length > 0
				? `Based on your ${summaryParts.join(' with ')}`
				: 'Here are performers we think you will love'
		}
	};
};
