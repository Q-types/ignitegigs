import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createNotification } from '$lib/server/notifications';

export const load: PageServerLoad = async ({ params, parent, locals: { supabase } }) => {
	const { user, performerProfile } = await parent();

	if (!user) {
		throw redirect(303, '/auth/login');
	}

	const { id } = params;

	// Fetch booking with related data
	const { data: booking, error: bookingError } = await supabase
		.from('bookings')
		.select(
			`
			*,
			performer:performer_profiles!bookings_performer_id_fkey(
				id, stage_name, location_name,
				user:users!performer_profiles_user_id_fkey(id, full_name, avatar_url, email)
			),
			client:users!bookings_client_id_fkey(id, full_name, avatar_url, email)
		`
		)
		.eq('id', id)
		.single();

	if (bookingError || !booking) {
		throw error(404, 'Booking not found');
	}

	// Check access - user must be either the client or the performer
	const isPerformer = performerProfile?.id === booking.performer_id;
	const isClient = user.id === booking.client_id;

	if (!isPerformer && !isClient) {
		throw error(403, 'You do not have access to this booking');
	}

	// Check if a dispute already exists for this booking
	const { data: existingDispute } = await supabase
		.from('disputes')
		.select('id')
		.eq('booking_id', id)
		.eq('raised_by', user.id)
		.maybeSingle();

	if (existingDispute) {
		throw error(400, 'You have already raised a dispute for this booking');
	}

	return {
		booking,
		isPerformer,
		isClient
	};
};

export const actions: Actions = {
	default: async ({ params, request, locals: { supabase, session }, parent }) => {
		const { user, performerProfile } = await parent();

		if (!session || !user) {
			return fail(401, { error: 'You must be logged in to raise a dispute' });
		}

		const { id } = params;
		const formData = await request.formData();

		const reason = formData.get('reason') as string;
		const description = formData.get('description') as string;
		const evidenceUrlsRaw = formData.get('evidence_urls') as string;

		// Validation
		if (!reason) {
			return fail(400, { error: 'Please select a reason for the dispute', reason, description, evidenceUrlsRaw });
		}

		const validReasons = ['no_show', 'poor_quality', 'safety_concern', 'payment_issue', 'harassment', 'other'];
		if (!validReasons.includes(reason)) {
			return fail(400, { error: 'Invalid dispute reason', reason, description, evidenceUrlsRaw });
		}

		if (!description || description.trim().length < 50) {
			return fail(400, { error: 'Description must be at least 50 characters', reason, description, evidenceUrlsRaw });
		}

		// Fetch booking to determine parties
		const { data: booking, error: bookingError } = await supabase
			.from('bookings')
			.select(
				`
				*,
				performer:performer_profiles!bookings_performer_id_fkey(
					id, user_id
				)
			`
			)
			.eq('id', id)
			.single();

		if (bookingError || !booking) {
			return fail(404, { error: 'Booking not found' });
		}

		// Check access
		const isPerformer = performerProfile?.id === booking.performer_id;
		const isClient = user.id === booking.client_id;

		if (!isPerformer && !isClient) {
			return fail(403, { error: 'You do not have access to this booking' });
		}

		// Determine who the dispute is raised against
		const raisedAgainst = isClient ? booking.performer?.user_id : booking.client_id;

		if (!raisedAgainst) {
			return fail(500, { error: 'Could not determine the other party' });
		}

		// Parse evidence URLs
		const evidenceUrls = evidenceUrlsRaw
			? evidenceUrlsRaw
					.split('\n')
					.map((url: string) => url.trim())
					.filter((url: string) => url.length > 0)
			: [];

		// Check for existing dispute
		const { data: existingDispute } = await supabase
			.from('disputes')
			.select('id')
			.eq('booking_id', id)
			.eq('raised_by', user.id)
			.maybeSingle();

		if (existingDispute) {
			return fail(400, { error: 'You have already raised a dispute for this booking' });
		}

		// Create the dispute
		const { error: insertError } = await supabase.from('disputes').insert({
			booking_id: id,
			raised_by: user.id,
			raised_against: raisedAgainst,
			reason,
			description: description.trim(),
			evidence_urls: evidenceUrls,
			status: 'open'
		});

		if (insertError) {
			console.error('Failed to create dispute:', insertError);
			return fail(500, { error: 'Failed to create dispute. Please try again.' });
		}

		// Update booking status to 'disputed'
		const { error: updateError } = await supabase
			.from('bookings')
			.update({ status: 'disputed' })
			.eq('id', id);

		if (updateError) {
			console.error('Failed to update booking status:', updateError);
		}

		// Notify the other party about the dispute
		await createNotification(supabase, {
			userId: raisedAgainst,
			type: 'dispute',
			title: 'Dispute Filed',
			body: 'A dispute has been raised regarding your booking',
			link: `/dashboard/bookings/${id}`
		});

		throw redirect(303, `/dashboard/bookings/${id}?dispute=filed`);
	}
};
