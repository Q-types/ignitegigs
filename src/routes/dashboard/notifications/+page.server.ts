import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

const DEFAULT_PREFERENCES = {
	email_booking_requests: true,
	email_booking_updates: true,
	email_messages: true,
	email_reviews: true,
	email_blog_comments: true,
	email_marketing: true,
	email_pli_expiry: true
};

export const load: PageServerLoad = async ({ parent, locals: { supabase, session } }) => {
	const { user } = await parent();

	if (!session) {
		return { preferences: DEFAULT_PREFERENCES };
	}

	const { data: preferences, error } = await supabase
		.from('notification_preferences')
		.select('*')
		.eq('user_id', session.user.id)
		.single();

	if (error || !preferences) {
		return { preferences: DEFAULT_PREFERENCES };
	}

	return {
		preferences: {
			email_booking_requests: preferences.email_booking_requests ?? true,
			email_booking_updates: preferences.email_booking_updates ?? true,
			email_messages: preferences.email_messages ?? true,
			email_reviews: preferences.email_reviews ?? true,
			email_blog_comments: preferences.email_blog_comments ?? true,
			email_marketing: preferences.email_marketing ?? true,
			email_pli_expiry: preferences.email_pli_expiry ?? true
		}
	};
};

export const actions: Actions = {
	updatePreferences: async ({ request, locals: { supabase, session } }) => {
		if (!session) return fail(401, { error: 'You must be logged in' });

		const formData = await request.formData();

		const preferences = {
			user_id: session.user.id,
			email_booking_requests: formData.get('email_booking_requests') === 'on',
			email_booking_updates: formData.get('email_booking_updates') === 'on',
			email_messages: formData.get('email_messages') === 'on',
			email_reviews: formData.get('email_reviews') === 'on',
			email_blog_comments: formData.get('email_blog_comments') === 'on',
			email_marketing: formData.get('email_marketing') === 'on',
			email_pli_expiry: formData.get('email_pli_expiry') === 'on'
		};

		const { error } = await supabase
			.from('notification_preferences')
			.upsert(preferences, { onConflict: 'user_id' });

		if (error) {
			console.error('Error updating notification preferences:', error);
			return fail(500, { error: 'Failed to update notification preferences' });
		}

		return { success: true, message: 'Notification preferences updated' };
	}
};
