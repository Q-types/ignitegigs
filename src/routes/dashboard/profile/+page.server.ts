import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

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
		const travelRadius = parseInt(formData.get('travelRadius') as string) || 25;
		const categories = formData.getAll('categories') as string[];
		const actTypes = formData.getAll('actTypes') as string[];
		const hourlyRate = formData.get('hourlyRate') as string;
		const eventRate = formData.get('eventRate') as string;
		const minRate = formData.get('minRate') as string;

		// Validation
		if (!locationName) {
			return fail(400, { error: 'Location is required' });
		}

		if (categories.length === 0) {
			return fail(400, { error: 'Please select at least one category' });
		}

		const profileData = {
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
			profile_complete: !!(stageName && bio && locationName && categories.length > 0),
			is_active: !!(stageName && bio && locationName && categories.length > 0)
		};

		if (performerProfile) {
			// Update existing profile
			const { error } = await supabase
				.from('performer_profiles')
				.update(profileData)
				.eq('id', performerProfile.id);

			if (error) {
				console.error('Profile update error:', error);
				return fail(500, { error: 'Failed to update profile' });
			}
		} else {
			// Create new profile
			const { error } = await supabase.from('performer_profiles').insert({
				user_id: session.user.id,
				...profileData
			});

			if (error) {
				console.error('Profile create error:', error);
				return fail(500, { error: 'Failed to create profile' });
			}
		}

		return { success: true, message: 'Profile updated successfully!' };
	}
};
