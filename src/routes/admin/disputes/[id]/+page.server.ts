import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { Database } from '$lib/types/database';

// Service role client to bypass RLS for admin operations
const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const load: PageServerLoad = async ({ params, locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/auth/login?redirectTo=/admin/disputes');
	}

	const { id } = params;

	// Fetch the dispute with full details
	const { data: dispute, error: disputeError } = await supabaseAdmin
		.from('disputes')
		.select(
			`
			*,
			booking:bookings!disputes_booking_id_fkey(
				id, event_date, event_time, event_end_time, event_duration_hours,
				event_location, event_type, event_details, guest_count,
				quoted_price_pence, agreed_price_pence, deposit_pence,
				platform_fee_pence, performer_payout_pence,
				deposit_paid, final_paid, status,
				performer_id, client_id,
				cancellation_policy,
				created_at, updated_at
			),
			raiser:users!disputes_raised_by_fkey(id, full_name, email, avatar_url, phone, user_type, created_at),
			target:users!disputes_raised_against_fkey(id, full_name, email, avatar_url, phone, user_type, created_at)
		`
		)
		.eq('id', id)
		.single();

	if (disputeError || !dispute) {
		throw error(404, 'Dispute not found');
	}

	// Fetch performer profile details
	let performerProfile = null;
	if (dispute.booking?.performer_id) {
		const { data } = await supabaseAdmin
			.from('performer_profiles')
			.select('id, stage_name, location_name, is_verified, avg_rating, total_bookings, user_id')
			.eq('id', dispute.booking.performer_id)
			.single();
		performerProfile = data;
	}

	// Fetch messages for this booking
	let messages: Array<Record<string, unknown>> = [];
	if (dispute.booking?.id) {
		const { data: msgs } = await supabaseAdmin
			.from('messages')
			.select(
				`
				*,
				sender:users!messages_sender_id_fkey(id, full_name, avatar_url)
			`
			)
			.eq('booking_id', dispute.booking.id)
			.order('created_at', { ascending: true });

		messages = msgs ?? [];
	}

	// Fetch other disputes for this booking (if any)
	const { data: relatedDisputes } = await supabaseAdmin
		.from('disputes')
		.select('id, raised_by, status, reason, created_at')
		.eq('booking_id', dispute.booking_id)
		.neq('id', id)
		.order('created_at', { ascending: false });

	return {
		dispute,
		performerProfile,
		messages,
		relatedDisputes: relatedDisputes ?? [],
		adminUserId: user.id
	};
};

export const actions: Actions = {
	// Update dispute status
	updateStatus: async ({ params, request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const newStatus = formData.get('status') as string;

		const validStatuses = ['open', 'under_review', 'resolved_refund', 'resolved_warning', 'resolved_no_action', 'closed'];
		if (!validStatuses.includes(newStatus)) {
			return fail(400, { error: 'Invalid status' });
		}

		const isResolved = newStatus.startsWith('resolved_') || newStatus === 'closed';

		const updateData: Record<string, unknown> = {
			status: newStatus
		};

		if (isResolved) {
			updateData.resolved_by = user.id;
			updateData.resolved_at = new Date().toISOString();
		}

		const { error: updateError } = await supabaseAdmin
			.from('disputes')
			.update(updateData)
			.eq('id', params.id);

		if (updateError) {
			console.error('Failed to update dispute status:', updateError);
			return fail(500, { error: 'Failed to update status' });
		}

		return { success: true, message: `Status updated to ${newStatus.replace(/_/g, ' ')}` };
	},

	// Add admin notes
	addNotes: async ({ params, request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const adminNotes = formData.get('admin_notes') as string;

		if (!adminNotes?.trim()) {
			return fail(400, { error: 'Notes cannot be empty' });
		}

		const { error: updateError } = await supabaseAdmin
			.from('disputes')
			.update({ admin_notes: adminNotes.trim() })
			.eq('id', params.id);

		if (updateError) {
			console.error('Failed to update admin notes:', updateError);
			return fail(500, { error: 'Failed to save notes' });
		}

		return { success: true, message: 'Admin notes saved' };
	},

	// Resolve with refund
	resolveRefund: async ({ params, request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const refundAmountStr = formData.get('refund_amount') as string;
		const resolution = formData.get('resolution') as string;

		if (!refundAmountStr) {
			return fail(400, { error: 'Refund amount is required' });
		}

		const refundAmountPounds = parseFloat(refundAmountStr);
		if (isNaN(refundAmountPounds) || refundAmountPounds <= 0) {
			return fail(400, { error: 'Invalid refund amount' });
		}

		const refundAmountPence = Math.round(refundAmountPounds * 100);

		// Update dispute
		const { error: disputeError } = await supabaseAdmin
			.from('disputes')
			.update({
				status: 'resolved_refund',
				resolution: resolution?.trim() || 'Refund issued to client',
				refund_amount_pence: refundAmountPence,
				resolved_by: user.id,
				resolved_at: new Date().toISOString()
			})
			.eq('id', params.id);

		if (disputeError) {
			console.error('Failed to resolve dispute:', disputeError);
			return fail(500, { error: 'Failed to resolve dispute' });
		}

		// Fetch dispute to get booking_id
		const { data: dispute } = await supabaseAdmin
			.from('disputes')
			.select('booking_id')
			.eq('id', params.id)
			.single();

		// Update the booking refund fields
		if (dispute?.booking_id) {
			await supabaseAdmin
				.from('bookings')
				.update({
					refund_amount_pence: refundAmountPence,
					refund_processed: false
				})
				.eq('id', dispute.booking_id);
		}

		return { success: true, message: `Dispute resolved with refund of \u00A3${refundAmountPounds.toFixed(2)}` };
	},

	// Resolve with warning
	resolveWarning: async ({ params, request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const resolution = formData.get('resolution') as string;

		const { error: updateError } = await supabaseAdmin
			.from('disputes')
			.update({
				status: 'resolved_warning',
				resolution: resolution?.trim() || 'Warning issued to the reported party',
				resolved_by: user.id,
				resolved_at: new Date().toISOString()
			})
			.eq('id', params.id);

		if (updateError) {
			console.error('Failed to resolve dispute:', updateError);
			return fail(500, { error: 'Failed to resolve dispute' });
		}

		return { success: true, message: 'Dispute resolved with warning' };
	},

	// Resolve with no action
	resolveNoAction: async ({ params, request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const resolution = formData.get('resolution') as string;

		const { error: updateError } = await supabaseAdmin
			.from('disputes')
			.update({
				status: 'resolved_no_action',
				resolution: resolution?.trim() || 'No action taken after review',
				resolved_by: user.id,
				resolved_at: new Date().toISOString()
			})
			.eq('id', params.id);

		if (updateError) {
			console.error('Failed to resolve dispute:', updateError);
			return fail(500, { error: 'Failed to resolve dispute' });
		}

		return { success: true, message: 'Dispute resolved with no action' };
	},

	// Close dispute
	closeDispute: async ({ params, request, locals }) => {
		const { session, user } = await locals.safeGetSession();
		if (!session || !user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const resolution = formData.get('resolution') as string;

		const { error: updateError } = await supabaseAdmin
			.from('disputes')
			.update({
				status: 'closed',
				resolution: resolution?.trim() || 'Dispute closed',
				resolved_by: user.id,
				resolved_at: new Date().toISOString()
			})
			.eq('id', params.id);

		if (updateError) {
			console.error('Failed to close dispute:', updateError);
			return fail(500, { error: 'Failed to close dispute' });
		}

		return { success: true, message: 'Dispute closed' };
	}
};
