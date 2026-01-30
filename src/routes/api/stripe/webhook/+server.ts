import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { stripe, constructWebhookEvent } from '$lib/server/stripe';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { sendPaymentConfirmationEmail, sendReviewReminderEmail } from '$lib/server/email';

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

	// Acknowledge receipt immediately -- return 200 for all processing outcomes
	// to prevent Stripe from retrying already-received events.
	// Errors in individual handlers are logged but do not produce non-200 responses.

	switch (event.type) {
		case 'payment_intent.succeeded': {
			try {
				const paymentIntent = event.data.object;
				const { booking_id, payment_type } = paymentIntent.metadata;

				if (!booking_id) {
					console.warn(`[stripe:payment_intent.succeeded] No booking_id in metadata for ${paymentIntent.id}`);
					break;
				}

				// Check if already processed (idempotency)
				const { data: existingBooking } = await supabaseAdmin
					.from('bookings')
					.select('deposit_paid, final_paid')
					.eq('id', booking_id)
					.single();

				if (payment_type === 'deposit' && existingBooking?.deposit_paid) {
					console.log(`[stripe:payment_intent.succeeded] Deposit already processed for booking ${booking_id}, skipping`);
					break;
				}

				if (payment_type === 'final' && existingBooking?.final_paid) {
					console.log(`[stripe:payment_intent.succeeded] Final payment already processed for booking ${booking_id}, skipping`);
					break;
				}

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
				} else {
					console.warn(`[stripe:payment_intent.succeeded] Unknown payment_type "${payment_type}" for booking ${booking_id}`);
					break;
				}

				const { error } = await supabaseAdmin
					.from('bookings')
					.update(updateData)
					.eq('id', booking_id);

				if (error) {
					console.error(`[stripe:payment_intent.succeeded] Failed to update booking ${booking_id}:`, error);
				} else {
					console.log(`[stripe:payment_intent.succeeded] Booking ${booking_id} updated after ${payment_type} payment`);

					// Fetch booking details for email notifications
					try {
						const { data: bookingDetails } = await supabaseAdmin
							.from('bookings')
							.select(`
								id, event_date,
								client:users!bookings_client_id_fkey(id, full_name, email),
								performer:performer_profiles!bookings_performer_id_fkey(
									stage_name,
									user:users!performer_profiles_user_id_fkey(full_name)
								)
							`)
							.eq('id', booking_id)
							.single();

						if (bookingDetails?.client?.email) {
							const performerName = bookingDetails.performer?.stage_name || bookingDetails.performer?.user?.full_name || 'Performer';

							// Send payment confirmation email to client
							try {
								await sendPaymentConfirmationEmail({
									to: bookingDetails.client.email,
									clientName: bookingDetails.client.full_name,
									performerName,
									eventDate: bookingDetails.event_date,
									amountPaid: paymentIntent.amount,
									paymentType: payment_type as 'deposit' | 'final',
									bookingId: booking_id
								});
							} catch (emailError) {
								console.error(`[stripe:payment_intent.succeeded] Failed to send payment confirmation email for booking ${booking_id}:`, emailError);
							}

							// Send review reminder when final payment is made (booking completed)
							if (payment_type === 'final') {
								try {
									await sendReviewReminderEmail({
										to: bookingDetails.client.email,
										clientName: bookingDetails.client.full_name,
										performerName,
										eventDate: bookingDetails.event_date,
										bookingId: booking_id
									});
								} catch (emailError) {
									console.error(`[stripe:payment_intent.succeeded] Failed to send review reminder email for booking ${booking_id}:`, emailError);
								}
							}
						}
					} catch (fetchError) {
						console.error(`[stripe:payment_intent.succeeded] Failed to fetch booking details for email notifications:`, fetchError);
					}
				}
			} catch (err) {
				console.error('[stripe:payment_intent.succeeded] Unhandled error:', err);
			}
			break;
		}

		case 'payment_intent.payment_failed': {
			try {
				const paymentIntent = event.data.object;
				const { booking_id } = paymentIntent.metadata;

				if (booking_id) {
					console.log(`[stripe:payment_intent.payment_failed] Payment failed for booking ${booking_id}, reason: ${paymentIntent.last_payment_error?.message || 'unknown'}`);
				} else {
					console.warn(`[stripe:payment_intent.payment_failed] No booking_id in metadata for ${paymentIntent.id}`);
				}
			} catch (err) {
				console.error('[stripe:payment_intent.payment_failed] Unhandled error:', err);
			}
			break;
		}

		case 'account.updated': {
			try {
				const account = event.data.object;

				if (account.charges_enabled && account.payouts_enabled) {
					const { error } = await supabaseAdmin
						.from('performer_profiles')
						.update({
							stripe_onboarding_complete: true
						})
						.eq('stripe_account_id', account.id);

					if (error) {
						console.error(`[stripe:account.updated] Failed to update performer Stripe status for account ${account.id}:`, error);
					} else {
						console.log(`[stripe:account.updated] Performer with Stripe account ${account.id} onboarding complete`);
					}
				}
			} catch (err) {
				console.error('[stripe:account.updated] Unhandled error:', err);
			}
			break;
		}

		case 'payout.paid': {
			try {
				const payout = event.data.object;
				console.log(`[stripe:payout.paid] Payout ${payout.id} completed: ${payout.amount / 100} ${payout.currency.toUpperCase()}`);
			} catch (err) {
				console.error('[stripe:payout.paid] Unhandled error:', err);
			}
			break;
		}

		default:
			console.log(`[stripe:webhook] Unhandled event type: ${event.type}`);
	}

	return json({ received: true });
};
