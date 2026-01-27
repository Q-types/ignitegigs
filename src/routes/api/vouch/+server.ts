import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createSupabaseServerClient } from '$lib/server/supabase';

/**
 * POST /api/vouch
 *
 * Creates a vouch from the current user for a performer.
 * Requirements:
 * - User must be authenticated
 * - User must have a complete performer profile
 * - User cannot vouch for themselves
 * - User can only vouch for a performer once
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
	const supabase = createSupabaseServerClient(cookies);

	// Check authentication
	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser();

	if (authError || !user) {
		return json({ error: 'Authentication required' }, { status: 401 });
	}

	// Parse request body
	let body: {
		performerId?: string;
		vouchType?: string;
		message?: string | null;
	};

	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body' }, { status: 400 });
	}

	const { performerId, vouchType, message } = body;

	// Validate required fields
	if (!performerId) {
		return json({ error: 'Performer ID is required' }, { status: 400 });
	}

	// Validate vouch type
	const validVouchTypes = ['skill', 'professionalism', 'safety', 'reliability'];
	if (!vouchType || !validVouchTypes.includes(vouchType)) {
		return json(
			{ error: 'Invalid vouch type. Must be one of: skill, professionalism, safety, reliability' },
			{ status: 400 }
		);
	}

	// Validate message length
	if (message && message.length > 500) {
		return json({ error: 'Message must be 500 characters or less' }, { status: 400 });
	}

	// Get the current user's performer profile
	const { data: voucherProfile, error: voucherError } = await supabase
		.from('performer_profiles')
		.select('id, profile_complete')
		.eq('user_id', user.id)
		.single();

	if (voucherError || !voucherProfile) {
		return json(
			{ error: 'You must have a performer profile to vouch for others' },
			{ status: 403 }
		);
	}

	// Check if profile is complete
	if (!voucherProfile.profile_complete) {
		return json(
			{ error: 'You must complete your performer profile before vouching for others' },
			{ status: 403 }
		);
	}

	// Check if trying to vouch for self
	if (voucherProfile.id === performerId) {
		return json({ error: 'You cannot vouch for yourself' }, { status: 400 });
	}

	// Verify the target performer exists
	const { data: targetProfile, error: targetError } = await supabase
		.from('performer_profiles')
		.select('id, is_active')
		.eq('id', performerId)
		.single();

	if (targetError || !targetProfile) {
		return json({ error: 'Performer not found' }, { status: 404 });
	}

	if (!targetProfile.is_active) {
		return json({ error: 'Cannot vouch for an inactive performer' }, { status: 400 });
	}

	// Check if already vouched
	const { data: existingVouch } = await supabase
		.from('performer_vouches')
		.select('id')
		.eq('voucher_id', voucherProfile.id)
		.eq('vouchee_id', performerId)
		.single();

	if (existingVouch) {
		return json({ error: 'You have already vouched for this performer' }, { status: 409 });
	}

	// Create the vouch
	const { data: newVouch, error: insertError } = await supabase
		.from('performer_vouches')
		.insert({
			voucher_id: voucherProfile.id,
			vouchee_id: performerId,
			vouch_type: vouchType,
			message: message || null
		})
		.select('id, vouch_type, message, created_at')
		.single();

	if (insertError) {
		console.error('Failed to create vouch:', insertError);

		// Handle unique constraint violation
		if (insertError.code === '23505') {
			return json({ error: 'You have already vouched for this performer' }, { status: 409 });
		}

		// Handle check constraint violation (self-vouch)
		if (insertError.code === '23514') {
			return json({ error: 'Invalid vouch operation' }, { status: 400 });
		}

		return json({ error: 'Failed to create vouch' }, { status: 500 });
	}

	// Get updated vouch count for the performer
	const { data: updatedProfile } = await supabase
		.from('performer_profiles')
		.select('vouch_count, community_trusted')
		.eq('id', performerId)
		.single();

	return json(
		{
			success: true,
			vouch: newVouch,
			performer: {
				vouchCount: updatedProfile?.vouch_count ?? 1,
				communityTrusted: updatedProfile?.community_trusted ?? false
			}
		},
		{ status: 201 }
	);
};

/**
 * DELETE /api/vouch
 *
 * Removes a vouch from the current user for a performer.
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

	// Parse request body
	let body: { performerId?: string };

	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body' }, { status: 400 });
	}

	const { performerId } = body;

	if (!performerId) {
		return json({ error: 'Performer ID is required' }, { status: 400 });
	}

	// Get the current user's performer profile
	const { data: voucherProfile, error: voucherError } = await supabase
		.from('performer_profiles')
		.select('id')
		.eq('user_id', user.id)
		.single();

	if (voucherError || !voucherProfile) {
		return json({ error: 'Performer profile not found' }, { status: 404 });
	}

	// Delete the vouch
	const { error: deleteError } = await supabase
		.from('performer_vouches')
		.delete()
		.eq('voucher_id', voucherProfile.id)
		.eq('vouchee_id', performerId);

	if (deleteError) {
		console.error('Failed to delete vouch:', deleteError);
		return json({ error: 'Failed to remove vouch' }, { status: 500 });
	}

	// Get updated vouch count
	const { data: updatedProfile } = await supabase
		.from('performer_profiles')
		.select('vouch_count, community_trusted')
		.eq('id', performerId)
		.single();

	return json({
		success: true,
		performer: {
			vouchCount: updatedProfile?.vouch_count ?? 0,
			communityTrusted: updatedProfile?.community_trusted ?? false
		}
	});
};
