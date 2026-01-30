import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { safeParseInt, sanitizeForLog } from '$lib/server/security';
import { geocodeAddress } from '$lib/server/geocoding';

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
	const { user, performerProfile } = await parent();

	if (!user) {
		throw redirect(303, '/auth/login?redirectTo=/dashboard/onboarding');
	}

	return {
		profile: performerProfile ?? null
	};
};

export const actions: Actions = {
	saveOnboarding: async ({ request, locals: { supabase, session }, parent }) => {
		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const { performerProfile, user } = await parent();
		const formData = await request.formData();

		// Step 1 fields
		const stageName = (formData.get('stageName') as string)?.trim() || '';
		const bio = (formData.get('bio') as string)?.trim() || '';
		const tagline = (formData.get('tagline') as string)?.trim() || '';

		// Step 2 fields
		const categories = formData.getAll('categories') as string[];
		const actTypes = formData.getAll('actTypes') as string[];

		// Step 3 fields
		const locationName = (formData.get('locationName') as string)?.trim() || '';
		const travelRadius = safeParseInt(formData.get('travelRadius') as string, 25);

		// Step 4 fields
		const hourlyRate = formData.get('hourlyRate') as string;
		const eventRate = formData.get('eventRate') as string;
		const showRate = formData.get('showRate') as string;
		const minRate = formData.get('minRate') as string;

		// Validation
		if (!stageName) {
			return fail(400, { error: 'Stage name is required.' });
		}

		if (bio.length < 50) {
			return fail(400, { error: 'Bio must be at least 50 characters.' });
		}

		if (categories.length === 0) {
			return fail(400, { error: 'Please select at least one category.' });
		}

		if (!locationName) {
			return fail(400, { error: 'Location is required.' });
		}

		const profileData: Record<string, unknown> = {
			stage_name: stageName,
			bio: bio || null,
			tagline: tagline || null,
			location_name: locationName,
			travel_radius_miles: Math.max(5, Math.min(200, travelRadius)),
			performer_category: categories,
			act_types: actTypes,
			hourly_rate_pence: hourlyRate ? Math.round(parseFloat(hourlyRate) * 100) : null,
			event_rate_pence: eventRate ? Math.round(parseFloat(eventRate) * 100) : null,
			show_rate_pence: showRate ? Math.round(parseFloat(showRate) * 100) : null,
			min_rate_pence: minRate ? Math.round(parseFloat(minRate) * 100) : null,
			profile_complete: true,
			is_active: true
		};

		// Geocode the location to get lat/lng coordinates
		const geocoded = await geocodeAddress(locationName);
		if (geocoded) {
			profileData.location_lat = geocoded.lat;
			profileData.location_lng = geocoded.lng;
		} else {
			console.warn(`Could not geocode location during onboarding: "${locationName}"`);
		}

		if (performerProfile) {
			// Update existing profile
			const { error } = await supabase
				.from('performer_profiles')
				.update(profileData)
				.eq('id', performerProfile.id);

			if (error) {
				console.error('Onboarding update error:', sanitizeForLog(error));
				return fail(500, { error: 'Failed to save profile. Please try again.' });
			}
		} else {
			// Create new profile
			const { error } = await supabase.from('performer_profiles').insert({
				user_id: session.user.id,
				...profileData
			});

			if (error) {
				console.error('Onboarding create error:', sanitizeForLog(error));
				return fail(500, { error: 'Failed to create profile. Please try again.' });
			}

			// Update user_type to 'performer' or 'both' if they were a client
			if (user?.user_type === 'client') {
				await supabase
					.from('users')
					.update({ user_type: 'both' })
					.eq('id', session.user.id);
			}
		}

		throw redirect(303, '/dashboard');
	}
};
