import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAccountStatus } from '$lib/server/stripe';
import { createAdminClient } from '$lib/server/admin';

export const GET: RequestHandler = async ({ url }) => {
	const accountId = url.searchParams.get('account_id');
	const performerId = url.searchParams.get('performer_id');

	if (!accountId || !performerId) {
		console.error('[Stripe Connect Callback] Missing account_id or performer_id query params');
		throw redirect(303, '/dashboard/payments?error=true');
	}

	try {
		const status = await getAccountStatus(accountId);

		if (status.isComplete) {
			// Account is fully set up — mark onboarding complete in the database
			const supabaseAdmin = createAdminClient();

			const { error } = await supabaseAdmin
				.from('performer_profiles')
				.update({ stripe_onboarding_complete: true })
				.eq('id', performerId);

			if (error) {
				console.error(
					`[Stripe Connect Callback] Failed to update performer ${performerId}:`,
					error
				);
				throw redirect(303, '/dashboard/payments?error=true');
			}

			console.log(
				`[Stripe Connect Callback] Performer ${performerId} onboarding complete (account: ${accountId})`
			);
			throw redirect(303, '/dashboard/payments?setup=complete');
		}

		// Account exists but is not fully verified yet
		console.log(
			`[Stripe Connect Callback] Performer ${performerId} onboarding still pending (account: ${accountId}, charges: ${status.chargesEnabled}, payouts: ${status.payoutsEnabled})`
		);
		throw redirect(303, '/dashboard/payments?setup=pending');
	} catch (err) {
		// Re-throw SvelteKit redirects — they use a special Redirect class
		if (err && typeof err === 'object' && 'status' in err && 'location' in err) {
			throw err;
		}

		console.error('[Stripe Connect Callback] Unexpected error:', err);
		throw redirect(303, '/dashboard/payments?error=true');
	}
};
