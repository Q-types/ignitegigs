import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const category = url.searchParams.get('category') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 12;

	let query = supabase
		.from('blog_posts')
		.select(`
			id, title, slug, excerpt, cover_image_url, category, tags,
			status, published_at, view_count, like_count, is_featured,
			author:users!blog_posts_author_id_fkey(id, full_name, avatar_url)
		`, { count: 'exact' })
		.eq('status', 'published')
		.eq('is_approved', true)
		.order('is_featured', { ascending: false })
		.order('published_at', { ascending: false });

	if (category) {
		query = query.eq('category', category);
	}

	const from = (page - 1) * perPage;
	query = query.range(from, from + perPage - 1);

	const { data: posts, count, error } = await query;

	return {
		posts: posts || [],
		totalCount: count || 0,
		page,
		totalPages: Math.ceil((count || 0) / perPage),
		category
	};
};
