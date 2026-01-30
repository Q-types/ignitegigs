import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';

type NotificationType = 'booking_request' | 'booking_update' | 'message' | 'review' | 'dispute' | 'system' | 'payment';

export async function createNotification(
	supabase: SupabaseClient<Database>,
	{
		userId,
		type,
		title,
		body,
		link
	}: {
		userId: string;
		type: NotificationType;
		title: string;
		body: string;
		link?: string;
	}
) {
	const { error } = await supabase.from('notifications').insert({
		user_id: userId,
		type,
		title,
		body,
		link: link ?? null
	});

	if (error) {
		console.error('Failed to create notification:', error);
	}

	return { error };
}

export async function createBulkNotifications(
	supabase: SupabaseClient<Database>,
	notifications: {
		userId: string;
		type: NotificationType;
		title: string;
		body: string;
		link?: string;
	}[]
) {
	const { error } = await supabase.from('notifications').insert(
		notifications.map((n) => ({
			user_id: n.userId,
			type: n.type,
			title: n.title,
			body: n.body,
			link: n.link ?? null
		}))
	);

	if (error) {
		console.error('Failed to create bulk notifications:', error);
	}

	return { error };
}
