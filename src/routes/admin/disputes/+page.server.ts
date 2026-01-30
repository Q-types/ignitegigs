import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { Database } from '$lib/types/database';

// Service role client to bypass RLS for admin operations
const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const load: PageServerLoad = async ({ url, locals }) => {
	const { session, user } = await locals.safeGetSession();

	if (!session || !user) {
		throw redirect(303, '/auth/login?redirectTo=/admin/disputes');
	}

	// Fetch user to check admin status
	const { data: userData } = await supabaseAdmin
		.from('users')
		.select('*')
		.eq('id', user.id)
		.single();

	// Simple admin check - in production, use a proper admin role system
	// For now, we allow access (you can add admin_role column or check email domain)

	const statusFilter = url.searchParams.get('status') || 'all';

	// Build query
	let query = supabaseAdmin
		.from('disputes')
		.select(
			`
			*,
			booking:bookings!disputes_booking_id_fkey(
				id, event_date, event_location, event_type,
				quoted_price_pence, agreed_price_pence, status,
				performer_id, client_id
			),
			raiser:users!disputes_raised_by_fkey(id, full_name, email, avatar_url),
			target:users!disputes_raised_against_fkey(id, full_name, email, avatar_url)
		`
		)
		.order('created_at', { ascending: false });

	// Apply status filter
	if (statusFilter !== 'all') {
		query = query.eq('status', statusFilter);
	}

	const { data: disputes, error: disputesError } = await query;

	if (disputesError) {
		console.error('Failed to fetch disputes:', disputesError);
		throw error(500, 'Failed to load disputes');
	}

	// Get counts per status for filter badges
	const { data: allDisputes } = await supabaseAdmin
		.from('disputes')
		.select('status');

	const statusCounts: Record<string, number> = {
		all: allDisputes?.length ?? 0,
		open: 0,
		under_review: 0,
		resolved_refund: 0,
		resolved_warning: 0,
		resolved_no_action: 0,
		closed: 0
	};

	allDisputes?.forEach((d) => {
		if (d.status in statusCounts) {
			statusCounts[d.status]++;
		}
	});

	return {
		disputes: disputes ?? [],
		statusFilter,
		statusCounts,
		adminUser: userData
	};
};
