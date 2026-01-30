import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';

/**
 * GET /api/notifications
 *
 * Fetch the authenticated user's notifications with pagination.
 * Query params:
 *   - limit: number (default 20, max 50)
 *   - offset: number (default 0)
 *   - unread_only: boolean (default false)
 */
export const GET: RequestHandler = async ({ url, cookies }) => {
	const supabase = createSupabaseServerClient(cookies);

	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser();

	if (authError || !user) {
		return json({ error: 'Authentication required' }, { status: 401 });
	}

	const limit = Math.min(Number(url.searchParams.get('limit') || '20'), 50);
	const offset = Number(url.searchParams.get('offset') || '0');
	const unreadOnly = url.searchParams.get('unread_only') === 'true';

	let query = supabase
		.from('notifications')
		.select('*', { count: 'exact' })
		.eq('user_id', user.id)
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1);

	if (unreadOnly) {
		query = query.eq('read', false);
	}

	const { data: notifications, error, count } = await query;

	if (error) {
		console.error('Failed to fetch notifications:', error);
		return json({ error: 'Failed to fetch notifications' }, { status: 500 });
	}

	// Also get unread count
	const { count: unreadCount } = await supabase
		.from('notifications')
		.select('*', { count: 'exact', head: true })
		.eq('user_id', user.id)
		.eq('read', false);

	return json({
		notifications: notifications ?? [],
		total: count ?? 0,
		unread_count: unreadCount ?? 0,
		limit,
		offset
	});
};

/**
 * PATCH /api/notifications
 *
 * Mark notification(s) as read.
 * Body:
 *   - { ids: string[] } to mark specific notifications as read
 *   - { all: true } to mark all notifications as read
 */
export const PATCH: RequestHandler = async ({ request, cookies }) => {
	const supabase = createSupabaseServerClient(cookies);

	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser();

	if (authError || !user) {
		return json({ error: 'Authentication required' }, { status: 401 });
	}

	let body: { ids?: string[]; all?: boolean };

	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body' }, { status: 400 });
	}

	const { ids, all } = body;

	if (!all && (!ids || !Array.isArray(ids) || ids.length === 0)) {
		return json({ error: 'Provide either { ids: string[] } or { all: true }' }, { status: 400 });
	}

	if (all) {
		// Mark all unread notifications as read for this user
		const { error } = await supabase
			.from('notifications')
			.update({ read: true })
			.eq('user_id', user.id)
			.eq('read', false);

		if (error) {
			console.error('Failed to mark all notifications as read:', error);
			return json({ error: 'Failed to update notifications' }, { status: 500 });
		}

		return json({ success: true, marked: 'all' });
	}

	// Mark specific notifications as read (RLS ensures only own notifications)
	const { error } = await supabase
		.from('notifications')
		.update({ read: true })
		.in('id', ids!)
		.eq('user_id', user.id);

	if (error) {
		console.error('Failed to mark notifications as read:', error);
		return json({ error: 'Failed to update notifications' }, { status: 500 });
	}

	return json({ success: true, marked: ids!.length });
};
