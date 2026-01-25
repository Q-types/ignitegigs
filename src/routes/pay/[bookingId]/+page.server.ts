import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createPaymentIntent, calculatePaymentAmounts, formatAmount } from '$lib/server/stripe';
import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from '$env/static/public';

export const load: PageServerLoad = async ({ params, locals: { supabase, session } }) => {
	if (!session) {
		throw redirect(303, `/auth/login?redirectTo=/pay/${params.bookingId}`);
	}

	const { bookingId } = params;

	// Fetch booking with performer info
	const { data: booking, error: bookingError } = await supabase
		.from('bookings')
		.select(
			`
			*,
			performer:performer_profiles!bookings_performer_id_fkey(
				id, stage_name, stripe_account_id, stripe_onboarding_complete,
				user:users!performer_profiles_user_id_fkey(full_name)
			)
		`
		)
		.eq('id', bookingId)
		.eq('client_id', session.user.id)
		.single();

	if (bookingError || !booking) {
		throw error(404, 'Booking not found');
	}

	// Check booking is in correct state for payment
	if (booking.status !== 'accepted') {
		throw error(400, 'This booking is not ready for payment');
	}

	// Check performer has Stripe set up
	if (!booking.performer?.stripe_account_id || !booking.performer?.stripe_onboarding_complete) {
		throw error(400, 'Performer has not completed payment setup. Please contact them directly.');
	}

	// Calculate payment amounts
	const agreedPrice = booking.agreed_price_pence || booking.quoted_price_pence;
	const isDeposit = !booking.deposit_paid;
	const { paymentAmount, platformFee, performerPayout } = calculatePaymentAmounts(agreedPrice, isDeposit);

	// Create PaymentIntent
	let clientSecret: string;
	try {
		const paymentIntent = await createPaymentIntent({
			amount: paymentAmount,
			connectedAccountId: booking.performer.stripe_account_id,
			applicationFeeAmount: platformFee,
			bookingId: booking.id,
			paymentType: isDeposit ? 'deposit' : 'final',
			customerEmail: session.user.email,
			description: `IgniteGigs ${isDeposit ? 'deposit' : 'final payment'} - ${booking.performer.stage_name || 'Performer'}`
		});

		clientSecret = paymentIntent.client_secret!;

		// Update booking with deposit/payment info
		if (isDeposit) {
			await supabase
				.from('bookings')
				.update({
					deposit_pence: paymentAmount,
					platform_fee_pence: platformFee * 2, // Total platform fee for both payments
					performer_payout_pence: performerPayout * 2 // Total payout for both payments
				})
				.eq('id', bookingId);
		}
	} catch (err) {
		console.error('Failed to create PaymentIntent:', err);
		throw error(500, 'Failed to initialize payment. Please try again.');
	}

	return {
		booking,
		clientSecret,
		publishableKey: PUBLIC_STRIPE_PUBLISHABLE_KEY,
		paymentAmount,
		isDeposit,
		formattedAmount: formatAmount(paymentAmount),
		formattedTotal: formatAmount(agreedPrice)
	};
};
