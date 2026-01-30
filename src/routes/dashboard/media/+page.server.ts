import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { uploadVideo, uploadPhoto, deleteMedia } from '$lib/server/cloudinary';

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
	const { performerProfile } = await parent();

	if (!performerProfile) {
		throw redirect(303, '/dashboard/profile');
	}

	// Fetch all media for this performer
	const { data: media } = await supabase
		.from('performer_media')
		.select('*')
		.eq('performer_id', performerProfile.id)
		.order('sort_order', { ascending: true });

	return {
		media: media ?? [],
		performerId: performerProfile.id
	};
};

export const actions: Actions = {
	upload: async ({ request, locals: { supabase, session }, parent }) => {
		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const { performerProfile } = await parent();
		if (!performerProfile) {
			return fail(400, { error: 'No performer profile found' });
		}

		const formData = await request.formData();
		const file = formData.get('file') as File;
		const mediaType = formData.get('mediaType') as 'video' | 'photo';
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const isPrimary = formData.get('isPrimary') === 'true';

		if (!file || file.size === 0) {
			return fail(400, { error: 'Please select a file to upload' });
		}

		// Validate file size (50MB for videos, 10MB for photos)
		const maxSize = mediaType === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
		if (file.size > maxSize) {
			return fail(400, {
				error: `File too large. Maximum size is ${mediaType === 'video' ? '50MB' : '10MB'}`
			});
		}

		try {
			let result;
			if (mediaType === 'video') {
				result = await uploadVideo(file, performerProfile.id);
			} else {
				result = await uploadPhoto(file, performerProfile.id);
			}

			// If this is set as primary, unset other primaries first
			if (isPrimary) {
				await supabase
					.from('performer_media')
					.update({ is_primary: false })
					.eq('performer_id', performerProfile.id)
					.eq('media_type', mediaType);
			}

			// Get current max sort order
			const { data: maxOrder } = await supabase
				.from('performer_media')
				.select('sort_order')
				.eq('performer_id', performerProfile.id)
				.order('sort_order', { ascending: false })
				.limit(1)
				.single();

			const sortOrder = (maxOrder?.sort_order ?? 0) + 1;

			// Save to database
			const { error: dbError } = await supabase.from('performer_media').insert({
				performer_id: performerProfile.id,
				media_type: mediaType,
				url: result.secure_url,
				thumbnail_url: result.thumbnail_url,
				cloudinary_public_id: result.public_id,
				title: title || null,
				description: description || null,
				is_primary: isPrimary,
				sort_order: sortOrder,
				duration_seconds: result.duration ? Math.round(result.duration) : null
			});

			if (dbError) {
				console.error('Database error:', dbError);
				return fail(500, { error: 'Failed to save media information' });
			}

			return { success: true, message: 'Media uploaded successfully!' };
		} catch (err) {
			console.error('Upload error:', err);
			return fail(500, { error: 'Failed to upload media. Please try again.' });
		}
	},

	delete: async ({ request, locals: { supabase, session }, parent }) => {
		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const { performerProfile } = await parent();
		if (!performerProfile) {
			return fail(400, { error: 'No performer profile found' });
		}

		const formData = await request.formData();
		const mediaId = formData.get('mediaId') as string;

		// Get media info first
		const { data: media } = await supabase
			.from('performer_media')
			.select('*')
			.eq('id', mediaId)
			.eq('performer_id', performerProfile.id)
			.single();

		if (!media) {
			return fail(404, { error: 'Media not found' });
		}

		try {
			// Delete from Cloudinary
			if (media.cloudinary_public_id) {
				await deleteMedia(
					media.cloudinary_public_id,
					media.media_type as 'video' | 'image'
				);
			}

			// Delete from database
			const { error: dbError } = await supabase
				.from('performer_media')
				.delete()
				.eq('id', mediaId);

			if (dbError) {
				console.error('Database delete error:', dbError);
				return fail(500, { error: 'Failed to delete media' });
			}

			return { success: true, message: 'Media deleted successfully' };
		} catch (err) {
			console.error('Delete error:', err);
			return fail(500, { error: 'Failed to delete media' });
		}
	},

	setPrimary: async ({ request, locals: { supabase, session }, parent }) => {
		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const { performerProfile } = await parent();
		if (!performerProfile) {
			return fail(400, { error: 'No performer profile found' });
		}

		const formData = await request.formData();
		const mediaId = formData.get('mediaId') as string;

		// Get media type
		const { data: media } = await supabase
			.from('performer_media')
			.select('media_type')
			.eq('id', mediaId)
			.single();

		if (!media) {
			return fail(404, { error: 'Media not found' });
		}

		// Unset all primaries of this type
		await supabase
			.from('performer_media')
			.update({ is_primary: false })
			.eq('performer_id', performerProfile.id)
			.eq('media_type', media.media_type);

		// Set new primary
		const { error } = await supabase
			.from('performer_media')
			.update({ is_primary: true })
			.eq('id', mediaId);

		if (error) {
			return fail(500, { error: 'Failed to set as primary' });
		}

		return { success: true };
	},

	reorder: async ({ request, locals: { supabase, session }, parent }) => {
		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const { performerProfile } = await parent();
		if (!performerProfile) {
			return fail(400, { error: 'No performer profile found' });
		}

		const formData = await request.formData();
		const itemsJson = formData.get('items') as string;

		if (!itemsJson) {
			return fail(400, { error: 'No reorder data provided' });
		}

		let items: { id: string; sort_order: number }[];
		try {
			items = JSON.parse(itemsJson);
		} catch {
			return fail(400, { error: 'Invalid reorder data' });
		}

		if (!Array.isArray(items) || items.length === 0) {
			return fail(400, { error: 'Invalid reorder data' });
		}

		// Verify all items belong to this performer
		const { data: existingMedia } = await supabase
			.from('performer_media')
			.select('id')
			.eq('performer_id', performerProfile.id)
			.in(
				'id',
				items.map((i) => i.id)
			);

		if (!existingMedia || existingMedia.length !== items.length) {
			return fail(400, { error: 'Some media items were not found' });
		}

		// Update sort orders
		const updates = items.map((item) =>
			supabase
				.from('performer_media')
				.update({ sort_order: item.sort_order })
				.eq('id', item.id)
				.eq('performer_id', performerProfile.id)
		);

		const results = await Promise.all(updates);
		const hasError = results.some((r) => r.error);

		if (hasError) {
			return fail(500, { error: 'Failed to reorder media' });
		}

		return { success: true, message: 'Media order updated' };
	}
};
