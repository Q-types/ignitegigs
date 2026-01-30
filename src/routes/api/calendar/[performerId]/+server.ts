import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

function escapeICalText(text: string): string {
	return text.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function formatICalDate(dateStr: string, timeStr?: string | null): string {
	const date = new Date(dateStr);
	if (timeStr) {
		const [hours, minutes] = timeStr.split(':');
		date.setHours(parseInt(hours), parseInt(minutes));
	}
	return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export const GET: RequestHandler = async ({ params, url }) => {
	const { performerId } = params;
	const token = url.searchParams.get('token');
	const checkDate = url.searchParams.get('date');

	// Use service role to bypass RLS for calendar feed
	const supabase = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

	// If a specific date is requested, return JSON availability check
	if (checkDate) {
		// Validate date format (YYYY-MM-DD)
		if (!/^\d{4}-\d{2}-\d{2}$/.test(checkDate)) {
			return json({ error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
		}

		const { data: existingBooking } = await supabase
			.from('bookings')
			.select('id')
			.eq('performer_id', performerId)
			.eq('event_date', checkDate)
			.not('status', 'in', '("cancelled","declined")')
			.maybeSingle();

		return json({
			date: checkDate,
			performerId,
			isBooked: !!existingBooking
		});
	}

	// Verify performer exists
	const { data: performer, error: performerError } = await supabase
		.from('performer_profiles')
		.select('id, stage_name, user_id, user:users!performer_profiles_user_id_fkey(full_name)')
		.eq('id', performerId)
		.single();

	if (performerError || !performer) {
		throw error(404, 'Performer not found');
	}

	// Fetch confirmed/accepted bookings
	const { data: bookings } = await supabase
		.from('bookings')
		.select(`
			id, event_date, event_time, event_end_time, event_location,
			event_type, event_details, status, guest_count,
			client:users!bookings_client_id_fkey(full_name)
		`)
		.eq('performer_id', performerId)
		.in('status', ['accepted', 'confirmed', 'completed'])
		.gte('event_date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
		.order('event_date', { ascending: true });

	// Fetch blocked dates from availability
	const { data: blockedDates } = await supabase
		.from('availability')
		.select('date, notes')
		.eq('performer_id', performerId)
		.eq('is_available', false)
		.gte('date', new Date().toISOString().split('T')[0]);

	const performerName = performer.stage_name || (performer.user as any)?.full_name || 'Performer';

	// Build iCal content
	let ical = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//IgniteGigs//Booking Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${escapeICalText(performerName)} - IgniteGigs
X-WR-TIMEZONE:Europe/London
REFRESH-INTERVAL;VALUE=DURATION:PT1H
X-PUBLISHED-TTL:PT1H
`;

	// Add bookings as events
	for (const booking of bookings || []) {
		const startDate = formatICalDate(booking.event_date, booking.event_time);
		const endDate = booking.event_end_time
			? formatICalDate(booking.event_date, booking.event_end_time)
			: formatICalDate(booking.event_date, booking.event_time || '23:59');

		const statusEmoji = booking.status === 'confirmed' ? '[CONFIRMED]' : booking.status === 'accepted' ? '[ACCEPTED]' : '[COMPLETED]';
		const clientName = (booking.client as any)?.full_name || 'Client';

		ical += `BEGIN:VEVENT
UID:${booking.id}@ignitegigs.com
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${escapeICalText(`${statusEmoji} Gig - ${clientName}`)}
LOCATION:${escapeICalText(booking.event_location || '')}
DESCRIPTION:${escapeICalText(`Event Type: ${booking.event_type || 'Not specified'}\\nClient: ${clientName}\\nGuests: ${booking.guest_count || 'Not specified'}\\n${booking.event_details || ''}\\n\\nView booking: https://ignitegigs.com/dashboard/bookings/${booking.id}`)}
STATUS:${booking.status === 'confirmed' ? 'CONFIRMED' : 'TENTATIVE'}
END:VEVENT
`;
	}

	// Add blocked dates
	for (const blocked of blockedDates || []) {
		ical += `BEGIN:VEVENT
UID:blocked-${blocked.date}-${performerId}@ignitegigs.com
DTSTART;VALUE=DATE:${blocked.date.replace(/-/g, '')}
DTEND;VALUE=DATE:${blocked.date.replace(/-/g, '')}
SUMMARY:${escapeICalText('Unavailable')}
DESCRIPTION:${escapeICalText(blocked.notes || 'Marked as unavailable')}
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT
`;
	}

	ical += `END:VCALENDAR`;

	// If ?download=true, serve as file attachment; otherwise serve as subscription feed
	const isDownload = url.searchParams.get('download') === 'true';

	const headers: Record<string, string> = {
		'Content-Type': 'text/calendar; charset=utf-8',
		'Cache-Control': 'public, max-age=3600'
	};

	if (isDownload) {
		headers['Content-Disposition'] = `attachment; filename="${performerName.replace(/[^a-zA-Z0-9]/g, '_')}_calendar.ics"`;
	}

	return new Response(ical, { headers });
};
