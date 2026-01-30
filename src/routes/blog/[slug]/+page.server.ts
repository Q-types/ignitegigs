import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals: { supabase, session } }) => {
	const { data: post, error: postError } = await supabase
		.from('blog_posts')
		.select(`
			*,
			author:users!blog_posts_author_id_fkey(id, full_name, avatar_url)
		`)
		.eq('slug', params.slug)
		.single();

	if (postError || !post) throw error(404, 'Article not found');

	// Only allow viewing published+approved posts (unless author)
	if (post.status !== 'published' || !post.is_approved) {
		if (!session || session.user.id !== post.author_id) {
			throw error(404, 'Article not found');
		}
	}

	// Increment view count (fire and forget)
	supabase.from('blog_posts').update({ view_count: (post.view_count || 0) + 1 }).eq('id', post.id).then(() => {});

	// Fetch comments
	const { data: comments } = await supabase
		.from('blog_comments')
		.select(`
			*,
			author:users!blog_comments_author_id_fkey(id, full_name, avatar_url)
		`)
		.eq('post_id', post.id)
		.eq('is_approved', true)
		.is('parent_id', null)
		.order('created_at', { ascending: true });

	// Fetch replies for each comment
	const commentsWithReplies = await Promise.all(
		(comments || []).map(async (comment) => {
			const { data: replies } = await supabase
				.from('blog_comments')
				.select(`
					*,
					author:users!blog_comments_author_id_fkey(id, full_name, avatar_url)
				`)
				.eq('parent_id', comment.id)
				.eq('is_approved', true)
				.order('created_at', { ascending: true });
			return { ...comment, replies: replies || [] };
		})
	);

	return {
		post,
		comments: commentsWithReplies,
		isAuthor: session?.user.id === post.author_id
	};
};

export const actions: Actions = {
	comment: async ({ request, params, locals: { supabase, session } }) => {
		if (!session) return fail(401, { error: 'Please log in to comment' });

		const formData = await request.formData();
		const content = formData.get('content') as string;
		const parentId = formData.get('parentId') as string | null;

		if (!content || content.trim().length < 1) {
			return fail(400, { error: 'Comment cannot be empty' });
		}

		if (content.length > 2000) {
			return fail(400, { error: 'Comment is too long (max 2000 characters)' });
		}

		// Get the post
		const { data: post } = await supabase
			.from('blog_posts')
			.select('id')
			.eq('slug', params.slug)
			.single();

		if (!post) return fail(404, { error: 'Article not found' });

		const { error: insertError } = await supabase
			.from('blog_comments')
			.insert({
				post_id: post.id,
				author_id: session.user.id,
				parent_id: parentId || null,
				content: content.trim()
			});

		if (insertError) {
			return fail(500, { error: 'Failed to post comment' });
		}

		return { success: true };
	}
};
