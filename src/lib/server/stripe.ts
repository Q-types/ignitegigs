import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { PUBLIC_APP_URL } from '$env/static/public';

// Platform fee percentage (8%)
export const PLATFORM_FEE_PERCENT = 8;

// Initialize Stripe with secret key
export const stripe = new Stripe(STRIPE_SECRET_KEY);

/**
 * Calculate payment amounts for a booking
 * @param agreedPricePence - Total agreed price in pence
 * @param isDeposit - Whether this is a deposit (50%) or final payment (50%)
 */
export function calculatePaymentAmounts(agreedPricePence: number, isDeposit: boolean = false) {
	// Calculate the payment amount (50% for deposit, 50% for final)
	const paymentAmount = isDeposit ? Math.round(agreedPricePence / 2) : Math.round(agreedPricePence / 2);

	// Platform fee is 8% of the payment amount
	const platformFee = Math.round(paymentAmount * (PLATFORM_FEE_PERCENT / 100));

	// Performer receives the payment minus the platform fee
	const performerPayout = paymentAmount - platformFee;

	return {
		paymentAmount,
		platformFee,
		performerPayout,
		// Total fees for the full booking
		totalPlatformFee: Math.round(agreedPricePence * (PLATFORM_FEE_PERCENT / 100)),
		totalPerformerPayout: agreedPricePence - Math.round(agreedPricePence * (PLATFORM_FEE_PERCENT / 100))
	};
}

/**
 * Create a Stripe Connect account for a performer
 * Uses Standard account type for easier onboarding
 */
export async function createConnectAccount(email: string, performerId: string) {
	try {
		const account = await stripe.accounts.create({
			type: 'standard',
			email,
			metadata: {
				performer_id: performerId
			}
		});

		console.log(`[Stripe] Created Connect account: ${account.id} for performer: ${performerId}`);
		return account;
	} catch (error) {
		console.error('[Stripe] Error creating Connect account:', error);
		throw error;
	}
}

/**
 * Generate an account link for Connect onboarding
 */
export async function createAccountLink(accountId: string, performerId: string) {
	try {
		const accountLink = await stripe.accountLinks.create({
			account: accountId,
			refresh_url: `${PUBLIC_APP_URL}/dashboard/payments?refresh=true`,
			return_url: `${PUBLIC_APP_URL}/api/stripe/connect/callback?account_id=${accountId}&performer_id=${performerId}`,
			type: 'account_onboarding'
		});

		console.log(`[Stripe] Created account link for: ${accountId}`);
		return accountLink;
	} catch (error) {
		console.error('[Stripe] Error creating account link:', error);
		throw error;
	}
}

/**
 * Get the status of a Connect account
 */
export async function getAccountStatus(accountId: string) {
	try {
		const account = await stripe.accounts.retrieve(accountId);

		return {
			id: account.id,
			chargesEnabled: account.charges_enabled,
			payoutsEnabled: account.payouts_enabled,
			detailsSubmitted: account.details_submitted,
			requirements: account.requirements,
			// Account is fully set up when both charges and payouts are enabled
			isComplete: account.charges_enabled && account.payouts_enabled
		};
	} catch (error) {
		console.error('[Stripe] Error getting account status:', error);
		throw error;
	}
}

/**
 * Create a login link to the Stripe Express dashboard
 */
export async function createDashboardLink(accountId: string) {
	try {
		// For Standard accounts, we create a login link
		const loginLink = await stripe.accounts.createLoginLink(accountId);
		return loginLink.url;
	} catch (error) {
		console.error('[Stripe] Error creating dashboard link:', error);
		throw error;
	}
}

/**
 * Create a PaymentIntent with application fee for marketplace payments
 */
export async function createPaymentIntent(options: {
	amount: number; // Amount in pence
	currency?: string;
	connectedAccountId: string;
	applicationFeeAmount: number;
	bookingId: string;
	paymentType: 'deposit' | 'final';
	customerEmail?: string;
	description?: string;
}) {
	const {
		amount,
		currency = 'gbp',
		connectedAccountId,
		applicationFeeAmount,
		bookingId,
		paymentType,
		customerEmail,
		description
	} = options;

	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency,
			// Send funds directly to the connected account
			transfer_data: {
				destination: connectedAccountId
			},
			// Platform takes its fee
			application_fee_amount: applicationFeeAmount,
			// Metadata for webhook processing
			metadata: {
				booking_id: bookingId,
				payment_type: paymentType,
				performer_account: connectedAccountId
			},
			// Optional: capture customer email for receipts
			receipt_email: customerEmail,
			description: description || `IgniteGigs booking payment - ${paymentType}`
		});

		console.log(`[Stripe] Created PaymentIntent: ${paymentIntent.id} for booking: ${bookingId}`);
		return paymentIntent;
	} catch (error) {
		console.error('[Stripe] Error creating PaymentIntent:', error);
		throw error;
	}
}

/**
 * Retrieve a PaymentIntent
 */
export async function getPaymentIntent(paymentIntentId: string) {
	try {
		return await stripe.paymentIntents.retrieve(paymentIntentId);
	} catch (error) {
		console.error('[Stripe] Error retrieving PaymentIntent:', error);
		throw error;
	}
}

/**
 * Refund a PaymentIntent
 */
export async function refundPayment(paymentIntentId: string, amount?: number) {
	try {
		const refund = await stripe.refunds.create({
			payment_intent: paymentIntentId,
			...(amount && { amount }),
			// Reverse the transfer to the connected account as well
			reverse_transfer: true,
			// Refund the application fee too
			refund_application_fee: true
		});

		console.log(`[Stripe] Created refund: ${refund.id} for PaymentIntent: ${paymentIntentId}`);
		return refund;
	} catch (error) {
		console.error('[Stripe] Error creating refund:', error);
		throw error;
	}
}

/**
 * Verify Stripe webhook signature
 */
export function constructWebhookEvent(payload: string, signature: string, secret: string) {
	try {
		return stripe.webhooks.constructEvent(payload, signature, secret);
	} catch (error) {
		console.error('[Stripe] Webhook signature verification failed:', error);
		throw error;
	}
}

/**
 * Format amount from pence to display string
 */
export function formatAmount(pence: number, currency = 'GBP'): string {
	return new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency
	}).format(pence / 100);
}

/**
 * Get payout history for a connected account
 */
export async function getPayoutHistory(accountId: string, limit = 10) {
	try {
		const payouts = await stripe.payouts.list(
			{ limit },
			{ stripeAccount: accountId }
		);
		return payouts.data;
	} catch (error) {
		console.error('[Stripe] Error getting payout history:', error);
		throw error;
	}
}

/**
 * Get balance for a connected account
 */
export async function getAccountBalance(accountId: string) {
	try {
		const balance = await stripe.balance.retrieve({
			stripeAccount: accountId
		});
		return balance;
	} catch (error) {
		console.error('[Stripe] Error getting account balance:', error);
		throw error;
	}
}
