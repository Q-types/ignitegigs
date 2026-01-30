import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { safeParseInt, sanitizeForLog } from '$lib/server/security';
import { geocodeAddress } from '$lib/server/geocoding';

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
	const { user, performerProfile } = await parent();

	if (!performerProfile) {
		// Create initial profile if doesn't exist
		return {
			profile: null,
			isNewProfile: true
		};
	}

	return {
		profile: performerProfile,
		isNewProfile: false
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals: { supabase, session }, parent }) => {
		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const { performerProfile } = await parent();
		const formData = await request.formData();

		const stageName = formData.get('stageName') as string;
		const bio = formData.get('bio') as string;
		const tagline = formData.get('tagline') as string;
		const locationName = formData.get('locationName') as string;
		const locationLat = formData.get('locationLat') as string;
		const locationLng = formData.get('locationLng') as string;
		const travelRadius = safeParseInt(formData.get('travelRadius') as string, 25);
		const categories = formData.getAll('categories') as string[];
		const actTypes = formData.getAll('actTypes') as string[];
		const hourlyRate = formData.get('hourlyRate') as string;
		const eventRate = formData.get('eventRate') as string;
		const minRate = formData.get('minRate') as string;
		const showRate = formData.get('showRate') as string;

		// Validation
		if (!locationName) {
			return fail(400, { error: 'Location is required' });
		}

		if (categories.length === 0) {
			return fail(400, { error: 'Please select at least one category' });
		}

		const profileData: Record<string, unknown> = {
			stage_name: stageName || null,
			bio: bio || null,
			tagline: tagline || null,
			location_name: locationName,
			travel_radius_miles: travelRadius,
			performer_category: categories,
			act_types: actTypes,
			hourly_rate_pence: hourlyRate ? Math.round(parseFloat(hourlyRate) * 100) : null,
			event_rate_pence: eventRate ? Math.round(parseFloat(eventRate) * 100) : null,
			min_rate_pence: minRate ? Math.round(parseFloat(minRate) * 100) : null,
			show_rate_pence: showRate ? Math.round(parseFloat(showRate) * 100) : null,
			profile_complete: !!(stageName && bio && locationName && categories.length > 0),
			is_active: !!(stageName && bio && locationName && categories.length > 0)
		};

		// Include lat/lng if provided manually via form fields
		if (locationLat && locationLng) {
			const lat = parseFloat(locationLat);
			const lng = parseFloat(locationLng);
			if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
				profileData.location_lat = lat;
				profileData.location_lng = lng;
			}
		}

		// Auto-geocode if location changed and no manual lat/lng was provided
		const locationChanged = !performerProfile || performerProfile.location_name !== locationName;
		if (locationChanged && !profileData.location_lat) {
			const geocoded = await geocodeAddress(locationName);
			if (geocoded) {
				profileData.location_lat = geocoded.lat;
				profileData.location_lng = geocoded.lng;
			} else {
				console.warn(`Could not geocode location for profile save: "${locationName}"`);
			}
		}

		if (performerProfile) {
			// Update existing profile
			const { error } = await supabase
				.from('performer_profiles')
				.update(profileData)
				.eq('id', performerProfile.id);

			if (error) {
				console.error('Profile update error:', sanitizeForLog(error));
				return fail(500, { error: 'Failed to update profile' });
			}
		} else {
			// Create new profile
			const { error } = await supabase.from('performer_profiles').insert({
				user_id: session.user.id,
				...profileData
			});

			if (error) {
				console.error('Profile create error:', sanitizeForLog(error));
				return fail(500, { error: 'Failed to create profile' });
			}
		}

		return { success: true, message: 'Profile updated successfully!' };
	}
};
