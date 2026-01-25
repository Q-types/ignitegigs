import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { sendNewBookingRequestEmail } from '$lib/server/email';

export const load: PageServerLoad = async ({ params, locals: { supabase, session } }) => {
	// Require authentication
	if (!session) {
		throw redirect(303, `/auth/login?redirectTo=/book/${params.performerId}`);
	}

	const { performerId } = params;

	// Fetch performer
	const { data: performer, error: performerError } = await supabase
		.from('performer_profiles')
		.select(
			`
			*,
			user:users!performer_profiles_user_id_fkey(id, full_name, email, avatar_url)
		`
		)
		.eq('id', performerId)
		.eq('is_active', true)
		.single();

	if (performerError || !performer) {
		throw error(404, 'Performer not found');
	}

	// Can't book yourself
	if (performer.user_id === session.user.id) {
		throw redirect(303, `/performers/${performerId}`);
	}

	// Get user's info
	const { data: currentUser } = await supabase
		.from('users')
		.select('*')
		.eq('id', session.user.id)
		.single();

	// Fetch availability for the next 90 days
	const today = new Date().toISOString().split('T')[0];
	const ninetyDaysLater = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

	const { data: availability } = await supabase
		.from('availability')
		.select('*')
		.eq('performer_id', performerId)
		.gte('date', today)
		.lte('date', ninetyDaysLater);

	return {
		performer,
		currentUser,
		availability: availability ?? []
	};
};

export const actions: Actions = {
	default: async ({ request, params, locals: { supabase, session } }) => {
		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const { performerId } = params;
		const formData = await request.formData();

		const eventDate = formData.get('eventDate') as string;
		const eventTime = formData.get('eventTime') as string;
		const eventDuration = parseInt(formData.get('eventDuration') as string) || null;
		const eventLocation = formData.get('eventLocation') as string;
		const eventType = formData.get('eventType') as string;
		const eventDetails = formData.get('eventDetails') as string;
		const guestCount = parseInt(formData.get('guestCount') as string) || null;

		// Validation
		if (!eventDate || !eventLocation) {
			return fail(400, {
				error: 'Please fill in all required fields',
				eventDate,
				eventTime,
				eventLocation,
				eventType,
				eventDetails
			});
		}

		// Validate date is in the future
		const selectedDate = new Date(eventDate);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (selectedDate < today) {
			return fail(400, {
				error: 'Event date must be in the future',
				eventDate,
				eventTime,
				eventLocation,
				eventType,
				eventDetails
			});
		}

		// Fetch performer to get their rate
		const { data: performer } = await supabase
			.from('performer_profiles')
			.select('*, user:users!performer_profiles_user_id_fkey(email, full_name)')
			.eq('id', performerId)
			.single();

		if (!performer) {
			return fail(400, { error: 'Performer not found' });
		}

		// Calculate quoted price (use hourly rate * duration, or event rate, or min rate)
		let quotedPricePence = 0;
		if (eventDuration && performer.hourly_rate_pence) {
			quotedPricePence = performer.hourly_rate_pence * eventDuration;
		} else if (performer.event_rate_pence) {
			quotedPricePence = performer.event_rate_pence;
		} else if (performer.min_rate_pence) {
			quotedPricePence = performer.min_rate_pence;
		} else {
			quotedPricePence = 20000; // Default £200 if no rates set
		}

		// Create booking
		const { data: booking, error: bookingError } = await supabase
			.from('bookings')
			.insert({
				performer_id: performerId,
				client_id: session.user.id,
				status: 'inquiry',
				event_date: eventDate,
				event_time: eventTime || null,
				event_duration_hours: eventDuration,
				event_location: eventLocation,
				event_type: eventType || null,
				event_details: eventDetails || null,
				guest_count: guestCount,
				quoted_price_pence: quotedPricePence
			})
			.select()
			.single();

		if (bookingError) {
			console.error('Error creating booking:', bookingError);
			return fail(500, { error: 'Failed to create booking request. Please try again.' });
		}

		// Get client info for email
		const { data: client } = await supabase
			.from('users')
			.select('full_name, email')
			.eq('id', session.user.id)
			.single();

		// Send email notification to performer
		if (performer.user?.email && client) {
			try {
				await sendNewBookingRequestEmail({
					to: performer.user.email,
					performerName: performer.stage_name || performer.user.full_name,
					clientName: client.full_name,
					eventDate,
					eventLocation,
					bookingId: booking.id
				});
			} catch (emailError) {
				console.error('Failed to send booking notification email:', emailError);
				// Don't fail the booking just because email failed
			}
		}

		// Redirect to confirmation page or messages
		throw redirect(303, `/dashboard/bookings/${booking.id}?new=true`);
	}
};
