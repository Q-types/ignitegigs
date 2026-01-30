import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateContract, getCancellationTerms } from '$lib/server/contracts';

export const POST: RequestHandler = async ({ request, locals: { supabase, session } }) => {
	if (!session) throw error(401, 'Unauthorized');

	const { bookingId } = await request.json();
	if (!bookingId) throw error(400, 'Booking ID required');

	// Fetch booking with performer and client details
	const { data: booking, error: bookingError } = await supabase
		.from('bookings')
		.select(`
			*,
			performer:performer_profiles!bookings_performer_id_fkey(
				stage_name, cancellation_policy,
				user:users!performer_profiles_user_id_fkey(full_name)
			),
			client:users!bookings_client_id_fkey(full_name)
		`)
		.eq('id', bookingId)
		.single();

	if (bookingError || !booking) throw error(404, 'Booking not found');

	// Verify user is the performer for this booking
	const { data: profile } = await supabase
		.from('performer_profiles')
		.select('id')
		.eq('user_id', session.user.id)
		.eq('id', booking.performer_id)
		.single();

	if (!profile) throw error(403, 'Only the performer can generate a contract');

	const cancellationPolicy = booking.performer?.cancellation_policy || 'standard';
	const agreedPrice = booking.agreed_price_pence || booking.quoted_price_pence;
	const depositAmount = Math.ceil(agreedPrice * 0.5);

	const contractText = generateContract({
		performerName: booking.performer?.stage_name || booking.performer?.user?.full_name || 'Performer',
		clientName: booking.client?.full_name || 'Client',
		eventDate: booking.event_date,
		eventTime: booking.event_time,
		eventEndTime: booking.event_end_time,
		eventLocation: booking.event_location,
		eventType: booking.event_type,
		eventDetails: booking.event_details,
		agreedPrice,
		depositAmount,
		cancellationPolicy,
		specialRequirements: booking.special_requirements,
		bookingId: booking.id
	});

	// Create contract record
	const { data: contract, error: contractError } = await supabase
		.from('booking_contracts')
		.insert({
			booking_id: bookingId,
			contract_text: contractText,
			cancellation_terms: getCancellationTerms(cancellationPolicy),
			payment_terms: `Total: ${agreedPrice} pence. Deposit: ${depositAmount} pence.`,
			status: 'pending'
		})
		.select()
		.single();

	if (contractError) throw error(500, 'Failed to create contract');

	return json({ contract });
};
