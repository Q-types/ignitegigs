import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { user, authUser, performerProfile } = await parent();
	return { user, authUser, performerProfile };
};

export const actions: Actions = {
	updateAccount: async ({ request, locals: { supabase, session } }) => {
		if (!session) return fail(401, { error: 'You must be logged in' });

		const formData = await request.formData();
		const fullName = formData.get('fullName') as string;
		const phone = formData.get('phone') as string;

		if (!fullName?.trim()) {
			return fail(400, { error: 'Full name is required', section: 'account' });
		}

		const { error } = await supabase
			.from('users')
			.update({
				full_name: fullName.trim(),
				phone: phone?.trim() || null
			})
			.eq('id', session.user.id);

		if (error) {
			console.error('Error updating account:', error);
			return fail(500, { error: 'Failed to update account information', section: 'account' });
		}

		return { success: true, message: 'Account information updated', section: 'account' };
	},

	updatePassword: async ({ request, locals: { supabase, session } }) => {
		if (!session) return fail(401, { error: 'You must be logged in' });

		const formData = await request.formData();
		const newPassword = formData.get('newPassword') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		if (!newPassword || newPassword.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters', section: 'password' });
		}

		if (newPassword !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match', section: 'password' });
		}

		const { error } = await supabase.auth.updateUser({ password: newPassword });

		if (error) {
			console.error('Error updating password:', error);
			return fail(500, { error: 'Failed to update password', section: 'password' });
		}

		return { success: true, message: 'Password updated successfully', section: 'password' };
	},

	deleteAccount: async ({ locals: { supabase, session } }) => {
		if (!session) return fail(401, { error: 'You must be logged in' });

		// For now, just deactivate - actual deletion requires admin API
		const { error } = await supabase
			.from('users')
			.update({ email_verified: false })
			.eq('id', session.user.id);

		// Also deactivate performer profile if exists
		await supabase
			.from('performer_profiles')
			.update({ is_active: false })
			.eq('user_id', session.user.id);

		if (error) {
			return fail(500, {
				error: 'Failed to process account deletion request',
				section: 'danger'
			});
		}

		return {
			success: true,
			message:
				'Account deactivation request submitted. Contact support to complete deletion.',
			section: 'danger'
		};
	}
};
