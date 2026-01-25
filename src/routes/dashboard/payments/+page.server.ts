import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import {
	createConnectAccount,
	createAccountLink,
	getAccountStatus,
	createDashboardLink,
	getAccountBalance,
	getPayoutHistory,
	formatAmount
} from '$lib/server/stripe';

export const load: PageServerLoad = async ({ url, parent, locals: { supabase } }) => {
	const { user, performerProfile } = await parent();

	if (!performerProfile) {
		throw redirect(303, '/dashboard');
	}

	// Check if coming back from Stripe onboarding
	const refresh = url.searchParams.get('refresh') === 'true';

	let stripeStatus = null;
	let balance = null;
	let payouts = [];

	if (performerProfile.stripe_account_id) {
		try {
			stripeStatus = await getAccountStatus(performerProfile.stripe_account_id);

			// Update our database if status changed
			if (stripeStatus.isComplete && !performerProfile.stripe_onboarding_complete) {
				await supabase
					.from('performer_profiles')
					.update({ stripe_onboarding_complete: true })
					.eq('id', performerProfile.id);
			}

			// Get balance and payouts if fully onboarded
			if (stripeStatus.isComplete) {
				balance = await getAccountBalance(performerProfile.stripe_account_id);
				payouts = await getPayoutHistory(performerProfile.stripe_account_id, 5);
			}
		} catch (err) {
			console.error('Error fetching Stripe status:', err);
		}
	}

	// Get earnings summary from bookings
	const { data: completedBookings } = await supabase
		.from('bookings')
		.select('performer_payout_pence, completed_at')
		.eq('performer_id', performerProfile.id)
		.eq('status', 'completed');

	const totalEarnings = (completedBookings ?? []).reduce(
		(sum, b) => sum + (b.performer_payout_pence || 0),
		0
	);

	const thisMonthStart = new Date();
	thisMonthStart.setDate(1);
	thisMonthStart.setHours(0, 0, 0, 0);

	const thisMonthEarnings = (completedBookings ?? [])
		.filter((b) => new Date(b.completed_at!) >= thisMonthStart)
		.reduce((sum, b) => sum + (b.performer_payout_pence || 0), 0);

	return {
		stripeStatus,
		balance,
		payouts,
		totalEarnings,
		thisMonthEarnings,
		hasStripeAccount: !!performerProfile.stripe_account_id,
		isOnboarded: performerProfile.stripe_onboarding_complete
	};
};

export const actions: Actions = {
	// Create or continue Stripe Connect onboarding
	setupStripe: async ({ locals: { supabase, session }, parent }) => {
		const { performerProfile, user } = await parent();

		if (!performerProfile || !user || !session) {
			throw redirect(303, '/auth/login');
		}

		let accountId = performerProfile.stripe_account_id;

		// Create account if doesn't exist
		if (!accountId) {
			const account = await createConnectAccount(user.email, performerProfile.id);
			accountId = account.id;

			// Save to database
			await supabase
				.from('performer_profiles')
				.update({ stripe_account_id: accountId })
				.eq('id', performerProfile.id);
		}

		// Create onboarding link
		const accountLink = await createAccountLink(accountId, performerProfile.id);

		throw redirect(303, accountLink.url);
	},

	// Open Stripe Express Dashboard
	openDashboard: async ({ parent }) => {
		const { performerProfile } = await parent();

		if (!performerProfile?.stripe_account_id) {
			return { error: 'No Stripe account found' };
		}

		const dashboardUrl = await createDashboardLink(performerProfile.stripe_account_id);
		throw redirect(303, dashboardUrl);
	}
};
