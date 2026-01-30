import type { PageServerLoad } from './$types';
import { createAdminClient } from '$lib/server/admin';

const PAGE_SIZE = 25;

export const load: PageServerLoad = async ({ url }) => {
	const supabaseAdmin = createAdminClient();

	const search = url.searchParams.get('search')?.trim() ?? '';
	const userType = url.searchParams.get('type') ?? 'all';
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
	const offset = (page - 1) * PAGE_SIZE;

	// Build query
	let query = supabaseAdmin
		.from('users')
		.select('*', { count: 'exact' })
		.order('created_at', { ascending: false })
		.range(offset, offset + PAGE_SIZE - 1);

	// Filter by user_type
	if (userType === 'performer' || userType === 'client' || userType === 'both') {
		query = query.eq('user_type', userType);
	}

	// Search by name or email
	if (search) {
		query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
	}

	const { data: users, count, error } = await query;

	if (error) {
		console.error('Admin users query error:', error);
	}

	const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

	return {
		users: users ?? [],
		totalCount: count ?? 0,
		currentPage: page,
		totalPages,
		search,
		userType
	};
};
