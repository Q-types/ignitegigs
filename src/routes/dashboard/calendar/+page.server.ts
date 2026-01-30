import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url, parent, locals: { supabase } }) => {
	const { performerProfile } = await parent();

	if (!performerProfile) {
		throw redirect(303, '/dashboard/profile');
	}

	// Get month from URL or default to current month
	const monthParam = url.searchParams.get('month');
	const now = new Date();
	let year: number, month: number;

	if (monthParam) {
		[year, month] = monthParam.split('-').map(Number);
	} else {
		year = now.getFullYear();
		month = now.getMonth() + 1;
	}

	// Get first and last day of month for query
	const firstDay = new Date(year, month - 1, 1).toISOString().split('T')[0];
	const lastDay = new Date(year, month, 0).toISOString().split('T')[0];

	// Fetch availability for this month
	const { data: availability } = await supabase
		.from('availability')
		.select('*')
		.eq('performer_id', performerProfile.id)
		.gte('date', firstDay)
		.lte('date', lastDay);

	// Fetch bookings for this month
	const { data: bookings } = await supabase
		.from('bookings')
		.select('id, event_date, status, event_type, client:users!bookings_client_id_fkey(full_name)')
		.eq('performer_id', performerProfile.id)
		.gte('event_date', firstDay)
		.lte('event_date', lastDay)
		.in('status', ['accepted', 'confirmed', 'completed']);

	return {
		year,
		month,
		availability: availability ?? [],
		bookings: bookings ?? [],
		performerId: performerProfile.id,
		performerProfile
	};
};

export const actions: Actions = {
	updateAvailability: async ({ request, locals: { supabase, session }, parent }) => {
		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const { performerProfile } = await parent();
		if (!performerProfile) {
			return fail(400, { error: 'No performer profile found' });
		}

		const formData = await request.formData();
		const date = formData.get('date') as string;
		const isAvailable = formData.get('isAvailable') === 'true';
		const notes = formData.get('notes') as string;

		if (!date) {
			return fail(400, { error: 'Date is required' });
		}

		// Check if availability record exists
		const { data: existing } = await supabase
			.from('availability')
			.select('id')
			.eq('performer_id', performerProfile.id)
			.eq('date', date)
			.single();

		if (existing) {
			// Update existing
			const { error } = await supabase
				.from('availability')
				.update({
					is_available: isAvailable,
					notes: notes || null
				})
				.eq('id', existing.id);

			if (error) {
				return fail(500, { error: 'Failed to update availability' });
			}
		} else {
			// Create new
			const { error } = await supabase.from('availability').insert({
				performer_id: performerProfile.id,
				date,
				is_available: isAvailable,
				notes: notes || null
			});

			if (error) {
				return fail(500, { error: 'Failed to set availability' });
			}
		}

		return { success: true };
	},

	bulkUpdate: async ({ request, locals: { supabase, session }, parent }) => {
		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const { performerProfile } = await parent();
		if (!performerProfile) {
			return fail(400, { error: 'No performer profile found' });
		}

		const formData = await request.formData();
		const dates = formData.getAll('dates') as string[];
		const isAvailable = formData.get('isAvailable') === 'true';

		if (dates.length === 0) {
			return fail(400, { error: 'No dates selected' });
		}

		// Upsert all dates
		for (const date of dates) {
			const { data: existing } = await supabase
				.from('availability')
				.select('id')
				.eq('performer_id', performerProfile.id)
				.eq('date', date)
				.single();

			if (existing) {
				await supabase
					.from('availability')
					.update({ is_available: isAvailable })
					.eq('id', existing.id);
			} else {
				await supabase.from('availability').insert({
					performer_id: performerProfile.id,
					date,
					is_available: isAvailable
				});
			}
		}

		return { success: true, message: `Updated ${dates.length} dates` };
	},

	updateCancellationPolicy: async ({ request, locals: { supabase, session }, parent }) => {
		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const { performerProfile } = await parent();
		if (!performerProfile) {
			return fail(400, { error: 'No performer profile found' });
		}

		const formData = await request.formData();
		const cancellationPolicy = formData.get('cancellationPolicy') as string;

		if (!['flexible', 'standard', 'strict'].includes(cancellationPolicy)) {
			return fail(400, { error: 'Invalid cancellation policy' });
		}

		const { error } = await supabase
			.from('performer_profiles')
			.update({ cancellation_policy: cancellationPolicy })
			.eq('id', performerProfile.id);

		if (error) {
			return fail(500, { error: 'Failed to update cancellation policy' });
		}

		return { success: true, message: 'Cancellation policy updated!' };
	}
};
