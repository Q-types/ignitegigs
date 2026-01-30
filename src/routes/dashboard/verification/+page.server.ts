import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { session, performerProfile } = await parent();
	if (!session) throw redirect(303, '/auth/login');

	return {
		profile: performerProfile
	};
};

export const actions: Actions = {
	submitEquity: async ({ request, locals: { supabase, session }, parent }) => {
		if (!session) throw redirect(303, '/auth/login');
		const { performerProfile } = await parent();
		if (!performerProfile) return fail(400, { error: 'No performer profile found' });

		const formData = await request.formData();
		const equityMemberId = formData.get('equityMemberId') as string;

		if (!equityMemberId || equityMemberId.trim().length < 3) {
			return fail(400, { error: 'Please enter a valid Equity member ID' });
		}

		const { error } = await supabase
			.from('performer_profiles')
			.update({
				equity_member_id: equityMemberId.trim(),
				equity_verified: true,
				equity_verified_at: new Date().toISOString(),
				verification_tier: 'verified_pro'
			})
			.eq('id', performerProfile.id);

		if (error) return fail(500, { error: 'Failed to save Equity membership' });
		return { success: true, message: 'Equity membership saved! Your profile is now Verified Pro.' };
	},

	submitPLI: async ({ request, locals: { supabase, session }, parent }) => {
		if (!session) throw redirect(303, '/auth/login');
		const { performerProfile } = await parent();
		if (!performerProfile) return fail(400, { error: 'No performer profile found' });

		const formData = await request.formData();
		const pliProvider = formData.get('pliProvider') as string;
		const pliPolicyNumber = formData.get('pliPolicyNumber') as string;
		const pliExpiryDate = formData.get('pliExpiryDate') as string;
		const pliDocumentUrl = formData.get('pliDocumentUrl') as string;

		if (!pliProvider || !pliPolicyNumber || !pliExpiryDate) {
			return fail(400, { error: 'Please fill in all required PLI fields' });
		}

		// Check expiry date is in the future
		if (new Date(pliExpiryDate) <= new Date()) {
			return fail(400, { error: 'PLI expiry date must be in the future' });
		}

		const updateData: Record<string, any> = {
			pli_provider: pliProvider.trim(),
			pli_policy_number: pliPolicyNumber.trim(),
			pli_expiry_date: pliExpiryDate,
			pli_document_url: pliDocumentUrl || null,
			pli_verified: true,
			pli_verified_at: new Date().toISOString()
		};

		// If not already verified_pro (Equity), upgrade to insured
		if (performerProfile.verification_tier === 'community') {
			updateData.verification_tier = 'insured';
		}

		const { error } = await supabase
			.from('performer_profiles')
			.update(updateData)
			.eq('id', performerProfile.id);

		if (error) return fail(500, { error: 'Failed to save PLI details' });
		return {
			success: true,
			message: 'Insurance details saved! Your profile is now visible to clients.'
		};
	},

	removePLI: async ({ locals: { supabase, session }, parent }) => {
		if (!session) throw redirect(303, '/auth/login');
		const { performerProfile } = await parent();
		if (!performerProfile) return fail(400, { error: 'No performer profile found' });

		const updateData: Record<string, any> = {
			pli_provider: null,
			pli_policy_number: null,
			pli_expiry_date: null,
			pli_document_url: null,
			pli_verified: false,
			pli_verified_at: null
		};

		// Downgrade tier if they were insured (not equity)
		if (!performerProfile.equity_verified) {
			updateData.verification_tier = 'community';
		}

		const { error } = await supabase
			.from('performer_profiles')
			.update(updateData)
			.eq('id', performerProfile.id);

		if (error) return fail(500, { error: 'Failed to remove PLI' });
		return { success: true, message: 'Insurance details removed.' };
	}
};
