import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	sendBookingAcceptedEmail,
	sendBookingDeclinedEmail,
	sendBookingCancelledEmail
} from '$lib/server/email';

export const load: PageServerLoad = async ({ params, url, parent, locals: { supabase } }) => {
	const { user, performerProfile } = await parent();

	if (!user) {
		throw redirect(303, '/auth/login');
	}

	const { id } = params;
	const isNew = url.searchParams.get('new') === 'true';

	// Fetch booking with related data
	const { data: booking, error: bookingError } = await supabase
		.from('bookings')
		.select(
			`
			*,
			performer:performer_profiles!bookings_performer_id_fkey(
				id, stage_name, location_name, stripe_account_id, stripe_onboarding_complete,
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

	// Fetch messages for this booking
	const { data: messages } = await supabase
		.from('messages')
		.select(
			`
			*,
			sender:users!messages_sender_id_fkey(id, full_name, avatar_url)
		`
		)
		.eq('booking_id', id)
		.order('created_at', { ascending: true });

	return {
		booking,
		messages: messages ?? [],
		isPerformer,
		isClient,
		isNew
	};
};

export const actions: Actions = {
	// Accept booking request
	accept: async ({ params, locals: { supabase, session }, parent }) => {
		const { performerProfile } = await parent();
		if (!session || !performerProfile) {
			return fail(401, { error: 'Unauthorized' });
		}

		const { id } = params;

		// Update booking status
		const { data: booking, error: updateError } = await supabase
			.from('bookings')
			.update({
				status: 'accepted',
				responded_at: new Date().toISOString()
			})
			.eq('id', id)
			.eq('performer_id', performerProfile.id)
			.select('*, client:users!bookings_client_id_fkey(email, full_name)')
			.single();

		if (updateError || !booking) {
			return fail(500, { error: 'Failed to accept booking' });
		}

		// Send email to client
		if (booking.client?.email) {
			try {
				await sendBookingAcceptedEmail({
					to: booking.client.email,
					clientName: booking.client.full_name,
					performerName: performerProfile.stage_name || 'Performer',
					eventDate: booking.event_date,
					bookingId: booking.id
				});
			} catch (e) {
				console.error('Failed to send acceptance email:', e);
			}
		}

		return { success: true, message: 'Booking accepted!' };
	},

	// Decline booking request
	decline: async ({ params, request, locals: { supabase, session }, parent }) => {
		const { performerProfile } = await parent();
		if (!session || !performerProfile) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const reason = formData.get('reason') as string;

		const { id } = params;

		const { data: booking, error: updateError } = await supabase
			.from('bookings')
			.update({
				status: 'declined',
				responded_at: new Date().toISOString()
			})
			.eq('id', id)
			.eq('performer_id', performerProfile.id)
			.select('*, client:users!bookings_client_id_fkey(email, full_name)')
			.single();

		if (updateError || !booking) {
			return fail(500, { error: 'Failed to decline booking' });
		}

		// Send email to client
		if (booking.client?.email) {
			try {
				await sendBookingDeclinedEmail({
					to: booking.client.email,
					clientName: booking.client.full_name,
					performerName: performerProfile.stage_name || 'Performer',
					eventDate: booking.event_date,
					reason
				});
			} catch (e) {
				console.error('Failed to send decline email:', e);
			}
		}

		return { success: true, message: 'Booking declined' };
	},

	// Cancel booking (by client)
	cancel: async ({ params, request, locals: { supabase, session } }) => {
		if (!session) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const reason = formData.get('reason') as string;

		const { id } = params;

		const { data: booking, error: updateError } = await supabase
			.from('bookings')
			.update({ status: 'cancelled' })
			.eq('id', id)
			.eq('client_id', session.user.id)
			.select('*, performer:performer_profiles!bookings_performer_id_fkey(stage_name, user:users!performer_profiles_user_id_fkey(email, full_name))')
			.single();

		if (updateError || !booking) {
			return fail(500, { error: 'Failed to cancel booking' });
		}

		// Send email to performer
		if (booking.performer?.user?.email) {
			try {
				await sendBookingCancelledEmail({
					to: booking.performer.user.email,
					performerName: booking.performer.stage_name || booking.performer.user.full_name,
					eventDate: booking.event_date,
					reason
				});
			} catch (e) {
				console.error('Failed to send cancellation email:', e);
			}
		}

		return { success: true, message: 'Booking cancelled' };
	},

	// Send message
	message: async ({ params, request, locals: { supabase, session } }) => {
		if (!session) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const content = formData.get('content') as string;

		if (!content?.trim()) {
			return fail(400, { error: 'Message cannot be empty' });
		}

		const { id } = params;

		const { error: messageError } = await supabase.from('messages').insert({
			booking_id: id,
			sender_id: session.user.id,
			content: content.trim()
		});

		if (messageError) {
			return fail(500, { error: 'Failed to send message' });
		}

		return { success: true };
	}
};
