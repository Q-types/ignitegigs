import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';

/**
 * GET /api/user/export
 *
 * GDPR Data Export - returns all user data as a downloadable JSON file.
 * Uses the user's own Supabase client so RLS policies scope data automatically.
 */
export const GET: RequestHandler = async ({ cookies }) => {
	const supabase = createSupabaseServerClient(cookies);

	// Check authentication
	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser();

	if (authError || !user) {
		return json({ error: 'Authentication required' }, { status: 401 });
	}

	try {
		// Fetch all user data in parallel - RLS scopes to authenticated user
		const [
			profileResult,
			performerResult,
			bookingsAsClientResult,
			bookingsAsPerformerResult,
			messagesResult,
			reviewsWrittenResult,
			reviewsReceivedResult
		] = await Promise.all([
			// User profile
			supabase
				.from('users')
				.select('*')
				.eq('id', user.id)
				.single(),

			// Performer profile (if any)
			supabase
				.from('performer_profiles')
				.select('*')
				.eq('user_id', user.id)
				.maybeSingle(),

			// Bookings as client
			supabase
				.from('bookings')
				.select('*')
				.eq('client_id', user.id)
				.order('created_at', { ascending: false }),

			// Bookings as performer (via performer_profiles)
			supabase
				.from('bookings')
				.select('*')
				.eq('performer_id', user.id)
				.order('created_at', { ascending: false }),

			// Messages sent
			supabase
				.from('messages')
				.select('*')
				.eq('sender_id', user.id)
				.order('created_at', { ascending: false }),

			// Reviews written
			supabase
				.from('reviews')
				.select('*')
				.eq('reviewer_id', user.id)
				.order('created_at', { ascending: false }),

			// Reviews received
			supabase
				.from('reviews')
				.select('*')
				.eq('reviewee_id', user.id)
				.order('created_at', { ascending: false })
		]);

		const exportData = {
			exportedAt: new Date().toISOString(),
			exportVersion: '1.0',
			platform: 'IgniteGigs',
			account: {
				authEmail: user.email,
				authId: user.id,
				createdAt: user.created_at
			},
			profile: profileResult.data ?? null,
			performerProfile: performerResult.data ?? null,
			bookings: {
				asClient: bookingsAsClientResult.data ?? [],
				asPerformer: bookingsAsPerformerResult.data ?? []
			},
			messages: messagesResult.data ?? [],
			reviews: {
				written: reviewsWrittenResult.data ?? [],
				received: reviewsReceivedResult.data ?? []
			}
		};

		const jsonString = JSON.stringify(exportData, null, 2);
		const timestamp = new Date().toISOString().split('T')[0];

		return new Response(jsonString, {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Content-Disposition': `attachment; filename="ignitegigs-data-export-${timestamp}.json"`,
				'Cache-Control': 'no-store'
			}
		});
	} catch (err) {
		console.error('GDPR data export failed:', err);
		return json({ error: 'Failed to export user data' }, { status: 500 });
	}
};
