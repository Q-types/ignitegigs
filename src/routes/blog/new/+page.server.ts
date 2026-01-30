import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {
	if (!session) throw redirect(303, '/auth/login?redirectTo=/blog/new');

	// Check if user is a verified performer
	const { data: profile } = await supabase
		.from('performer_profiles')
		.select('id, verification_tier, profile_complete')
		.eq('user_id', session.user.id)
		.single();

	if (!profile || !profile.profile_complete || !['insured', 'verified_pro'].includes(profile.verification_tier || '')) {
		throw redirect(303, '/blog?error=not-authorized');
	}

	return { profile };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase, session } }) => {
		if (!session) throw redirect(303, '/auth/login');

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;
		const excerpt = formData.get('excerpt') as string;
		const category = formData.get('category') as string;
		const coverImageUrl = formData.get('coverImageUrl') as string;
		const tagsRaw = formData.get('tags') as string;

		if (!title || title.length < 3) return fail(400, { error: 'Title must be at least 3 characters' });
		if (!content || content.length < 50) return fail(400, { error: 'Content must be at least 50 characters' });
		if (!category) return fail(400, { error: 'Please select a category' });

		const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

		// Generate slug from title
		const baseSlug = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').slice(0, 80);
		const slug = `${baseSlug}-${Date.now().toString(36)}`;

		const { data: post, error: insertError } = await supabase
			.from('blog_posts')
			.insert({
				author_id: session.user.id,
				title: title.trim(),
				slug,
				content: content.trim(),
				excerpt: excerpt?.trim() || content.trim().slice(0, 200),
				cover_image_url: coverImageUrl || null,
				category,
				tags,
				status: 'published',
				is_approved: true,
				published_at: new Date().toISOString()
			})
			.select()
			.single();

		if (insertError) return fail(500, { error: 'Failed to publish article' });

		throw redirect(303, `/blog/${slug}`);
	}
};
