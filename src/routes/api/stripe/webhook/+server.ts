import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { stripe, constructWebhookEvent } from '$lib/server/stripe';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

// Use service role for webhook processing (bypasses RLS)
const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	if (!signature) {
		return json({ error: 'Missing signature' }, { status: 400 });
	}

	let event;
	try {
		event = constructWebhookEvent(body, signature, STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.error('Webhook signature verification failed:', err);
		return json({ error: 'Invalid signature' }, { status: 400 });
	}

	try {
		switch (event.type) {
			case 'payment_intent.succeeded': {
				const paymentIntent = event.data.object;
				const { booking_id, payment_type } = paymentIntent.metadata;

				if (booking_id) {
					const updateData: Record<string, unknown> = {};

					if (payment_type === 'deposit') {
						updateData.deposit_paid = true;
						updateData.deposit_paid_at = new Date().toISOString();
						updateData.status = 'confirmed';
						updateData.stripe_payment_intent_id = paymentIntent.id;
					} else if (payment_type === 'final') {
						updateData.final_paid = true;
						updateData.final_paid_at = new Date().toISOString();
						updateData.status = 'completed';
						updateData.completed_at = new Date().toISOString();
					}

					const { error } = await supabaseAdmin
						.from('bookings')
						.update(updateData)
						.eq('id', booking_id);

					if (error) {
						console.error('Failed to update booking:', error);
					} else {
						console.log(`Booking ${booking_id} updated after ${payment_type} payment`);
					}
				}
				break;
			}

			case 'payment_intent.payment_failed': {
				const paymentIntent = event.data.object;
				const { booking_id } = paymentIntent.metadata;

				if (booking_id) {
					console.log(`Payment failed for booking ${booking_id}`);
					// Could send notification to client about failed payment
				}
				break;
			}

			case 'account.updated': {
				// Handle Connect account updates
				const account = event.data.object;

				if (account.charges_enabled && account.payouts_enabled) {
					// Account is fully set up - update performer profile
					const { error } = await supabaseAdmin
						.from('performer_profiles')
						.update({
							stripe_onboarding_complete: true
						})
						.eq('stripe_account_id', account.id);

					if (error) {
						console.error('Failed to update performer Stripe status:', error);
					} else {
						console.log(`Performer with Stripe account ${account.id} onboarding complete`);
					}
				}
				break;
			}

			case 'payout.paid': {
				// Payout to performer's bank account completed
				const payout = event.data.object;
				console.log(`Payout ${payout.id} completed: ${payout.amount / 100} ${payout.currency.toUpperCase()}`);
				break;
			}

			default:
				console.log(`Unhandled webhook event type: ${event.type}`);
		}

		return json({ received: true });
	} catch (err) {
		console.error('Webhook processing error:', err);
		return json({ error: 'Webhook processing failed' }, { status: 500 });
	}
};
