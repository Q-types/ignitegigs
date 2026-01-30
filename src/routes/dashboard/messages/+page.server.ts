import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { createNotification } from '$lib/server/notifications';

export const load: PageServerLoad = async ({ url, parent, locals: { supabase } }) => {
	const { user, performerProfile } = await parent();

	if (!user) {
		return { conversations: [], selectedBookingId: null, messages: [] };
	}

	const performerId = performerProfile?.id;

	// Get all bookings that have messages or are active (for conversations list)
	const { data: bookings, error: bookingsError } = await supabase
		.from('bookings')
		.select(`
			id, status, event_date, event_location, event_type, created_at,
			performer:performer_profiles!bookings_performer_id_fkey(
				id, stage_name, location_name,
				user:users!performer_profiles_user_id_fkey(id, full_name, avatar_url)
			),
			client:users!bookings_client_id_fkey(id, full_name, avatar_url, email)
		`)
		.or(performerId ? `performer_id.eq.${performerId},client_id.eq.${user.id}` : `client_id.eq.${user.id}`)
		.in('status', ['inquiry', 'pending', 'accepted', 'confirmed', 'completed'])
		.order('updated_at', { ascending: false });

	if (bookingsError) {
		console.error('Error fetching bookings for messages:', bookingsError);
	}

	// For each booking, get the latest message and unread count
	const conversations = await Promise.all(
		(bookings || []).map(async (booking) => {
			const [latestMsg, unreadCount] = await Promise.all([
				supabase
					.from('messages')
					.select('content, created_at, sender_id')
					.eq('booking_id', booking.id)
					.order('created_at', { ascending: false })
					.limit(1)
					.single(),
				supabase
					.from('messages')
					.select('id', { count: 'exact', head: true })
					.eq('booking_id', booking.id)
					.neq('sender_id', user.id)
					.is('read_at', null)
			]);

			return {
				booking,
				lastMessage: latestMsg.data,
				unreadCount: unreadCount.count || 0
			};
		})
	);

	// Filter to only show bookings that have messages or active status
	const filteredConversations = conversations.filter(
		(c) => c.lastMessage || ['inquiry', 'pending', 'accepted', 'confirmed'].includes(c.booking.status)
	);

	// Sort: unread first, then by latest message
	filteredConversations.sort((a, b) => {
		if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
		if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
		const aDate = a.lastMessage?.created_at || a.booking.created_at;
		const bDate = b.lastMessage?.created_at || b.booking.created_at;
		return new Date(bDate).getTime() - new Date(aDate).getTime();
	});

	// Load messages for selected booking
	const selectedBookingId = url.searchParams.get('booking');
	let messages: any[] = [];

	if (selectedBookingId) {
		const { data: msgs } = await supabase
			.from('messages')
			.select('*, sender:users!messages_sender_id_fkey(id, full_name, avatar_url)')
			.eq('booking_id', selectedBookingId)
			.order('created_at', { ascending: true });

		messages = msgs || [];

		// Mark messages as read
		await supabase
			.from('messages')
			.update({ read_at: new Date().toISOString() })
			.eq('booking_id', selectedBookingId)
			.neq('sender_id', user.id)
			.is('read_at', null);
	}

	return {
		conversations: filteredConversations,
		selectedBookingId,
		messages
	};
};

export const actions: Actions = {
	send: async ({ request, locals: { supabase, session } }) => {
		if (!session) {
			return fail(401, { error: 'You must be logged in to send messages' });
		}

		const formData = await request.formData();
		const content = formData.get('content') as string;
		const bookingId = formData.get('bookingId') as string;

		if (!content?.trim()) {
			return fail(400, { error: 'Message cannot be empty' });
		}

		if (!bookingId) {
			return fail(400, { error: 'No conversation selected' });
		}

		const { error } = await supabase.from('messages').insert({
			booking_id: bookingId,
			sender_id: session.user.id,
			content: content.trim()
		});

		if (error) {
			console.error('Error sending message:', error);
			return fail(500, { error: 'Failed to send message' });
		}

		// Update booking updated_at to sort conversations
		await supabase
			.from('bookings')
			.update({ updated_at: new Date().toISOString() })
			.eq('id', bookingId);

		// Notify the other party about the new message
		const { data: msgBooking } = await supabase
			.from('bookings')
			.select('client_id, performer:performer_profiles!bookings_performer_id_fkey(user_id)')
			.eq('id', bookingId)
			.single();

		if (msgBooking) {
			const recipientId = session.user.id === msgBooking.client_id
				? msgBooking.performer?.user_id
				: msgBooking.client_id;

			if (recipientId) {
				await createNotification(supabase, {
					userId: recipientId,
					type: 'message',
					title: 'New Message',
					body: `${session.user.user_metadata?.full_name || 'Someone'} sent you a message`,
					link: `/dashboard/messages?booking=${bookingId}`
				});
			}
		}

		return { success: true };
	}
};
