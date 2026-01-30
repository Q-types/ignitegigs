import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

/**
 * DELETE /api/user/delete
 *
 * GDPR Account Deletion - anonymises user data and signs them out.
 * Keeps bookings and reviews for audit trail but strips personal info.
 * Uses service role for admin operations that bypass RLS.
 */
export const DELETE: RequestHandler = async ({ request, cookies }) => {
	const supabase = createSupabaseServerClient(cookies);

	// Check authentication
	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser();

	if (authError || !user) {
		return json({ error: 'Authentication required' }, { status: 401 });
	}

	// Parse and validate confirmation
	let body: { confirm?: boolean };

	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body' }, { status: 400 });
	}

	if (body.confirm !== true) {
		return json(
			{ error: 'Deletion must be confirmed. Send { "confirm": true } in the request body.' },
			{ status: 400 }
		);
	}

	try {
		// Use service role client for admin operations
		const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

		// Anonymise user profile data
		const { error: userUpdateError } = await supabaseAdmin
			.from('users')
			.update({
				full_name: 'Deleted User',
				email: `deleted-${user.id}@removed.ignitegigs.com`,
				phone: null,
				avatar_url: null
			})
			.eq('id', user.id);

		if (userUpdateError) {
			console.error('Failed to anonymise user profile:', userUpdateError);
			return json({ error: 'Failed to process account deletion' }, { status: 500 });
		}

		// Anonymise performer profile if exists
		const { error: performerUpdateError } = await supabaseAdmin
			.from('performer_profiles')
			.update({
				stage_name: 'Deleted Performer',
				bio: null,
				tagline: null,
				is_active: false,
				profile_complete: false
			})
			.eq('user_id', user.id);

		// Performer update is optional - user may not have a performer profile
		if (performerUpdateError && performerUpdateError.code !== 'PGRST116') {
			console.error('Failed to anonymise performer profile:', performerUpdateError);
		}

		// Anonymise messages content (keep records for booking audit trail)
		const { error: messagesError } = await supabaseAdmin
			.from('messages')
			.update({ content: '[Message removed - account deleted]' })
			.eq('sender_id', user.id);

		if (messagesError) {
			console.error('Failed to anonymise messages:', messagesError);
		}

		// Anonymise review content but keep ratings for performer integrity
		const { error: reviewsError } = await supabaseAdmin
			.from('reviews')
			.update({ content: '[Review removed - account deleted]' })
			.eq('reviewer_id', user.id);

		if (reviewsError) {
			console.error('Failed to anonymise reviews:', reviewsError);
		}

		// Delete notification preferences
		await supabaseAdmin
			.from('notification_preferences')
			.delete()
			.eq('user_id', user.id);

		// Delete vouches given by this user's performer profile
		const { data: performerProfile } = await supabaseAdmin
			.from('performer_profiles')
			.select('id')
			.eq('user_id', user.id)
			.maybeSingle();

		if (performerProfile) {
			await supabaseAdmin
				.from('performer_vouches')
				.delete()
				.eq('voucher_id', performerProfile.id);
		}

		// Sign the user out
		await supabase.auth.signOut();

		// Delete the auth user via admin API
		const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

		if (deleteAuthError) {
			console.error('Failed to delete auth user:', deleteAuthError);
			// Non-fatal: data is already anonymised, auth cleanup can be retried
		}

		return json({
			success: true,
			message: 'Your account has been deleted and your personal data has been anonymised.'
		});
	} catch (err) {
		console.error('GDPR account deletion failed:', err);
		return json({ error: 'Failed to delete account. Please contact support.' }, { status: 500 });
	}
};
